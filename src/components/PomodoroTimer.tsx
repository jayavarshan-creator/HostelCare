import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Sparkles, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';

interface PomodoroTimerProps {
  onBack?: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'focus' | 'breaks' | 'stats'>('focus');
  const [subType, setSubType] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  
  // Durations in seconds: 25 mins work, 5 mins short break, 15 mins long break
  const durations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const [timeLeft, setTimeLeft] = useState<number>(durations.work);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(2);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play synthetic pleasant web audio chime on completion
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // AudioContext not available or blocked
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playChime();
            if (subType === 'work') {
              setSessionsCompleted((s) => s + 1);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, subType, soundEnabled]);

  const togglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durations[subType]);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (subType === 'work') {
      setSubType('shortBreak');
      setTimeLeft(durations.shortBreak);
    } else {
      setSubType('work');
      setTimeLeft(durations.work);
    }
  };

  const handleSelectSubtype = (type: 'work' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setSubType(type);
    setTimeLeft(durations[type]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentDuration = durations[subType];
  const progressPercent = ((currentDuration - timeLeft) / currentDuration) * 100;
  const strokeDashoffset = 440 - (440 * progressPercent) / 100;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white rounded-3xl overflow-hidden p-4 sm:p-6 relative select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white flex items-center gap-1 text-xs font-semibold"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}
        <h3 className="text-sm font-bold tracking-wide uppercase text-indigo-300">
          Pomodoro Timer
        </h3>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
          title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Subtype selector: 25m Focus / 5m Break / 15m Long */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          onClick={() => handleSelectSubtype('work')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition ${
            subType === 'work'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          25m Focus
        </button>
        <button
          onClick={() => handleSelectSubtype('shortBreak')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition ${
            subType === 'shortBreak'
              ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          5m Break
        </button>
        <button
          onClick={() => handleSelectSubtype('longBreak')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition ${
            subType === 'longBreak'
              ? 'bg-indigo-400 text-slate-950 shadow-md shadow-indigo-400/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          15m Long
        </button>
      </div>

      {/* Circular Timer Visual Display matching Poster */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Subtle cosmic outer glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-600/20 via-amber-500/10 to-blue-500/20 blur-xl" />

          {/* SVG Ring Progress */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background track */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="rgba(30, 41, 59, 0.8)"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Animated progress circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#timerGradient)"
              strokeWidth="8"
              strokeDasharray="440"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-linear"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono drop-shadow-md">
              {formattedTime}
            </span>
            <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold mt-1">
              {subType === 'work' ? 'Focus Time' : subType === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </span>
            {subType === 'work' && (
              <span className="text-[10px] text-amber-400 mt-1 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3" /> Session #{sessionsCompleted + 1}
              </span>
            )}
          </div>
        </div>

        {/* Controls matching Poster: Reset, Play/Pause, Skip */}
        <div className="flex items-center gap-5 mt-6">
          <button
            onClick={handleReset}
            className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/30 transition transform hover:scale-105 active:scale-95"
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? (
              <Pause className="w-6 h-6 fill-slate-950" />
            ) : (
              <Play className="w-6 h-6 fill-slate-950 translate-x-0.5" />
            )}
          </button>

          <button
            onClick={handleSkip}
            className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700"
            title="Next Session"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Motivational quote matching Poster */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-300 italic">
            "Small steps lead to big results!" <span className="text-amber-400">★</span>
          </p>
        </div>
      </div>

      {/* Bottom Sub-Tabs: Focus, Breaks, Stats */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-around text-xs">
        <button
          onClick={() => {
            setMode('focus');
            handleSelectSubtype('work');
          }}
          className={`flex flex-col items-center gap-1 font-semibold transition ${
            mode === 'focus' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span>⏳</span>
          <span>Focus</span>
        </button>

        <button
          onClick={() => {
            setMode('breaks');
            handleSelectSubtype('shortBreak');
          }}
          className={`flex flex-col items-center gap-1 font-semibold transition ${
            mode === 'breaks' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span>☕</span>
          <span>Breaks</span>
        </button>

        <button
          onClick={() => setMode('stats')}
          className={`flex flex-col items-center gap-1 font-semibold transition ${
            mode === 'stats' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span>📊</span>
          <span>Stats ({sessionsCompleted})</span>
        </button>
      </div>
    </div>
  );
};

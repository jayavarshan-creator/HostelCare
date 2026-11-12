import React, { useState } from 'react';
import {
  Complaint,
  ComplaintCategory,
  ComplaintPriority,
  User,
  CategoryMetadata,
  Notice,
} from '../types';
import {
  CATEGORIES_METADATA,
  validateComplaintSubmission,
  generateVerificationOtp,
  formatTimelineDate,
} from '../utils/complaints';
import { PomodoroTimer } from './PomodoroTimer';
import confetti from 'canvas-confetti';
import {
  Bell,
  CheckCircle2,
  Clock,
  ChevronRight,
  PlusCircle,
  FileText,
  HelpCircle,
  MoreHorizontal,
  Home,
  CheckSquare,
  User as UserIcon,
  Sparkles,
  Camera,
  AlertTriangle,
  Star,
  PhoneCall,
  ShieldAlert,
  ArrowLeft,
  Upload,
  Calendar,
  KeyRound,
  Send,
  Zap,
  Droplet,
  Fan,
  Armchair,
  Wifi,
  Sparkle,
  MessageCircle,
} from 'lucide-react';

interface StudentPortalProps {
  currentUser: User;
  complaints: Complaint[];
  notices: Notice[];
  onCreateComplaint: (newComplaint: Complaint) => void;
  onRateComplaint: (complaintId: string, rating: number, feedback: string) => void;
  onSelectComplaintForTracking?: (complaint: Complaint) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentUser,
  complaints,
  notices,
  onCreateComplaint,
  onRateComplaint,
}) => {
  // Navigation within the student mobile view
  const [currentTab, setCurrentTab] = useState<
    'home' | 'types' | 'category_preview' | 'report' | 'status' | 'pomodoro' | 'help' | 'profile'
  >('home');

  // Selected category for reporting
  const [selectedCategory, setSelectedCategory] = useState<CategoryMetadata>(CATEGORIES_METADATA[0]);

  // Selected complaint for the live status stepper view
  const studentComplaints = complaints.filter((c) => c.studentId === currentUser.id);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>(
    studentComplaints[0]?.id || ''
  );

  // New complaint form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roomNumber, setRoomNumber] = useState(currentUser.roomNumber || 'B-304');
  const [studentPhone, setStudentPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [priority, setPriority] = useState<ComplaintPriority>('medium');
  const [preferredSlot, setPreferredSlot] = useState('Today, 02:00 - 04:00 PM');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rating modal states for completed complaint
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState('');
  const [hasRatedThisSession, setHasRatedThisSession] = useState(false);

  // Active complaint to track
  const activeComplaint = studentComplaints.find((c) => c.id === selectedComplaintId) || studentComplaints[0];

  // Render category icon dynamically
  const renderCategoryIcon = (id: ComplaintCategory, className = 'w-6 h-6') => {
    switch (id) {
      case 'cleaning':
        return <Sparkle className={className} />;
      case 'electricity':
        return <Zap className={className} />;
      case 'water':
        return <Droplet className={className} />;
      case 'ac_fan':
        return <Fan className={className} />;
      case 'furniture':
        return <Armchair className={className} />;
      case 'wifi':
        return <Wifi className={className} />;
      default:
        return <MessageCircle className={className} />;
    }
  };

  const handleOpenCategory = (cat: CategoryMetadata) => {
    setSelectedCategory(cat);
    setTitle(cat.sampleIssues[0] || '');
    setDescription('');
    setFormErrors({});
    setCurrentTab('category_preview');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateComplaintSubmission({
      category: selectedCategory.id,
      title,
      description,
      roomNumber,
      studentPhone,
    });

    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    const newId = `HC-${Math.floor(1000 + Math.random() * 9000)}`;
    const otp = generateVerificationOtp();
    const nowIso = new Date().toISOString();
    const nowFormatted = formatTimelineDate(nowIso);

    const newComplaint: Complaint = {
      id: newId,
      category: selectedCategory.id,
      title: title.trim(),
      description: description.trim(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentPhone: studentPhone.trim(),
      roomNumber: roomNumber.trim(),
      hostelBlock: currentUser.hostelBlock || 'Block B (Nilgiri)',
      priority,
      status: 'registered',
      createdAt: nowIso,
      preferredSlot,
      photoUrl: photoUrl || undefined,
      verificationOtp: otp,
      timeline: [
        {
          step: 'registered',
          title: 'Complaint Registered',
          description: 'Your complaint has been successfully registered.',
          timestamp: nowFormatted,
          completed: true,
          active: true,
        },
        {
          step: 'scheduled',
          title: 'Time Slot for Rectification',
          description: 'Pending technician schedule allocation.',
          timestamp: 'Pending',
          completed: false,
        },
        {
          step: 'completed',
          title: 'Completed',
          description: 'Pending resolution.',
          timestamp: 'Pending',
          completed: false,
        },
      ],
    };

    setTimeout(() => {
      onCreateComplaint(newComplaint);
      setSelectedComplaintId(newId);
      setIsSubmitting(false);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      setCurrentTab('status');
    }, 400);
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;
    onRateComplaint(activeComplaint.id, ratingScore, ratingComment);
    setHasRatedThisSession(true);
    confetti({
      particleCount: 40,
      spread: 70,
    });
  };

  // Sample photo picker presets for quick testing
  const samplePhotos: Record<ComplaintCategory, string> = {
    cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    electricity: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
    water: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    ac_fan: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    furniture: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    wifi: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    others: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80',
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none overflow-hidden">
      {/* Scrollable View Area */}
      <div className="flex-1 overflow-y-auto">
        {/* VIEW 1: HOME DASHBOARD (Matching Poster) */}
        {currentTab === 'home' && (
          <div className="p-4 sm:p-5 space-y-4">
            {/* Header Greeting & Bell */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5">
                  Hello, {currentUser.name.split(' ')[0]}! <span className="text-xl">👋</span>
                </h2>
                <p className="text-xs text-indigo-300 font-medium">Keep going, you're doing great!</p>
              </div>
              <button
                onClick={() => setCurrentTab('help')}
                className="relative p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 shadow-sm"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-amber-400" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900" />
              </button>
            </div>

            {/* Today's Goal Progress Card (Matching Poster) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 border border-indigo-700/50 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-sm">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Today's Goal</h3>
                    <p className="text-xs text-indigo-200">Complete 3 study / maintenance tasks</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-amber-300 border border-amber-400/30">
                  {studentComplaints.filter((c) => c.status === 'completed').length > 0 ? '2/3' : '1/3'}
                </span>
              </div>
              <div className="w-full bg-indigo-950/80 rounded-full h-2 overflow-hidden border border-indigo-700/30">
                <div
                  className="bg-gradient-to-r from-amber-400 to-yellow-300 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: studentComplaints.filter((c) => c.status === 'completed').length > 0 ? '66%' : '33%',
                  }}
                />
              </div>
            </div>

            {/* 4 Quick Action Cards (2x2 Grid Matching Poster) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Register Complaint */}
              <button
                onClick={() => setCurrentTab('types')}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-indigo-800/40 to-slate-800/70 border border-indigo-500/20 hover:border-indigo-400/40 text-center transition shadow-md active:scale-95"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center mb-2 group-hover:scale-105 transition shadow-inner">
                  <PlusCircle className="w-6 h-6 text-indigo-400" />
                </div>
                <span className="text-xs font-bold text-white">Register Complaint</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Quick issue reporting</span>
              </button>

              {/* Card 2: Complaint Status */}
              <button
                onClick={() => setCurrentTab('status')}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-emerald-900/30 to-slate-800/70 border border-emerald-500/20 hover:border-emerald-400/40 text-center transition shadow-md active:scale-95"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 text-emerald-300 flex items-center justify-center mb-2 group-hover:scale-105 transition shadow-inner">
                  <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-xs font-bold text-white">Complaint Status</span>
                <span className="text-[10px] text-emerald-300/80 mt-0.5">
                  {studentComplaints.length} Active / Logged
                </span>
              </button>

              {/* Card 3: Help & Support */}
              <button
                onClick={() => setCurrentTab('help')}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-cyan-900/30 to-slate-800/70 border border-cyan-500/20 hover:border-cyan-400/40 text-center transition shadow-md active:scale-95"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 text-cyan-300 flex items-center justify-center mb-2 group-hover:scale-105 transition shadow-inner">
                  <HelpCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-xs font-bold text-white">Help & Support</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Warden & Helpline</span>
              </button>

              {/* Card 4: Pomodoro Focus Timer */}
              <button
                onClick={() => setCurrentTab('pomodoro')}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-amber-900/30 to-slate-800/70 border border-amber-500/20 hover:border-amber-400/40 text-center transition shadow-md active:scale-95"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2 group-hover:scale-105 transition shadow-inner">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <span className="text-xs font-bold text-white">Pomodoro Timer</span>
                <span className="text-[10px] text-amber-300/80 mt-0.5">Hostel Study Tool</span>
              </button>
            </div>

            {/* Recent Activity Section (Matching Poster) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recent Activity</h3>
                <button
                  onClick={() => setCurrentTab('status')}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
                >
                  See All →
                </button>
              </div>

              {studentComplaints.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <p className="text-xs text-slate-400">No complaints filed yet.</p>
                  <button
                    onClick={() => setCurrentTab('types')}
                    className="mt-2 text-xs font-bold text-indigo-400 hover:underline"
                  >
                    + Register your first complaint
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {studentComplaints.slice(0, 3).map((item) => {
                    const isDone = item.status === 'completed' || item.status === 'closed';
                    const isInProgress = item.status === 'in_progress';
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedComplaintId(item.id);
                          setCurrentTab('status');
                        }}
                        className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 cursor-pointer transition"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isInProgress
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isDone
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : isInProgress
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {item.status === 'completed'
                                ? 'Resolved'
                                : item.status === 'in_progress'
                                ? 'In Progress'
                                : item.status === 'scheduled'
                                ? 'Scheduled'
                                : 'Registered'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">
                            {CATEGORIES_METADATA.find((m) => m.id === item.category)?.title} •{' '}
                            {item.timeline[0]?.timestamp || 'Today'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pinned Hostel Notice Board */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📢</span> Official Warden Notices
                </h3>
              </div>
              <div className="space-y-2">
                {notices.slice(0, 2).map((notice) => (
                  <div
                    key={notice.id}
                    className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-800/40"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-indigo-200">{notice.title}</span>
                      <span className="text-[10px] text-slate-400">{notice.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2">{notice.content}</p>
                    <p className="text-[10px] text-amber-400 font-medium mt-1">
                      — {notice.authorName} ({notice.authorRole})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: COMPLAINT TYPES (Matching Poster Screen) */}
        {currentTab === 'types' && (
          <div className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('home')}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-black text-white">Complaint Types</h2>
            </div>
            <p className="text-xs text-slate-400">
              Select the category matching your hostel issue for prompt allocation:
            </p>

            <div className="space-y-2.5">
              {CATEGORIES_METADATA.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleOpenCategory(cat)}
                  className="w-full p-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 hover:border-indigo-500/50 flex items-center justify-between text-left transition group shadow-sm active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition"
                      style={{ backgroundColor: `${cat.accentColor}20`, color: cat.accentColor }}
                    >
                      {renderCategoryIcon(cat.id, 'w-6 h-6')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                        {cat.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{cat.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: CATEGORY PREVIEW (Matching individual poster screens) */}
        {currentTab === 'category_preview' && (
          <div className="p-4 sm:p-5 flex flex-col h-full space-y-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('types')}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                aria-label="Back to types"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-black text-white">{selectedCategory.title}</h2>
            </div>

            {/* Poster style circular illustration display */}
            <div className="my-auto flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-gradient-to-b from-indigo-900/40 via-slate-800/40 to-slate-900 border border-indigo-500/20">
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center mb-4 shadow-xl ring-4 ring-white/10"
                style={{ backgroundColor: `${selectedCategory.accentColor}25`, color: selectedCategory.accentColor }}
              >
                {renderCategoryIcon(selectedCategory.id, 'w-14 h-14')}
              </div>

              <h3 className="text-xl font-black text-white">{selectedCategory.title}</h3>
              <p className="text-sm text-slate-300 max-w-xs mt-2">{selectedCategory.subtitle}</p>

              {/* Sample issue tags */}
              <div className="mt-4 flex flex-wrap gap-1.5 justify-center max-w-xs">
                {selectedCategory.sampleIssues.map((issue, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTitle(issue)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    + {issue}
                  </button>
                ))}
              </div>
            </div>

            {/* Action button matching poster */}
            <button
              onClick={() => setCurrentTab('report')}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 shadow-xl shadow-indigo-600/30 transition transform active:scale-[0.98]"
            >
              Report Complaint
            </button>
          </div>
        )}

        {/* VIEW 4: REPORT COMPLAINT FORM */}
        {currentTab === 'report' && (
          <div className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('category_preview')}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                aria-label="Back to preview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-lg font-black text-white">Log {selectedCategory.title} Request</h2>
                <p className="text-[11px] text-slate-400">Fill in details for immediate maintenance dispatch</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {/* Category banner */}
              <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-700/40 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${selectedCategory.accentColor}25`, color: selectedCategory.accentColor }}
                >
                  {renderCategoryIcon(selectedCategory.id, 'w-5 h-5')}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{selectedCategory.title}</div>
                  <div className="text-[10px] text-slate-300">
                    Handled by {selectedCategory.defaultTechnicianCategory.toUpperCase()} staff
                  </div>
                </div>
              </div>

              {/* Room & Contact */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Room Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                  {formErrors.roomNumber && (
                    <p className="text-[10px] text-rose-400 mt-0.5">{formErrors.roomNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                  {formErrors.studentPhone && (
                    <p className="text-[10px] text-rose-400 mt-0.5">{formErrors.studentPhone}</p>
                  )}
                </div>
              </div>

              {/* Title / Summary */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Issue Summary <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bathroom tap leaking non-stop"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500"
                />
                {formErrors.title && (
                  <p className="text-[10px] text-rose-400 mt-0.5">{formErrors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Detailed Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain location, severity, when it started, etc."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 resize-none"
                />
                {formErrors.description && (
                  <p className="text-[10px] text-rose-400 mt-0.5">{formErrors.description}</p>
                )}
              </div>

              {/* Priority Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Priority Level</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'low', label: 'Low', color: 'text-slate-300' },
                    { id: 'medium', label: 'Medium', color: 'text-blue-400' },
                    { id: 'high', label: 'High', color: 'text-amber-400' },
                    { id: 'emergency', label: 'Urgent 🔥', color: 'text-rose-400' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id as ComplaintPriority)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                        priority === p.id
                          ? 'bg-indigo-600 border-indigo-400 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Rectification Slot */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preferred Time Slot for Visit
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="Today, 02:00 - 04:00 PM">Today, 02:00 - 04:00 PM (Afternoon)</option>
                  <option value="Today, 04:00 - 06:00 PM">Today, 04:00 - 06:00 PM (Evening)</option>
                  <option value="Tomorrow, 09:00 - 11:00 AM">Tomorrow, 09:00 - 11:00 AM (Morning)</option>
                  <option value="Tomorrow, 11:00 AM - 01:00 PM">Tomorrow, 11:00 AM - 01:00 PM</option>
                  <option value="Emergency (Immediate)">Immediate (Emergency)</option>
                </select>
              </div>

              {/* Photo Upload Simulation */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Attach Photo of Issue (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(samplePhotos[selectedCategory.id])}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-indigo-300 font-medium flex items-center justify-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Attach Sample Photo</span>
                  </button>
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="text-xs text-rose-400 px-2 py-1"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {photoUrl && (
                  <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-700 h-28">
                    <img src={photoUrl} alt="Issue preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-[10px] bg-slate-900/80 px-2 py-0.5 rounded text-white">
                      Attached
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Complaint</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* VIEW 5: COMPLAINT STATUS (Directly matches the poster's stepper!) */}
        {currentTab === 'status' && (
          <div className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-black text-white">Complaint Status</h2>
              </div>

              {/* Complaint switcher if student has multiple */}
              {studentComplaints.length > 1 && (
                <select
                  value={selectedComplaintId}
                  onChange={(e) => {
                    setSelectedComplaintId(e.target.value);
                    setHasRatedThisSession(false);
                  }}
                  className="text-xs bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-slate-200"
                >
                  {studentComplaints.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} - {c.title.slice(0, 16)}...
                    </option>
                  ))}
                </select>
              )}
            </div>

            {!activeComplaint ? (
              <div className="p-8 text-center bg-slate-800/40 rounded-3xl border border-slate-800">
                <p className="text-sm text-slate-400">No active complaints found.</p>
                <button
                  onClick={() => setCurrentTab('types')}
                  className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Register New Complaint
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Complaint Info Badge */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-800 to-indigo-950/60 border border-indigo-700/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      #{activeComplaint.id}
                    </span>
                    <span className="text-xs font-bold text-indigo-300">
                      Room {activeComplaint.roomNumber}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white">{activeComplaint.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">{activeComplaint.description}</p>

                  {/* Technician info if assigned */}
                  {activeComplaint.assignedEmployeeName && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400">Assigned Tech: </span>
                        <span className="font-bold text-white">
                          {activeComplaint.assignedEmployeeName}
                        </span>
                      </div>
                      <a
                        href={`tel:${activeComplaint.assignedEmployeePhone}`}
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                      >
                        <PhoneCall className="w-3 h-3" /> Call Tech
                      </a>
                    </div>
                  )}

                  {/* Secure Verification OTP box */}
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-[10px] uppercase font-bold text-amber-300">
                          Resolution Verification OTP
                        </div>
                        <div className="text-[10px] text-slate-300">
                          Share with technician only when work is done
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-black tracking-widest text-white px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">
                      {activeComplaint.verificationOtp}
                    </span>
                  </div>
                </div>

                {/* STEPPER TIMELINE (EXACT VISUAL REPLICA OF THE POSTER) */}
                <div className="p-4 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-xl">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
                    Tracking Timeline
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                    {/* Step 1: Complaint Registered */}
                    <div className="relative">
                      <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">Complaint Registered</h5>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Your complaint has been successfully registered.
                        </p>
                        <span className="inline-block text-[10px] font-mono text-slate-400 mt-1">
                          📅 {activeComplaint.timeline[0]?.timestamp || '11 Nov 2026, 10:30 AM'}
                        </span>
                      </div>
                    </div>

                    {/* Step 2: Time Slot for Rectification */}
                    <div className="relative">
                      <div
                        className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                          activeComplaint.status !== 'registered'
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">Time Slot for Rectification</h5>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {activeComplaint.scheduledSlot
                            ? `Scheduled on ${activeComplaint.scheduledSlot}`
                            : `Preferred: ${activeComplaint.preferredSlot}`}
                        </p>
                        <span className="inline-block text-[10px] font-mono text-slate-400 mt-1">
                          📅 {activeComplaint.timeline[1]?.timestamp || 'Scheduled'}
                        </span>
                      </div>
                    </div>

                    {/* Step 3: Completed */}
                    <div className="relative">
                      <div
                        className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                          activeComplaint.status === 'completed' || activeComplaint.status === 'closed'
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">Completed</h5>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {activeComplaint.status === 'completed' || activeComplaint.status === 'closed'
                            ? 'Your complaint has been resolved.'
                            : 'Awaiting resolution completion.'}
                        </p>
                        <span className="inline-block text-[10px] font-mono text-slate-400 mt-1">
                          📅 {activeComplaint.timeline[2]?.timestamp || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technician Completion Proof Photo (if completed) */}
                {activeComplaint.completionProofUrl && (
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-xs font-bold text-slate-300 block mb-2">
                      📸 Technician Resolution Proof:
                    </span>
                    <img
                      src={activeComplaint.completionProofUrl}
                      alt="Resolution Proof"
                      className="w-full h-36 object-cover rounded-xl"
                    />
                    {activeComplaint.technicianNotes && (
                      <p className="text-[11px] text-slate-300 mt-2 italic bg-slate-900/60 p-2 rounded-lg">
                        "{activeComplaint.technicianNotes}"
                      </p>
                    )}
                  </div>
                )}

                {/* Rating Form if Completed */}
                {(activeComplaint.status === 'completed' || activeComplaint.status === 'closed') && (
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-700/40">
                    {hasRatedThisSession || activeComplaint.studentRating ? (
                      <div className="text-center py-2">
                        <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= (activeComplaint.studentRating || ratingScore)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs font-bold text-white">Thank you for your rating!</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {activeComplaint.studentFeedback || ratingComment || 'Verified & Closed.'}
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleRatingSubmit} className="space-y-3">
                        <div className="text-center">
                          <h5 className="text-xs font-bold text-white">Rate the Resolution Quality</h5>
                          <p className="text-[10px] text-slate-400">
                            Help us maintain high hostel living standards
                          </p>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setRatingScore(s)}
                                className="p-1 hover:scale-110 transition"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    s <= ratingScore
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <input
                          type="text"
                          value={ratingComment}
                          onChange={(e) => setRatingComment(e.target.value)}
                          placeholder="Add comments (e.g., fast work, neat cleaning)..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                        />

                        <button
                          type="submit"
                          className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                        >
                          Submit Feedback
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Back to Home Button (Matching Poster) */}
                <button
                  onClick={() => setCurrentTab('home')}
                  className="w-full py-3 rounded-2xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: POMODORO TIMER */}
        {currentTab === 'pomodoro' && (
          <div className="h-full">
            <PomodoroTimer onBack={() => setCurrentTab('home')} />
          </div>
        )}

        {/* VIEW 7: HELP & SUPPORT */}
        {currentTab === 'help' && (
          <div className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('home')}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-black text-white">Help & Emergency Support</h2>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Campus Emergency & Ambulance</h4>
                    <p className="text-[11px] text-rose-300">Available 24x7 for medical / fire emergencies</p>
                  </div>
                </div>
                <a
                  href="tel:108"
                  className="mt-3 inline-block w-full py-2 text-center rounded-xl bg-rose-600 text-white font-bold text-xs"
                >
                  Call Emergency Desk (108 / Ext 4444)
                </a>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <h4 className="text-xs font-bold text-white mb-2">Hostel Administration Directory</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
                    <div>
                      <div className="font-semibold text-white">Chief Warden Office</div>
                      <div className="text-[10px] text-slate-400">Dr. Rajesh Deshmukh</div>
                    </div>
                    <a href="tel:+919811122334" className="text-indigo-400 font-bold">
                      Call
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
                    <div>
                      <div className="font-semibold text-white">Hostel Gate 2 Security Post</div>
                      <div className="text-[10px] text-slate-400">24h Guard Room</div>
                    </div>
                    <a href="tel:+919899900011" className="text-indigo-400 font-bold">
                      Call
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
                    <div>
                      <div className="font-semibold text-white">Maintenance Control Room</div>
                      <div className="text-[10px] text-slate-400">Central Electrical & Plumbing</div>
                    </div>
                    <a href="tel:+919822233445" className="text-indigo-400 font-bold">
                      Call
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 8: PROFILE */}
        {currentTab === 'profile' && (
          <div className="p-4 sm:p-5 space-y-4">
            <div className="text-center py-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-indigo-500/40 shadow-xl"
              />
              <h3 className="text-base font-black text-white mt-2">{currentUser.name}</h3>
              <p className="text-xs text-amber-400 font-bold">Student • ID: {currentUser.id}</p>
              <p className="text-xs text-slate-400">
                Room {currentUser.roomNumber} • {currentUser.hostelBlock}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-200 font-mono">{currentUser.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Phone:</span>
                <span className="text-slate-200">{currentUser.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Total Requests Logged:</span>
                <span className="text-amber-400 font-bold">{studentComplaints.length}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Resolved Complaints:</span>
                <span className="text-emerald-400 font-bold">
                  {studentComplaints.filter((c) => c.status === 'completed' || c.status === 'closed').length}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCurrentTab('types')}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              + Register New Complaint
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION BAR (Matching the Poster) */}
      <nav className="shrink-0 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-4 py-2 flex items-center justify-around text-xs">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-1 font-semibold transition ${
            currentTab === 'home' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('status')}
          className={`flex flex-col items-center gap-1 font-semibold transition ${
            currentTab === 'status' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px]">Status</span>
        </button>

        <button
          onClick={() => setCurrentTab('pomodoro')}
          className={`flex flex-col items-center gap-1 font-semibold transition ${
            currentTab === 'pomodoro' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px]">Study</span>
        </button>

        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center gap-1 font-semibold transition ${
            currentTab === 'profile' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </div>
  );
};

import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="relative mx-auto my-3 sm:my-6 w-full max-w-[390px] h-[844px] max-h-[92vh] bg-slate-950 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_12px_#1e293b,0_0_0_14px_#334155] border-4 border-slate-700/60 flex flex-col overflow-hidden">
      {/* Top Phone Bezel & Status Bar (matching poster 9:41) */}
      <div className="shrink-0 h-11 px-6 pt-2 pb-1 flex items-center justify-between text-white text-xs select-none bg-slate-900/90 z-20">
        <span className="font-bold text-xs tracking-tight">9:41</span>

        {/* Dynamic Island Pill */}
        <div className="w-24 h-5 bg-slate-950 rounded-full flex items-center justify-center border border-slate-800 shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 mr-3" />
          <div className="w-2 h-2 rounded-full bg-indigo-900/40" />
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Screen Body */}
      <div className="flex-1 w-full h-[calc(100%-44px-20px)] overflow-hidden relative bg-slate-900 flex flex-col">
        {children}
      </div>

      {/* Bottom Home Indicator Bar */}
      <div className="shrink-0 h-5 bg-slate-900/90 flex items-center justify-center z-20">
        <div className="w-32 h-1 bg-slate-600/80 rounded-full" />
      </div>
    </div>
  );
};

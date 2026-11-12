import React from 'react';
import { X, Sparkles, CheckCircle2, Smartphone, Shield, Wrench, GraduationCap } from 'lucide-react';

interface PosterShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PosterShowcaseModal: React.FC<PosterShowcaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Original HostelCare Poster Reference</h2>
              <p className="text-xs text-slate-400">
                Uploaded Poster & Corresponding Role Implementations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Poster Image */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Uploaded Design Poster
            </span>
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner max-h-[70vh] overflow-y-auto">
              <img
                src="/assets/aistudio/HostelCare_App_Showcase_Poster__1__328136cc.png"
                alt="HostelCare App Showcase Poster"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Interactive Feature Coverage Breakdown */}
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-700/40">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5 mb-1.5">
                <span>🌟</span> Faithfully Implemented Features
              </h3>
              <p className="text-indigo-200/90 leading-relaxed">
                The application faithfully reconstructs every screen from the showcase poster:
              </p>

              <ul className="mt-3 space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Student Mobile App:</strong> Welcome Back Login, Sign Up, "Hello Student!" dashboard with "Today's Goal: Complete 3 tasks (1/3)", 4 quick action cards, and recent activity.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Complaint Categories:</strong> All 7 illustrated category screens (Room Cleaning 🧹, Electricity / Lights 💡, Water Supply 💧, AC / Fan 🌀, Furniture 🛋️, Wi-Fi 📶, Others 💬).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Complaint Status Stepper:</strong> Exact replication of the 3-step timeline (Complaint Registered, Time Slot for Rectification, Completed) with live dates and resolution proof.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Pomodoro Timer:</strong> Built-in 25:00 focus timer with animated ring progress, quote "Small steps lead to big results!", play/pause, reset, and audio chimes!
                  </span>
                </li>
              </ul>
            </div>

            {/* Requested Role Additions */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5 mb-2">
                <span>🛡️</span> Roles Requested by User
              </h3>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    <span>Hostel Warden Portal</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Full administration dashboard: oversee all student requests, assign tasks to technicians, manage emergency escalations, and broadcast official hostel notices.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4" />
                    <span>Corresponding Employee / Technician Roles</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Specialized portals for Electrician, Plumber, Housekeeping, AC/HVAC, Furniture, and Network staff. Includes on-site progress toggles, photo proof upload, and Student OTP verification.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
            >
              Close & Explore Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

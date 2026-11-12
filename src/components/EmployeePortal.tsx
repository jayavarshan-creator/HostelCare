import React, { useState } from 'react';
import {
  Complaint,
  ComplaintStatus,
  EmployeeCategory,
  User,
} from '../types';
import {
  CATEGORIES_METADATA,
  formatTimelineDate,
} from '../utils/complaints';
import confetti from 'canvas-confetti';
import {
  Wrench,
  CheckCircle2,
  Clock,
  PhoneCall,
  MapPin,
  Camera,
  KeyRound,
  AlertCircle,
  FileText,
  Calendar,
  Send,
  Sparkle,
  Zap,
  Droplet,
  Fan,
  Armchair,
  Wifi,
  MessageCircle,
} from 'lucide-react';

interface EmployeePortalProps {
  currentUser: User;
  complaints: Complaint[];
  onUpdateComplaintStatus: (
    complaintId: string,
    newStatus: ComplaintStatus,
    notes?: string,
    proofUrl?: string
  ) => void;
  onClaimComplaint: (complaintId: string) => void;
  isMobileFrame?: boolean;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({
  currentUser,
  complaints,
  onUpdateComplaintStatus,
  onClaimComplaint,
  isMobileFrame = false,
}) => {
  const [filterTab, setFilterTab] = useState<'assigned' | 'in_progress' | 'unassigned' | 'completed'>('assigned');
  
  // Resolution modal state
  const [resolvingComplaint, setResolvingComplaint] = useState<Complaint | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [techNotes, setTechNotes] = useState('');
  const [proofPhotoUrl, setProofPhotoUrl] = useState('');
  const [resolutionError, setResolutionError] = useState<string | null>(null);

  const empCategory = currentUser.employeeCategory || 'electricity';
  const categoryMeta = CATEGORIES_METADATA.find((m) => m.id === empCategory);

  // Filter complaints
  // 1. Assigned to this employee
  const myAssignedComplaints = complaints.filter(
    (c) => c.assignedEmployeeId === currentUser.id
  );

  // 2. Unassigned complaints matching this trade category
  const unassignedCategoryComplaints = complaints.filter(
    (c) => c.category === empCategory && (!c.assignedEmployeeId || c.status === 'registered')
  );

  const activeWorkload = myAssignedComplaints.filter(
    (c) => c.status === 'scheduled' || c.status === 'in_progress'
  );

  const completedToday = myAssignedComplaints.filter(
    (c) => c.status === 'completed' || c.status === 'closed'
  );

  const renderCategoryIcon = (id: EmployeeCategory, className = 'w-4 h-4') => {
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

  const handleStartWork = (complaintId: string) => {
    onUpdateComplaintStatus(complaintId, 'in_progress');
  };

  const handleOpenResolveModal = (c: Complaint) => {
    setResolvingComplaint(c);
    setOtpInput('');
    setTechNotes('Issue inspected and rectified. Tested with student.');
    const sampleProofPhotos: Record<string, string> = {
      cleaning: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
      electricity: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
      water: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
      ac_fan: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      furniture: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
      wifi: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    };
    setProofPhotoUrl(sampleProofPhotos[c.category] || sampleProofPhotos.electricity);
    setResolutionError(null);
  };

  const handleConfirmResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingComplaint) return;

    if (otpInput.trim() !== resolvingComplaint.verificationOtp) {
      setResolutionError(
        `Invalid Verification OTP! Ask student in Room ${resolvingComplaint.roomNumber} for their 4-digit code (Demo code: ${resolvingComplaint.verificationOtp}).`
      );
      return;
    }

    onUpdateComplaintStatus(
      resolvingComplaint.id,
      'completed',
      techNotes.trim(),
      proofPhotoUrl || undefined
    );

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    setResolvingComplaint(null);
  };

  return (
    <div
      className={`flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto w-full min-w-0 ${
        isMobileFrame
          ? 'p-3 space-y-3'
          : 'p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto'
      }`}
    >
      {/* Top Profile & Trade Banner */}
      <div className="bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-md w-full min-w-0">
        <div className="flex items-center gap-3 w-full min-w-0">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500/50 shadow shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-sm sm:text-base font-bold text-white">
                {currentUser.name}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                {renderCategoryIcon(empCategory, 'w-3 h-3')}
                <span>{categoryMeta?.title}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {currentUser.designation || 'Maintenance Staff'} • <span className="font-mono text-slate-300">{currentUser.id}</span>
            </p>
          </div>
        </div>

        {/* Quick Workload Stats - 3 Equal Columns */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 w-full">
          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider truncate">
              Active
            </span>
            <span className="text-base font-black text-amber-400">
              {activeWorkload.length}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider truncate">
              Resolved
            </span>
            <span className="text-base font-black text-emerald-400">
              {completedToday.length}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider truncate">
              Queue
            </span>
            <span className="text-base font-black text-indigo-400">
              {unassignedCategoryComplaints.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Bar - Scrollable horizontally on mobile with zero text wrapping bugs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-800/80 shrink-0 w-full min-w-0">
        <button
          onClick={() => setFilterTab('assigned')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-xs transition shrink-0 ${
            filterTab === 'assigned'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800/60'
          }`}
        >
          Assigned ({myAssignedComplaints.length})
        </button>

        <button
          onClick={() => setFilterTab('in_progress')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-xs transition shrink-0 ${
            filterTab === 'in_progress'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800/60'
          }`}
        >
          On-Site ({activeWorkload.length})
        </button>

        <button
          onClick={() => setFilterTab('unassigned')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-xs transition shrink-0 ${
            filterTab === 'unassigned'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800/60'
          }`}
        >
          Dept Queue ({unassignedCategoryComplaints.length})
        </button>

        <button
          onClick={() => setFilterTab('completed')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-xs transition shrink-0 ${
            filterTab === 'completed'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800/60'
          }`}
        >
          Resolved Archive ({completedToday.length})
        </button>
      </div>

      {/* Work Orders List Container */}
      <div className="w-full min-w-0 pb-8">
        {filterTab === 'unassigned' ? (
          /* Available in department queue to claim */
          unassignedCategoryComplaints.length === 0 ? (
            <div className="p-6 text-center bg-slate-900/80 rounded-2xl border border-slate-800 text-slate-400 text-xs w-full">
              No unassigned complaints in {categoryMeta?.title} department right now.
            </div>
          ) : (
            <div
              className={`w-full ${
                isMobileFrame
                  ? 'flex flex-col gap-3'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              }`}
            >
              {unassignedCategoryComplaints.map((c) => (
                <div
                  key={c.id}
                  className="w-full min-w-0 p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-sm"
                >
                  <div className="w-full min-w-0">
                    <div className="flex items-center justify-between mb-1.5 w-full">
                      <span className="font-mono font-bold text-amber-400 text-xs">#{c.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 shrink-0">
                        Awaiting Tech
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-white break-words">{c.title}</h3>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">{c.description}</p>

                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400 text-[11px] shrink-0">Location:</span>
                        <span className="font-semibold text-white text-[11px] truncate text-right">
                          Room {c.roomNumber} ({c.hostelBlock})
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400 text-[11px] shrink-0">Preferred Slot:</span>
                        <span className="font-medium text-amber-400 text-[11px] truncate text-right">
                          {c.preferredSlot || 'Flexible'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 w-full">
                    <button
                      onClick={() => onClaimComplaint(c.id)}
                      className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
                    >
                      Claim & Accept Work Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Assigned Work Orders */
          (() => {
            const list =
              filterTab === 'in_progress'
                ? activeWorkload
                : filterTab === 'completed'
                ? completedToday
                : myAssignedComplaints;

            if (list.length === 0) {
              return (
                <div className="p-6 text-center bg-slate-900/80 rounded-2xl border border-slate-800 text-slate-400 text-xs w-full">
                  No complaints found under this tab.
                </div>
              );
            }

            return (
              <div
                className={`w-full ${
                  isMobileFrame
                    ? 'flex flex-col gap-3'
                    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                }`}
              >
                {list.map((c) => {
                  const isDone = c.status === 'completed' || c.status === 'closed';
                  const isInProgress = c.status === 'in_progress';

                  return (
                    <div
                      key={c.id}
                      className={`w-full min-w-0 p-3.5 sm:p-4 rounded-2xl bg-slate-900 border flex flex-col justify-between transition shadow-sm ${
                        isInProgress
                          ? 'border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                          : isDone
                          ? 'border-emerald-500/30'
                          : 'border-slate-800'
                      }`}
                    >
                      <div className="w-full min-w-0">
                        {/* Header ID and Status Badge */}
                        <div className="flex items-center justify-between mb-2 w-full">
                          <span className="font-mono font-bold text-amber-400 text-xs">#{c.id}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                              isDone
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : isInProgress
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {c.status === 'in_progress'
                              ? 'IN PROGRESS'
                              : c.status === 'scheduled'
                              ? 'SCHEDULED'
                              : c.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-xs sm:text-sm font-bold text-white break-words leading-snug">
                          {c.title}
                        </h3>
                        <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {c.description}
                        </p>

                        {/* Location & Student Details Card */}
                        <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs w-full">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-400 text-[11px] shrink-0">Location:</span>
                            <span className="font-bold text-white text-[11px] truncate text-right">
                              Room {c.roomNumber} ({c.hostelBlock})
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-400 text-[11px] shrink-0">Student:</span>
                            <span className="font-medium text-slate-200 text-[11px] truncate text-right">
                              {c.studentName}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-400 text-[11px] shrink-0">Phone:</span>
                            <a
                              href={`tel:${c.studentPhone}`}
                              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono font-semibold text-[11px] shrink-0"
                            >
                              <PhoneCall className="w-3 h-3" /> {c.studentPhone}
                            </a>
                          </div>
                          {c.scheduledSlot && (
                            <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-800">
                              <span className="text-amber-400 text-[10px] font-bold shrink-0">Slot:</span>
                              <span className="font-semibold text-amber-300 text-[11px] truncate text-right">
                                {c.scheduledSlot}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Issue Photo Thumbnail if uploaded */}
                        {c.photoUrl && (
                          <div className="mt-2.5 w-full">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                              Student Photo of Issue:
                            </span>
                            <img
                              src={c.photoUrl}
                              alt="Issue"
                              className="w-full h-28 object-cover rounded-xl border border-slate-800 shadow-sm"
                            />
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800 w-full">
                        {!isDone && (
                          <>
                            {c.status !== 'in_progress' ? (
                              <button
                                onClick={() => handleStartWork(c.id)}
                                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md transition flex items-center justify-center gap-1.5"
                              >
                                <Wrench className="w-3.5 h-3.5" />
                                <span>Start Work / On-Site</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenResolveModal(c)}
                                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-md transition flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Complete & Verify OTP</span>
                              </button>
                            )}
                          </>
                        )}

                        {isDone && (
                          <div className="w-full text-center text-[11px] text-emerald-400 font-bold py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            ✓ Rectification Completed & Verified
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()
        )}
      </div>

      {/* RESOLUTION MODAL WITH OTP VERIFICATION (Clean Mobile Overlay) */}
      {resolvingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-4 sm:p-6 my-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                <span className="truncate">Mark Resolution for #{resolvingComplaint.id}</span>
              </h3>
              <button
                onClick={() => setResolvingComplaint(null)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmResolution} className="mt-3.5 space-y-3.5">
              {resolutionError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{resolutionError}</span>
                </div>
              )}

              {/* OTP Input Requirement */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <label className="block text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Enter Student OTP (Room {resolvingComplaint.roomNumber})</span>
                </label>
                <p className="text-[10px] text-slate-300 mb-2">
                  Ask the student in Room {resolvingComplaint.roomNumber} for their 4-digit code.
                </p>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder={`e.g. ${resolvingComplaint.verificationOtp}`}
                  className="w-full px-3 py-2 bg-slate-950 border border-amber-500/50 rounded-xl text-center text-lg font-mono font-black text-amber-300 tracking-widest placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[10px] text-slate-400 mt-1 text-center">
                  (Demo code is: <strong>{resolvingComplaint.verificationOtp}</strong>)
                </p>
              </div>

              {/* Technician notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Resolution Summary / Work Done
                </label>
                <textarea
                  rows={2}
                  required
                  value={techNotes}
                  onChange={(e) => setTechNotes(e.target.value)}
                  placeholder="Describe parts replaced or repairs completed..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white resize-none"
                />
              </div>

              {/* Proof Photo Attachment */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Proof of Rectification Photo
                </label>
                {proofPhotoUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 h-24">
                    <img
                      src={proofPhotoUrl}
                      alt="Proof"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 text-[9px] bg-slate-900/80 px-2 py-0.5 rounded text-emerald-300 font-bold">
                      Attached
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setProofPhotoUrl(
                        'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80'
                      )
                    }
                    className="w-full py-2 bg-slate-800 text-xs text-indigo-300 rounded-xl border border-slate-700"
                  >
                    + Attach Proof Photo
                  </button>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setResolvingComplaint(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
                >
                  Verify & Mark Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

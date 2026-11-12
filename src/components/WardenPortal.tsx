import React, { useState } from 'react';
import {
  Complaint,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
  EmployeeCategory,
  User,
  Notice,
} from '../types';
import {
  CATEGORIES_METADATA,
  calculateComplaintMetrics,
  formatTimelineDate,
} from '../utils/complaints';
import {
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Send,
  PlusCircle,
  Megaphone,
  PhoneCall,
  Calendar,
  Layers,
  ArrowUpRight,
  Eye,
  Check,
  X,
  Sparkle,
  Zap,
  Droplet,
  Fan,
  Armchair,
  Wifi,
  MessageCircle,
} from 'lucide-react';

interface WardenPortalProps {
  currentUser: User;
  complaints: Complaint[];
  employees: User[];
  notices: Notice[];
  onAssignComplaint: (
    complaintId: string,
    employeeId: string,
    scheduledSlot: string
  ) => void;
  onUpdateComplaintPriority: (
    complaintId: string,
    priority: ComplaintPriority
  ) => void;
  onAddNotice: (notice: Notice) => void;
  isMobileFrame?: boolean;
}

export const WardenPortal: React.FC<WardenPortalProps> = ({
  currentUser,
  complaints,
  employees,
  notices,
  onAssignComplaint,
  onUpdateComplaintPriority,
  onAddNotice,
  isMobileFrame = false,
}) => {
  const metrics = calculateComplaintMetrics(complaints);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBlock, setSelectedBlock] = useState<string>('all');

  // Active modal states
  const [allocatingComplaint, setAllocatingComplaint] = useState<Complaint | null>(null);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [scheduledSlot, setScheduledSlot] = useState<string>('Today, 02:00 - 04:00 PM');
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  // New Notice form state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'general' | 'water' | 'electricity' | 'wifi'>('general');
  const [noticeIsImportant, setNoticeIsImportant] = useState(true);

  // View detail modal
  const [detailComplaint, setDetailComplaint] = useState<Complaint | null>(null);

  // Render category icon dynamically
  const renderCategoryIcon = (id: ComplaintCategory, className = 'w-4 h-4') => {
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

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesBlock = selectedBlock === 'all' || c.hostelBlock.toLowerCase().includes(selectedBlock.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory && matchesBlock;
  });

  const handleOpenAssign = (c: Complaint) => {
    setAllocatingComplaint(c);
    // Find matching employee by category
    const defaultEmp = employees.find((e) => e.employeeCategory === c.category) || employees[0];
    setSelectedEmpId(defaultEmp?.id || '');
    setScheduledSlot(c.preferredSlot || 'Today, 02:00 - 04:00 PM');
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocatingComplaint || !selectedEmpId) return;

    onAssignComplaint(allocatingComplaint.id, selectedEmpId, scheduledSlot);
    setAllocatingComplaint(null);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    const newNotice: Notice = {
      id: `NOT-${Date.now().toString().slice(-4)}`,
      title: noticeTitle.trim(),
      content: noticeContent.trim(),
      category: noticeCategory,
      date: 'Today',
      authorName: currentUser.name,
      authorRole: 'Chief Warden',
      isImportant: noticeIsImportant,
    };

    onAddNotice(newNotice);
    setNoticeTitle('');
    setNoticeContent('');
    setShowNoticeModal(false);
  };

  return (
    <div
      className={`flex-1 bg-slate-950 text-slate-100 overflow-y-auto w-full min-w-0 ${
        isMobileFrame
          ? 'p-3 space-y-3'
          : 'p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto'
      }`}
    >
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h1 className="text-base sm:text-xl lg:text-2xl font-black text-white tracking-tight">
              Warden Administration
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
            Hostel Facilities Management, Staff Allocation, and SLA Oversight
          </p>
        </div>

        {/* Action button: Post Notice */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNoticeModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        className={
          isMobileFrame
            ? 'grid grid-cols-2 gap-2'
            : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4'
        }
      >
        {/* Total Complaints */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="truncate">Total Requests</span>
            <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{metrics.total}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">All time logged</div>
        </div>

        {/* Pending Allocation */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between text-[11px] text-amber-400 mb-1">
            <span className="truncate">Pending Dispatch</span>
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400">{metrics.registered}</div>
          <div className="text-[10px] text-amber-300/80 mt-0.5">Needs staff dispatch</div>
        </div>

        {/* In Progress */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-blue-500/30 bg-blue-500/5">
          <div className="flex items-center justify-between text-[11px] text-blue-400 mb-1">
            <span className="truncate">In Rectification</span>
            <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-400">{metrics.inProgress + metrics.scheduled}</div>
          <div className="text-[10px] text-blue-300/80 mt-0.5">Scheduled & on site</div>
        </div>

        {/* Resolved */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center justify-between text-[11px] text-emerald-400 mb-1">
            <span className="truncate">Resolved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">{metrics.completed}</div>
          <div className="text-[10px] text-emerald-300/80 mt-0.5">{metrics.resolutionRate}% SLA Success</div>
        </div>

        {/* High / Emergency */}
        <div
          className={`p-3 rounded-2xl bg-slate-900 border border-rose-500/30 bg-rose-500/5 ${
            isMobileFrame ? 'col-span-2' : 'col-span-2 sm:col-span-1'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] text-rose-400 mb-1">
            <span>High / Urgent Priority</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400">{metrics.highOrEmergency}</div>
          <div className="text-[10px] text-rose-300/80 mt-0.5">Priority attention</div>
        </div>
      </div>

      {/* Maintenance Employees Roster / Workload */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 w-full min-w-0">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
          <span>Maintenance Staff ({employees.length})</span>
          <span className="text-[10px] text-indigo-400 font-medium">Auto-matched</span>
        </h3>

        <div
          className={
            isMobileFrame
              ? 'grid grid-cols-2 gap-2'
              : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5'
          }
        >
          {employees.map((emp) => {
            const activeTasks = complaints.filter(
              (c) =>
                c.assignedEmployeeId === emp.id &&
                (c.status === 'scheduled' || c.status === 'in_progress')
            ).length;
            const catMeta = CATEGORIES_METADATA.find((m) => m.id === emp.employeeCategory);

            return (
              <div
                key={emp.id}
                className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-600"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{emp.name}</div>
                    <div className="text-[10px] text-amber-400 font-semibold truncate">
                      {catMeta?.title || 'General'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-[10px]">
                  <span className="text-slate-400">Active Load:</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded ${
                      activeTasks > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {activeTasks} tasks
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Complaints Management Table & Filters */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-xl">
        {/* Search & Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student, room, complaint ID, or title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="registered">Registered (Pending Allocation)</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-xs"
            >
              <option value="all">All Categories</option>
              {CATEGORIES_METADATA.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>

            {/* Block Filter */}
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-xs"
            >
              <option value="all">All Hostel Blocks</option>
              <option value="Block A">Block A (Sahyadri)</option>
              <option value="Block B">Block B (Nilgiri)</option>
              <option value="Block C">Block C (Aravali)</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Complaint</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Room & Student</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Assigned Technician</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No complaints match current filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => {
                  const cat = CATEGORIES_METADATA.find((m) => m.id === c.category);
                  const isUnassigned = !c.assignedEmployeeId || c.status === 'registered';

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition">
                      {/* ID & Title */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400">{c.id}</span>
                          {c.priority === 'emergency' && (
                            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">
                              URGENT
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-white truncate mt-0.5">{c.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{c.description}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cat?.badgeBg}`}
                        >
                          {renderCategoryIcon(c.category, 'w-3 h-3')}
                          <span>{cat?.title}</span>
                        </span>
                      </td>

                      {/* Room & Student */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">Room {c.roomNumber}</div>
                        <div className="text-slate-400 text-[11px]">{c.studentName}</div>
                        <div className="text-slate-500 text-[10px]">{c.hostelBlock}</div>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-3">
                        <select
                          value={c.priority}
                          onChange={(e) =>
                            onUpdateComplaintPriority(c.id, e.target.value as ComplaintPriority)
                          }
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border bg-slate-900 ${
                            c.priority === 'emergency'
                              ? 'text-rose-400 border-rose-500/40'
                              : c.priority === 'high'
                              ? 'text-amber-400 border-amber-500/40'
                              : c.priority === 'medium'
                              ? 'text-blue-400 border-blue-500/40'
                              : 'text-slate-400 border-slate-700'
                          }`}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="emergency">Emergency</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            c.status === 'completed' || c.status === 'closed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : c.status === 'in_progress'
                              ? 'bg-blue-500/20 text-blue-300'
                              : c.status === 'scheduled'
                              ? 'bg-indigo-500/20 text-indigo-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {c.status === 'completed'
                            ? 'Resolved'
                            : c.status === 'in_progress'
                            ? 'In Progress'
                            : c.status === 'scheduled'
                            ? 'Scheduled'
                            : 'Pending Allocation'}
                        </span>
                      </td>

                      {/* Assigned Tech */}
                      <td className="py-3 px-3">
                        {c.assignedEmployeeName ? (
                          <div>
                            <div className="font-bold text-slate-200">{c.assignedEmployeeName}</div>
                            <div className="text-[10px] text-slate-400">{c.scheduledSlot}</div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-amber-400 italic font-medium">
                            Not yet assigned
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setDetailComplaint(c)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="View Full Details & OTP"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenAssign(c)}
                            className={`px-2.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 ${
                              isUnassigned
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                                : 'bg-slate-800 hover:bg-slate-700 text-indigo-300'
                            }`}
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{isUnassigned ? 'Assign Staff' : 'Reassign'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ALLOCATION DIALOG */}
      {allocatingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <span>Assign Maintenance Staff to #{allocatingComplaint.id}</span>
              </h3>
              <button
                onClick={() => setAllocatingComplaint(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="mt-4 space-y-4">
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="font-bold text-white text-xs">{allocatingComplaint.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Room {allocatingComplaint.roomNumber} • Student: {allocatingComplaint.studentName}
                </div>
                <div className="text-[11px] text-amber-300 mt-1">
                  Preferred Visit Slot: {allocatingComplaint.preferredSlot}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Employee / Technician
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {employees.map((emp) => {
                    const isSelected = selectedEmpId === emp.id;
                    const isMatchedCategory = emp.employeeCategory === allocatingComplaint.category;

                    return (
                      <div
                        key={emp.id}
                        onClick={() => setSelectedEmpId(emp.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-500 text-white'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold flex items-center gap-1.5">
                              {emp.name}
                              {isMatchedCategory && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                                  Category Match
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">{emp.designation}</div>
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirmed Rectification Time Slot
                </label>
                <input
                  type="text"
                  value={scheduledSlot}
                  onChange={(e) => setScheduledSlot(e.target.value)}
                  placeholder="e.g. Today, 02:00 - 04:00 PM"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAllocatingComplaint(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BROADCAST NOTICE DIALOG */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <span>Broadcast Notice to Hostel</span>
              </h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Water Supply Maintenance Schedule"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="general">General Administration</option>
                  <option value="water">Water Supply / Sanitation</option>
                  <option value="electricity">Electrical Maintenance</option>
                  <option value="wifi">Hostel Internet / Wi-Fi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Details</label>
                <textarea
                  rows={3}
                  required
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Write message to students and staff..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="impNotice"
                  checked={noticeIsImportant}
                  onChange={(e) => setNoticeIsImportant(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <label htmlFor="impNotice" className="text-xs text-slate-300">
                  Mark as High Importance Banner
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW COMPLAINT DETAILS */}
      {detailComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Complaint #{detailComplaint.id}</span>
                <span className="text-xs font-normal text-slate-400">
                  ({formatTimelineDate(detailComplaint.createdAt)})
                </span>
              </h3>
              <button onClick={() => setDetailComplaint(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-black text-white">{detailComplaint.title}</h4>
                <p className="text-xs text-slate-300 mt-1">{detailComplaint.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                <div>
                  <span className="text-slate-400">Student: </span>
                  <span className="font-bold text-white">{detailComplaint.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400">Room: </span>
                  <span className="font-bold text-amber-400">{detailComplaint.roomNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400">Phone: </span>
                  <span className="font-mono text-slate-200">{detailComplaint.studentPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400">Hostel Block: </span>
                  <span className="text-slate-200">{detailComplaint.hostelBlock}</span>
                </div>
              </div>

              {/* Photo if attached */}
              {detailComplaint.photoUrl && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">
                    Student Issue Photo:
                  </span>
                  <img
                    src={detailComplaint.photoUrl}
                    alt="Issue photo"
                    className="w-full h-44 object-cover rounded-xl border border-slate-700"
                  />
                </div>
              )}

              {/* Technician resolution proof */}
              {detailComplaint.completionProofUrl && (
                <div>
                  <span className="text-xs font-semibold text-emerald-400 block mb-1">
                    Technician Resolution Proof:
                  </span>
                  <img
                    src={detailComplaint.completionProofUrl}
                    alt="Resolution photo"
                    className="w-full h-44 object-cover rounded-xl border border-emerald-500/30"
                  />
                  {detailComplaint.technicianNotes && (
                    <p className="text-xs text-slate-300 mt-1.5 italic bg-slate-800 p-2 rounded-lg">
                      "{detailComplaint.technicianNotes}"
                    </p>
                  )}
                </div>
              )}

              {/* OTP for Verification */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-amber-300">Completion Verification OTP</div>
                  <div className="text-[10px] text-slate-400">
                    Given to student to confirm work completion
                  </div>
                </div>
                <span className="font-mono font-black text-white text-base px-3 py-1 rounded bg-slate-900 border border-amber-500/40">
                  {detailComplaint.verificationOtp}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

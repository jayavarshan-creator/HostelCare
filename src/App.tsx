import React, { useState } from 'react';
import {
  User,
  Complaint,
  Notice,
  ComplaintPriority,
  ComplaintStatus,
} from './types';
import {
  DEMO_USERS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTICES,
  formatTimelineDate,
} from './utils/complaints';
import { Navbar } from './components/Navbar';
import { PhoneFrame } from './components/PhoneFrame';
import { StudentPortal } from './components/StudentPortal';
import { WardenPortal } from './components/WardenPortal';
import { EmployeePortal } from './components/EmployeePortal';
import { AuthModal } from './components/AuthModal';
import { PosterShowcaseModal } from './components/PosterShowcaseModal';

export default function App() {
  // Users state
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USERS[0]); // Default to student Aarav

  // Main complaints database state
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);

  // Notices / Announcement state
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);

  // Display mode: Mobile phone frame mockup vs Full responsive view
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isPosterOpen, setIsPosterOpen] = useState<boolean>(false);

  // Employees list for warden assignment
  const employees = users.filter((u) => u.role === 'employee');

  // Handle user registration (Student, Warden, or Staff)
  const handleRegisterUser = (newUser: User) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  // Handle new complaint creation
  const handleCreateComplaint = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  // Handle warden assigning complaint to an employee
  const handleAssignComplaint = (
    complaintId: string,
    employeeId: string,
    scheduledSlot: string
  ) => {
    const employee = users.find((u) => u.id === employeeId);
    if (!employee) return;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          const nowStr = formatTimelineDate(new Date().toISOString());
          const updatedTimeline = c.timeline.map((step) => {
            if (step.step === 'scheduled') {
              return {
                ...step,
                description: `Assigned to ${employee.name} (${employee.designation || 'Staff'}). Scheduled: ${scheduledSlot}`,
                timestamp: nowStr,
                completed: true,
                active: true,
              };
            }
            return step;
          });

          return {
            ...c,
            status: 'scheduled',
            assignedEmployeeId: employee.id,
            assignedEmployeeName: employee.name,
            assignedEmployeePhone: employee.phone,
            assignedEmployeeCategory: employee.employeeCategory,
            scheduledSlot,
            timeline: updatedTimeline,
          };
        }
        return c;
      })
    );
  };

  // Handle employee updating status (e.g. in_progress, completed)
  const handleUpdateComplaintStatus = (
    complaintId: string,
    newStatus: ComplaintStatus,
    notes?: string,
    proofUrl?: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          const nowStr = formatTimelineDate(new Date().toISOString());
          const updatedTimeline = c.timeline.map((step) => {
            if (newStatus === 'completed' && step.step === 'completed') {
              return {
                ...step,
                description: notes || 'Your complaint has been resolved by technician.',
                timestamp: nowStr,
                completed: true,
                active: false,
              };
            }
            if (newStatus === 'in_progress' && step.step === 'scheduled') {
              return {
                ...step,
                description: 'Technician arrived on-site and began rectification.',
                timestamp: nowStr,
                completed: true,
                active: true,
              };
            }
            return step;
          });

          return {
            ...c,
            status: newStatus,
            technicianNotes: notes || c.technicianNotes,
            completionProofUrl: proofUrl || c.completionProofUrl,
            timeline: updatedTimeline,
          };
        }
        return c;
      })
    );
  };

  // Handle employee self-claiming an unassigned complaint in their trade
  const handleClaimComplaint = (complaintId: string) => {
    if (!currentUser || currentUser.role !== 'employee') return;
    const nowStr = formatTimelineDate(new Date().toISOString());

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          const updatedTimeline = c.timeline.map((step) => {
            if (step.step === 'scheduled') {
              return {
                ...step,
                description: `Claimed by ${currentUser.name}. Rectification scheduled.`,
                timestamp: nowStr,
                completed: true,
                active: true,
              };
            }
            return step;
          });

          return {
            ...c,
            status: 'scheduled',
            assignedEmployeeId: currentUser.id,
            assignedEmployeeName: currentUser.name,
            assignedEmployeePhone: currentUser.phone,
            assignedEmployeeCategory: currentUser.employeeCategory,
            scheduledSlot: c.preferredSlot || 'Today, 02:00 - 04:00 PM',
            timeline: updatedTimeline,
          };
        }
        return c;
      })
    );
  };

  // Handle warden updating complaint priority
  const handleUpdateComplaintPriority = (complaintId: string, priority: ComplaintPriority) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, priority } : c))
    );
  };

  // Handle warden posting notice
  const handleAddNotice = (notice: Notice) => {
    setNotices((prev) => [notice, ...prev]);
  };

  // Handle student rating submission
  const handleRateComplaint = (complaintId: string, rating: number, feedback: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              studentRating: rating,
              studentFeedback: feedback,
              status: 'closed',
            }
          : c
      )
    );
  };

  // Switch active user
  const handleQuickSwitchUser = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => setCurrentUser(null)}
        onQuickSwitchUser={handleQuickSwitchUser}
        allUsers={users}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        onShowPosterModal={() => setIsPosterOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {currentUser ? (
          <>
            {/* If Mobile Mockup Frame is toggled */}
            {isMobileFrame ? (
              <PhoneFrame>
                {currentUser.role === 'student' ? (
                  <StudentPortal
                    currentUser={currentUser}
                    complaints={complaints}
                    notices={notices}
                    onCreateComplaint={handleCreateComplaint}
                    onRateComplaint={handleRateComplaint}
                  />
                ) : currentUser.role === 'warden' ? (
                  <WardenPortal
                    currentUser={currentUser}
                    complaints={complaints}
                    employees={employees}
                    notices={notices}
                    onAssignComplaint={handleAssignComplaint}
                    onUpdateComplaintPriority={handleUpdateComplaintPriority}
                    onAddNotice={handleAddNotice}
                    isMobileFrame={true}
                  />
                ) : (
                  <EmployeePortal
                    currentUser={currentUser}
                    complaints={complaints}
                    onUpdateComplaintStatus={handleUpdateComplaintStatus}
                    onClaimComplaint={handleClaimComplaint}
                    isMobileFrame={true}
                  />
                )}
              </PhoneFrame>
            ) : (
              /* Full Responsive View (great for desktop dashboarding) */
              <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
                {currentUser.role === 'student' ? (
                  <div className="max-w-2xl mx-auto w-full h-[850px] max-h-[88vh] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                    <StudentPortal
                      currentUser={currentUser}
                      complaints={complaints}
                      notices={notices}
                      onCreateComplaint={handleCreateComplaint}
                      onRateComplaint={handleRateComplaint}
                    />
                  </div>
                ) : currentUser.role === 'warden' ? (
                  <WardenPortal
                    currentUser={currentUser}
                    complaints={complaints}
                    employees={employees}
                    notices={notices}
                    onAssignComplaint={handleAssignComplaint}
                    onUpdateComplaintPriority={handleUpdateComplaintPriority}
                    onAddNotice={handleAddNotice}
                    isMobileFrame={false}
                  />
                ) : (
                  <EmployeePortal
                    currentUser={currentUser}
                    complaints={complaints}
                    onUpdateComplaintStatus={handleUpdateComplaintStatus}
                    onClaimComplaint={handleClaimComplaint}
                    isMobileFrame={false}
                  />
                )}
              </div>
            )}
          </>
        ) : (
          /* Unauthenticated Landing / Login Prompt */
          <div className="text-center p-8 max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-400 mx-auto flex items-center justify-center font-black text-white text-3xl shadow-lg mb-4">
              H
            </div>
            <h2 className="text-2xl font-black text-white">
              Hostel<span className="text-amber-400">Care</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Smart Hostel Complaint Management System
            </p>
            <p className="text-xs text-indigo-300 mt-3 font-medium">
              Please sign in to access Student services, Warden oversight, or Maintenance Work Orders.
            </p>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="mt-6 w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-600/30 transition"
            >
              Sign In / Choose Role
            </button>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => handleQuickSwitchUser(user)}
        allUsers={users}
        onRegisterUser={handleRegisterUser}
      />

      {/* Poster Showcase Modal */}
      <PosterShowcaseModal
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
      />
    </div>
  );
}

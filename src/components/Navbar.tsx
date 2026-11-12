import React from 'react';
import { User } from '../types';
import {
  Shield,
  Smartphone,
  Monitor,
  LogOut,
  Sparkles,
  Image as ImageIcon,
  UserCheck,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onQuickSwitchUser: (user: User) => void;
  allUsers: User[];
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  onShowPosterModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onQuickSwitchUser,
  allUsers,
  isMobileFrame,
  setIsMobileFrame,
  onShowPosterModal,
}) => {
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  const getRoleBadge = (role: string, employeeCategory?: string) => {
    if (role === 'warden') {
      return {
        label: 'Hostel Warden',
        color: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
      };
    }
    if (role === 'employee') {
      const categoryNames: Record<string, string> = {
        electricity: 'Electrician',
        water: 'Plumber',
        cleaning: 'Housekeeping',
        ac_fan: 'AC & Fan Tech',
        furniture: 'Carpentry',
        wifi: 'Wi-Fi / Network',
        others: 'General Tech',
      };
      return {
        label: employeeCategory ? categoryNames[employeeCategory] || 'Employee' : 'Employee',
        color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
      };
    }
    return {
      label: 'Student',
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30',
    };
  };

  const badge = currentUser ? getRoleBadge(currentUser.role, currentUser.employeeCategory) : null;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-amber-500 shadow-md shadow-indigo-500/20">
            <span className="text-xl font-black text-white">H</span>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 p-0.5 rounded-full shadow-sm">
              <Shield className="w-3 h-3 fill-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-amber-300 bg-clip-text text-transparent">
                Hostel<span className="text-amber-400">Care</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Smart CMS
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              Report • Track • Get It Resolved — <span className="text-amber-300">Your Hostel, Our Priority ✨</span>
            </p>
          </div>
        </div>

        {/* Action Controls & User Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Mode Toggle: Phone Frame vs Full Screen */}
          <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 hidden sm:flex items-center gap-1 text-xs">
            <button
              onClick={() => setIsMobileFrame(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition ${
                isMobileFrame
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="View in mobile app frame matching poster"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Mockup</span>
            </button>
            <button
              onClick={() => setIsMobileFrame(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition ${
                !isMobileFrame
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="View responsive wide layout"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full View</span>
            </button>
          </div>

          {/* Reference Poster preview button */}
          <button
            onClick={onShowPosterModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition shadow-sm"
            title="View original poster design showcase"
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Original</span> Poster
          </button>

          {/* Current User Role / Quick Switch Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-left transition"
                aria-label="User role menu"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-400/40"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                    {currentUser.name}
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-amber-400 font-medium">
                    {badge?.label}
                  </div>
                </div>
              </button>

              {/* Role switch popup menu */}
              {showRoleMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowRoleMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-40 text-slate-200">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge?.color}`}>
                          {badge?.label}
                        </span>
                        {currentUser.roomNumber && (
                          <span className="text-[10px] text-slate-400">
                            Room {currentUser.roomNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch Role (Instant Demo)
                    </div>

                    <div className="max-h-60 overflow-y-auto px-1 space-y-1">
                      {allUsers.map((u) => {
                        const isSelected = u.id === currentUser.id;
                        const uBadge = getRoleBadge(u.role, u.employeeCategory);
                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              onQuickSwitchUser(u);
                              setShowRoleMenu(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition ${
                              isSelected
                                ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
                                : 'hover:bg-slate-800 text-slate-300'
                            }`}
                          >
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <div className="flex-1 truncate">
                              <div className="font-semibold text-slate-200">{u.name}</div>
                              <div className="text-[10px] text-slate-400">{uBadge.label}</div>
                            </div>
                            {isSelected && (
                              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800 px-2">
                      <button
                        onClick={() => {
                          setShowRoleMenu(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out / Switch Account</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-600/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

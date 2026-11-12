import React, { useState } from 'react';
import { User, UserRole, EmployeeCategory } from '../types';
import { validateUserRegistration } from '../utils/complaints';
import confetti from 'canvas-confetti';
import {
  Lock,
  User as UserIcon,
  Mail,
  Home,
  Shield,
  Wrench,
  GraduationCap,
  Eye,
  EyeOff,
  Zap,
  Droplet,
  Sparkle,
  Fan,
  Armchair,
  Wifi,
  AlertCircle,
  Briefcase,
  Phone,
  Building,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  allUsers: User[];
  onRegisterUser: (newUser: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  allUsers,
  onRegisterUser,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [selectedEmpCategory, setSelectedEmpCategory] = useState<EmployeeCategory>('electricity');

  // Login form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common sign up fields
  const [signUpName, setSignUpName] = useState('');
  const [signUpId, setSignUpId] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  // Role-specific sign up fields
  const [signUpRoom, setSignUpRoom] = useState('');
  const [signUpBlock, setSignUpBlock] = useState('Block B (Nilgiri)');
  const [signUpDesignation, setSignUpDesignation] = useState('Deputy Hostel Warden');
  const [signUpStaffTrade, setSignUpStaffTrade] = useState<EmployeeCategory>('electricity');
  const [signUpStaffTitle, setSignUpStaffTitle] = useState('Certified Electrical Technician');

  const tradesList: { id: EmployeeCategory; label: string; icon: any; color: string; defaultTitle: string }[] = [
    { id: 'electricity', label: 'Electrician', icon: Zap, color: 'text-yellow-400', defaultTitle: 'Senior Electrical Tech' },
    { id: 'water', label: 'Plumber', icon: Droplet, color: 'text-cyan-400', defaultTitle: 'Plumbing & Water Specialist' },
    { id: 'cleaning', label: 'Housekeeping', icon: Sparkle, color: 'text-amber-400', defaultTitle: 'Sanitation Supervisor' },
    { id: 'ac_fan', label: 'AC / Fan', icon: Fan, color: 'text-blue-400', defaultTitle: 'HVAC & Appliance Specialist' },
    { id: 'furniture', label: 'Furniture', icon: Armchair, color: 'text-orange-400', defaultTitle: 'Carpentry & Furniture Tech' },
    { id: 'wifi', label: 'Wi-Fi / IT', icon: Wifi, color: 'text-indigo-400', defaultTitle: 'Hostel Network Admin' },
  ];

  // Handle manual login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let user: User | undefined;

    if (selectedRole === 'student') {
      user = allUsers.find(
        (u) =>
          u.role === 'student' &&
          (u.id.toLowerCase() === identifier.trim().toLowerCase() ||
            u.email.toLowerCase() === identifier.trim().toLowerCase() ||
            identifier.trim() === '')
      );
    } else if (selectedRole === 'warden') {
      user = allUsers.find(
        (u) =>
          u.role === 'warden' &&
          (u.id.toLowerCase() === identifier.trim().toLowerCase() ||
            u.email.toLowerCase() === identifier.trim().toLowerCase() ||
            identifier.trim() === '')
      );
    } else if (selectedRole === 'employee') {
      user = allUsers.find(
        (u) =>
          u.role === 'employee' &&
          (u.employeeCategory === selectedEmpCategory ||
            u.id.toLowerCase() === identifier.trim().toLowerCase() ||
            u.email.toLowerCase() === identifier.trim().toLowerCase())
      );
    }

    if (!user) {
      setError('Invalid ID or credentials for this role. You can also use 1-click Quick Login below!');
      return;
    }

    onLoginSuccess(user);
    onClose();
  };

  // Handle sign up submission for Student, Warden, or Staff
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Prepare role-specific data
    let newUser: User;

    if (selectedRole === 'student') {
      const validation = validateUserRegistration({
        role: 'student',
        name: signUpName,
        id: signUpId,
        email: signUpEmail,
        roomNumber: signUpRoom,
        hostelBlock: signUpBlock,
        phone: signUpPhone || '+91 98765 ' + Math.floor(10000 + Math.random() * 90000),
      });

      if (!validation.valid) {
        setError(Object.values(validation.errors)[0]);
        return;
      }

      newUser = {
        id: signUpId.trim().toUpperCase(),
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        role: 'student',
        phone: signUpPhone.trim() || '+91 98765 ' + Math.floor(10000 + Math.random() * 90000),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        roomNumber: signUpRoom.trim().toUpperCase(),
        hostelBlock: signUpBlock,
      };
    } else if (selectedRole === 'warden') {
      const validation = validateUserRegistration({
        role: 'warden',
        name: signUpName,
        id: signUpId,
        email: signUpEmail,
        designation: signUpDesignation,
        hostelBlock: signUpBlock,
        phone: signUpPhone || '+91 98111 ' + Math.floor(10000 + Math.random() * 90000),
      });

      if (!validation.valid) {
        setError(Object.values(validation.errors)[0]);
        return;
      }

      newUser = {
        id: signUpId.trim().toUpperCase(),
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        role: 'warden',
        phone: signUpPhone.trim() || '+91 98111 ' + Math.floor(10000 + Math.random() * 90000),
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
        designation: signUpDesignation.trim(),
        hostelBlock: signUpBlock,
      };
    } else {
      // Employee / Staff
      const validation = validateUserRegistration({
        role: 'employee',
        name: signUpName,
        id: signUpId,
        email: signUpEmail,
        employeeCategory: signUpStaffTrade,
        designation: signUpStaffTitle,
        phone: signUpPhone || '+91 98222 ' + Math.floor(10000 + Math.random() * 90000),
      });

      if (!validation.valid) {
        setError(Object.values(validation.errors)[0]);
        return;
      }

      const tradeAvatars: Record<EmployeeCategory, string> = {
        electricity: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80',
        water: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        cleaning: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        ac_fan: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
        furniture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        wifi: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
        others: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      };

      newUser = {
        id: signUpId.trim().toUpperCase(),
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        role: 'employee',
        employeeCategory: signUpStaffTrade,
        phone: signUpPhone.trim() || '+91 98222 ' + Math.floor(10000 + Math.random() * 90000),
        avatar: tradeAvatars[signUpStaffTrade] || tradeAvatars.electricity,
        designation: signUpStaffTitle.trim() || `${signUpStaffTrade.toUpperCase()} Technician`,
      };
    }

    onRegisterUser(newUser);
    onLoginSuccess(newUser);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Graphic matching poster */}
        <div className="relative bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-950 p-6 pb-6 text-center overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            aria-label="Close dialog"
          >
            ✕
          </button>

          {/* Logo badge */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-amber-400 shadow-lg shadow-indigo-900/50 mb-2">
            <span className="text-2xl font-black text-white">H</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Hostel<span className="text-amber-400">Care</span>
          </h2>
          <p className="text-xs text-indigo-200/90 font-medium mt-0.5">
            {mode === 'login'
              ? 'Welcome Back! Login to continue'
              : `Create ${selectedRole === 'student' ? 'Student' : selectedRole === 'warden' ? 'Warden' : 'Staff'} Account`}
          </p>

          {/* ROLE SELECTOR TABS (Available in BOTH Login and Sign Up!) */}
          <div className="mt-4 grid grid-cols-3 gap-1.5 p-1 bg-slate-950/60 backdrop-blur-sm rounded-xl border border-slate-700/50">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student');
                setError(null);
                if (mode === 'signup' && !signUpId) setSignUpId('STU-2026-');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                selectedRole === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('warden');
                setError(null);
                if (mode === 'signup' && !signUpId) setSignUpId('WARDEN-');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                selectedRole === 'warden'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Warden</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('employee');
                setError(null);
                if (mode === 'signup' && !signUpId) setSignUpId('EMP-');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                selectedRole === 'employee'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Staff</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 pt-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* ======================= LOGIN VIEW ======================= */}
          {mode === 'login' ? (
            <div>
              {/* If employee role in login mode, show domain trade selector */}
              {selectedRole === 'employee' && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Select Employee Department / Trade
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {tradesList.map((trade) => {
                      const Icon = trade.icon;
                      const isSelected = selectedEmpCategory === trade.id;
                      return (
                        <button
                          key={trade.id}
                          type="button"
                          onClick={() => setSelectedEmpCategory(trade.id)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition ${
                            isSelected
                              ? 'bg-slate-800 border-indigo-500 text-white shadow-sm'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-1 ${trade.color}`} />
                          <span className="text-[11px] font-semibold">{trade.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    {selectedRole === 'student'
                      ? 'Student ID'
                      : selectedRole === 'warden'
                      ? 'Warden ID'
                      : 'Employee ID'}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        selectedRole === 'student'
                          ? 'e.g. STU-1024'
                          : selectedRole === 'warden'
                          ? 'e.g. WARDEN-01'
                          : 'e.g. EMP-' + selectedEmpCategory.toUpperCase().slice(0, 4)
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-600/30 transition transform active:scale-[0.98]"
                >
                  Login as {selectedRole === 'student' ? 'Student' : selectedRole === 'warden' ? 'Warden' : 'Staff'}
                </button>
              </form>

              {/* Fast 1-Click Demo Login Shortcuts */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Fast 1-Click Demo Login
                  </span>
                  <span className="text-[10px] text-amber-400 font-medium">Instant Access</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const stu = allUsers.find((u) => u.role === 'student');
                      if (stu) {
                        onLoginSuccess(stu);
                        onClose();
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                        🎓
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white">Student</div>
                        <div className="text-[10px] text-slate-400">Aarav (B-304)</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const warden = allUsers.find((u) => u.role === 'warden');
                      if (warden) {
                        onLoginSuccess(warden);
                        onClose();
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                        🛡️
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white">Warden</div>
                        <div className="text-[10px] text-slate-400">Dr. Deshmukh</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const elec = allUsers.find((u) => u.employeeCategory === 'electricity');
                      if (elec) {
                        onLoginSuccess(elec);
                        onClose();
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold text-xs">
                        ⚡
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white">Electrician</div>
                        <div className="text-[10px] text-slate-400">Ramesh Verma</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const plumb = allUsers.find((u) => u.employeeCategory === 'water');
                      if (plumb) {
                        onLoginSuccess(plumb);
                        onClose();
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                        💧
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white">Plumber</div>
                        <div className="text-[10px] text-slate-400">Suresh Nair</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Toggle to Sign Up */}
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError(null);
                    }}
                    className="font-bold text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Sign Up for {selectedRole === 'student' ? 'Student' : selectedRole === 'warden' ? 'Warden' : 'Staff'}
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* ======================= SIGN UP VIEW (STUDENT / WARDEN / STAFF) ======================= */
            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              {/* Role Indicator Banner */}
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400">Registering as:</span>
                <span className="font-bold text-white px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 capitalize">
                  {selectedRole === 'employee' ? 'Maintenance Staff' : selectedRole}
                </span>
              </div>

              {/* 1. Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'e.g. Maya Iyer'
                        : selectedRole === 'warden'
                        ? 'e.g. Dr. Meenakshi Sundaram'
                        : 'e.g. Karthik Raman'
                    }
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* 2. ID and Role-Specific identifier */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    {selectedRole === 'student'
                      ? 'Student ID'
                      : selectedRole === 'warden'
                      ? 'Warden Code'
                      : 'Employee ID'} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpId}
                    onChange={(e) => setSignUpId(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'e.g. STU-2099'
                        : selectedRole === 'warden'
                        ? 'e.g. WARDEN-02'
                        : 'e.g. EMP-ELEC-02'
                    }
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* If Student: Room Number */}
                {selectedRole === 'student' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Room Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Home className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signUpRoom}
                        onChange={(e) => setSignUpRoom(e.target.value)}
                        placeholder="e.g. B-402"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* If Warden: Designation */}
                {selectedRole === 'warden' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Designation <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signUpDesignation}
                        onChange={(e) => setSignUpDesignation(e.target.value)}
                        placeholder="e.g. Deputy Warden"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* If Staff: Title */}
                {selectedRole === 'employee' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Job Title / Skill <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signUpStaffTitle}
                        onChange={(e) => setSignUpStaffTitle(e.target.value)}
                        placeholder="e.g. Senior Tech"
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* If Staff: Maintenance Department / Trade Selector */}
              {selectedRole === 'employee' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Your Maintenance Trade / Department <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {tradesList.map((trade) => {
                      const Icon = trade.icon;
                      const isSelected = signUpStaffTrade === trade.id;
                      return (
                        <button
                          key={trade.id}
                          type="button"
                          onClick={() => {
                            setSignUpStaffTrade(trade.id);
                            setSignUpStaffTitle(trade.defaultTitle);
                          }}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition ${
                            isSelected
                              ? 'bg-emerald-600/30 border-emerald-500 text-white shadow-sm'
                              : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-1 ${trade.color}`} />
                          <span className="text-[11px] font-semibold">{trade.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* If Student or Warden: Hostel Block / Jurisdiction */}
              {(selectedRole === 'student' || selectedRole === 'warden') && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    {selectedRole === 'student' ? 'Hostel Block' : 'Warden Jurisdiction Block'}
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={signUpBlock}
                      onChange={(e) => setSignUpBlock(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {selectedRole === 'warden' && (
                        <option value="All Blocks (A, B, C)">All Blocks (A, B, C) - Central</option>
                      )}
                      <option value="Block A (Sahyadri)">Block A (Sahyadri Hostel)</option>
                      <option value="Block B (Nilgiri)">Block B (Nilgiri Hostel)</option>
                      <option value="Block C (Aravali)">Block C (Aravali Hostel)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Contact Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Official Email <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder={
                        selectedRole === 'student'
                          ? 'name@hostel.edu'
                          : selectedRole === 'warden'
                          ? 'warden.name@hostel.edu'
                          : 'staff.name@maintenance.edu'
                      }
                      className="w-full pl-10 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Contact Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full pl-10 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full mt-3 py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg transition transform active:scale-[0.98] ${
                  selectedRole === 'warden'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-600/30'
                    : selectedRole === 'employee'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-emerald-600/30'
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-indigo-600/30'
                }`}
              >
                Create{' '}
                {selectedRole === 'student'
                  ? 'Student'
                  : selectedRole === 'warden'
                  ? 'Warden'
                  : 'Staff'}{' '}
                Account
              </button>

              {/* Back to Login link */}
              <div className="mt-3 text-center">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                    }}
                    className="font-bold text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

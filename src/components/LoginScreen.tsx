import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Lock,
  Send,
  UserCheck,
  Shield,
  GraduationCap,
  School,
  KeyRound,
  Sparkles,
  Smartphone,
  CheckCircle2,
  X,
  AlertCircle,
  Key,
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole, email: string) => void;
  onRequestParentAccount?: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('admin@theeducators.edu');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('super_admin');

  // Phase 1 Cybersecurity Authentication Modals
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [pendingLogin, setPendingLogin] = useState<{ role: UserRole; email: string } | null>(null);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStage, setForgotStage] = useState<'request' | 'otp' | 'success'>('request');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showParentRegModal, setShowParentRegModal] = useState(false);
  const [parentRegForm, setParentRegForm] = useState({
    studentCode: '',
    parentPhone: '+92 ',
    parentCnic: '',
    password: '',
  });
  const [parentRegSuccess, setParentRegSuccess] = useState(false);

  const handleRoleQuickFill = (role: UserRole) => {
    setSelectedRole(role);
    switch (role) {
      case 'super_admin':
        setEmail('admin@theeducators.edu');
        break;
      case 'campus_admin':
        setEmail('demoadmin@theeducators.edu');
        break;
      case 'teacher':
        setEmail('teacher@theeducators.edu');
        break;
      case 'accountant':
        setEmail('accountant@theeducators.edu');
        break;
      case 'parent':
        setEmail('parent@theeducators.edu');
        break;
      case 'student':
        setEmail('hamza@student.theeducators.edu');
        break;
    }
  };

  const attemptLogin = (role: UserRole, loginEmail: string) => {
    // If super_admin or campus_admin, trigger cybersecurity 2FA OTP requirement
    if (role === 'super_admin' || role === 'campus_admin') {
      setPendingLogin({ role, email: loginEmail });
      setTwoFactorCode('');
      setShow2FAModal(true);
    } else {
      onLogin(role, loginEmail);
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length === 6 || twoFactorCode === '739201') {
      setShow2FAModal(false);
      if (pendingLogin) {
        onLogin(pendingLogin.role, pendingLogin.email);
      }
    } else {
      alert('Invalid Two-Factor Authentication code. Try demo code: 739201');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    attemptLogin(selectedRole, email);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStage === 'request') {
      if (!forgotEmail) return;
      setForgotStage('otp');
    } else if (forgotStage === 'otp') {
      if (resetOtp.length < 4) {
        alert('Please enter 4-digit verification code sent to your mobile.');
        return;
      }
      setForgotStage('success');
    }
  };

  const handleParentRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentRegForm.studentCode || !parentRegForm.parentPhone) {
      alert('Please provide student code and registered mobile number.');
      return;
    }
    setParentRegSuccess(true);
    setTimeout(() => {
      setParentRegSuccess(false);
      setShowParentRegModal(false);
      onLogin('parent', 'parent@theeducators.edu');
    }, 1800);
  };

  return (
    <div
      id="login-screen"
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#1da1f2] via-[#2ba5f5] to-[#47b2f8] flex flex-col justify-between select-none"
    >
      {/* Top Demo Bar */}
      <header className="w-full bg-slate-900/80 backdrop-blur-md text-slate-100 text-xs py-2 px-4 flex flex-wrap items-center justify-between z-30 border-b border-slate-700/50 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold tracking-wide text-emerald-300">DEMO ENVIRONMENT ACTIVE</span>
          <span className="text-slate-400 hidden sm:inline">• Exact High-Fidelity Replication of The Educators Portal</span>
        </div>

        {/* Quick Role Switcher Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-300 font-medium mr-1 hidden md:inline">Quick Demo Login:</span>
          {(
            [
              { role: 'super_admin', label: 'Super Admin', icon: Shield, bg: 'bg-red-600 hover:bg-red-500' },
              { role: 'teacher', label: 'Teacher', icon: GraduationCap, bg: 'bg-indigo-600 hover:bg-indigo-500' },
              { role: 'accountant', label: 'Accountant', icon: KeyRound, bg: 'bg-amber-600 hover:bg-amber-500' },
              { role: 'parent', label: 'Parent', icon: UserCheck, bg: 'bg-emerald-600 hover:bg-emerald-500' },
              { role: 'student', label: 'Student', icon: School, bg: 'bg-sky-600 hover:bg-sky-500' },
            ] as const
          ).map((item) => (
            <button
              key={item.role}
              type="button"
              id={`quick-login-${item.role}`}
              onClick={() => {
                handleRoleQuickFill(item.role);
                onLogin(item.role, email);
              }}
              className={`px-2.5 py-1 text-xs font-medium text-white rounded shadow transition-transform active:scale-95 flex items-center gap-1 ${item.bg} ${
                selectedRole === item.role ? 'ring-2 ring-white font-bold' : 'opacity-90'
              }`}
            >
              <item.icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Stage with Center Card & Scenery Illustrations */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-8 z-20">
        
        {/* Left Side: School Campus Illustration (Stylized Vector Recreation) */}
        <div className="hidden lg:flex flex-col items-center absolute left-6 bottom-4 w-72 pointer-events-none select-none opacity-95">
          {/* Clouds */}
          <div className="absolute -top-20 left-4 bg-white/70 rounded-full w-24 h-8 blur-[1px]" />
          <div className="absolute -top-14 right-2 bg-white/60 rounded-full w-32 h-10 blur-[1px]" />

          {/* School Building */}
          <div className="relative flex flex-col items-center">
            {/* Red Flag on flagpole */}
            <div className="w-0.5 h-7 bg-amber-900 relative">
              <div className="absolute top-0 right-0 w-4 h-3 bg-red-600 clip-flag" />
            </div>
            {/* Clock Tower Roof */}
            <div className="w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[28px] border-b-amber-700" />
            {/* Clock Tower Body */}
            <div className="w-20 h-16 bg-[#e4be7e] border-x border-[#c99e5e] flex items-center justify-center shadow-inner">
              {/* Clock Face */}
              <div className="w-8 h-8 rounded-full bg-white border border-slate-400 flex items-center justify-center relative shadow">
                <div className="w-0.5 h-2.5 bg-slate-800 absolute top-1.5" />
                <div className="w-2 h-0.5 bg-slate-800 absolute right-1.5" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-900" />
              </div>
            </div>
            {/* Building Main Structure */}
            <div className="w-56 h-28 bg-[#e8c88c] border border-[#be9455] rounded-t-sm shadow-md grid grid-cols-4 gap-2 p-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-5 bg-neutral-800/80 rounded-t-sm border border-neutral-600" />
              ))}
            </div>
            {/* School Entrance Door */}
            <div className="absolute bottom-0 w-10 h-12 bg-red-700 rounded-t-md border-2 border-red-900 shadow" />
          </div>

          {/* Trees & Lawn Base */}
          <div className="flex items-end justify-center -mt-6 gap-2 w-full">
            <div className="w-16 h-20 bg-emerald-700 rounded-full border-2 border-emerald-900 relative">
              <div className="absolute bottom-0 left-6 w-3 h-8 bg-amber-900 -mb-4" />
            </div>
            <div className="w-20 h-24 bg-emerald-600 rounded-full border-2 border-emerald-800 relative z-10">
              <div className="absolute bottom-0 left-8 w-4 h-9 bg-amber-900 -mb-4" />
            </div>
            <div className="w-14 h-18 bg-emerald-700 rounded-full border-2 border-emerald-900 relative">
              <div className="absolute bottom-0 left-5 w-3 h-7 bg-amber-900 -mb-3" />
            </div>
          </div>
        </div>

        {/* Right Side: School Bus Illustration (Exact Match from Image 1) */}
        <div className="hidden lg:flex flex-col items-center absolute right-6 bottom-4 w-84 pointer-events-none select-none">
          <div className="relative w-72 h-64 bg-amber-400 rounded-3xl border-4 border-amber-600 shadow-2xl overflow-hidden flex flex-col items-center pt-2">
            {/* Top Sign: SCHOOL BUS */}
            <div className="bg-neutral-900 text-amber-300 font-extrabold text-sm tracking-wider px-6 py-1 rounded-md shadow-inner border border-neutral-700">
              SCHOOL BUS
            </div>

            {/* Bus Lights */}
            <div className="flex justify-between w-full px-6 mt-2">
              <div className="w-4 h-4 rounded-full bg-red-600 border border-neutral-800 animate-pulse" />
              <div className="w-4 h-4 rounded-full bg-red-600 border border-neutral-800 animate-pulse" />
            </div>

            {/* Front Windshield with Friendly Driver & Kids */}
            <div className="w-[88%] h-28 bg-sky-200 border-2 border-neutral-800 rounded-xl mt-2 flex items-center justify-around px-2 shadow-inner overflow-hidden relative">
              {/* Kids in Window */}
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-amber-200 border border-amber-500 relative flex items-center justify-center text-[10px] font-bold text-amber-900">
                  😊
                </div>
                <div className="w-8 h-8 rounded-full bg-rose-200 border border-rose-500 relative flex items-center justify-center text-[10px] font-bold text-rose-900">
                  👧
                </div>
              </div>

              {/* Driver with Captain Hat */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-3 bg-sky-800 rounded-t-md -mb-1" />
                <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-400 flex items-center justify-center text-xs">
                  👨‍✈️
                </div>
              </div>
            </div>

            {/* Bus Grill & Headlights */}
            <div className="w-full flex items-center justify-between px-4 mt-3">
              <div className="w-7 h-7 rounded-full bg-white border-2 border-neutral-800 shadow" />
              <div className="flex-1 mx-3 h-6 bg-neutral-900 rounded flex items-center justify-around px-2">
                <div className="w-1 h-4 bg-slate-300 rounded-full" />
                <div className="w-1 h-4 bg-slate-300 rounded-full" />
                <div className="w-1 h-4 bg-slate-300 rounded-full" />
                <div className="w-1 h-4 bg-slate-300 rounded-full" />
                <div className="w-1 h-4 bg-slate-300 rounded-full" />
              </div>
              <div className="w-7 h-7 rounded-full bg-white border-2 border-neutral-800 shadow" />
            </div>

            {/* Bumper */}
            <div className="w-full h-7 bg-neutral-800 border-t-2 border-neutral-600 mt-2" />
          </div>

          {/* Bus Tires */}
          <div className="flex justify-between w-60 -mt-3">
            <div className="w-12 h-8 bg-neutral-950 rounded-b-xl border border-neutral-800" />
            <div className="w-12 h-8 bg-neutral-950 rounded-b-xl border border-neutral-800" />
          </div>
        </div>

        {/* Center: The Exact Authentic Login Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          id="login-card"
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-7 border border-slate-200/90 z-20"
        >
          {/* Logo Crest & Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-emerald-600 mb-2">
              <div className="w-full h-full bg-gradient-to-b from-emerald-600 to-teal-800 rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="w-5 h-5 rounded-full bg-amber-300 mb-0.5 shadow-sm" />
                <div className="text-[7px] font-black uppercase tracking-tighter text-emerald-100">THE EDUCATORS</div>
              </div>
            </div>

            <div className="text-emerald-800 font-bold text-sm tracking-wide uppercase">
              THE EDUCATORS
            </div>
            <div className="text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5">
              A Project of Beaconhouse
            </div>
            <h2 id="school-title" className="text-xl font-extrabold text-[#112d4e] mt-1 tracking-tight">
              DEMO SCHOOL
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Sign in to start your session
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            {/* Student Code / Email Field */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  id="student-code-input"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Student Code/Email"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  id="password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotStage('request');
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] text-[#337ab7] hover:text-[#23527c] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Sign In Button (Blue) */}
            <button
              type="submit"
              id="sign-in-btn"
              className="w-full py-2.5 px-4 bg-[#337ab7] hover:bg-[#286090] active:bg-[#204d74] text-white text-sm font-semibold rounded-md shadow flex items-center justify-center gap-2 transition duration-150 cursor-pointer"
            >
              <span>Sign In</span>
              <Send className="w-3.5 h-3.5 fill-current rotate-45" />
            </button>

            {/* Request Parent Account Button (Green) */}
            <button
              type="button"
              id="request-parent-btn"
              onClick={() => setShowParentRegModal(true)}
              className="w-full py-2 px-4 bg-[#28a745] hover:bg-[#218838] active:bg-[#1e7e34] text-white text-xs font-semibold rounded-md shadow flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Request Parent Account</span>
            </button>
          </form>

          {/* Mobile App Download Badges */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
            <button
              type="button"
              id="google-play-badge"
              onClick={() => alert('The Educators Android Parent/Student App will be downloaded.')}
              className="bg-black hover:bg-neutral-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-left shadow-sm border border-neutral-700 transition active:scale-95"
            >
              <div className="w-5 h-5 flex items-center justify-center text-emerald-400 font-bold text-base">▶</div>
              <div>
                <div className="text-[8px] uppercase tracking-wider text-neutral-400 leading-tight">ANDROID APP ON</div>
                <div className="text-xs font-semibold leading-tight">Google play</div>
              </div>
            </button>

            <button
              type="button"
              id="app-store-badge"
              onClick={() => alert('The Educators iOS Parent/Student App will be downloaded.')}
              className="bg-black hover:bg-neutral-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-left shadow-sm border border-neutral-700 transition active:scale-95"
            >
              <div className="w-5 h-5 flex items-center justify-center text-white text-base"></div>
              <div>
                <div className="text-[8px] uppercase tracking-wider text-neutral-400 leading-tight">Download on the</div>
                <div className="text-xs font-semibold leading-tight">App Store</div>
              </div>
            </button>
          </div>

          {/* Copyright Note */}
          <div className="text-center mt-5 text-[11px] text-slate-500 font-medium">
            Copyright © <span className="text-sky-700 hover:underline cursor-pointer">www.ourschoolsoftware.com</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Ground Green Grass Layer */}
      <div className="w-full h-12 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 border-t-4 border-emerald-800 flex items-center justify-center z-10 relative">
        <div className="text-emerald-100 text-xs font-medium tracking-wide">
          Institutional Management Platform • Secure Multi-Tier RBAC &amp; ISO-Compliant Standards
        </div>
      </div>

      {/* 2FA VERIFICATION MODAL */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#002147] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Two-Factor Authentication (2FA)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShow2FAModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerify2FA} className="p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-800 p-2.5 rounded border border-blue-200">
                <Smartphone className="w-5 h-5 shrink-0 text-blue-600" />
                <div>
                  <div className="font-bold">Security Token Required</div>
                  <div className="text-[11px] text-blue-700">
                    A 6-digit OTP code was sent to registered device (+92 300 ***4567).
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Enter 6-Digit Security Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 739201"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-center text-lg tracking-widest font-mono font-bold border rounded outline-none focus:ring-2 focus:ring-[#002147]"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Demo Code: <strong className="font-mono text-slate-800">739201</strong></span>
                <button
                  type="button"
                  onClick={() => setTwoFactorCode('739201')}
                  className="text-sky-600 hover:underline font-semibold"
                >
                  Auto-Fill
                </button>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShow2FAModal(false)}
                  className="flex-1 py-2 border rounded text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#002147] hover:bg-[#003366] text-white font-bold rounded shadow transition"
                >
                  Verify &amp; Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#002147] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Account Password Recovery</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleForgotSubmit} className="p-4 space-y-3 text-xs">
              {forgotStage === 'request' && (
                <>
                  <p className="text-slate-600">
                    Enter your registered email address or student code to receive an account reset OTP token.
                  </p>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Registered Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@theeducators.edu"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#337ab7] hover:bg-[#286090] text-white font-bold rounded shadow transition"
                  >
                    Send OTP Recovery Code
                  </button>
                </>
              )}

              {forgotStage === 'otp' && (
                <>
                  <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded border border-emerald-200">
                    4-digit recovery PIN was dispatched to {forgotEmail}.
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Enter 4-Digit Recovery PIN</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      placeholder="4819"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      className="w-full px-3 py-2 text-center text-base tracking-widest font-mono font-bold border rounded outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">New Account Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow transition"
                  >
                    Reset &amp; Update Password
                  </button>
                </>
              )}

              {forgotStage === 'success' && (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <div className="font-bold text-slate-800 text-sm">Password Successfully Reset!</div>
                  <p className="text-slate-500 text-xs">
                    Your credentials have been securely updated in the campus database.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-2 bg-[#002147] text-white font-bold rounded"
                  >
                    Return To Sign In
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* PARENT ACCOUNT REGISTRATION MODAL */}
      {showParentRegModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#28a745] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                <h3 className="font-bold text-sm">Parent Portal Self-Registration</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowParentRegModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleParentRegSubmit} className="p-4 space-y-3 text-xs">
              {parentRegSuccess ? (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                  <div className="font-bold text-slate-900 text-base">Parent Account Activated!</div>
                  <p className="text-slate-500 text-xs">
                    Linking with student records and redirecting directly into Parent Portal...
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-slate-600">
                    Parents can register their account by providing the student's admission code and the father's registered mobile number.
                  </p>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Student Admission ID / Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EDU-2024-001 or EDU-2024-002"
                      value={parentRegForm.studentCode}
                      onChange={(e) => setParentRegForm({ ...parentRegForm, studentCode: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded outline-none font-mono font-semibold"
                    />
                    <span className="text-[10px] text-slate-400">Printed on student fee voucher or ID badge</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Father's Registered Mobile *</label>
                      <input
                        type="text"
                        required
                        placeholder="+92 300 1234567"
                        value={parentRegForm.parentPhone}
                        onChange={(e) => setParentRegForm({ ...parentRegForm, parentPhone: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Father's CNIC (Optional)</label>
                      <input
                        type="text"
                        placeholder="35202-1234567-1"
                        value={parentRegForm.parentCnic}
                        onChange={(e) => setParentRegForm({ ...parentRegForm, parentCnic: e.target.value })}
                        className="w-full px-3 py-1.5 border rounded outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Choose Portal Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={parentRegForm.password}
                      onChange={(e) => setParentRegForm({ ...parentRegForm, password: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t">
                    <button
                      type="button"
                      onClick={() => setShowParentRegModal(false)}
                      className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#28a745] hover:bg-[#218838] text-white font-bold rounded shadow transition"
                    >
                      Verify &amp; Create Account
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Lock,
  Send,
  UserCheck,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
  Key,
  School,
  ArrowLeft,
  HelpCircle,
  Loader2,
  LockKeyhole
} from 'lucide-react';
import { UserRole } from '../types';
import { authService, DEFAULT_SEED_PASSWORD } from '../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole, email: string) => void;
  onReturnToPublicSite?: () => void;
}

export default function LoginScreen({ onLoginSuccess, onReturnToPublicSite }: LoginScreenProps) {
  // Input credentials state (empty by default)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Authentication submission states
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accountStatusMessage, setAccountStatusMessage] = useState<string | null>(null);

  // Directory Guide Modal (For security testing reference)
  const [showDirectoryGuide, setShowDirectoryGuide] = useState(false);

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStage, setForgotStage] = useState<'request' | 'otp' | 'success'>('request');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Parent Self-Registration Modal state
  const [showParentRegModal, setShowParentRegModal] = useState(false);
  const [parentRegForm, setParentRegForm] = useState({
    studentCode: '',
    parentPhone: '+92 300 1234567',
    parentName: '',
    email: '',
    password: '',
  });
  const [parentRegMsg, setParentRegMsg] = useState<string | null>(null);
  const [parentRegSuccess, setParentRegSuccess] = useState(false);

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setAccountStatusMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage('Please enter both your email/username and password.');
      return;
    }

    setIsAuthenticating(true);

    try {
      // Authenticate with authService
      const result = await authService.authenticate(identifier, password, rememberMe);

      if (result.success && result.role && result.user) {
        onLoginSuccess(result.role, result.user.email);
      } else {
        setErrorMessage(result.message || 'Authentication failed. Please check your credentials.');
        if (result.accountStatus && result.accountStatus !== 'Active') {
          setAccountStatusMessage(`Account Status: ${result.accountStatus.toUpperCase()}`);
        }
      }
    } catch {
      setErrorMessage('An unexpected error occurred during authentication. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Forgot Password Form Handler
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);

    if (forgotStage === 'request') {
      if (!forgotEmail) {
        setForgotMsg('Please enter your registered email address.');
        return;
      }
      setForgotLoading(true);
      const res = authService.requestPasswordReset(forgotEmail);
      setForgotLoading(false);
      setForgotMsg(res.message);
      if (res.otp) {
        setForgotOtp(res.otp);
      }
      setForgotStage('otp');
    } else if (forgotStage === 'otp') {
      if (!forgotOtp || forgotOtp.length < 4) {
        setForgotMsg('Please enter a valid OTP code.');
        return;
      }
      if (!newPassword || newPassword.length < 6) {
        setForgotMsg('New password must be at least 6 characters long.');
        return;
      }
      setForgotLoading(true);
      const res = await authService.resetPasswordWithOtp(forgotEmail, forgotOtp, newPassword);
      setForgotLoading(false);
      if (res.success) {
        setForgotStage('success');
      } else {
        setForgotMsg(res.message);
      }
    }
  };

  // Parent Self-Registration Form Handler
  const handleParentRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setParentRegMsg(null);

    if (!parentRegForm.studentCode || !parentRegForm.parentPhone || !parentRegForm.password) {
      setParentRegMsg('Please provide student code, mobile number and password.');
      return;
    }

    const res = await authService.registerParentAccount(
      parentRegForm.studentCode,
      parentRegForm.parentPhone,
      parentRegForm.parentName,
      parentRegForm.email,
      parentRegForm.password
    );

    if (res.success) {
      setParentRegSuccess(true);
    } else {
      setParentRegMsg(res.message);
    }
  };

  return (
    <div
      id="login-screen"
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#002147] via-[#093563] to-[#124270] flex flex-col justify-between select-none"
    >
      {/* Top Header Bar */}
      <header className="w-full bg-slate-900/90 backdrop-blur-md text-slate-100 text-xs py-2.5 px-4 flex items-center justify-between z-30 border-b border-slate-700/60 shadow-sm">
        <div className="flex items-center gap-2">
          {onReturnToPublicSite && (
            <button
              type="button"
              onClick={onReturnToPublicSite}
              className="text-slate-300 hover:text-white flex items-center gap-1.5 font-semibold text-xs py-1 px-2.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
              <span>Return to Public Website</span>
            </button>
          )}
          <span className="text-slate-400 hidden md:inline">• Secure Institutional Gateway</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowDirectoryGuide(true)}
            className="text-amber-300 hover:text-amber-200 font-bold text-xs flex items-center gap-1.5 bg-amber-950/60 hover:bg-amber-900/80 px-2.5 py-1 rounded border border-amber-500/40 transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Credentials Directory Guide</span>
          </button>
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <LockKeyhole className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Stage with Center Login Card */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-8 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          id="login-card"
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-7 border border-slate-200/90 z-20"
        >
          {/* School Crest & Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-[#002147] mb-2">
              <div className="w-full h-full bg-gradient-to-b from-[#002147] to-[#00152e] rounded-lg flex flex-col items-center justify-center text-white relative overflow-hidden">
                <School className="w-8 h-8 text-amber-400" />
              </div>
            </div>

            <div className="text-[#002147] font-black text-sm tracking-wider uppercase">
              THE EDUCATORS
            </div>
            <div className="text-[10px] text-emerald-700 font-bold tracking-tight uppercase">
              A Project of Beaconhouse
            </div>
            <h2 id="school-title" className="text-xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Institutional Auth Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Enter your authorized credentials to access your dashboard
            </p>
          </div>

          {/* Authentication Failure or Status Banner */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold">{errorMessage}</div>
                {accountStatusMessage && (
                  <div className="font-mono text-[11px] text-red-700 font-semibold">{accountStatusMessage}</div>
                )}
              </div>
            </div>
          )}

          {/* Real Authentication Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Email / Username Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Email Address or Username</label>
              <div className="relative">
                <input
                  id="login-identifier-input"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@theeducators.edu or username"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002147] focus:border-[#002147] outline-none transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Password Input with Visibility Toggle */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(identifier);
                    setForgotStage('request');
                    setForgotMsg(null);
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] text-sky-700 hover:text-sky-900 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002147] focus:border-[#002147] outline-none transition"
                />
                <button
                  type="button"
                  id="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#002147] focus:ring-[#002147]"
                />
                <span>Remember Me on this device</span>
              </label>
            </div>

            {/* Sign In Submit Button */}
            <button
              type="submit"
              id="sign-in-submit-btn"
              disabled={isAuthenticating}
              className="w-full py-2.5 px-4 bg-[#002147] hover:bg-[#003366] active:bg-[#00152e] text-white text-sm font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition duration-150 cursor-pointer disabled:opacity-75"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Authenticating Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Portal</span>
                  <Send className="w-3.5 h-3.5 fill-current rotate-45" />
                </>
              )}
            </button>

            {/* Request Parent Registration Button */}
            <button
              type="button"
              id="request-parent-btn"
              onClick={() => {
                setParentRegMsg(null);
                setParentRegSuccess(false);
                setShowParentRegModal(true);
              }}
              className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>New Parent Self-Registration</span>
            </button>
          </form>

          {/* Copyright Note */}
          <div className="text-center mt-6 text-[11px] text-slate-500 font-medium pt-3 border-t border-slate-100">
            Institutional Management System • ISO 27001 Security Standard
          </div>
        </motion.div>
      </div>

      {/* Footer Banner */}
      <div className="w-full h-10 bg-slate-900 border-t border-slate-800 flex items-center justify-center z-10 relative px-4">
        <div className="text-slate-400 text-[11px] font-medium tracking-wide text-center">
          The Educators Central Information Network • Strict Multi-Tier RBAC &amp; Session Isolation Enforced
        </div>
      </div>

      {/* CREDENTIALS DIRECTORY GUIDE MODAL (FOR VERIFICATION TESTING) */}
      {showDirectoryGuide && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#002147] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Institutional User Directory Guide</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDirectoryGuide(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg leading-relaxed">
                <span className="font-bold">Real Security System Active:</span> Quick-login and demo bypass buttons have been removed. Use the official credentials listed below to authenticate into each role manually.
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Default Seed Password for All Accounts:
                </div>
                <div className="bg-slate-100 p-2 rounded text-center font-mono font-black text-sm text-slate-900 border border-slate-300">
                  {DEFAULT_SEED_PASSWORD}
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {[
                  { role: 'Super Admin', email: 'admin@theeducators.edu', username: 'super.admin', target: 'Super Admin Dashboard' },
                  { role: 'Campus Principal', email: 'principal@theeducators.edu', username: 'principal.mt', target: 'Super Admin / Principal Center' },
                  { role: 'Teacher', email: 'teacher@theeducators.edu', username: 'prof.tariq', target: 'Teacher Dashboard' },
                  { role: 'Accountant', email: 'accountant@theeducators.edu', username: 'bursar.rashid', target: 'Accountant Dashboard' },
                  { role: 'Parent', email: 'parent@theeducators.edu', username: 'parent.ghulam', target: 'Parent Portal' },
                  { role: 'Student', email: 'hamza@student.theeducators.edu', username: 'student.hamza', target: 'Student Portal' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900">{item.role}</div>
                      <div className="text-[11px] font-mono text-slate-600">{item.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifier(item.email);
                        setPassword(DEFAULT_SEED_PASSWORD);
                        setShowDirectoryGuide(false);
                      }}
                      className="px-2.5 py-1 bg-[#002147] hover:bg-[#003366] text-white font-bold text-[10px] rounded transition"
                    >
                      Fill Form
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDirectoryGuide(false)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded text-xs"
                >
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD RECOVERY MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
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
              {forgotMsg && (
                <div className="p-2.5 bg-sky-50 border border-sky-200 rounded text-sky-900 font-medium">
                  {forgotMsg}
                </div>
              )}

              {forgotStage === 'request' && (
                <>
                  <p className="text-slate-600">
                    Enter your registered email address or username to receive an account recovery OTP code.
                  </p>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Registered Email Address</label>
                    <input
                      type="text"
                      required
                      placeholder="admin@theeducators.edu"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#002147]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-2 bg-[#002147] hover:bg-[#003366] text-white font-bold rounded-md shadow transition"
                  >
                    {forgotLoading ? 'Processing...' : 'Send OTP Recovery Code'}
                  </button>
                </>
              )}

              {forgotStage === 'otp' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Enter 6-Digit Recovery OTP</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      className="w-full px-3 py-2 text-center text-lg tracking-widest font-mono font-bold border rounded-md outline-none"
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
                      className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#002147]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md shadow transition"
                  >
                    {forgotLoading ? 'Resetting Password...' : 'Reset & Update Password'}
                  </button>
                </>
              )}

              {forgotStage === 'success' && (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <div className="font-bold text-slate-800 text-sm">Password Successfully Reset!</div>
                  <p className="text-slate-500 text-xs">
                    Your credentials have been securely updated. You can now sign in with your new password.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-2 bg-[#002147] text-white font-bold rounded-md"
                  >
                    Return To Sign In
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* PARENT SELF-REGISTRATION MODAL */}
      {showParentRegModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
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
              {parentRegMsg && (
                <div className="p-2 bg-red-50 text-red-800 border border-red-200 rounded font-medium">
                  {parentRegMsg}
                </div>
              )}

              {parentRegSuccess ? (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <div className="font-bold text-slate-900 text-base">Parent Account Created!</div>
                  <p className="text-slate-500 text-xs">
                    Account created successfully. You can now log in with your credentials.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowParentRegModal(false)}
                    className="mt-2 px-4 py-2 bg-[#002147] text-white font-bold rounded-lg text-xs"
                  >
                    Proceed To Login
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-slate-600">
                    Register your parent account by providing the student's admission code and guardian details.
                  </p>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Student Admission Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EDU-2024-001"
                      value={parentRegForm.studentCode}
                      onChange={(e) => setParentRegForm({ ...parentRegForm, studentCode: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded outline-none font-mono font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Parent Full Name</label>
                    <input
                      type="text"
                      placeholder="Muhammad Aslam"
                      value={parentRegForm.parentName}
                      onChange={(e) => setParentRegForm({ ...parentRegForm, parentName: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Registered Mobile Number *</label>
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
                    <label className="block font-semibold text-slate-700 mb-1">Account Password *</label>
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
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow transition"
                    >
                      Create Account
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

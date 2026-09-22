import { useState } from 'react';
import { Search, Globe, Home, Plus, Heart, Mail, FileText, Bell, LogOut, ChevronDown, User, ShieldCheck, Menu } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface TopHeaderProps {
  currentUser: UserProfile;
  selectedCampus: string;
  onCampusChange: (campus: string) => void;
  onSearchStudent: (query: string) => void;
  onRoleSwitch: (role: UserRole) => void;
  onLogout: () => void;
  onQuickAction: (action: string) => void;
  unreadComplaintsCount: number;
  unreadMessagesCount: number;
  onToggleMobileSidebar?: () => void;
}

export default function TopHeader({
  currentUser,
  selectedCampus,
  onCampusChange,
  onSearchStudent,
  onRoleSwitch,
  onLogout,
  onQuickAction,
  unreadComplaintsCount,
  unreadMessagesCount,
  onToggleMobileSidebar,
}: TopHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState('English');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showCampusMenu, setShowCampusMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchStudent(searchQuery);
  };

  const campuses = ['Main Campus', 'City Campus', 'Girls Wing Campus', 'North College Campus'];

  return (
    <header
      id="top-header"
      className="w-full bg-[#1b3b6f] text-[#f8fafc] border-b border-[#142c52] shadow-sm z-20 shrink-0"
    >
      <div className="flex flex-wrap items-center justify-between px-3 py-2 gap-2">
        {/* Left: Mobile Menu Hamburger & Student Search Box */}
        <div className="flex items-center gap-2.5">
          {onToggleMobileSidebar && (
            <button
              type="button"
              id="header-mobile-menu-btn"
              onClick={onToggleMobileSidebar}
              className="p-1.5 rounded-lg bg-[#102444] hover:bg-[#203a66] text-white transition lg:hidden border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-sky-400"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5 text-sky-400" />
            </button>
          )}

          <form onSubmit={handleSearchSubmit} className="flex items-center" id="student-search-form">
            <input
              type="text"
              id="header-student-search"
              placeholder="Search Student..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearchStudent(e.target.value);
              }}
              className="px-3 py-1.5 text-xs text-slate-900 bg-white placeholder-slate-400 rounded-l focus:outline-none w-44 sm:w-64 border border-r-0 border-slate-300"
            />
            <button
              type="submit"
              id="header-search-submit"
              className="bg-[#d9534f] hover:bg-[#c9302c] active:bg-[#ac2925] text-white px-3 py-1.5 text-xs rounded-r flex items-center justify-center transition"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              id="lang-selector-btn"
              onClick={() => setLang(lang === 'English' ? 'Urdu' : 'English')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-[#b83b5e] hover:bg-[#992e4b] text-white rounded transition shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang}</span>
            </button>
          </div>

          {/* Campus Selector */}
          <div className="relative">
            <button
              type="button"
              id="campus-selector-btn"
              onClick={() => setShowCampusMenu(!showCampusMenu)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-[#d92027] hover:bg-[#b0161c] text-white rounded transition shadow-sm"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{selectedCampus}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showCampusMenu && (
              <div className="absolute left-0 mt-1 w-48 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 py-1 z-50 text-xs">
                <div className="px-3 py-1 font-semibold text-slate-400 text-[10px] uppercase">Select Campus</div>
                {campuses.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      onCampusChange(c);
                      setShowCampusMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between ${
                      selectedCampus === c ? 'bg-red-50 text-red-700 font-semibold' : ''
                    }`}
                  >
                    <span>{c}</span>
                    {selectedCampus === c && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Badges & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Plus Action - Only for Admins */}
          {(currentUser.role === 'super_admin' || currentUser.role === 'campus_admin') && (
            <button
              type="button"
              id="badge-quick-admit"
              title="Quick Admit Student"
              onClick={() => onQuickAction('admit')}
              className="w-7 h-7 rounded bg-[#28a745] hover:bg-[#218838] flex items-center justify-center text-white shadow transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}

          {/* Complaints Badge */}
          <button
            type="button"
            id="badge-complaints"
            title="Parent Complaints"
            onClick={() => onQuickAction('complaints')}
            className="w-7 h-7 rounded bg-[#e83e8c] hover:bg-[#d63384] relative flex items-center justify-center text-white shadow transition"
          >
            <Heart className="w-3.5 h-3.5" />
            {unreadComplaintsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] font-bold px-1 rounded-full border border-white">
                {unreadComplaintsCount}
              </span>
            )}
          </button>

          {/* Messages / SMS Badge */}
          <button
            type="button"
            id="badge-messages"
            title="SMS & Messages"
            onClick={() => onQuickAction('sms')}
            className="w-7 h-7 rounded bg-[#fd7e14] hover:bg-[#dc6502] relative flex items-center justify-center text-white shadow transition"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="absolute -top-1 -right-1 bg-amber-500 text-[10px] font-bold px-1 rounded-full border border-white">
              {unreadMessagesCount}
            </span>
          </button>

          {/* Fee / Balance Badge */}
          <button
            type="button"
            id="badge-fee"
            title="Fee Vouchers"
            onClick={() => onQuickAction('fees')}
            className="w-7 h-7 rounded bg-[#dc3545] hover:bg-[#bd2130] relative flex items-center justify-center text-white shadow transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="absolute -top-1 -right-1 bg-slate-900 text-[10px] font-bold px-1 rounded-full border border-white">
              5
            </span>
          </button>

          {/* User Profile Pill */}
          <div className="relative">
            {currentUser.role === 'super_admin' ? (
              <button
                type="button"
                id="user-profile-menu-btn"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0f2444] hover:bg-[#0b1b33] border border-[#2b4c7e] text-xs transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold text-slate-100">{currentUser.name}</span>
                <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-sky-600 text-white font-mono">
                  {currentUser.role.replace('_', ' ')}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            ) : (
              <div
                id="user-profile-pill-static"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0f2444] border border-[#2b4c7e] text-xs"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-slate-100">{currentUser.name}</span>
                <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-emerald-600 text-white font-mono">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
            )}

            {/* Switch Role Dropdown (Super Admin ONLY) */}
            {showRoleMenu && currentUser.role === 'super_admin' && (
              <div className="absolute right-0 mt-1 w-56 bg-white text-slate-800 rounded-md shadow-2xl border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 font-semibold text-slate-400 text-[10px] uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Super Admin Perspective Preview</span>
                </div>
                {(
                  [
                    { role: 'super_admin', label: 'Super Admin (All Modules)' },
                    { role: 'campus_admin', label: 'Campus Principal / Admin' },
                    { role: 'teacher', label: 'Teacher Dashboard View' },
                    { role: 'accountant', label: 'Bursar / Accountant View' },
                    { role: 'parent', label: 'Parent Portal View' },
                    { role: 'student', label: 'Student Portal View' },
                  ] as const
                ).map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => {
                      onRoleSwitch(r.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-sky-50 flex items-center justify-between ${
                      currentUser.role === r.role ? 'bg-sky-100/70 text-sky-800 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>{r.label}</span>
                    {currentUser.role === r.role && (
                      <span className="w-2 h-2 rounded-full bg-sky-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Log Out */}
          <button
            type="button"
            id="header-logout-btn"
            onClick={onLogout}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-900/60 hover:bg-red-700 text-slate-200 hover:text-white rounded border border-slate-700/50 transition cursor-pointer"
          >
            <span>Log Out</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

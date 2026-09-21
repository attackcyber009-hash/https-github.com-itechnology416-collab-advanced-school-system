import { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  Check,
  Search,
  AlertCircle,
  Coins,
  DollarSign,
  UserPlus,
  Receipt,
  Sliders,
  Calculator,
  Fingerprint,
  Globe,
  Building2,
  MapPin,
  Mail,
  Phone,
  Clock,
  ArrowRight,
  Upload,
  X,
  FileText,
  CheckCircle2,
  Activity,
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { Student, CampusBranch, ClassInfo } from '../types';

// ==========================================
// 1. SCHOOL NOTICE BOARD VIEW
// ==========================================
interface SchoolNoticeBoardViewProps {
  initialNotices: any[];
  onAddNotice?: (notice: any) => void;
  onDeleteNotice?: (id: string) => void;
}

export function SchoolNoticeBoardView({
  initialNotices,
  onAddNotice,
  onDeleteNotice,
}: SchoolNoticeBoardViewProps) {
  const [notices, setNotices] = useState<any[]>(initialNotices);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Urgent Announcement',
    targetGroup: 'Parents',
    date: new Date().toISOString().split('T')[0],
    body: '',
    isPinned: false,
    publisher: 'Super Admin Office',
  });

  const filteredNotices = useMemo(() => {
    return notices.filter(
      (n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notices, searchQuery]);

  const handleAddNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.body) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    const noticeObj = {
      id: `notice-${Date.now()}`,
      ...newNotice,
    };
    setNotices((prev) => [noticeObj, ...prev]);
    if (onAddNotice) onAddNotice(noticeObj);
    setShowAddModal(false);
    setNewNotice({
      title: '',
      category: 'Urgent Announcement',
      targetGroup: 'Parents',
      date: new Date().toISOString().split('T')[0],
      body: '',
      isPinned: false,
      publisher: 'Super Admin Office',
    });
    alert('Circular and notice board entry published successfully!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this notice?')) {
      setNotices((prev) => prev.filter((n) => n.id !== id));
      if (onDeleteNotice) onDeleteNotice(id);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-2xs text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">School Notice Board &amp; Public Circulars</h3>
          <p className="text-[10px] text-slate-500">Publish news, schedule changes, holiday banners and dynamic announcements for Parents, Students and Staff.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold flex items-center gap-1 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Publish Notice</span>
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search circular title, content keywords or target group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`p-3.5 rounded-lg border transition ${
              notice.isPinned
                ? 'bg-amber-50/50 border-amber-200 shadow-3xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-1.5">
                <span
                  className={`px-2 py-0.5 rounded-[4px] text-[8.5px] font-black uppercase tracking-wider ${
                    notice.category === 'Urgent Announcement' || notice.category === 'Emergency'
                      ? 'bg-red-100 text-red-900 border border-red-200'
                      : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                  }`}
                >
                  {notice.category}
                </span>
                {notice.isPinned && (
                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[8.5px] font-black uppercase">
                    Pinned
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(notice.id)}
                className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-slate-50 transition"
                title="Remove Notice"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="font-bold text-slate-900 text-xs mt-2">{notice.title}</h4>
            <p className="text-slate-600 leading-relaxed mt-1">{notice.body}</p>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="font-medium">Audience: <strong className="text-slate-800">{notice.targetGroup}</strong></span>
              <span>{notice.date} • {notice.publisher}</span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border max-w-md w-full shadow-2xl p-4 overflow-hidden">
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h3 className="text-sm font-bold text-slate-800">Publish New Notice Board Entry</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddNoticeSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Examination Datesheet Out"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  >
                    <option value="Urgent Announcement">Urgent Announcement</option>
                    <option value="Academic Circular">Academic Circular</option>
                    <option value="General News">General News</option>
                    <option value="Sports & Co-curricular">Sports &amp; Co-curricular</option>
                    <option value="Fee Notification">Fee Notification</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={newNotice.targetGroup}
                    onChange={(e) => setNewNotice({ ...newNotice, targetGroup: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  >
                    <option value="All">All Registered (Parents/Staff)</option>
                    <option value="Parents">Parents Only</option>
                    <option value="Staff">Teaching &amp; Support Staff Only</option>
                    <option value="Students">Students Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Body Copy *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type the detailed circular message here..."
                  value={newNotice.body}
                  onChange={(e) => setNewNotice({ ...newNotice, body: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="pin-check"
                  checked={newNotice.isPinned}
                  onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="pin-check" className="font-bold text-slate-700 cursor-pointer">
                  Pin this notice at the top of portal dashboard
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. MANAGE CAMPUSES VIEW
// ==========================================
interface ManageCampusesViewProps {
  initialCampuses: CampusBranch[];
  onAddCampus?: (campus: CampusBranch) => void;
  onUpdateCampus?: (campus: CampusBranch) => void;
}

export function ManageCampusesView({
  initialCampuses,
  onAddCampus,
  onUpdateCampus,
}: ManageCampusesViewProps) {
  const [campuses, setCampuses] = useState<CampusBranch[]>(initialCampuses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCampus, setNewCampus] = useState({
    campusName: '',
    campusCode: '',
    principalName: '',
    contactNo: '',
    address: '',
    studentCount: 450,
    teacherCount: 24,
    feeRecoveryRate: 85,
    ptmSatisfactionIndex: 4.2,
    teacherAttendanceRate: 97.2,
    biseBoardPassRate: 100,
    studentRetentionRate: 98.4,
    studentAttendanceRate: 94.5,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampus.campusName || !newCampus.campusCode) {
      alert('Please enter Campus Name and Code.');
      return;
    }
    const campusObj: CampusBranch = {
      id: `campus-${Date.now()}`,
      ...newCampus,
    };
    setCampuses((prev) => [...prev, campusObj]);
    if (onAddCampus) onAddCampus(campusObj);
    setShowAddModal(false);
    setNewCampus({
      campusName: '',
      campusCode: '',
      principalName: '',
      contactNo: '',
      address: '',
      studentCount: 450,
      teacherCount: 24,
      feeRecoveryRate: 85,
      ptmSatisfactionIndex: 4.2,
      teacherAttendanceRate: 97.2,
      biseBoardPassRate: 100,
      studentRetentionRate: 98.4,
      studentAttendanceRate: 94.5,
    });
    alert(`Campus branch "${campusObj.campusName}" provisioned successfully!`);
  };

  const handleToggleActive = (code: string) => {
    alert(`Campus with branch code "${code}" operational parameters verified and locked.`);
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-2xs text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Centralized Campus &amp; Branch Directory</h3>
          <p className="text-[10px] text-slate-500">Configure new physical branches, assign principals, track regional performance targets and monitor board statistics.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold flex items-center gap-1 transition"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Provision New Branch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {campuses.map((branch, index) => (
          <div key={`${branch.campusCode}-${index}`} className="p-3 bg-slate-50 rounded-lg border hover:border-slate-300 transition">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{branch.campusName}</h4>
                <p className="text-[10px] text-[#002147] font-black mt-0.5">Code: {branch.campusCode}</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-black text-[9px] uppercase border border-emerald-300">
                Operational
              </span>
            </div>

            <div className="mt-3 space-y-1 text-[11px] text-slate-600 border-t pt-2.5">
              <div className="flex justify-between"><span className="text-slate-400">Principal:</span> <span className="font-bold text-slate-800">{branch.principalName || 'Mr. Ahmed Khan'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Total Enrollment:</span> <span className="font-bold text-slate-800">{branch.studentCount} Students</span></div>
              <div className="flex justify-between"><span className="text-slate-400">BISE Board Pass:</span> <span className="font-bold text-emerald-800">{branch.biseBoardPassRate}%</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Fee Recovery Rate:</span> <span className="font-bold text-blue-800">{branch.feeRecoveryRate}%</span></div>
              <div className="flex justify-between truncate"><span className="text-slate-400">Regional Phone:</span> <span className="font-bold text-slate-800">{branch.contactNo || '+92 42 35891100'}</span></div>
            </div>

            <div className="mt-3 pt-2 border-t flex gap-1.5">
              <button
                type="button"
                onClick={() => alert(`Opening details for regional office: ${branch.campusName}`)}
                className="flex-1 py-1 bg-white border hover:bg-slate-100 text-slate-700 font-bold rounded text-center"
              >
                Inspect Ledger
              </button>
              <button
                type="button"
                onClick={() => handleToggleActive(branch.campusCode || '')}
                className="flex-1 py-1 bg-[#002147] text-white hover:bg-black font-bold rounded text-center"
              >
                Lock Audit
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border max-w-md w-full shadow-2xl p-4 overflow-hidden">
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h3 className="text-sm font-bold text-slate-800">Provision New Institutional Branch</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campus Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DHA Phase 6 Campus"
                    value={newCampus.campusName}
                    onChange={(e) => setNewCampus({ ...newCampus, campusName: e.target.value })}
                    className="w-full px-2.5 py-1.5 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CAMPUS-DHA6"
                    value={newCampus.campusCode}
                    onChange={(e) => setNewCampus({ ...newCampus, campusCode: e.target.value })}
                    className="w-full px-2.5 py-1.5 border rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch Principal</label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. Tariq Mahmood"
                    value={newCampus.principalName}
                    onChange={(e) => setNewCampus({ ...newCampus, principalName: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact No</label>
                  <input
                    type="text"
                    placeholder="e.g. +92 42 111-300-400"
                    value={newCampus.contactNo}
                    onChange={(e) => setNewCampus({ ...newCampus, contactNo: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Physical Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Plot 14-B, Sector L, DHA Phase 6, Lahore"
                  value={newCampus.address}
                  onChange={(e) => setNewCampus({ ...newCampus, address: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Pupil Count</label>
                  <input
                    type="number"
                    value={newCampus.studentCount}
                    onChange={(e) => setNewCampus({ ...newCampus, studentCount: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fee Recovery Target (%)</label>
                  <input
                    type="number"
                    value={newCampus.feeRecoveryRate}
                    onChange={(e) => setNewCampus({ ...newCampus, feeRecoveryRate: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold"
                >
                  Confirm Provisioning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. ADMIN ROLE MANAGEMENT VIEW
// ==========================================
export function AdminRoleManagementView() {
  const [admins, setAdmins] = useState([
    { id: 'adm-01', name: 'Zia-ur-Rehman', email: 'zia@educators.edu', role: 'Super Admin', permissions: 'Full Access', campus: 'Central Office', lastActive: 'Active Just Now' },
    { id: 'adm-02', name: 'Aasma Jamil', email: 'aasma.j@educators.edu', role: 'Branch Administrator', permissions: 'Academics & Attendance', campus: 'Main Executive Campus', lastActive: '2 Hours Ago' },
    { id: 'adm-03', name: 'Kashif Ali', email: 'kashif@educators.edu', role: 'Accounts Clerk', permissions: 'Fee ledger and Salaries', campus: 'Central Office', lastActive: '1 Day Ago' },
    { id: 'adm-04', name: 'Farooq Qureshi', email: 'farooq@transport.org', role: 'Transport Officer', permissions: 'Routes & Fleet Logs', campus: 'All Campuses', lastActive: '3 Days Ago' },
  ]);

  const [auditLogs] = useState([
    { timestamp: '2026-09-20 11:15', actor: 'Zia-ur-Rehman', action: 'Approved Leave Request #LV-1021', ip: '192.168.10.45' },
    { timestamp: '2026-09-20 09:30', actor: 'Aasma Jamil', action: 'Published New Notice: Mid-Term Examination Out', ip: '192.168.1.154' },
    { timestamp: '2026-09-19 16:45', actor: 'Kashif Ali', action: 'Generated Monthly Fee Vouchers - Sept 2026', ip: '192.168.10.82' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'Branch Administrator',
    permissions: 'Academics & Attendance',
    campus: 'Main Executive Campus',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email) {
      alert('Please fill out Name and Email.');
      return;
    }
    const adminObj = {
      id: `adm-${Date.now()}`,
      ...newAdmin,
      lastActive: 'Never Signed In',
    };
    setAdmins((prev) => [...prev, adminObj]);
    setShowAddModal(false);
    setNewAdmin({
      name: '',
      email: '',
      role: 'Branch Administrator',
      permissions: 'Academics & Attendance',
      campus: 'Main Executive Campus',
    });
    alert(`System Administrator access granted for "${adminObj.name}". Email notification sent.`);
  };

  const handleRevoke = (id: string) => {
    if (window.confirm('Are you sure you want to revoke this user\'s access?')) {
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-2xs text-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Admin Role &amp; Permission Manager</h3>
          <p className="text-[10px] text-slate-500">Configure roles, granular dashboard security permissions, manage active operators and view secure access audit logs.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold flex items-center gap-1 transition"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Grant Access</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Active Admins List */}
        <div className="lg:col-span-8 border rounded-lg overflow-hidden">
          <div className="p-2.5 bg-slate-50 border-b font-bold text-slate-700">Active System Administrators &amp; Operators</div>
          <div className="divide-y">
            {admins.map((adm) => (
              <div key={adm.id} className="p-3 bg-white hover:bg-slate-50 transition flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{adm.name}</span>
                    <span className="px-1.5 py-0.2 bg-blue-100 text-[#002147] text-[9px] font-black rounded uppercase border border-blue-200">{adm.role}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{adm.email} • Campus: <strong className="text-slate-700">{adm.campus}</strong></div>
                  <div className="text-[10px] mt-1 text-slate-400">Scope: <span className="font-mono text-[9px] text-[#002147] font-semibold">{adm.permissions}</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 italic">{adm.lastActive}</span>
                  <button
                    type="button"
                    onClick={() => handleRevoke(adm.id)}
                    className="px-2 py-1 border hover:border-red-300 hover:text-red-700 rounded font-bold text-[10px] text-slate-600 transition"
                  >
                    Revoke Access
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="lg:col-span-4 border rounded-lg overflow-hidden bg-slate-50 flex flex-col justify-between">
          <div>
            <div className="p-2.5 bg-slate-100 border-b font-bold text-slate-700 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#002147]" />
              <span>Security Access Audit Trail</span>
            </div>
            <div className="p-2 divide-y divide-slate-200/60 max-h-[220px] overflow-y-auto">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="py-2 text-[10px] text-slate-600">
                  <div className="flex justify-between font-mono text-[9px] text-slate-400">
                    <span>{log.timestamp}</span>
                    <span>IP: {log.ip}</span>
                  </div>
                  <p className="mt-1 font-semibold text-slate-800">
                    {log.actor} <span className="font-normal text-slate-500">{log.action.split(':')[0]}</span> {log.action.split(':')[1] || ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-2.5 bg-slate-100 border-t text-[10px] text-slate-500 font-mono text-center">
            🔒 SSL Secured Live Security Logs
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border max-w-md w-full shadow-2xl p-4 overflow-hidden">
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h3 className="text-sm font-bold text-slate-800">Grant Operator Dashboard Access</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Operator Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Junaid"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. junaid@educators.edu"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">System Role</label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Branch Administrator">Branch Administrator</option>
                    <option value="Accounts Clerk">Accounts Clerk</option>
                    <option value="Admission Officer">Admission Officer</option>
                    <option value="Transport Officer">Transport Officer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch Scope</label>
                  <select
                    value={newAdmin.campus}
                    onChange={(e) => setNewAdmin({ ...newAdmin, campus: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  >
                    <option value="All Campuses">All Campuses (Central)</option>
                    <option value="Main Executive Campus">Main Executive Campus</option>
                    <option value="Cantt Girls Branch">Cantt Girls Branch</option>
                    <option value="DHA Phase 5 Campus">DHA Phase 5 Campus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Permissions Group</label>
                <select
                  value={newAdmin.permissions}
                  onChange={(e) => setNewAdmin({ ...newAdmin, permissions: e.target.value })}
                  className="w-full px-2 py-1.5 border rounded text-xs"
                >
                  <option value="Full Access">Full access (Root credentials)</option>
                  <option value="Academics & Attendance">Academics &amp; Attendance ONLY</option>
                  <option value="Fee ledger and Salaries">Fee Ledger &amp; Salaries ONLY</option>
                  <option value="Routes & Fleet Logs">Routes &amp; Fleet Logs ONLY</option>
                  <option value="Read-Only Operator">Read-Only access (View metrics only)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold"
                >
                  Authorize System Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. SMS TO FEE DEFAULTER VIEW
// ==========================================
interface SmsToFeeDefaulterViewProps {
  students: Student[];
  onLogSms?: (sms: any) => void;
}

export function SmsToFeeDefaulterView({ students, onLogSms }: SmsToFeeDefaulterViewProps) {
  // Overdue fee defaulters mock
  const [defaulters, setDefaulters] = useState([
    { id: 'def-1', studentId: 'std-001', studentName: 'Sarah Ali', className: 'Class 10-A', overdueMonths: 2, amountPending: 18500, phone: '+92 321 4455822', isChecked: true },
    { id: 'def-2', studentId: 'std-002', studentName: 'Zainab Fatima', className: 'Class 9-B', overdueMonths: 1, amountPending: 9200, phone: '+92 300 1234567', isChecked: true },
    { id: 'def-3', studentId: 'std-003', studentName: 'Bilal Ahmed', className: 'Class 10-A', overdueMonths: 3, amountPending: 27500, phone: '+92 333 9876543', isChecked: true },
    { id: 'def-4', studentId: 'std-004', studentName: 'Eshaal Imran', className: 'Class 8-C', overdueMonths: 1, amountPending: 8500, phone: '+92 312 8877665', isChecked: false },
  ]);

  const [messageTemplate, setMessageTemplate] = useState(
    'Dear Parent, tuition fee voucher of PKR {amount} for student {student_name} is outstanding for {months} months. Kindly clear dues before the 10th to avoid fine surcharges.'
  );

  const [sendingSms, setSendingSms] = useState(false);

  const checkedCount = defaulters.filter((d) => d.isChecked).length;
  const totalOutstanding = defaulters.filter((d) => d.isChecked).reduce((acc, d) => acc + d.amountPending, 0);

  const handleToggleCheck = (id: string) => {
    setDefaulters((prev) => prev.map((d) => (d.id === id ? { ...d, isChecked: !d.isChecked } : d)));
  };

  const handleToggleAll = (val: boolean) => {
    setDefaulters((prev) => prev.map((d) => ({ ...d, isChecked: val })));
  };

  const handleSendBroadcast = () => {
    if (checkedCount === 0) {
      alert('Please check at least one fee defaulter account.');
      return;
    }
    setSendingSms(true);
    setTimeout(() => {
      setSendingSms(false);
      alert(`Carrier SMS broadcast initiated! ${checkedCount} parents queued. API Status Code: SUCCESS_OK.`);
      if (onLogSms) {
        defaulters.filter(d => d.isChecked).forEach(d => {
          onLogSms({
            id: `sms-${Date.now()}-${Math.random()}`,
            sender: 'Super Admin',
            recipientType: 'Parent',
            recipientName: `${d.studentName} Parent`,
            message: messageTemplate
              .replace('{student_name}', d.studentName)
              .replace('{amount}', d.amountPending.toString())
              .replace('{months}', d.overdueMonths.toString()),
            timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
            status: 'Delivered',
            gatewayResponse: 'SMS_GATEWAY_SUCCESS: OK',
          });
        });
      }
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-2xs text-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">SMS Defaulter Alert &amp; Cellular Broadcaster</h3>
          <p className="text-[10px] text-slate-500">Isolate accounts with unpaid fee vouchers, bulk customize notification templates, and trigger cellular SMS dispatches.</p>
        </div>
        <div className="p-2 bg-red-50 text-red-900 border border-red-200 rounded font-black text-[10px] uppercase">
          🚨 {checkedCount} Target Accounts Overdue
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Defaulters Select Grid */}
        <div className="lg:col-span-7 border rounded-lg overflow-hidden flex flex-col justify-between bg-white">
          <div>
            <div className="p-2.5 bg-slate-50 border-b flex items-center justify-between font-bold text-slate-700">
              <span>Unpaid Student Ledger Accounts</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => handleToggleAll(true)} className="text-[10px] text-[#002147] hover:underline">Select All</button>
                <span className="text-slate-300">|</span>
                <button type="button" onClick={() => handleToggleAll(false)} className="text-[10px] text-slate-500 hover:underline">Deselect All</button>
              </div>
            </div>

            <div className="divide-y max-h-[300px] overflow-y-auto">
              {defaulters.map((def) => (
                <div key={def.id} className="p-3 hover:bg-slate-50 transition flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={def.isChecked}
                      onChange={() => handleToggleCheck(def.id)}
                      className="rounded text-[#002147] focus:ring-[#002147] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-900">{def.studentName}</span>
                      <span className="ml-2 text-[10px] text-slate-400">({def.className})</span>
                      <div className="text-[10px] text-slate-500 mt-0.5">Parent Cell: <strong className="font-mono text-slate-700">{def.phone}</strong></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-700 font-bold">PKR {def.amountPending.toLocaleString()}</div>
                    <span className="px-1.5 py-0.2 bg-red-100 text-red-900 rounded-[4px] text-[8.5px] font-black uppercase mt-1 inline-block border border-red-200">
                      {def.overdueMonths} Month{def.overdueMonths > 1 ? 's' : ''} Overdue
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t flex justify-between items-center text-[11px] font-bold">
            <span className="text-slate-600">Consolidated Overdue Outstanding:</span>
            <span className="text-red-700 text-xs font-black">PKR {totalOutstanding.toLocaleString()}</span>
          </div>
        </div>

        {/* SMS Broadcast Composer */}
        <div className="lg:col-span-5 border rounded-lg overflow-hidden bg-slate-50 p-3.5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-1">
              <Mail className="w-4 h-4 text-slate-600" />
              <span>Compose Cellular Defaulter SMS Template</span>
            </h4>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">MAPPING TAGS AVAILABLE</label>
              <div className="flex flex-wrap gap-1">
                <span className="px-1.5 py-0.5 bg-slate-200 rounded text-[9px] font-mono font-black select-all cursor-pointer">{`{student_name}`}</span>
                <span className="px-1.5 py-0.5 bg-slate-200 rounded text-[9px] font-mono font-black select-all cursor-pointer">{`{amount}`}</span>
                <span className="px-1.5 py-0.5 bg-slate-200 rounded text-[9px] font-mono font-black select-all cursor-pointer">{`{months}`}</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">SMS Message Body Copy *</label>
              <textarea
                required
                rows={5}
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                className="w-full px-2.5 py-1.5 border rounded font-sans text-xs bg-white"
              />
            </div>

            {/* Template Live Mockup Card */}
            <div className="p-2.5 bg-amber-50 rounded border border-amber-200/60 font-mono text-[9px] text-amber-900 leading-relaxed">
              <div className="font-bold border-b border-amber-200/60 pb-1 mb-1">Live Preview (e.g. Zainab Fatima):</div>
              {messageTemplate
                .replace('{student_name}', 'Zainab Fatima')
                .replace('{amount}', '9,200')
                .replace('{months}', '1')}
            </div>
          </div>

          <button
            type="button"
            disabled={sendingSms}
            onClick={handleSendBroadcast}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition mt-2 disabled:bg-red-300 flex items-center justify-center gap-2 text-xs"
          >
            {sendingSms ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Broadcasting Alerts...</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Send BroadCast to {checkedCount} Parents</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. BULK FEE PAYMENT VIEW
// ==========================================
export function BulkFeePaymentView() {
  const [selectedClass, setSelectedClass] = useState('Class 10-A');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [receiptNumber, setReceiptNumber] = useState('');

  const [studentBalances, setStudentBalances] = useState([
    { id: 'sb-1', rollNo: '101', name: 'Muhammad Ali', totalDues: 8500, paidThisTurn: 8500, isSelected: true },
    { id: 'sb-2', rollNo: '102', name: 'Sarah Ali', totalDues: 18500, paidThisTurn: 18500, isSelected: true },
    { id: 'sb-3', rollNo: '103', name: 'Bilal Ahmed', totalDues: 27500, paidThisTurn: 27500, isSelected: false },
    { id: 'sb-4', rollNo: '104', name: 'Hamza Malik', totalDues: 5200, paidThisTurn: 5200, isSelected: true },
  ]);

  const handleToggleSelect = (id: string) => {
    setStudentBalances((prev) => prev.map((s) => (s.id === id ? { ...s, isSelected: !s.isSelected } : s)));
  };

  const handleAmountChange = (id: string, val: number) => {
    setStudentBalances((prev) => prev.map((s) => (s.id === id ? { ...s, paidThisTurn: val } : s)));
  };

  const selectedStudents = studentBalances.filter((s) => s.isSelected);
  const totalReceived = selectedStudents.reduce((acc, s) => acc + s.paidThisTurn, 0);

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudents.length === 0) {
      alert('Please select at least one student transaction.');
      return;
    }
    const receipt = receiptNumber || `REC-BULK-${Math.floor(1000 + Math.random() * 9000)}`;
    alert(
      `Recorded fee collection of PKR ${totalReceived.toLocaleString()} for ${selectedStudents.length} students via ${paymentMode}.\nReceipt/Ref: ${receipt}.`
    );
    // Clear and simulate reset
    setStudentBalances((prev) =>
      prev.map((s) => (s.isSelected ? { ...s, totalDues: s.totalDues - s.paidThisTurn, isSelected: false, paidThisTurn: 0 } : s))
    );
    setReceiptNumber('');
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-2xs text-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Classwise Bulk Fee Recovery Engine</h3>
          <p className="text-[10px] text-slate-500">Collect monthly school tuition fees for an entire class roster in a single interactive transaction screen.</p>
        </div>
      </div>

      <form onSubmit={handleBulkSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Class / Section</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-2 py-1.5 border rounded text-xs bg-white"
            >
              <option value="Class 10-A">Class 10-A (Secondary)</option>
              <option value="Class 9-B">Class 9-B (Secondary)</option>
              <option value="Class 8-C">Class 8-C (Middle)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Payment Channel</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-2 py-1.5 border rounded text-xs bg-white"
            >
              <option value="Cash">Cash Ledger</option>
              <option value="Bank Deposit">Bank Deposit (HBL Branch)</option>
              <option value="EasyPaisa">EasyPaisa Corporate Wallet</option>
              <option value="JazzCash">JazzCash Corporate Wallet</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Receipt / Ref Number (Optional)</label>
            <input
              type="text"
              placeholder="e.g. REC-99201"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              className="w-full px-2.5 py-1.5 border rounded text-xs bg-white font-mono"
            />
          </div>
        </div>

        {/* Students Table Grid */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="p-2.5 text-center font-bold text-slate-700 w-10">Select</th>
                <th className="p-2.5 font-bold text-slate-700 w-24">Roll No</th>
                <th className="p-2.5 font-bold text-slate-700">Student Name</th>
                <th className="p-2.5 font-bold text-slate-700 text-right">Pending Balance (PKR)</th>
                <th className="p-2.5 font-bold text-slate-700 text-right w-40">Amount Collected (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {studentBalances.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="p-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={student.isSelected}
                      onChange={() => handleToggleSelect(student.id)}
                      className="rounded text-[#002147] focus:ring-[#002147] w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="p-2.5 font-mono text-slate-500 font-bold">#{student.rollNo}</td>
                  <td className="p-2.5 font-bold text-slate-900">{student.name}</td>
                  <td className="p-2.5 text-right font-bold text-red-600">PKR {student.totalDues.toLocaleString()}</td>
                  <td className="p-2.5">
                    <input
                      type="number"
                      max={student.totalDues}
                      value={student.paidThisTurn}
                      onChange={(e) => handleAmountChange(student.id, Number(e.target.value))}
                      className="w-full text-right px-2 py-1 border rounded bg-slate-50/50 focus:bg-white font-mono text-emerald-800 font-bold"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-emerald-950">
          <div className="flex items-center gap-1.5">
            <Coins className="w-5 h-5 text-emerald-600" />
            <span>Total Transacted Amount: <strong className="text-sm font-black text-emerald-800">PKR {totalReceived.toLocaleString()}</strong></span>
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg shadow-sm transition flex items-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Post Bulk Payments ({selectedStudents.length} Students)</span>
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// 6. ADMIT STUDENT VIEW
// ==========================================
interface AdmitStudentFormViewProps {
  onAdmitSubmit?: (student: any) => void;
}

export function AdmitStudentFormView({ onAdmitSubmit }: AdmitStudentFormViewProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    bFormNo: '',
    bloodGroup: 'B+',
    fatherName: '',
    fatherCnic: '',
    fatherOccupation: '',
    parentPhone: '',
    emergencyContact: '',
    address: '',
    className: 'Class 10-A',
    previousSchool: '',
    annualIncome: '',
    concessionCategory: 'None',
  });

  const handleStepNext = () => {
    if (step === 1 && (!formData.name || !formData.dob)) {
      alert('Please enter Student Name and Date of Birth.');
      return;
    }
    if (step === 2 && (!formData.fatherName || !formData.parentPhone)) {
      alert('Please enter Father Name and Parent Contact Phone.');
      return;
    }
    setStep(step + 1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockStudent = {
      id: `std-${Date.now()}`,
      rollNo: Math.floor(100 + Math.random() * 900).toString(),
      status: 'Active',
      academicSession: '2026-2027',
      ...formData,
    };
    alert(`Success! Student admission registered in main database.\nAssigned Roll No: #${mockStudent.rollNo}.`);
    if (onAdmitSubmit) onAdmitSubmit(mockStudent);
    // Reset wizard
    setFormData({
      name: '',
      dob: '',
      gender: 'Male',
      bFormNo: '',
      bloodGroup: 'B+',
      fatherName: '',
      fatherCnic: '',
      fatherOccupation: '',
      parentPhone: '',
      emergencyContact: '',
      address: '',
      className: 'Class 10-A',
      previousSchool: '',
      annualIncome: '',
      concessionCategory: 'None',
    });
    setStep(1);
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-2xs text-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Student Admission &amp; Enrollment Wizard</h3>
          <p className="text-[10px] text-slate-500">Official multi-step admission intake form for registering active student records, parents and concessions.</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#002147]">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] ${step >= 1 ? 'bg-[#002147] text-white' : 'bg-slate-100 text-slate-400'}`}>1</span>
          <span>General</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] ${step >= 2 ? 'bg-[#002147] text-white' : 'bg-slate-100 text-slate-400'}`}>2</span>
          <span>Parental</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] ${step >= 3 ? 'bg-[#002147] text-white' : 'bg-slate-100 text-slate-400'}`}>3</span>
          <span>Academic</span>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {step === 1 && (
          <div className="space-y-3">
            <h4 className="font-bold text-[#002147] border-b pb-1 text-xs">Step 1: Student Personal Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zainab Fatima"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">National B-Form ID / CNIC</label>
                <input
                  type="text"
                  placeholder="e.g. 35201-1234567-8"
                  value={formData.bFormNo}
                  onChange={(e) => setFormData({ ...formData, bFormNo: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                >
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O+">O+</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Upload Admission Photo</label>
                <div className="border border-dashed rounded p-1 flex items-center gap-1 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                  <Upload className="w-3.5 h-3.5 text-slate-400 ml-1" />
                  <span className="text-[10px] text-slate-500 font-medium">Select Portrait JPG</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                type="button"
                onClick={handleStepNext}
                className="px-4 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold flex items-center gap-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h4 className="font-bold text-[#002147] border-b pb-1 text-xs">Step 2: Parent &amp; Guardian Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Father / Guardian Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Jamil"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Father National CNIC ID</label>
                <input
                  type="text"
                  placeholder="35201-9988776-3"
                  value={formData.fatherCnic}
                  onChange={(e) => setFormData({ ...formData, fatherCnic: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Father Occupation</label>
                <input
                  type="text"
                  placeholder="e.g. Government Officer"
                  value={formData.fatherOccupation}
                  onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Parent Cell Phone (Primary SMS) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +92 321 9900881"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Alternate Contact</label>
                <input
                  type="text"
                  placeholder="e.g. +92 42 35812345"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Residence Address</label>
                <input
                  type="text"
                  placeholder="e.g. Sector H, Phase 1, DHA Lahore"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                />
              </div>
            </div>

            <div className="flex justify-between pt-2 border-t">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50 font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleStepNext}
                className="px-4 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold flex items-center gap-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h4 className="font-bold text-[#002147] border-b pb-1 text-xs">Step 3: Placement, Fee &amp; Concessions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Admit to Class / Section *</label>
                <select
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                >
                  <option value="Class 10-A">Class 10-A</option>
                  <option value="Class 9-B">Class 9-B</option>
                  <option value="Class 8-C">Class 8-C</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Previous Institution</label>
                <input
                  type="text"
                  placeholder="e.g. Divisional Public School"
                  value={formData.previousSchool}
                  onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Fee Concession Category</label>
                <select
                  value={formData.concessionCategory}
                  onChange={(e) => setFormData({ ...formData, concessionCategory: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs font-semibold text-emerald-800"
                >
                  <option value="None">None (Standard Tuition)</option>
                  <option value="Sibling Concession (20%)">Sibling Concession (20% Off)</option>
                  <option value="Merit Scholar (50%)">Merit Scholar (50% Off)</option>
                  <option value="Staff Son Discount (100%)">Staff Son Discount (100% Free)</option>
                </select>
              </div>
            </div>

            {/* Checklist items */}
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="font-bold text-slate-700 block mb-2">Mandatory Verification Checklist Checklist:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" required className="rounded text-[#002147] focus:ring-[#002147]" />
                  <span>Verified Original B-Form / Birth Cert</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" required className="rounded text-[#002147] focus:ring-[#002147]" />
                  <span>School Leaving / Character Cert received</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" required className="rounded text-[#002147] focus:ring-[#002147]" />
                  <span>Parent CNIC copy archived</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" required className="rounded text-[#002147] focus:ring-[#002147]" />
                  <span>Standard Admission Fee paid and verified</span>
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-2 border-t">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50 font-bold"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-black flex items-center gap-1 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Confirm Student Intake &amp; Generate Roll No</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

// ==========================================
// 7. FEE TYPES/HEADS VIEW
// ==========================================
export function FeeTypesHeadsView() {
  const [feeHeads, setFeeHeads] = useState([
    { id: 'fh-1', code: 'TUIT', name: 'Monthly Tuition Fee', standardAmount: 8500, cycle: 'Monthly', status: 'Active' },
    { id: 'fh-2', code: 'ADMI', name: 'One-time Admission Intake Fee', standardAmount: 15000, cycle: 'One-time', status: 'Active' },
    { id: 'fh-3', code: 'EXAM', name: 'Term Examination Paper Fee', standardAmount: 2500, cycle: 'Termly', status: 'Active' },
    { id: 'fh-4', code: 'COMP', name: 'Computer Practical Lab Fee', standardAmount: 1200, cycle: 'Monthly', status: 'Active' },
    { id: 'fh-5', code: 'TRAN', name: 'School Bus Transportation Fare', standardAmount: 5000, cycle: 'Monthly', status: 'Active' },
    { id: 'fh-6', code: 'SECU', name: 'Security Fund (Refundable)', standardAmount: 10000, cycle: 'One-time', status: 'Inactive' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newHead, setNewHead] = useState({
    code: '',
    name: '',
    standardAmount: 3000,
    cycle: 'Monthly',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHead.code || !newHead.name) {
      alert('Please fill out Fee Code and Name.');
      return;
    }
    const headObj = {
      id: `fh-${Date.now()}`,
      ...newHead,
      status: 'Active',
    };
    setFeeHeads((prev) => [...prev, headObj]);
    setShowAddModal(false);
    setNewHead({
      code: '',
      name: '',
      standardAmount: 3000,
      cycle: 'Monthly',
    });
    alert(`New accounting Fee Head "${headObj.name}" created.`);
  };

  const handleToggleStatus = (id: string) => {
    setFeeHeads((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: f.status === 'Active' ? 'Inactive' : 'Active' } : f))
    );
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-2xs text-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Accounting Ledger Fee Types &amp; Revenue Heads</h3>
          <p className="text-[10px] text-slate-500">Define global billing units, tuition standards, co-curricular funds, refundable security heads and billing cycles.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold flex items-center gap-1 transition"
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Add Fee Head</span>
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-2.5 font-bold text-slate-700">Fee Code</th>
              <th className="p-2.5 font-bold text-slate-700">Revenue head Name</th>
              <th className="p-2.5 font-bold text-slate-700 text-center">Billing Cycle</th>
              <th className="p-2.5 font-bold text-slate-700 text-right">Standard Rate (PKR)</th>
              <th className="p-2.5 font-bold text-slate-700 text-center">Accounting Status</th>
              <th className="p-2.5 font-bold text-slate-700 text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y font-mono text-[11px]">
            {feeHeads.map((fh) => (
              <tr key={fh.id} className="hover:bg-slate-50/50">
                <td className="p-2.5 text-[#002147] font-black">{fh.code}</td>
                <td className="p-2.5 font-sans font-semibold text-slate-800">{fh.name}</td>
                <td className="p-2.5 text-center font-sans">
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">
                    {fh.cycle}
                  </span>
                </td>
                <td className="p-2.5 text-right font-bold text-slate-900">PKR {fh.standardAmount.toLocaleString()}</td>
                <td className="p-2.5 text-center font-sans">
                  <span
                    className={`px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase border ${
                      fh.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border-slate-300'
                    }`}
                  >
                    {fh.status}
                  </span>
                </td>
                <td className="p-2.5 text-center font-sans">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(fh.id)}
                    className="px-2.5 py-1 bg-white border hover:bg-slate-50 text-slate-700 rounded text-[10px] font-bold transition"
                  >
                    Toggle Active
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border max-w-md w-full shadow-2xl p-4 overflow-hidden">
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h3 className="text-sm font-bold text-slate-800">Add New Accounting Fee Head</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fee Code (4 letters) *</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="e.g. COMP"
                    value={newHead.code}
                    onChange={(e) => setNewHead({ ...newHead, code: e.target.value.toUpperCase() })}
                    className="w-full px-2.5 py-1.5 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fee Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science Laboratory Fee"
                    value={newHead.name}
                    onChange={(e) => setNewHead({ ...newHead, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 border rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Standard Amount (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={newHead.standardAmount}
                    onChange={(e) => setNewHead({ ...newHead, standardAmount: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Interval</label>
                  <select
                    value={newHead.cycle}
                    onChange={(e) => setNewHead({ ...newHead, cycle: e.target.value })}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  >
                    <option value="Monthly">Monthly Billing</option>
                    <option value="One-time">One-time / Admission</option>
                    <option value="Termly">Termly / Bi-annually</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold"
                >
                  Create Revenue Head
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 8. FAMILY FEE CALCULATOR VIEW
// ==========================================
export function FamilyFeeCalculatorView() {
  const [siblings, setSiblings] = useState([
    { id: 'sib-1', name: 'Sarah Ali', grade: 'Class 10', standardTuition: 8500, concessionPercent: 0, customDiscount: 0, hasBus: true },
    { id: 'sib-2', name: 'Muhammad Ali', grade: 'Class 8', standardTuition: 8500, concessionPercent: 20, customDiscount: 0, hasBus: false },
    { id: 'sib-3', name: 'Hamza Ali', grade: 'Class 3', standardTuition: 6500, concessionPercent: 50, customDiscount: 1000, hasBus: true },
  ]);

  const [siblingName, setSiblingName] = useState('');
  const [siblingGrade, setSiblingGrade] = useState('Class 1');

  const addSibling = () => {
    if (!siblingName) {
      alert('Please enter sibling student name.');
      return;
    }
    const standardMap: Record<string, number> = { 'Class 1': 5000, 'Class 2': 5000, 'Class 8': 8500, 'Class 10': 8500 };
    const baseTuition = standardMap[siblingGrade] || 5500;

    // Default concession progressive logic (2nd child = 20%, 3rd child = 50%)
    const nextCount = siblings.length + 1;
    const defaultDiscount = nextCount === 2 ? 20 : nextCount >= 3 ? 50 : 0;

    const newSib = {
      id: `sib-${Date.now()}`,
      name: siblingName,
      grade: siblingGrade,
      standardTuition: baseTuition,
      concessionPercent: defaultDiscount,
      customDiscount: 0,
      hasBus: false,
    };

    setSiblings([...siblings, newSib]);
    setSiblingName('');
    alert(`Added ${newSib.name} to family grouping. Progressive concession set to ${defaultDiscount}%!`);
  };

  const removeSibling = (id: string) => {
    setSiblings(siblings.filter((s) => s.id !== id));
  };

  const updateDiscount = (id: string, pct: number) => {
    setSiblings(siblings.map((s) => (s.id === id ? { ...s, concessionPercent: pct } : s)));
  };

  const toggleBus = (id: string) => {
    setSiblings(siblings.map((s) => (s.id === id ? { ...s, hasBus: !s.hasBus } : s)));
  };

  // Calculations
  const calculatedRows = useMemo(() => {
    return siblings.map((sib) => {
      const tuitionDiscount = (sib.standardTuition * sib.concessionPercent) / 100;
      const finalTuition = sib.standardTuition - tuitionDiscount - sib.customDiscount;
      const busFare = sib.hasBus ? 5000 : 0;
      const studentTotal = finalTuition + busFare;

      return {
        ...sib,
        tuitionDiscount,
        finalTuition,
        busFare,
        studentTotal,
      };
    });
  }, [siblings]);

  const totalStandard = calculatedRows.reduce((acc, r) => acc + r.standardTuition, 0);
  const totalDiscounts = calculatedRows.reduce((acc, r) => acc + r.tuitionDiscount + r.customDiscount, 0);
  const totalBus = calculatedRows.reduce((acc, r) => acc + r.busFare, 0);
  const consolidatedFamilyTotal = calculatedRows.reduce((acc, r) => acc + r.studentTotal, 0);

  return (
    <div className="bg-white rounded-lg border p-4 shadow-2xs text-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Dynamic Family &amp; Sibling Fee Calculator</h3>
          <p className="text-[10px] text-slate-500">Calculate consolidated multi-child accounts, apply sibling progressive concession rules and estimate net household fees.</p>
        </div>
      </div>

      {/* Sibling Intake Group */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border items-end">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Search Sibling / Pupil Name</label>
          <input
            type="text"
            placeholder="e.g. Maryam Ali"
            value={siblingName}
            onChange={(e) => setSiblingName(e.target.value)}
            className="w-full px-2.5 py-1.5 border rounded text-xs bg-white"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">Enrolling Class</label>
          <select
            value={siblingGrade}
            onChange={(e) => setSiblingGrade(e.target.value)}
            className="w-full px-2 py-1.5 border rounded text-xs bg-white"
          >
            <option value="Class 1">Class 1 (Primary)</option>
            <option value="Class 2">Class 2 (Primary)</option>
            <option value="Class 8">Class 8 (Middle)</option>
            <option value="Class 10">Class 10 (Secondary)</option>
          </select>
        </div>
        <button
          type="button"
          onClick={addSibling}
          className="py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold transition flex items-center justify-center gap-1 text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Sibling to Group</span>
        </button>
      </div>

      {/* Calculator Grid */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-2.5 font-bold text-slate-700">Sibling Name</th>
              <th className="p-2.5 font-bold text-slate-700">Class</th>
              <th className="p-2.5 font-bold text-slate-700 text-right">Base Tuition (PKR)</th>
              <th className="p-2.5 font-bold text-slate-700 text-center w-36">Concession (%)</th>
              <th className="p-2.5 font-bold text-slate-700 text-center">Transport Fare (PKR)</th>
              <th className="p-2.5 font-bold text-slate-700 text-right">Student Net Total</th>
              <th className="p-2.5 font-bold text-slate-700 text-center w-16">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y font-mono text-[11px]">
            {calculatedRows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50">
                <td className="p-2.5 font-sans font-bold text-slate-900">{row.name}</td>
                <td className="p-2.5 font-sans">{row.grade}</td>
                <td className="p-2.5 text-right">PKR {row.standardTuition.toLocaleString()}</td>
                <td className="p-2.5 text-center font-sans">
                  <select
                    value={row.concessionPercent}
                    onChange={(e) => updateDiscount(row.id, Number(e.target.value))}
                    className="px-2 py-0.5 border rounded text-xs bg-white text-emerald-800 font-bold"
                  >
                    <option value={0}>0% Normal</option>
                    <option value={10}>10% Merit</option>
                    <option value={20}>20% 2nd Child</option>
                    <option value={50}>50% Sibling Aid</option>
                    <option value={100}>100% Free Scholarship</option>
                  </select>
                </td>
                <td className="p-2.5 text-center font-sans">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={row.hasBus}
                      onChange={() => toggleBus(row.id)}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>{row.hasBus ? 'Van (+PKR 5,000)' : 'Own Arrangement'}</span>
                  </label>
                </td>
                <td className="p-2.5 text-right text-[#002147] font-black">PKR {row.studentTotal.toLocaleString()}</td>
                <td className="p-2.5 text-center">
                  <button
                    type="button"
                    onClick={() => removeSibling(row.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bill Estimation Card */}
      <div className="bg-slate-50 rounded-lg border p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-6"><span className="text-slate-500">Gross Sibling Fees:</span> <span className="font-mono text-slate-700 font-bold">PKR {totalStandard.toLocaleString()}</span></div>
          <div className="flex justify-between gap-6"><span className="text-slate-500">Total Sibling Concessions:</span> <span className="font-mono text-red-600 font-bold">- PKR {totalDiscounts.toLocaleString()}</span></div>
          <div className="flex justify-between gap-6"><span className="text-slate-500">Consolidated Van Fares:</span> <span className="font-mono text-emerald-700 font-bold">+ PKR {totalBus.toLocaleString()}</span></div>
        </div>

        <div className="text-right border-l pl-4 border-slate-300">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Family Invoice</span>
          <span className="text-lg font-black text-[#002147] block mt-1">PKR {consolidatedFamilyTotal.toLocaleString()}</span>
          <button
            type="button"
            onClick={() => alert(`Consolidated invoice of PKR ${consolidatedFamilyTotal.toLocaleString()} logged and generated.`)}
            className="mt-2.5 px-4 py-1.5 bg-[#002147] hover:bg-black text-white font-bold rounded flex items-center gap-1 transition text-xs"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Post Group invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 9. MANAGE BIOMETRIC DEVICES VIEW
// ==========================================
export function ManageBiometricDevicesView() {
  const [devices, setDevices] = useState([
    { id: 'bio-1', model: 'ZKTeco iClock 900', ip: '192.168.10.200', port: '4370', type: 'Fingerprint + Card', status: 'Online', usersCount: 382, logsCount: 14050 },
    { id: 'bio-2', model: 'HikVision Face Terminal', ip: '192.168.10.201', port: '5000', type: 'Facial Recognition', status: 'Online', usersCount: 124, logsCount: 4122 },
    { id: 'bio-3', model: 'ZKTeco F22 Branch', ip: '192.168.1.18', port: '4370', type: 'Fingerprint Only', status: 'Offline', usersCount: 220, logsCount: 980 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [pingingId, setPingingId] = useState<string | null>(null);

  const [newDevice, setNewDevice] = useState({
    model: '',
    ip: '',
    port: '4370',
    type: 'Fingerprint Only',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.model || !newDevice.ip) {
      alert('Please fill out Device Model and IP Address.');
      return;
    }
    const devObj = {
      id: `bio-${Date.now()}`,
      ...newDevice,
      status: 'Online',
      usersCount: 0,
      logsCount: 0,
    };
    setDevices([...devices, devObj]);
    setShowAddModal(false);
    setNewDevice({
      model: '',
      ip: '',
      port: '4370',
      type: 'Fingerprint Only',
    });
    alert(`Device "${devObj.model}" connected successfully onto port ${devObj.port}!`);
  };

  const handlePingDevice = (id: string, ip: string) => {
    setPingingId(id);
    setTimeout(() => {
      setPingingId(null);
      alert(`Ping response from ${ip}: 32 bytes in 4ms. Device active and listening.`);
    }, 1000);
  };

  const handleFetchUsers = (id: string) => {
    alert('Contacting device SDK... Fetching daily clocking transaction database... Sync Complete.');
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-2xs text-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Biometric Attendance Machine Manager (ZKTeco / HikVision)</h3>
          <p className="text-[10px] text-slate-500">Configure TCP/IP terminal endpoints, track network socket status, retrieve raw fingerprint templates and synchronize attendance logs.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold flex items-center gap-1 transition"
        >
          <Fingerprint className="w-3.5 h-3.5 animate-pulse text-amber-300" />
          <span>Connect Machine</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {devices.map((dev) => {
          const isOnline = dev.status === 'Online';
          return (
            <div key={dev.id} className="p-3 bg-slate-50 rounded-lg border hover:border-slate-300 transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{dev.model}</h4>
                    <p className="font-mono text-[10px] text-slate-500 mt-0.5">{dev.ip}:{dev.port}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-[4px] text-[8.5px] font-black uppercase flex items-center gap-1 border ${
                    isOnline
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-red-100 text-red-900 border-red-300'
                  }`}>
                    {isOnline ? <Wifi className="w-3 h-3 text-emerald-600" /> : <WifiOff className="w-3 h-3 text-red-600" />}
                    <span>{dev.status}</span>
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[10.5px] text-slate-600 bg-white p-2 rounded border">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Registered Users</span>
                    <strong className="text-slate-800 font-mono text-xs">{dev.usersCount} Employees</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Raw Punch Logs</span>
                    <strong className="text-slate-800 font-mono text-xs">{dev.logsCount.toLocaleString()}</strong>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 mt-2 font-semibold">Sensor Interface: <span className="text-[#002147]">{dev.type}</span></p>
              </div>

              <div className="mt-4 pt-2 border-t flex gap-1.5">
                <button
                  type="button"
                  disabled={pingingId === dev.id}
                  onClick={() => handlePingDevice(dev.id, dev.ip)}
                  className="flex-1 py-1.5 bg-white border hover:bg-slate-100 text-slate-700 font-bold rounded flex items-center justify-center gap-1 transition"
                >
                  {pingingId === dev.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3 text-sky-600" />}
                  <span>Ping Device</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFetchUsers(dev.id)}
                  className="flex-1 py-1.5 bg-[#002147] hover:bg-black text-white font-bold rounded flex items-center justify-center gap-1 transition"
                >
                  <Database className="w-3 h-3" />
                  <span>Sync Logs</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border max-w-md w-full shadow-2xl p-4 overflow-hidden">
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h3 className="text-sm font-bold text-slate-800">Add Biometric Machine Terminal</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Machine Model / Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ZKTeco iClock 900"
                  value={newDevice.model}
                  onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">IP Address Socket *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 192.168.10.20"
                    value={newDevice.ip}
                    onChange={(e) => setNewDevice({ ...newDevice, ip: e.target.value })}
                    className="w-full px-2.5 py-1.5 border rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Comm Port *</label>
                  <input
                    type="text"
                    required
                    value={newDevice.port}
                    onChange={(e) => setNewDevice({ ...newDevice, port: e.target.value })}
                    className="w-full px-2.5 py-1.5 border rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Terminal Authentication Core Type</label>
                <select
                  value={newDevice.type}
                  onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                  className="w-full px-2.5 py-1.5 border rounded text-xs"
                >
                  <option value="Fingerprint Only">Fingerprint Sensor Only</option>
                  <option value="Fingerprint + Card">Fingerprint Reader + RFID Proximity Card</option>
                  <option value="Facial Recognition">Facial Recognition Infrared Core</option>
                  <option value="Hybrid (Face + Fing + Card)">Hybrid Multi-spectral Biometric</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold"
                >
                  Connect Terminal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 10. WEBSITE MANAGEMENT VIEW
// ==========================================
interface WebsiteManagementViewProps {
  initialClasses: ClassInfo[];
}

export function WebsiteManagementView({ initialClasses }: WebsiteManagementViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'classes'>('general');

  // General Settings
  const [webSettings, setWebSettings] = useState({
    siteTitle: 'The Educators Al-Huda Islamic School System',
    tagline: 'Illuminating Minds, Nurturing Values, Inspiring Excellence',
    email: 'admissions@educators.edu.pk',
    phone: '+92 42 111 300 400',
    headerBanner: 'Admissions Open for Academic session 2026-2027! Register today.',
    facebookUrl: 'https://facebook.com/TheEducatorsAlHuda',
    instagramUrl: 'https://instagram.com/TheEducatorsAlHuda',
  });

  const [galleryImages, setGalleryImages] = useState([
    { id: 'img-1', title: 'Main Science Lab Equipment', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80' },
    { id: 'img-2', title: 'Campus Sports Tournament 2026', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80' },
    { id: 'img-3', title: 'Annual Cultural Stage Speech competition', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80' },
  ]);

  // Classes to show (interactive toggles)
  const [visibleClasses, setVisibleClasses] = useState<Record<string, boolean>>({
    'Class 10-A': true,
    'Class 9-B': true,
    'Class 8-C': true,
    'Class 7': true,
    'Class 6': false,
  });

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Public Portal General and Gallery configurations successfully saved and synchronized with public CMS servers.');
  };

  const handleAddGalleryImage = () => {
    const title = prompt('Enter a title/caption for the new gallery photo:');
    if (!title) return;
    const url = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
    setGalleryImages([...galleryImages, { id: `img-${Date.now()}`, title, url }]);
    alert('Photo published to campus web gallery.');
  };

  const handleRemoveImage = (id: string) => {
    setGalleryImages(galleryImages.filter((img) => img.id !== id));
  };

  const handleToggleClassVisibility = (className: string) => {
    setVisibleClasses((prev) => ({ ...prev, [className]: !prev[className] }));
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-2xs text-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Public Website &amp; Portal CMS Management</h3>
          <p className="text-[10px] text-slate-500">Configure content sliders, campus image galleries, SEO headers, contact numbers, and publish academic programs on the public website.</p>
        </div>
      </div>

      {/* Selector Sub-navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1 mb-2 font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('general')}
          className={`px-3 py-1.5 border-b-2 transition ${
            activeSubTab === 'general'
              ? 'border-[#002147] text-[#002147] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          General &amp; Gallery Settings
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('classes')}
          className={`px-3 py-1.5 border-b-2 transition ${
            activeSubTab === 'classes'
              ? 'border-[#002147] text-[#002147] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Classes to show on Admissions Page
        </button>
      </div>

      {activeSubTab === 'general' ? (
        <form onSubmit={handleSaveGeneral} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Public Website Title / Brand *</label>
              <input
                type="text"
                required
                value={webSettings.siteTitle}
                onChange={(e) => setWebSettings({ ...webSettings, siteTitle: e.target.value })}
                className="w-full px-2.5 py-1.5 border rounded text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Homepage Mission Tagline</label>
              <input
                type="text"
                value={webSettings.tagline}
                onChange={(e) => setWebSettings({ ...webSettings, tagline: e.target.value })}
                className="w-full px-2.5 py-1.5 border rounded text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Admissions Phone Contact *</label>
              <input
                type="text"
                required
                value={webSettings.phone}
                onChange={(e) => setWebSettings({ ...webSettings, phone: e.target.value })}
                className="w-full px-2.5 py-1.5 border rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Admissions Email Address *</label>
              <input
                type="email"
                required
                value={webSettings.email}
                onChange={(e) => setWebSettings({ ...webSettings, email: e.target.value })}
                className="w-full px-2.5 py-1.5 border rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Top Bar Alert News ticker Banner</label>
              <input
                type="text"
                value={webSettings.headerBanner}
                onChange={(e) => setWebSettings({ ...webSettings, headerBanner: e.target.value })}
                className="w-full px-2.5 py-1.5 border rounded text-xs"
              />
            </div>
          </div>

          {/* Gallery management */}
          <div className="bg-slate-50 p-3 rounded-lg border space-y-2">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <ImageIcon className="w-4 h-4 text-slate-600" />
                <span>Interactive Public Campus Gallery &amp; Banners</span>
              </span>
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="px-2.5 py-1 bg-[#002147] hover:bg-black text-white rounded font-bold transition flex items-center gap-0.5 text-[10px]"
              >
                <Plus className="w-3 h-3" />
                <span>Upload Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {galleryImages.map((img) => (
                <div key={img.id} className="relative group bg-white border rounded p-1.5 overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-24 object-cover rounded"
                  />
                  <div className="mt-1 flex items-center justify-between gap-1.5">
                    <span className="truncate font-medium text-slate-700 text-[10px] block">{img.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded bg-slate-50 transition"
                      title="Remove Image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t">
            <button
              type="submit"
              className="px-5 py-2 bg-[#002147] hover:bg-black text-white font-black rounded-lg shadow-xs transition"
            >
              Save Website Settings
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border">
            <span className="font-bold text-slate-800 block">Classes to Show on Public admissions page</span>
            <p className="text-[10px] text-slate-500 mt-0.5">Toggle which academic divisions are visible on the online inquiry form, curriculum prospectus and public admission portal.</p>
          </div>

          <div className="border rounded-lg bg-white overflow-hidden divide-y">
            {initialClasses.map((cls) => {
              const classNameKey = cls.className || cls.name || `class-${cls.id}`;
              const isVisible = visibleClasses[classNameKey] ?? true;
              return (
                <div key={cls.id} className="p-3 flex items-center justify-between hover:bg-slate-50/50 transition">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">{cls.name || cls.className}</span>
                    <div className="text-[10px] text-slate-500 mt-0.5">Regional Branch: <strong className="text-slate-700">{cls.campusName || 'Main Executive'}</strong> • Class Teacher: {cls.classTeacher}</div>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50 border p-1 px-2.5 rounded hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => handleToggleClassVisibility(classNameKey)}
                      className="rounded text-[#002147] focus:ring-[#002147] w-4 h-4 cursor-pointer"
                    />
                    <span className={`font-black text-[9px] uppercase ${isVisible ? 'text-emerald-800' : 'text-slate-500'}`}>
                      {isVisible ? 'Visible on Website' : 'Hidden from Website'}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => alert('Website public class list updated and cached on servers successfully.')}
              className="px-5 py-2 bg-[#002147] hover:bg-black text-white font-black rounded-lg shadow-xs transition"
            >
              Update Public Class Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

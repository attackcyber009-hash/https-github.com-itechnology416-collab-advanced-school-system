import { useState } from 'react';
import {
  MessageSquare,
  Send,
  Bell,
  MessageCircle,
  HelpCircle,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Plus,
  Share2,
  Printer,
  Smartphone,
  PhoneCall,
  User,
  CheckCheck,
  Building,
} from 'lucide-react';
import { SmsBroadcastLog, NoticeCircular, ParentComplaintTicket, Student } from '../types';
import {
  INITIAL_SMS_LOGS,
  INITIAL_CIRCULARS,
  INITIAL_COMPLAINT_TICKETS,
} from '../data/phase6Data';

interface CommunicationsHubViewProps {
  students: Student[];
}

export default function CommunicationsHubView({ students }: CommunicationsHubViewProps) {
  const [activeTab, setActiveTab] = useState<'sms' | 'whatsapp' | 'notices' | 'complaints'>('sms');

  // Stores
  const [smsLogs, setSmsLogs] = useState<SmsBroadcastLog[]>(INITIAL_SMS_LOGS);
  const [notices, setNotices] = useState<NoticeCircular[]>(INITIAL_CIRCULARS);
  const [complaints, setComplaints] = useState<ParentComplaintTicket[]>(INITIAL_COMPLAINT_TICKETS);

  // SMS Composer State
  const [smsMask, setSmsMask] = useState('EDUCATORS');
  const [smsTarget, setSmsTarget] = useState<SmsBroadcastLog['targetAudience']>('All Parents');
  const [smsTemplate, setSmsTemplate] = useState('custom');
  const [smsText, setSmsText] = useState(
    'Respected Parents, Mid-Term Assessment 2024 commences from 21st October. Please ensure timely clearance of dues and collection of Roll No slips. - The Educators Campus'
  );

  // WhatsApp Single Dispatcher
  const [waStudentId, setWaStudentId] = useState<string>(students[0]?.id || '');
  const [waTemplate, setWaTemplate] = useState('fee');

  // Notice Creation Modal
  const [noticeModal, setNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState<Partial<NoticeCircular>>({
    title: '',
    category: 'Academic & Exams',
    targetAudience: 'All',
    urgency: 'Normal',
    content: '',
  });

  // Complaint Resolve Modal
  const [activeTicket, setActiveTicket] = useState<ParentComplaintTicket | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // Predefined SMS templates
  const applySmsTemplate = (key: string) => {
    setSmsTemplate(key);
    if (key === 'attendance_absent') {
      setSmsText(
        'Dear Parent, your child was marked ABSENT today without prior leave approval. Please confirm reason with school office at 042-35882100. - The Educators'
      );
    } else if (key === 'fee_reminder') {
      setSmsText(
        'Respected Parent, Fee Challan for current month is due on 10th. Kindly clear dues to avoid late surcharge. Pay via 1Link or campus bank. - The Educators'
      );
    } else if (key === 'exam_schedule') {
      setSmsText(
        'Official Exam Datesheet has been published. Exams begin 21st Oct. Roll No Slips are issued to cleared students. Best wishes! - The Educators'
      );
    } else if (key === 'rain_emergency') {
      setSmsText(
        'EMERGENCY ALERT: Due to heavy rains & urban flooding forecast, campus will remain closed tomorrow as per Govt notification. Online classes on portal. - Principal'
      );
    } else if (key === 'urdu_general') {
      setSmsText(
        'معزز والدین، مڈ ٹرم امتحانات کے رول نمبر سلپس جاری کر دیے گئے ہیں۔ فیس کی بر وقت ادائیگی یقینی بنائیں۔ شکریہ - دی ایجوکیٹرز'
      );
    }
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsText.trim()) return;

    const recipientCount =
      smsTarget === 'All Parents'
        ? students.length
        : smsTarget === 'Class-wise'
        ? 35
        : smsTarget === 'Fee Defaulters'
        ? 8
        : 22;

    const newLog: SmsBroadcastLog = {
      id: `sms-${Date.now()}`,
      campaignTitle: `Broadcast: ${smsTemplate} (${smsTarget})`,
      maskId: smsMask,
      targetAudience: smsTarget,
      messageBody: smsText,
      recipientCount: recipientCount,
      deliveredCount: recipientCount - 1,
      failedCount: 1,
      costPkr: recipientCount * 1.5,
      sentAt: new Date().toLocaleString(),
      status: 'Delivered',
    };

    setSmsLogs([newLog, ...smsLogs]);
    alert(`SMS Broadcast dispatched to ${recipientCount} recipients via '${smsMask}' GSM Gateway!`);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;

    const item: NoticeCircular = {
      id: `not-${Date.now()}`,
      circularNo: `TE/CIR/2024/${Math.floor(100 + Math.random() * 900)}`,
      title: newNotice.title || 'Official Circular',
      publishDate: new Date().toISOString().split('T')[0],
      category: newNotice.category || 'Academic & Exams',
      targetAudience: newNotice.targetAudience || 'All',
      content: newNotice.content || '',
      signedBy: 'Office of the Executive Principal',
      urgency: newNotice.urgency || 'Normal',
      isPinned: false,
    };

    setNotices([item, ...notices]);
    setNoticeModal(false);
    setNewNotice({ title: '', content: '', category: 'Academic & Exams', targetAudience: 'All', urgency: 'Normal' });
    alert(`Notice Circular #${item.circularNo} published to institutional boards!`);
  };

  const handleResolveTicket = () => {
    if (!activeTicket) return;
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === activeTicket.id
          ? {
              ...c,
              status: 'Resolved',
              resolutionSummary: resolutionText || 'Resolved satisfactorily with parent communication.',
              resolvedAt: new Date().toISOString().split('T')[0],
            }
          : c
      )
    );
    setActiveTicket(null);
    setResolutionText('');
    alert('Complaint marked as RESOLVED and parent notified via SMS!');
  };

  const selectedStudent = students.find((s) => s.id === waStudentId) || students[0];

  const getWaText = () => {
    if (!selectedStudent) return '';
    if (waTemplate === 'fee') {
      return `Dear Parent of ${selectedStudent.name} (Roll #${selectedStudent.rollNo}), this is a gentle reminder that the tuition fee voucher of PKR ${selectedStudent.monthlyFee.toLocaleString()} is due. Please clear via 1Link or visit school accounts. Regards, The Educators.`;
    }
    if (waTemplate === 'exam') {
      return `Dear Parent of ${selectedStudent.name}, Mid-Term Examinations begin on 21st October. Kindly ensure ${selectedStudent.name} brings their official Roll Number Slip and stationary. Best regards, Class Incharge.`;
    }
    return `Assalam-o-Alaikum, this is an official update regarding ${selectedStudent.name}'s progress at The Educators Campus. Please feel free to reply with any queries.`;
  };

  const openWhatsApp = () => {
    if (!selectedStudent) return;
    const phone = selectedStudent.parentPhone.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('0') ? '92' + phone.slice(1) : phone;
    const text = encodeURIComponent(getWaText());
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div id="communications-hub-suite" className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold shadow">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Omni-Channel Communications &amp; Parent Helpdesk Hub
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
                PTA Approved Masking
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Branded GSM SMS broadcasting ('EDUCATORS'), direct WhatsApp links, digital circulars &amp; parent complaint SLAs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setNoticeModal(true)}
            className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Notice Circular</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-xs flex flex-wrap items-center gap-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('sms')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'sms'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Smartphone className="w-4 h-4 text-sky-400" />
          <span>Masked SMS Broadcaster</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'whatsapp'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>WhatsApp Direct Links</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notices')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'notices'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span>Notice Board &amp; Circulars</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('complaints')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'complaints'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-rose-400" />
          <span>Parent Complaint Helpdesk ({complaints.filter((c) => c.status !== 'Resolved').length} Open)</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: MASKED SMS BROADCASTER */}
      {/* ============================================================ */}
      {activeTab === 'sms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
          {/* Left Column: Composer Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-700" />
                  <h3 className="font-bold text-slate-800">Compose Branded SMS Broadcast</h3>
                </div>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                  PTA Mask: {smsMask}
                </span>
              </div>

              <form onSubmit={handleSendSms} className="space-y-3">
                {/* Mask & Audience */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sender ID / Mask</label>
                    <input
                      type="text"
                      disabled
                      value={smsMask}
                      className="w-full px-3 py-1.5 border rounded bg-slate-100 font-mono font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                    <select
                      value={smsTarget}
                      onChange={(e) => setSmsTarget(e.target.value as any)}
                      className="w-full px-3 py-1.5 border rounded bg-white font-semibold text-slate-800"
                    >
                      <option value="All Parents">All Registered Parents ({students.length})</option>
                      <option value="Fee Defaulters">Fee Defaulters Only</option>
                      <option value="Class Specific">Class Specific Wing</option>
                      <option value="Staff Only">Teaching &amp; Admin Staff</option>
                    </select>
                  </div>
                </div>

                {/* Templates Quick Buttons */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quick SMS Templates</label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => applySmsTemplate('fee_reminder')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 font-medium"
                    >
                      Fee Challan Due
                    </button>
                    <button
                      type="button"
                      onClick={() => applySmsTemplate('attendance_absent')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 font-medium"
                    >
                      Absent Alert
                    </button>
                    <button
                      type="button"
                      onClick={() => applySmsTemplate('exam_schedule')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 font-medium"
                    >
                      Datesheet Release
                    </button>
                    <button
                      type="button"
                      onClick={() => applySmsTemplate('rain_emergency')}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded text-[11px] font-bold"
                    >
                      Weather Emergency
                    </button>
                    <button
                      type="button"
                      onClick={() => applySmsTemplate('urdu_general')}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded text-[11px] font-bold"
                    >
                      اردو پیام
                    </button>
                  </div>
                </div>

                {/* Text Area */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Message Body</label>
                    <span className="text-[10px] font-mono text-slate-500">
                      {smsText.length} chars ({Math.ceil(smsText.length / 160) || 1} SMS Credit)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-xs leading-relaxed"
                  />
                </div>

                <div className="p-2.5 bg-slate-50 rounded border flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Estimated Cost:</span>
                  <span className="font-bold text-emerald-800 font-mono">
                    PKR {(students.length * 1.5).toFixed(0)} (~PKR 1.50 / SMS)
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#002147] hover:bg-[#072d5b] text-white font-bold rounded-lg shadow flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Dispatch SMS via Masked Gateway</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Transmission History & Delivery Logs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-800">Recent Gateway Delivery Logs</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Live Telco Handshake</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                    <tr>
                      <th className="py-2 px-3">Campaign / Target</th>
                      <th className="py-2 px-3">Message Snippet</th>
                      <th className="py-2 px-3 text-center">Delivered</th>
                      <th className="py-2 px-3 text-center">Cost</th>
                      <th className="py-2 px-3 text-right">Dispatched</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {smsLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{log.campaignTitle}</div>
                          <span className="font-mono text-[10px] text-sky-800 font-semibold">
                            [{log.maskId}] • {log.targetAudience}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 max-w-[200px] truncate text-slate-600">
                          {log.messageBody}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-700">
                          {log.deliveredCount} / {log.recipientCount}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-800">
                          PKR {log.costPkr}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-400 text-[10px] font-mono">
                          {log.sentAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: DIRECT WHATSAPP LINKS (wa.me) */}
      {/* ============================================================ */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-4 text-xs">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Instant WhatsApp Direct Messaging Assistant</span>
              </h3>
              <p className="text-slate-500 text-xs">
                Launch pre-filled official message threads to parents on WhatsApp without saving numbers
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs">
                Zero SMS Cost • Direct Chat
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* WhatsApp Control Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-800 border-b pb-2">Select Recipient &amp; Message</h4>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student / Parent</label>
                <select
                  value={waStudentId}
                  onChange={(e) => setWaStudentId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white font-semibold text-slate-800"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} — {st.className} (Father: {st.fatherName} • {st.parentPhone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Context</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setWaTemplate('fee')}
                    className={`p-2 rounded border text-center transition ${
                      waTemplate === 'fee'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Fee Due Notice
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaTemplate('exam')}
                    className={`p-2 rounded border text-center transition ${
                      waTemplate === 'exam'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Exam Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaTemplate('general')}
                    className={`p-2 rounded border text-center transition ${
                      waTemplate === 'general'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    General Progress
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-900">
                  Live Message Preview:
                </span>
                <p className="text-xs text-slate-800 italic leading-relaxed">"{getWaText()}"</p>
              </div>

              <button
                type="button"
                onClick={openWhatsApp}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open in WhatsApp Web / App ({selectedStudent?.parentPhone})</span>
              </button>
            </div>

            {/* Direct Quick WhatsApp Directory */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-800 border-b pb-2">Quick WhatsApp Student Directory</h4>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {students.map((st) => (
                  <div
                    key={st.id}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 flex items-center justify-between transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{st.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {st.className} • Father: {st.fatherName}
                      </div>
                      <div className="font-mono text-[10px] text-emerald-700 font-semibold">
                        {st.parentPhone}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setWaStudentId(st.id);
                        const phone = st.parentPhone.replace(/[^0-9]/g, '');
                        const cleanPhone = phone.startsWith('0') ? '92' + phone.slice(1) : phone;
                        window.open(
                          `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Assalam-o-Alaikum, this is an update regarding ${st.name} from The Educators Main Campus.`
                          )}`,
                          '_blank'
                        );
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] flex items-center gap-1 shadow-xs"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Chat</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: NOTICE BOARD & CIRCULARS */}
      {/* ============================================================ */}
      {activeTab === 'notices' && (
        <div className="space-y-4 text-xs">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Official Digital Notice Board &amp; Institutional Circulars</span>
              </h3>
              <p className="text-slate-500 text-xs">
                Official notifications signed by the Executive Principal and Academic Council
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNoticeModal(true)}
              className="px-3.5 py-1.5 bg-[#002147] hover:bg-[#072d5b] text-white rounded font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>Publish New Circular</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((n) => (
              <div
                key={n.id}
                className={`bg-white rounded-xl border p-5 shadow-xs space-y-3 relative ${
                  n.urgency === 'Urgent / Alert' ? 'border-rose-400 ring-1 ring-rose-300 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between border-b pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {n.circularNo}
                      </span>
                      {n.urgency === 'Urgent / Alert' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                          URGENT
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">{n.title}</h4>
                  </div>

                  <span className="text-slate-400 font-mono text-[10px]">{n.publishDate}</span>
                </div>

                <p className="text-slate-700 leading-relaxed text-xs">{n.content}</p>

                <div className="pt-2 border-t flex items-center justify-between text-[11px] text-slate-500">
                  <div>
                    <span className="font-semibold text-slate-700">Category: </span>
                    <span className="text-indigo-800 font-medium">{n.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[10px] flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Circular</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Circular Modal */}
          {noticeModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5 border border-slate-300 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-500" />
                    <span>Publish Official Circular</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setNoticeModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateNotice} className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Circular Title</label>
                    <input
                      type="text"
                      required
                      value={newNotice.title}
                      onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                      placeholder="e.g. Schedule for Annual Sports Gala 2024"
                      className="w-full px-3 py-1.5 border rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={newNotice.category}
                        onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as any })}
                        className="w-full px-3 py-1.5 border rounded bg-white"
                      >
                        <option value="Academic">Academic</option>
                        <option value="Holiday">Holiday</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Sports">Sports</option>
                        <option value="Administrative">Administrative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                      <select
                        value={newNotice.targetAudience}
                        onChange={(e) =>
                          setNewNotice({ ...newNotice, targetAudience: e.target.value as any })
                        }
                        className="w-full px-3 py-1.5 border rounded bg-white"
                      >
                        <option value="All">All School Community</option>
                        <option value="Parents">Parents Only</option>
                        <option value="Students">Students Only</option>
                        <option value="Staff">Teaching &amp; Admin Staff</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Notice Body Text</label>
                    <textarea
                      rows={4}
                      required
                      value={newNotice.content}
                      onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                      placeholder="Type the full official announcement details here..."
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="urgent-box"
                      checked={newNotice.urgency === 'Urgent / Alert'}
                      onChange={(e) =>
                        setNewNotice({
                          ...newNotice,
                          urgency: e.target.checked ? 'Urgent / Alert' : 'Normal',
                        })
                      }
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                    <label htmlFor="urgent-box" className="font-bold text-rose-800 cursor-pointer">
                      Mark as URGENT (Highlights in red with alert priority)
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button
                      type="button"
                      onClick={() => setNoticeModal(false)}
                      className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold"
                    >
                      Publish Circular
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: PARENT COMPLAINT HELPDESK & SLA TRACKER */}
      {/* ============================================================ */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-rose-600" />
                <span>Parent Grievance &amp; Complaint Helpdesk SLA Tracker</span>
              </h3>
              <p className="text-slate-500 text-xs">
                Ticketed parent requests tracked against institutional 48-hour resolution SLA
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold font-mono text-[11px]">
                Target SLA: 48 Hours Max
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                <tr>
                  <th className="py-2.5 px-3">Ticket #</th>
                  <th className="py-2.5 px-3">Parent &amp; Student</th>
                  <th className="py-2.5 px-3">Subject / Issue Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Priority</th>
                  <th className="py-2.5 px-3">Assigned Officer</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-sky-800">{ticket.ticketNo}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{ticket.parentName}</div>
                      <div className="text-[11px] text-slate-500">
                        Student: {ticket.studentName} ({ticket.className})
                      </div>
                      <div className="font-mono text-[10px] text-indigo-700">{ticket.parentPhone}</div>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="font-semibold text-slate-800">{ticket.subject}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-2">{ticket.description}</div>
                      {ticket.resolutionSummary && (
                        <div className="text-[10px] text-emerald-700 italic mt-1 bg-emerald-50 p-1 rounded">
                          Resolution: {ticket.resolutionSummary}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          ticket.priority === 'Emergency'
                            ? 'bg-rose-100 text-rose-800'
                            : ticket.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{ticket.assignedTo}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center justify-center gap-1 w-28 mx-auto ${
                          ticket.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ticket.status === 'Under Investigation'
                            ? 'bg-amber-100 text-amber-800'
                            : ticket.status === 'Escalated to Principal'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {ticket.status === 'Resolved' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{ticket.status}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {ticket.status !== 'Resolved' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTicket(ticket);
                            setResolutionText('');
                          }}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-[11px] shadow-xs"
                        >
                          Resolve Ticket
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resolve Ticket Modal */}
          {activeTicket && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-300 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Resolve Ticket {activeTicket.ticketNo}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTicket(null)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="bg-slate-50 p-2.5 rounded border text-[11px]">
                    <div className="font-bold text-slate-800">{activeTicket.subject}</div>
                    <div className="text-slate-600 mt-0.5">{activeTicket.description}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Parent: {activeTicket.parentName} ({activeTicket.parentPhone})
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Resolution Actions Taken &amp; Feedback
                    </label>
                    <textarea
                      rows={3}
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="e.g. Discussed with van driver to adjust morning stop time by 5 minutes. Parent informed."
                      className="w-full p-2 border rounded text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setActiveTicket(null)}
                    className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleResolveTicket}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold"
                  >
                    Confirm &amp; Notify Parent
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

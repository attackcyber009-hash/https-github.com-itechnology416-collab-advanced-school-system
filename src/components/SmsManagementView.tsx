import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Users,
  User,
  Phone,
  FileText,
  History,
  Send,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  BookOpen
} from 'lucide-react';
import { SmsRecord, SmsTemplate } from '../types';

interface SmsManagementViewProps {
  smsHistory: SmsRecord[];
  smsTemplates: SmsTemplate[];
  onSendSms: (sms: SmsRecord) => void;
  onAddTemplate: (template: SmsTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  initialAction?: 'parents' | 'students' | 'staff' | 'specific' | 'templates' | 'history';
}

export default function SmsManagementView({
  smsHistory,
  smsTemplates,
  onSendSms,
  onAddTemplate,
  onDeleteTemplate,
  initialAction = 'parents'
}: SmsManagementViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'parents' | 'students' | 'staff' | 'specific' | 'templates' | 'history'>(initialAction);

  useEffect(() => {
    setActiveSubTab(initialAction);
  }, [initialAction]);

  // Form states
  const [parentTarget, setParentTarget] = useState<'All' | 'Class 10-A' | 'Class 9-B'>('All');
  const [studentTarget, setStudentTarget] = useState<'All' | 'Class 10-A' | 'Class 9-B'>('All');
  const [staffTarget, setStaffTarget] = useState<'All' | 'Teaching Staff' | 'Administrative Staff'>('All');
  const [specificNumber, setSpecificNumber] = useState('');
  const [specificName, setSpecificName] = useState('');

  const [smsMessage, setSmsMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  // Templates list states
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateBody, setNewTemplateBody] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<SmsTemplate['category']>('General');

  // Search in History
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');

  const handleApplyTemplate = (id: string) => {
    const tmpl = smsTemplates.find(t => t.id === id);
    if (tmpl) {
      setSmsMessage(tmpl.body);
      setSelectedTemplateId(id);
    }
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitle.trim() || !newTemplateBody.trim()) {
      alert('Please fill out both template title and body content.');
      return;
    }
    const tmpl: SmsTemplate = {
      id: `tmpl-${Date.now()}`,
      title: newTemplateTitle,
      body: newTemplateBody,
      category: newTemplateCategory
    };
    onAddTemplate(tmpl);
    setNewTemplateTitle('');
    setNewTemplateBody('');
    alert('SMS Template successfully created!');
  };

  const handleDispatchSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsMessage.trim()) {
      alert('Please provide a message body to broadcast.');
      return;
    }

    let resolvedRecipientName = '';
    let resolvedRecipientType: SmsRecord['recipientType'] = 'Parent';

    if (activeSubTab === 'parents') {
      resolvedRecipientName = parentTarget === 'All' ? 'All Registered Parents' : `${parentTarget} Parents`;
      resolvedRecipientType = 'Parent';
    } else if (activeSubTab === 'students') {
      resolvedRecipientName = studentTarget === 'All' ? 'All Enrolled Students' : `${studentTarget} Students`;
      resolvedRecipientType = 'Student';
    } else if (activeSubTab === 'staff') {
      resolvedRecipientName = staffTarget === 'All' ? 'All Registered Staff' : staffTarget;
      resolvedRecipientType = 'Staff';
    } else {
      if (!specificNumber.trim()) {
        alert('Please specify a mobile number.');
        return;
      }
      resolvedRecipientName = specificName.trim() ? `${specificName} (${specificNumber})` : specificNumber;
      resolvedRecipientType = 'Specific Number';
    }

    setIsSending(true);

    setTimeout(() => {
      const record: SmsRecord = {
        id: `sms-${Date.now()}`,
        sender: 'Super Admin',
        recipientType: resolvedRecipientType,
        recipientName: resolvedRecipientName,
        message: smsMessage,
        timestamp: new Date().toLocaleString(),
        status: 'Sent',
        gatewayResponse: 'SMS_GATEWAY_SUCCESS: OK (200)'
      };

      onSendSms(record);
      setIsSending(false);
      setSmsMessage('');
      setSpecificNumber('');
      setSpecificName('');
      setSelectedTemplateId('');
      setActiveSubTab('history');
      alert(`SMS Broadcast dispatched successfully via primary GSM carrier gateway!`);
    }, 800);
  };

  const filteredHistory = smsHistory.filter(record =>
    record.recipientName.toLowerCase().includes(searchHistoryQuery.toLowerCase()) ||
    record.message.toLowerCase().includes(searchHistoryQuery.toLowerCase())
  );

  return (
    <div id="sms-management-system" className="space-y-5 text-xs text-slate-800">
      {/* Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#002147] to-[#002147]/80 text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">Carrier SMS Gateway Broadcaster</h2>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#002147] text-amber-300 border border-amber-500/20">
                GSM SMS Gateway Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Deliver alerts, noticeboards, emergency schedules, and fee warnings directly into mobile networks worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="bg-white rounded-lg border border-slate-200 p-1 shadow-xs flex flex-wrap items-center gap-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('parents')}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            activeSubTab === 'parents' ? 'bg-[#002147] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>SMS to Parents</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('students')}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            activeSubTab === 'students' ? 'bg-[#002147] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-sky-400" />
          <span>SMS to Students</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('staff')}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            activeSubTab === 'staff' ? 'bg-[#002147] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-3.5 h-3.5 text-indigo-400" />
          <span>SMS to Staff</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('specific')}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            activeSubTab === 'specific' ? 'bg-[#002147] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>SMS to Specific Number</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('templates')}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            activeSubTab === 'templates' ? 'bg-[#002147] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span>SMS Templates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            activeSubTab === 'history' ? 'bg-[#002147] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-3.5 h-3.5 text-rose-400" />
          <span>SMS History ({smsHistory.length})</span>
        </button>
      </div>

      {/* Main Switch Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Input Forms (for Parents, Students, Staff, Specific) */}
        {['parents', 'students', 'staff', 'specific'].includes(activeSubTab) && (
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b pb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <Send className="w-4 h-4 text-[#002147]" />
                <span>Compose Cellular Broadcast Dispatch</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Configure your transmission options below. SMS messages are routed instantly over local carriers.
              </p>
            </div>

            <form onSubmit={handleDispatchSms} className="space-y-4 font-semibold text-slate-700">
              {/* Target Dropdowns */}
              {activeSubTab === 'parents' && (
                <div>
                  <label className="block mb-1">Select Parent Target Audience *</label>
                  <select
                    value={parentTarget}
                    onChange={(e) => setParentTarget(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white text-slate-800"
                  >
                    <option value="All">All Registered Parents (Broad Group)</option>
                    <option value="Class 10-A">Parents of Class 10-A</option>
                    <option value="Class 9-B">Parents of Class 9-B</option>
                  </select>
                </div>
              )}

              {activeSubTab === 'students' && (
                <div>
                  <label className="block mb-1">Select Student Target Audience *</label>
                  <select
                    value={studentTarget}
                    onChange={(e) => setStudentTarget(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white text-slate-800"
                  >
                    <option value="All">All Enrolled Students</option>
                    <option value="Class 10-A">Students of Class 10-A</option>
                    <option value="Class 9-B">Students of Class 9-B</option>
                  </select>
                </div>
              )}

              {activeSubTab === 'staff' && (
                <div>
                  <label className="block mb-1">Select Staff Target Group *</label>
                  <select
                    value={staffTarget}
                    onChange={(e) => setStaffTarget(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white text-slate-800"
                  >
                    <option value="All">All Institutional Staff</option>
                    <option value="Teaching Staff">Teaching Staff Only</option>
                    <option value="Administrative Staff">Administrative &amp; General Support</option>
                  </select>
                </div>
              )}

              {activeSubTab === 'specific' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Phone Number * (Include Country Prefix)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +923001234567"
                      value={specificNumber}
                      onChange={(e) => setSpecificNumber(e.target.value)}
                      className="w-full p-2 border rounded font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Recipient Reference Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq Mahmood"
                      value={specificName}
                      onChange={(e) => setSpecificName(e.target.value)}
                      className="w-full p-2 border rounded font-medium text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Template Quick Selection */}
              <div>
                <label className="block mb-1">Inject Pre-defined SMS Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleApplyTemplate(e.target.value)}
                  className="w-full p-2 border rounded bg-white text-slate-800 font-medium"
                >
                  <option value="">-- Click to select template --</option>
                  {smsTemplates.map(tmpl => (
                    <option key={tmpl.id} value={tmpl.id}>
                      [{tmpl.category}] {tmpl.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* SMS Text Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold">SMS Body Text *</label>
                  <span className={`text-[10px] ${smsMessage.length > 160 ? 'text-amber-600' : 'text-slate-400'}`}>
                    Characters: {smsMessage.length} ({Math.ceil(smsMessage.length / 160)} SMS parts)
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter message here. SMS segments exceeding 160 characters are combined automatically by carrier routing nodes."
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full p-2 border rounded font-medium text-slate-800 outline-none"
                />
              </div>

              {isSending && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-950 font-bold text-center animate-pulse">
                  Gateway is packaging text payloads and establishing trunk handshakes...
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2 bg-indigo-950 hover:bg-slate-900 text-white rounded font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Broadcast GSM Message</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* RIGHT COLUMN / SIDE HELP: SMS Policy Guidance for sending screens */}
        {['parents', 'students', 'staff', 'specific'].includes(activeSubTab) && (
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>GSM Gateway Broadcast Policy</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Cellular broadcasts bypass device silent flags. Ensure that templates strictly conform to PTA regulations and institutional protocols to mitigate spam categorization triggers on network operators.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[10px]">
                <li>General broadcasts are dispatched between 8:00 AM and 8:00 PM.</li>
                <li>Emergency alarms and security closures bypass timing windows.</li>
                <li>Each text segment carries up to 160 standard GSM-7 characters.</li>
              </ul>
            </div>

            {/* Template previews */}
            <div className="bg-white rounded-xl border p-4 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-800 border-b pb-1.5">Quick Copy Template Reference</h4>
              <div className="space-y-2 text-[11px]">
                {smsTemplates.slice(0, 3).map(tmpl => (
                  <div key={tmpl.id} className="p-2 bg-slate-50 border rounded hover:bg-slate-100 transition">
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>{tmpl.title}</span>
                      <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded">{tmpl.category}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{tmpl.body}</p>
                    <button
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl.id)}
                      className="text-[9px] text-[#002147] font-bold underline mt-1 cursor-pointer block"
                    >
                      Apply Template content
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW: SMS TEMPLATES                     */}
        {/* ======================================= */}
        {activeSubTab === 'templates' && (
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Create new template form */}
            <div className="md:col-span-5 bg-white rounded-xl border p-5 shadow-xs space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>Create SMS Template</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Save reusable text layouts for recurrent attendance reports, emergency events, or payment deadlines.
                </p>
              </div>

              <form onSubmit={handleCreateTemplate} className="space-y-3 font-semibold text-slate-700">
                <div>
                  <label className="block mb-1">Template Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Absence Alert Warning"
                    value={newTemplateTitle}
                    onChange={(e) => setNewTemplateTitle(e.target.value)}
                    className="w-full p-2 border rounded font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block mb-1">Select Category *</label>
                  <select
                    value={newTemplateCategory}
                    onChange={(e) => setNewTemplateCategory(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white text-slate-800 font-medium cursor-pointer"
                  >
                    <option value="General">General Broadcast</option>
                    <option value="Attendance">Attendance Reports</option>
                    <option value="Fee Reminder">Fee Reminder Notification</option>
                    <option value="Exam Result">Exam &amp; Test Results</option>
                    <option value="Emergency">Emergency Closures</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Template Body Text *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="e.g. Dear Parent, student {student_name} was found absent on {date}. Kindly verify reason."
                    value={newTemplateBody}
                    onChange={(e) => setNewTemplateBody(e.target.value)}
                    className="w-full p-2 border rounded font-medium text-slate-800 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs transition cursor-pointer"
                >
                  Save SMS Template
                </button>
              </form>
            </div>

            {/* Current templates list */}
            <div className="md:col-span-7 bg-white rounded-xl border p-5 shadow-xs space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>Manage Templates Library</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Quick audit, edit, or removal of pre-approved cellular broadcast layouts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {smsTemplates.map(tmpl => (
                  <div key={tmpl.id} className="p-3 bg-slate-50 border rounded-lg hover:border-slate-300 transition space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between font-black text-slate-800 border-b pb-1">
                        <span>{tmpl.title}</span>
                        <span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                          {tmpl.category}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-600 mt-2 whitespace-pre-wrap">{tmpl.body}</p>
                    </div>
                    <div className="text-right pt-2 border-t mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Delete this template?')) onDeleteTemplate(tmpl.id);
                        }}
                        className="text-[10px] text-rose-600 font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Template</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW: SMS HISTORY                       */}
        {/* ======================================= */}
        {activeSubTab === 'history' && (
          <div className="lg:col-span-12 bg-white rounded-xl border shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <History className="w-4 h-4 text-[#002147]" />
                <span>SMS Transmission Logs Gateway Outbox</span>
              </h3>

              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchHistoryQuery}
                  onChange={(e) => setSearchHistoryQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg bg-slate-100 text-xs focus:bg-white outline-none"
                />
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <History className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-bold">No SMS records found matching current query</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-3">Reference ID</th>
                      <th className="p-3">Sender Unit</th>
                      <th className="p-3">Target / Recipient</th>
                      <th className="p-3">Message Body Packet</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Transmission Result</th>
                      <th className="p-3 text-right">Gateway Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredHistory.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-slate-400 text-[10px]">{log.id}</td>
                        <td className="p-3 text-slate-500 font-bold">{log.sender}</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase mr-1.5 ${
                            log.recipientType === 'Parent' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            log.recipientType === 'Student' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                            log.recipientType === 'Staff' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {log.recipientType}
                          </span>
                          <span className="font-bold text-slate-800">{log.recipientName}</span>
                        </td>
                        <td className="p-3 max-w-sm">
                          <p className="whitespace-pre-line text-slate-600 line-clamp-2" title={log.message}>
                            {log.message}
                          </p>
                        </td>
                        <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 w-max ${
                            log.status === 'Sent' || log.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {log.status === 'Sent' || log.status === 'Delivered' ? (
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <XCircle className="w-3 h-3 text-rose-600" />
                            )}
                            <span>{log.status}</span>
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono text-slate-400 text-[10px]">{log.gatewayResponse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  Users,
  User,
  History,
  Send,
  CheckCircle,
  XCircle,
  Search,
  BellRing,
  AlertCircle
} from 'lucide-react';
import { MobileNotificationRecord } from '../types';

interface MobileNotificationsViewProps {
  notificationHistory: MobileNotificationRecord[];
  onSendNotification: (notification: MobileNotificationRecord) => void;
  initialAction?: 'parents' | 'staff' | 'students' | 'history';
}

export default function MobileNotificationsView({
  notificationHistory,
  onSendNotification,
  initialAction = 'parents'
}: MobileNotificationsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'parents' | 'staff' | 'students' | 'history'>(initialAction);

  useEffect(() => {
    setActiveSubTab(initialAction);
  }, [initialAction]);

  // Form states
  const [targetGroup, setTargetGroup] = useState<'All' | 'Class 10-A' | 'Class 9-B' | 'Teaching Staff' | 'Administrative Staff'>('All');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Search History
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationTitle.trim() || !notificationBody.trim()) {
      alert('Please fill out both notification title and message body.');
      return;
    }

    let resolvedRecipientType: MobileNotificationRecord['recipientType'] = 'Parent';
    let resolvedRecipientName = '';

    if (activeSubTab === 'parents') {
      resolvedRecipientType = 'Parent';
      resolvedRecipientName = targetGroup === 'All' ? 'All Registered Parents' : `Parents of ${targetGroup}`;
    } else if (activeSubTab === 'staff') {
      resolvedRecipientType = 'Staff';
      resolvedRecipientName = targetGroup === 'All' ? 'All Institutional Staff' : targetGroup;
    } else {
      resolvedRecipientType = 'Student';
      resolvedRecipientName = targetGroup === 'All' ? 'All Enrolled Students' : `Students of ${targetGroup}`;
    }

    setIsSending(true);

    setTimeout(() => {
      const record: MobileNotificationRecord = {
        id: `notif-${Date.now()}`,
        recipientType: resolvedRecipientType,
        recipientName: resolvedRecipientName,
        title: notificationTitle,
        body: notificationBody,
        timestamp: new Date().toLocaleString(),
        status: 'Delivered'
      };

      onSendNotification(record);
      setIsSending(false);
      setNotificationTitle('');
      setNotificationBody('');
      setActiveSubTab('history');
      alert('FCM push notification broadcast dispatched successfully!');
    }, 700);
  };

  const filteredHistory = notificationHistory.filter(record =>
    record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="mobile-notification-system" className="space-y-5 text-xs text-slate-800">
      {/* Header Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#002147] to-[#002147]/80 text-white flex items-center justify-center shadow-xs">
            <Bell className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">FCM Push Notification Broadcaster</h2>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#002147] text-rose-300 border border-rose-500/20">
                Push Gateway Online
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Transmit system notices, class events, calendar schedules and urgent announcements to iOS &amp; Android student/parent app shells.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-1 shadow-xs flex flex-wrap items-center gap-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => {
            setActiveSubTab('parents');
            setTargetGroup('All');
          }}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            activeSubTab === 'parents' ? 'bg-[#002147] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-rose-400" />
          <span>Notifications to Parent</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('staff');
            setTargetGroup('All');
          }}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            activeSubTab === 'staff' ? 'bg-[#002147] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-3.5 h-3.5 text-sky-400" />
          <span>Notifications to Staff</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('students');
            setTargetGroup('All');
          }}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            activeSubTab === 'students' ? 'bg-[#002147] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>Notifications to Students</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            activeSubTab === 'history' ? 'bg-[#002147] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-3.5 h-3.5 text-[#002147]" />
          <span>Send Notifications History ({notificationHistory.length})</span>
        </button>
      </div>

      {/* Main Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Editor Form */}
        {['parents', 'staff', 'students'].includes(activeSubTab) && (
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b pb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <BellRing className="w-4 h-4 text-rose-500" />
                <span>Create Mobile App Push Notification</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Configure push details. Upon dispatch, Google Firebase Cloud Messaging (FCM) routes payload packets instantly.
              </p>
            </div>

            <form onSubmit={handleSendNotificationSubmit} className="space-y-4 font-semibold text-slate-700">
              {/* Target Dropdown */}
              <div>
                <label className="block mb-1">Target Group *</label>
                {activeSubTab === 'parents' && (
                  <select
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white text-slate-800"
                  >
                    <option value="All">All Connected Parents</option>
                    <option value="Class 10-A">Parents of Class 10-A</option>
                    <option value="Class 9-B">Parents of Class 9-B</option>
                  </select>
                )}

                {activeSubTab === 'staff' && (
                  <select
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white text-slate-800"
                  >
                    <option value="All">All Institutional Staff</option>
                    <option value="Teaching Staff">Teaching Staff Only</option>
                    <option value="Administrative Staff">Administrative Staff Only</option>
                  </select>
                )}

                {activeSubTab === 'students' && (
                  <select
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white text-slate-800"
                  >
                    <option value="All">All Enrolled Students</option>
                    <option value="Class 10-A">Students of Class 10-A</option>
                    <option value="Class 9-B">Students of Class 9-B</option>
                  </select>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block mb-1">Notification Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dynamic Exam Reschedule Notification"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  className="w-full p-2 border rounded font-medium text-slate-800"
                />
              </div>

              {/* Message Body */}
              <div>
                <label className="block mb-1">Notification Body Content *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type the message body here. Keep it concise as mobile screens have limited display width."
                  value={notificationBody}
                  onChange={(e) => setNotificationBody(e.target.value)}
                  className="w-full p-2 border rounded font-medium text-slate-800 outline-none"
                />
              </div>

              {isSending && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded text-rose-950 font-bold text-center animate-pulse">
                  Establishing handshake with Firebase Cloud Messaging API endpoints...
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2 bg-[#002147] hover:bg-slate-900 text-white rounded font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-rose-400" />
                  <span>Transmit App Push Notification</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* RIGHT COLUMN: App Preview / Info Card */}
        {['parents', 'staff', 'students'].includes(activeSubTab) && (
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#002147]/5 border border-[#002147]/20 rounded-xl p-4 text-slate-700 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#002147]">
                <AlertCircle className="w-4 h-4 text-[#002147] shrink-0" />
                <span>Mobile Shell Notification Preview</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Behold the mock rendering format below to visualize how the push announcement will align inside user device system notification drawers:
              </p>

              {/* Simulated Device Notification Card */}
              <div className="bg-white rounded-lg p-3.5 border shadow-sm space-y-1 mt-2 font-sans">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-[#002147] rounded flex items-center justify-center">
                      <span className="text-[7px] text-white font-extrabold font-mono">E</span>
                    </div>
                    <span className="font-bold text-[#002147]">THE EDUCATORS APP</span>
                  </div>
                  <span>just now</span>
                </div>
                <h4 className="font-bold text-slate-800 text-[11px] mt-1">
                  {notificationTitle || 'System Notification Header'}
                </h4>
                <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                  {notificationBody || 'Announcements and system updates will stream into this segment dynamically in real-time...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW: SEND NOTIFICATIONS HISTORY         */}
        {/* ======================================= */}
        {activeSubTab === 'history' && (
          <div className="lg:col-span-12 bg-white rounded-xl border shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <History className="w-4 h-4 text-rose-500" />
                <span>Push Notification Outbox Logs</span>
              </h3>

              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg bg-slate-100 text-xs focus:bg-white outline-none"
                />
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Bell className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
                <p className="font-bold">No mobile notifications recorded in current outbox log</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-3">Notification ID</th>
                      <th className="p-3">Target Audience Group</th>
                      <th className="p-3">Heading / Title</th>
                      <th className="p-3">Body Content Payload</th>
                      <th className="p-3">Sent Date &amp; Time</th>
                      <th className="p-3 text-right">FCM Delivery Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredHistory.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-slate-400 text-[10px]">{log.id}</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase mr-1.5 ${
                            log.recipientType === 'Parent' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            log.recipientType === 'Student' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                            'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {log.recipientType}
                          </span>
                          <span className="font-bold text-slate-800">{log.recipientName}</span>
                        </td>
                        <td className="p-3 font-bold text-slate-900">{log.title}</td>
                        <td className="p-3 max-w-sm">
                          <p className="whitespace-pre-line text-slate-600 line-clamp-2" title={log.body}>
                            {log.body}
                          </p>
                        </td>
                        <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                        <td className="p-3 text-right">
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>{log.status}</span>
                          </span>
                        </td>
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

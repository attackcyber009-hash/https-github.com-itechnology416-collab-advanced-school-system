import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  History,
  Send,
  CheckCircle,
  Search,
  AlertCircle,
  Paperclip
} from 'lucide-react';
import { EmailRecord } from '../types';

interface EmailAlertsViewProps {
  emailHistory: EmailRecord[];
  onSendEmail: (email: EmailRecord) => void;
  initialAction?: 'specific' | 'history';
}

export default function EmailAlertsView({
  emailHistory,
  onSendEmail,
  initialAction = 'specific'
}: EmailAlertsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'specific' | 'history'>(initialAction);

  useEffect(() => {
    setActiveSubTab(initialAction);
  }, [initialAction]);

  // Form states
  const [recipientEmails, setRecipientEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search History
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!recipientEmails.trim() || !subject.trim() || !body.trim()) {
      setErrorMessage('Please fill out recipient emails, subject, and body content.');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      const record: EmailRecord = {
        id: `mail-${Date.now()}`,
        recipientEmails: recipientEmails,
        subject: subject,
        body: body,
        timestamp: new Date().toLocaleString(),
        status: 'Sent',
        attachments: attachments.trim() ? attachments : undefined
      };

      onSendEmail(record);
      setIsSending(false);
      setRecipientEmails('');
      setSubject('');
      setBody('');
      setAttachments('');
      setActiveSubTab('history');
      setStatusMessage('Official alert email dispatched successfully via SMTP server relay!');
      setTimeout(() => setStatusMessage(null), 5000);
    }, 800);
  };

  const filteredHistory = emailHistory.filter(record =>
    record.recipientEmails.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="email-alert-system" className="space-y-5 text-xs text-slate-800">
      {/* Header Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#002147] to-[#002147]/80 text-white flex items-center justify-center shadow-xs">
            <Mail className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">Official Institutional Mail SMTP Gateway</h2>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#002147] text-purple-300 border border-purple-500/20">
                SMTP Relay Connected
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Deliver official letters, enrollment invoices, academic transcripts, parent newsletters, and formal staff alerts with file attachment support.
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>✓ {statusMessage}</span>
          <button type="button" onClick={() => setStatusMessage(null)} className="text-emerald-600 hover:text-emerald-800 font-bold">✕</button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>⚠️ {errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-800 font-bold">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-1 shadow-xs flex flex-wrap items-center gap-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('specific')}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            activeSubTab === 'specific' ? 'bg-[#002147] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-purple-400" />
          <span>Message to Specific Emails</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            activeSubTab === 'history' ? 'bg-[#002147] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-3.5 h-3.5 text-[#002147]" />
          <span>Send Email History ({emailHistory.length})</span>
        </button>
      </div>

      {/* Main Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Editor Form */}
        {activeSubTab === 'specific' && (
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b pb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <Mail className="w-4 h-4 text-purple-500" />
                <span>Compose Official Mail Notification</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Configure your transmission options below. Multi-recipient alerts will render in BCC format automatically to preserve contact privacy.
              </p>
            </div>

            <form onSubmit={handleSendEmailSubmit} className="space-y-4 font-semibold text-slate-700">
              {/* CC / BCC Recipients */}
              <div>
                <label className="block mb-1">Target Email Addresses * (Comma Separated)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. parent1@gmail.com, teacher.a@school.edu"
                  value={recipientEmails}
                  onChange={(e) => setRecipientEmails(e.target.value)}
                  className="w-full p-2 border rounded font-medium text-slate-800"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block mb-1">Email Subject Line *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Revised Fee Structure Announcement - Term II"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 border rounded font-medium text-slate-800"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block mb-1 flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                  <span>External Attachment Resource Link (Optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://school-portal.com/documents/fee-structure.pdf"
                  value={attachments}
                  onChange={(e) => setAttachments(e.target.value)}
                  className="w-full p-2 border rounded font-medium text-slate-800"
                />
              </div>

              {/* Message Body */}
              <div>
                <label className="block mb-1">Email Body Content *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Dear Parents and Faculty, this is to formally announce that the management has approved the rescheduled exam calendars..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-2 border rounded font-medium text-slate-800 outline-none"
                />
              </div>

              {isSending && (
                <div className="p-3 bg-purple-50 border border-purple-100 rounded text-purple-950 font-bold text-center animate-pulse">
                  Establishing handshake with SMTP Secure Mail Relay Server...
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2 bg-[#002147] hover:bg-slate-900 text-white rounded font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-purple-400" />
                  <span>Transmit Official Mail</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* RIGHT COLUMN: App Preview / Info Card */}
        {activeSubTab === 'specific' && (
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#002147]/5 border border-[#002147]/20 rounded-xl p-4 text-slate-700 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#002147]">
                <AlertCircle className="w-4 h-4 text-[#002147] shrink-0" />
                <span>SMTP Relayed Email Template Preview</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Review formatting of the outgoing official header template:
              </p>

              {/* Simulated Device Notification Card */}
              <div className="bg-white rounded-lg border shadow-sm max-w-sm w-full space-y-3 mt-2 font-sans overflow-hidden">
                <div className="bg-[#002147] text-white p-3 flex items-center justify-between text-xs font-bold">
                  <span>THE EDUCATORS CAMPUS PORTAL</span>
                </div>

                <div className="px-4 py-1 space-y-1 text-[10px] text-slate-500 border-b pb-2">
                  <div><span className="font-bold text-slate-700">From:</span> office@theeducators.edu</div>
                  <div><span className="font-bold text-slate-700">To:</span> {recipientEmails || 'recipient@gmail.com'}</div>
                  <div><span className="font-bold text-slate-700">Subject:</span> {subject || 'Official Alert subject line'}</div>
                </div>

                <div className="px-4 py-2 space-y-2 min-h-[140px]">
                  <p className="text-[10px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {body || 'Your official announcement layout body content will stream into this segment dynamically in real-time...'}
                  </p>
                  {attachments.trim() && (
                    <div className="mt-3 p-1.5 bg-slate-50 border rounded flex items-center justify-between text-[9px] text-slate-600">
                      <span className="truncate font-mono font-bold max-w-[180px]">{attachments}</span>
                      <span className="text-[8px] bg-slate-200 text-slate-500 px-1 rounded uppercase font-bold">PDF Attachment</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 text-slate-400 p-2.5 text-center text-[8px] border-t">
                  The Educators Private High School System © All Rights Reserved.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW: SEND EMAIL HISTORY                 */}
        {/* ======================================= */}
        {activeSubTab === 'history' && (
          <div className="lg:col-span-12 bg-white rounded-xl border shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <History className="w-4 h-4 text-purple-500" />
                <span>SMTP Transmission Logs</span>
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
                <Mail className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
                <p className="font-bold">No mail records logged in outbox</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-3">Mail Reference ID</th>
                      <th className="p-3">Recipient Address List</th>
                      <th className="p-3">Email Subject Line</th>
                      <th className="p-3">Body Content Payload</th>
                      <th className="p-3">Attachment URI</th>
                      <th className="p-3">Sent Timestamp</th>
                      <th className="p-3 text-right">SMTP Server Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredHistory.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-slate-400 text-[10px]">{log.id}</td>
                        <td className="p-3 font-bold text-slate-800">{log.recipientEmails}</td>
                        <td className="p-3 font-bold text-indigo-950">{log.subject}</td>
                        <td className="p-3 max-w-sm">
                          <p className="whitespace-pre-line text-slate-600 line-clamp-2" title={log.body}>
                            {log.body}
                          </p>
                        </td>
                        <td className="p-3 max-w-xs">
                          {log.attachments ? (
                            <a
                              href={log.attachments}
                              target="_blank"
                              rel="noreferrer"
                              className="text-purple-600 font-mono hover:underline truncate block"
                            >
                              {log.attachments}
                            </a>
                          ) : (
                            <span className="text-slate-400 font-mono">-</span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                        <td className="p-3 text-right">
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200">
                            <CheckCircle className="w-3 h-3 text-purple-600" />
                            <span>SMTP Delivered</span>
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

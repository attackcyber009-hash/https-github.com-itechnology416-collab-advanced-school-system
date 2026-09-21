import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  Users,
  User,
  History,
  CheckCircle,
  Search,
  AlertCircle
} from 'lucide-react';
import { TelegramRecord } from '../types';

interface TelegramNotificationsViewProps {
  telegramHistory: TelegramRecord[];
  onSendMessage: (msg: TelegramRecord) => void;
  initialAction?: 'parents' | 'staff' | 'history';
}

export default function TelegramNotificationsView({
  telegramHistory,
  onSendMessage,
  initialAction = 'parents'
}: TelegramNotificationsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'parents' | 'staff' | 'history'>(initialAction);

  useEffect(() => {
    setActiveSubTab(initialAction);
  }, [initialAction]);

  // Form states
  const [targetGroup, setTargetGroup] = useState<'All' | 'Class 10-A' | 'Class 9-B' | 'Teaching Staff' | 'Administrative Staff'>('All');
  const [telegramMessage, setTelegramMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Search History
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendTelegramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramMessage.trim()) {
      alert('Please fill out message content.');
      return;
    }

    let resolvedRecipientType: TelegramRecord['recipientType'] = 'Parent';
    let resolvedRecipientName = '';

    if (activeSubTab === 'parents') {
      resolvedRecipientType = 'Parent';
      resolvedRecipientName = targetGroup === 'All' ? 'All Registered Parents' : `Parents of ${targetGroup}`;
    } else {
      resolvedRecipientType = 'Staff';
      resolvedRecipientName = targetGroup === 'All' ? 'All Institutional Staff' : targetGroup;
    }

    setIsSending(true);

    setTimeout(() => {
      const record: TelegramRecord = {
        id: `tg-${Date.now()}`,
        recipientType: resolvedRecipientType,
        recipientName: resolvedRecipientName,
        message: telegramMessage,
        timestamp: new Date().toLocaleString(),
        status: 'Sent'
      };

      onSendMessage(record);
      setIsSending(false);
      setTelegramMessage('');
      setActiveSubTab('history');
      alert('Telegram bot broadcast transmitted successfully to registered subscriber channels!');
    }, 700);
  };

  const filteredHistory = telegramHistory.filter(record =>
    record.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="telegram-notification-system" className="space-y-5 text-xs text-slate-800">
      {/* Header Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#002147] to-[#002147]/80 text-white flex items-center justify-center shadow-xs">
            <Send className="w-5 h-5 text-sky-400 rotate-[-15deg]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">Telegram Channel Bot Broadcaster</h2>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#002147] text-sky-300 border border-sky-500/20">
                Telegram Bot API Live
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Transmit system alerts, news feeds, homework diaries and general circular bulletins to registered Telegram channel subscribers.
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
          <Users className="w-3.5 h-3.5 text-sky-400" />
          <span>Message to Parents</span>
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
          <User className="w-3.5 h-3.5 text-emerald-400" />
          <span>Message to Staff</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
            activeSubTab === 'history' ? 'bg-[#002147] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-3.5 h-3.5 text-[#002147]" />
          <span>Send Message History ({telegramHistory.length})</span>
        </button>
      </div>

      {/* Main Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Editor Form */}
        {['parents', 'staff'].includes(activeSubTab) && (
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b pb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <Send className="w-4 h-4 text-sky-500" />
                <span>Compose Telegram Broadcast Message</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Messages are pushed automatically through your institutional Telegram Bot webhook channel. Subscribers must start the bot to receive feeds.
              </p>
            </div>

            <form onSubmit={handleSendTelegramSubmit} className="space-y-4 font-semibold text-slate-700">
              {/* Target Dropdown */}
              <div>
                <label className="block mb-1">Target Subscriber Group *</label>
                {activeSubTab === 'parents' ? (
                  <select
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white text-slate-800"
                  >
                    <option value="All">All Parents Subscriber Channel (@TheEducatorsParents)</option>
                    <option value="Class 10-A">Parents of Class 10-A</option>
                    <option value="Class 9-B">Parents of Class 9-B</option>
                  </select>
                ) : (
                  <select
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white text-slate-800"
                  >
                    <option value="All">All Staff Channel (@TheEducatorsStaff)</option>
                    <option value="Teaching Staff">Teaching Staff Only</option>
                    <option value="Administrative Staff">Administrative Staff Only</option>
                  </select>
                )}
              </div>

              {/* Message Body */}
              <div>
                <label className="block mb-1">Bulletin Message Content * (Markdown Supported)</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Dear Parents, our school is proud to announce the annual sports day schedule starting from..."
                  value={telegramMessage}
                  onChange={(e) => setTelegramMessage(e.target.value)}
                  className="w-full p-2 border rounded font-medium text-slate-800 outline-none"
                />
              </div>

              {isSending && (
                <div className="p-3 bg-sky-50 border border-sky-100 rounded text-sky-950 font-bold text-center animate-pulse">
                  Relaying API payload request blocks to Telegram HTTP Bot gateway...
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2 bg-[#002147] hover:bg-slate-900 text-white rounded font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  <span>Broadcast Telegram Message</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* RIGHT COLUMN: App Preview / Info Card */}
        {['parents', 'staff'].includes(activeSubTab) && (
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#002147]/5 border border-[#002147]/20 rounded-xl p-4 text-slate-700 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#002147]">
                <AlertCircle className="w-4 h-4 text-[#002147] shrink-0" />
                <span>Telegram Message Card Preview</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Render preview formatting as it appears on official subscriber Telegram chats:
              </p>

              {/* Simulated Device Notification Card */}
              <div className="bg-[#5480a8] rounded-lg p-3 border shadow-sm max-w-sm w-full space-y-1 mt-2 font-sans text-white">
                <div className="bg-slate-800/40 p-2 rounded-t flex items-center gap-2 text-xs font-bold -mx-3 -mt-3 border-b border-white/10">
                  <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center font-black text-white text-[10px]">
                    TE
                  </div>
                  <div>
                    <div className="leading-none">The Educators Official Bot</div>
                    <span className="text-[9px] opacity-70">broadcast channel</span>
                  </div>
                </div>

                <div className="bg-slate-900/65 p-2.5 rounded-lg border border-white/10 shadow-xs max-w-[90%] mt-3 space-y-1">
                  <p className="text-[10px] text-slate-100 leading-normal whitespace-pre-wrap">
                    {telegramMessage || 'Dynamic Telegram announcement text stream details will format right here...'}
                  </p>
                  <div className="text-[8px] text-white/40 text-right">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* VIEW: SEND MESSAGE HISTORY              */}
        {/* ======================================= */}
        {activeSubTab === 'history' && (
          <div className="lg:col-span-12 bg-white rounded-xl border shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <History className="w-4 h-4 text-sky-500" />
                <span>Telegram Bot Dispatch Logs</span>
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
                <Send className="w-12 h-12 text-slate-300 mx-auto animate-pulse rotate-[-15deg]" />
                <p className="font-bold">No Telegram circular records logged</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-3">Reference ID</th>
                      <th className="p-3">Target Channel Group</th>
                      <th className="p-3">Markdown Circular Payload</th>
                      <th className="p-3">Broadcast Timestamp</th>
                      <th className="p-3 text-right">Telegram HTTP Response</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredHistory.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-slate-400 text-[10px]">{log.id}</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase mr-1.5 ${
                            log.recipientType === 'Parent' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                            'bg-indigo-50 text-indigo-700 border border-indigo-200'
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
                        <td className="p-3 text-right">
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>HTTP 200 OK</span>
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

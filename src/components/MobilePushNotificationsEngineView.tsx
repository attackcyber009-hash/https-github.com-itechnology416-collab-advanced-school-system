import React, { useState } from 'react';
import {
  Bell,
  Smartphone,
  Send,
  CheckCircle2,
  Users,
  AlertTriangle,
  Sparkles,
  Radio,
  Sliders,
  Settings,
  ShieldCheck,
  RefreshCw,
  Clock,
  Eye,
  Key,
  Layers,
} from 'lucide-react';
import { ClassInfo } from '../types';

interface MobilePushNotificationsEngineViewProps {
  classes?: ClassInfo[];
}

export default function MobilePushNotificationsEngineView({
  classes = [],
}: MobilePushNotificationsEngineViewProps) {
  const [activeTab, setActiveTab] = useState<'composer' | 'templates' | 'subscribers' | 'vapid_config'>('composer');

  // Push Broadcast state
  const [targetAudience, setTargetAudience] = useState<'all' | 'parents' | 'students' | 'staff' | 'specific_class'>('parents');
  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || 'Class 9');
  const [pushTitle, setPushTitle] = useState('Urgent: Heavy Rainfall School Advisory');
  const [pushBody, setPushBody] = useState('Due to heavy monsoon rainfall and district administration alerts, the school campus will observe an emergency closure tomorrow. Online classes will commence at 09:00 AM.');
  const [pushPriority, setPushPriority] = useState<'high' | 'normal'>('high');
  const [actionButtonText, setActionButtonText] = useState('Open School Portal');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // VAPID & Service Worker config
  const [vapidConfig, setVapidConfig] = useState({
    publicKey: 'BK8x9_01_a98eJkLoP92834019283401928340192834019283401928340192834',
    fcmSenderId: '1098234019283',
    serviceWorkerStatus: 'Active (sw.js v2.4.0)',
    totalSubscribedTokens: 1482,
    iosDevices: 580,
    androidDevices: 742,
    desktopPwa: 160,
  });

  const handleApplyTemplate = (title: string, body: string, btn: string) => {
    setPushTitle(title);
    setPushBody(body);
    setActionButtonText(btn);
    setActiveTab('composer');
  };

  const handleBroadcastPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle || !pushBody) {
      alert('Please provide notification title and message body.');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 4000);
      alert(`Web Push Broadcast dispatched to ${vapidConfig.totalSubscribedTokens} registered mobile & PWA devices!`);
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-pink-900 to-slate-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-400 text-rose-950 uppercase tracking-wide">
                PWA Web Push Engine
              </span>
              <span className="text-xs bg-white/15 px-2 py-0.5 rounded border border-white/20 text-rose-100 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-rose-300" />
                VAPID Web Push &bull; iOS &bull; Android &bull; FCM Service Worker
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Mobile Push Notifications Engine
            </h1>
            <p className="text-rose-100 text-xs mt-1 max-w-2xl">
              Dispatch instant lock-screen mobile push notifications to parents, teachers, and students without requiring app store downloads.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/30 p-2.5 rounded-xl border border-white/15 text-xs text-rose-100">
            <div>
              <div className="text-[10px] text-rose-300 font-bold uppercase">Subscribed Devices</div>
              <div className="text-lg font-black text-white">{vapidConfig.totalSubscribedTokens.toLocaleString()}</div>
            </div>
            <div className="h-7 w-px bg-white/20"></div>
            <div>
              <div className="text-[10px] text-emerald-300 font-bold uppercase">Delivery Rate</div>
              <div className="text-lg font-black text-emerald-400">99.8%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 pt-2 rounded-t-xl">
        <div className="flex gap-2">
          {[
            { id: 'composer', label: 'Push Broadcast Composer', icon: Send },
            { id: 'templates', label: 'Trigger Presets & Automated Templates', icon: Layers },
            { id: 'subscribers', label: 'Device Registry & Analytics', icon: Smartphone },
            { id: 'vapid_config', label: 'VAPID & FCM Key Settings', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'border-rose-600 text-rose-700 bg-rose-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: PUSH BROADCAST COMPOSER & SMARTPHONE PREVIEW */}
      {activeTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Composer Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Send className="w-4 h-4 text-rose-600" />
              <span>Compose Real-Time Push Notification</span>
            </h3>

            <form onSubmit={handleBroadcastPush} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Audience</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'parents', label: 'All Parents' },
                    { id: 'students', label: 'All Students' },
                    { id: 'staff', label: 'Faculty & Staff' },
                    { id: 'specific_class', label: 'Specific Class' },
                  ].map((aud) => (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => setTargetAudience(aud.id as any)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        targetAudience === aud.id
                          ? 'border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-rose-400'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      {aud.label}
                    </button>
                  ))}
                </div>
              </div>

              {targetAudience === 'specific_class' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Target Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notification Title</label>
                <input
                  type="text"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  placeholder="e.g. Daily Attendance Alert"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notification Message Body</label>
                <textarea
                  rows={4}
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                  placeholder="Type message content..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Action Button Text</label>
                  <input
                    type="text"
                    value={actionButtonText}
                    onChange={(e) => setActionButtonText(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Priority</label>
                  <select
                    value={pushPriority}
                    onChange={(e) => setPushPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  >
                    <option value="high">High (Wake Device Instantly)</option>
                    <option value="normal">Normal (Standard Battery Safe)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Broadcasting to Web Push Relays...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Broadcast Web Push Notification Instantly</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Smartphone Lock-Screen Preview */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-rose-600" />
              <span>Mobile Device Lock-Screen Preview</span>
            </h3>

            {/* Mock Smartphone Frame */}
            <div className="w-full max-w-[320px] mx-auto bg-slate-950 rounded-[36px] p-3 shadow-2xl border-4 border-slate-800 relative">
              {/* Speaker & Camera Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3"></div>

              {/* Phone Screen Canvas */}
              <div className="h-[400px] bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 rounded-[24px] p-3.5 text-white flex flex-col justify-between relative overflow-hidden">
                {/* Clock on Lockscreen */}
                <div className="text-center pt-2 space-y-0.5">
                  <div className="text-3xl font-light tracking-tight font-sans">11:46</div>
                  <div className="text-[11px] text-slate-300 font-medium">Monday, September 21</div>
                </div>

                {/* Floating Push Notification Banner */}
                <div className="bg-white/20 backdrop-blur-md border border-white/25 rounded-2xl p-3 text-white shadow-xl space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between text-[11px] text-slate-200">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="w-4 h-4 rounded bg-rose-600 text-white flex items-center justify-center text-[9px] font-black">
                        E
                      </span>
                      <span>The Educators</span>
                    </div>
                    <span className="text-[10px] text-slate-300">now</span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-white">{pushTitle || 'Notification Title'}</h5>
                    <p className="text-[11px] text-slate-200 leading-snug line-clamp-3 mt-0.5">
                      {pushBody || 'Notification body text will appear here.'}
                    </p>
                  </div>

                  {actionButtonText && (
                    <div className="pt-1.5 border-t border-white/15 flex justify-end">
                      <button
                        type="button"
                        className="px-2.5 py-1 bg-white/30 hover:bg-white/40 text-white text-[10px] font-bold rounded-lg transition"
                      >
                        {actionButtonText}
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Torch & Camera Shortcuts */}
                <div className="flex justify-between items-center px-4 pb-1">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs">🔦</div>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs">📷</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRIGGER PRESETS & AUTOMATED TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">High-Impact School Trigger Presets</h3>
            <p className="text-xs text-slate-500">
              Click any pre-configured automated template to populate the broadcast composer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              {
                title: 'Student Absence Alert',
                body: 'Dear Parent, your child [Student Name] was marked ABSENT today during morning roll call. Please contact the administration if this is an error.',
                btn: 'View Attendance',
                tag: 'Daily Attendance Trigger',
                color: 'border-rose-200 bg-rose-50/50',
              },
              {
                title: 'Fee Voucher Due Date Reminder',
                body: 'Dear Parent, the monthly tuition fee voucher for [Student Name] (Amount: PKR [Amount]) is due on the 10th. Pay digitally via 1Link or EasyPaisa.',
                btn: 'Pay Fee Online',
                tag: 'Finance & Accounts',
                color: 'border-blue-200 bg-blue-50/50',
              },
              {
                title: 'Daily Homework Diary Published',
                body: 'Homework and learning objectives for today have been updated for Class [Class Name]. Please review and sign off the diary.',
                btn: 'View Homework',
                tag: 'Academic Operations',
                color: 'border-emerald-200 bg-emerald-50/50',
              },
              {
                title: 'Emergency Weather / Heavy Rain Closure',
                body: 'Due to severe weather warnings and rain inundation, the campus will remain closed tomorrow. Virtual classrooms will begin at 09:00 AM.',
                btn: 'View Circular',
                tag: 'Administration Alert',
                color: 'border-amber-200 bg-amber-50/50',
              },
            ].map((tmpl, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${tmpl.color} space-y-2.5 flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {tmpl.tag}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-2">{tmpl.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{tmpl.body}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl.title, tmpl.body, tmpl.btn)}
                  className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs rounded-lg transition cursor-pointer shadow-2xs"
                >
                  Apply to Composer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DEVICE SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Registered Push Token Subscribers</h3>
              <p className="text-xs text-slate-500">Breakdown of active PWA and Web Push browser endpoints.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-xs text-slate-500 font-bold">Android (Chrome / Samsung)</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{vapidConfig.androidDevices}</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">50.1% of fleet</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-xs text-slate-500 font-bold">Apple iOS (Safari PWA)</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{vapidConfig.iosDevices}</div>
              <div className="text-[10px] text-blue-600 font-bold mt-1">39.1% of fleet</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <div className="text-xs text-slate-500 font-bold">Desktop Browser PWA</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{vapidConfig.desktopPwa}</div>
              <div className="text-[10px] text-purple-600 font-bold mt-1">10.8% of fleet</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VAPID & FCM CONFIGURATION */}
      {activeTab === 'vapid_config' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Web Push Cryptographic Keys &amp; FCM Gateway</h3>
            <p className="text-xs text-slate-500">
              Configure standard VAPID public/private key pairs and Service Worker parameters.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">VAPID Public Key (Base64 URL Safe)</label>
              <input
                type="text"
                readOnly
                value={vapidConfig.publicKey}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Firebase Cloud Messaging (FCM) Sender ID</label>
              <input
                type="text"
                readOnly
                value={vapidConfig.fcmSenderId}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service Worker Script URI</label>
              <div className="font-mono text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                /firebase-messaging-sw.js &bull; Scope: /
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

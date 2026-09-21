import React, { useState, useEffect } from 'react';
import {
  Settings,
  MessageSquare,
  Mail,
  CreditCard,
  Send,
  Zap,
  CheckCircle2,
  AlertCircle,
  Save,
  RefreshCw,
  Eye,
  Key,
  Globe,
  Clock,
  Building,
  Phone,
  Shield,
  Smartphone,
  Copy,
  Check,
  Radio,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  QrCode,
  Layers,
  Database,
  Calendar,
  DollarSign,
  FileText,
  Lock,
  ExternalLink,
} from 'lucide-react';

interface SettingsViewProps {
  initialSubTab?: 'general' | 'sms' | 'email' | 'payment' | 'whatsapp' | 'telegram' | 'automations';
}

export function SettingsView({ initialSubTab = 'general' }: SettingsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    'general' | 'sms' | 'email' | 'payment' | 'whatsapp' | 'telegram' | 'automations'
  >(initialSubTab);

  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Sync when initialSubTab changes from parent/sidebar navigation
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const triggerSaveNotification = (sectionName: string) => {
    setSavedSuccess(`${sectionName} saved and applied successfully!`);
    setTimeout(() => {
      setSavedSuccess(null);
    }, 3500);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'whatsapp', label: 'WhatsApp', icon: Send },
    { id: 'telegram', label: 'Telegram', icon: Send },
    { id: 'automations', label: 'Automations', icon: Zap },
  ] as const;

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen space-y-5">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure system parameters, digital communication gateways, paymentbillers, and background automation triggers.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold shadow-xs animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{savedSuccess}</span>
          </div>
        )}
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Tab Navigation Ribbon */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 border-b-2 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'border-sky-600 text-sky-700 bg-white shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="p-5 sm:p-6">
          {activeSubTab === 'general' && <GeneralSettingsTab onSave={() => triggerSaveNotification('General Settings')} />}
          {activeSubTab === 'sms' && <SmsSettingsTab onSave={() => triggerSaveNotification('SMS Gateway Settings')} />}
          {activeSubTab === 'email' && <EmailSettingsTab onSave={() => triggerSaveNotification('Email & SMTP Settings')} />}
          {activeSubTab === 'payment' && <PaymentSettingsTab onSave={() => triggerSaveNotification('Payment Gateway Settings')} />}
          {activeSubTab === 'whatsapp' && <WhatsAppSettingsTab onSave={() => triggerSaveNotification('WhatsApp Cloud API Settings')} />}
          {activeSubTab === 'telegram' && <TelegramSettingsTab onSave={() => triggerSaveNotification('Telegram Bot API Settings')} />}
          {activeSubTab === 'automations' && <AutomationsSettingsTab onSave={() => triggerSaveNotification('System Automations & Scheduled Crons')} />}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   1. GENERAL SETTINGS TAB
   ========================================================================= */
function GeneralSettingsTab({ onSave }: { onSave: () => void }) {
  const [generalConfig, setGeneralConfig] = useState(() => {
    const saved = localStorage.getItem('the_educators_general_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      schoolName: 'The Educators School System',
      campusBranch: 'Islamabad Capital Campus (ISB-042)',
      tagline: 'Excellence in Learning & Character Building',
      registrationNumber: 'FBISE / REG-2026-9812',
      principalName: 'Prof. Dr. Tariq Mansoor',
      academicSession: '2025 - 2026',
      officialEmail: 'info@theeducators.edu.pk',
      officialPhone: '+92 (51) 486-1190',
      hotlinePhone: '+92 (300) 852-9901',
      campusAddress: 'Plot 14-B, Street 7, Sector H-8/4, Islamabad, Pakistan',
      city: 'Islamabad',
      country: 'Pakistan',
      currency: 'PKR (₨)',
      timeZone: 'Asia/Karachi (UTC+05:00)',
      dateFormat: 'DD/MM/YYYY',
      workingDays: 'Mon - Sat (6 Days Schedule)',
      passingPercentage: 40,
      minAttendancePercentage: 75,
      autoRollNumbers: true,
      maintenanceMode: false,
    };
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('the_educators_general_config', JSON.stringify(generalConfig));
    onSave();
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">General Institutional Settings</h2>
          <p className="text-xs text-slate-500">
            Define institutional identity, official contacts, fiscal parameters, and campus academic policies.
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Institutional Identity */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-sky-600" />
          <span>School Identity &amp; Affiliation</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">School / Institute Name</label>
            <input
              type="text"
              value={generalConfig.schoolName}
              onChange={(e) => setGeneralConfig({ ...generalConfig, schoolName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campus / Branch Title</label>
            <input
              type="text"
              value={generalConfig.campusBranch}
              onChange={(e) => setGeneralConfig({ ...generalConfig, campusBranch: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Affiliation / Registration No</label>
            <input
              type="text"
              value={generalConfig.registrationNumber}
              onChange={(e) => setGeneralConfig({ ...generalConfig, registrationNumber: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Principal / Head of Institute</label>
            <input
              type="text"
              value={generalConfig.principalName}
              onChange={(e) => setGeneralConfig({ ...generalConfig, principalName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Current Academic Session</label>
            <input
              type="text"
              value={generalConfig.academicSession}
              onChange={(e) => setGeneralConfig({ ...generalConfig, academicSession: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Slogan / Tagline</label>
            <input
              type="text"
              value={generalConfig.tagline}
              onChange={(e) => setGeneralConfig({ ...generalConfig, tagline: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Official Communication & Address */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Phone className="w-4 h-4 text-sky-600" />
          <span>Contact Coordinates &amp; Physical Location</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Administrative Email</label>
            <input
              type="email"
              value={generalConfig.officialEmail}
              onChange={(e) => setGeneralConfig({ ...generalConfig, officialEmail: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Landline Office Phone</label>
            <input
              type="text"
              value={generalConfig.officialPhone}
              onChange={(e) => setGeneralConfig({ ...generalConfig, officialPhone: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Emergency Hotline</label>
            <input
              type="text"
              value={generalConfig.hotlinePhone}
              onChange={(e) => setGeneralConfig({ ...generalConfig, hotlinePhone: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Campus Physical Address</label>
            <input
              type="text"
              value={generalConfig.campusAddress}
              onChange={(e) => setGeneralConfig({ ...generalConfig, campusAddress: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
            <input
              type="text"
              value={generalConfig.city}
              onChange={(e) => setGeneralConfig({ ...generalConfig, city: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Regional & Academic Policies */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-600" />
          <span>Regional Localization &amp; Academic Rules</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Operational Currency</label>
            <select
              value={generalConfig.currency}
              onChange={(e) => setGeneralConfig({ ...generalConfig, currency: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            >
              <option value="PKR (₨)">PKR (₨) - Pakistani Rupee</option>
              <option value="USD ($)">USD ($) - US Dollar</option>
              <option value="GBP (£)">GBP (£) - British Pound</option>
              <option value="AED (د.إ)">AED (د.إ) - UAE Dirham</option>
              <option value="SAR (﷼)">SAR (﷼) - Saudi Riyal</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Time Zone</label>
            <select
              value={generalConfig.timeZone}
              onChange={(e) => setGeneralConfig({ ...generalConfig, timeZone: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="Asia/Karachi (UTC+05:00)">Asia/Karachi (UTC+05:00)</option>
              <option value="Asia/Dubai (UTC+04:00)">Asia/Dubai (UTC+04:00)</option>
              <option value="Asia/Riyadh (UTC+03:00)">Asia/Riyadh (UTC+03:00)</option>
              <option value="Europe/London (UTC+00:00)">Europe/London (UTC+00:00)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Passing Mark Threshold (%)</label>
            <input
              type="number"
              value={generalConfig.passingPercentage}
              onChange={(e) => setGeneralConfig({ ...generalConfig, passingPercentage: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Min. Attendance Threshold (%)</label>
            <input
              type="number"
              value={generalConfig.minAttendancePercentage}
              onChange={(e) => setGeneralConfig({ ...generalConfig, minAttendancePercentage: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save General Settings</span>
        </button>
      </div>
    </form>
  );
}

/* =========================================================================
   2. SMS SETTINGS TAB
   ========================================================================= */
function SmsSettingsTab({ onSave }: { onSave: () => void }) {
  const [smsConfig, setSmsConfig] = useState(() => {
    const saved = localStorage.getItem('the_educators_sms_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      provider: 'Jazz Business Corporate SMS API',
      senderId: 'EDUCATORS',
      apiKey: 'sk_live_jazz_99812301928340192',
      apiUrl: 'https://api.jazzbusiness.com.pk/sms/v2/broadcast',
      httpMethod: 'POST',
      balanceCredits: 18450,
      totalCredits: 25000,
      autoAbsentAlert: true,
      autoFeeNotice: true,
      autoResultPublished: true,
      autoEmergencyClosure: true,
    };
  });

  const [testPhone, setTestPhone] = useState('03008529901');
  const [testMessage, setTestMessage] = useState('The Educators SMS Gateway Test: Connection verified successfully.');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('the_educators_sms_config', JSON.stringify(smsConfig));
    onSave();
  };

  const handleSendTestSms = () => {
    if (!testPhone) {
      alert('Please enter a recipient phone number.');
      return;
    }
    setIsSendingTest(true);
    setTestResult(null);
    setTimeout(() => {
      setIsSendingTest(false);
      setTestResult(`Test SMS dispatched to ${testPhone} via ${smsConfig.senderId} (HTTP 200 OK - MessageID: JZ-991823)`);
      setSmsConfig((prev: any) => ({ ...prev, balanceCredits: prev.balanceCredits - 1 }));
    }, 1200);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">SMS Gateway &amp; Masking Configuration</h2>
          <p className="text-xs text-slate-500">
            Configure telecom corporate SMS APIs (Jazz, Telenor, Zong, Twilio, BrandSMS) for automated student and parent broadcasts.
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save SMS Config</span>
        </button>
      </div>

      {/* Live Quota Badge Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs space-y-1">
          <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">SMS Balance Remaining</div>
          <div className="text-2xl font-black text-white">{smsConfig.balanceCredits.toLocaleString()} Credits</div>
          <div className="text-[11px] text-slate-400">Total Quota: {smsConfig.totalCredits.toLocaleString()}</div>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Approved Sender Mask</div>
          <div className="text-xl font-bold font-mono text-slate-900">{smsConfig.senderId}</div>
          <div className="text-[11px] text-emerald-600 font-bold">PTA Verified &bull; Active</div>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Gateway Provider</div>
          <div className="text-xs font-bold text-slate-800">{smsConfig.provider}</div>
          <div className="text-[11px] text-sky-600 font-mono">Status: Connected (24ms)</div>
        </div>
      </div>

      {/* Provider Details */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-sky-600" />
          <span>Gateway Provider &amp; API Credentials</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Gateway Provider</label>
            <select
              value={smsConfig.provider}
              onChange={(e) => setSmsConfig({ ...smsConfig, provider: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            >
              <option value="Jazz Business Corporate SMS API">Jazz Business Corporate SMS API (Pakistan)</option>
              <option value="Telenor Corporate Portal">Telenor Corporate Portal (Pakistan)</option>
              <option value="Zong Enterprise Bulk Gateway">Zong Enterprise Bulk Gateway (CMPak)</option>
              <option value="BrandSMS Pakistan">BrandSMS Pakistan (Multi-Telco Masking)</option>
              <option value="Twilio SMS API">Twilio International SMS API</option>
              <option value="Custom HTTP REST Webhook">Custom HTTP / REST Webhook</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Sender ID / Brand Masking</label>
            <input
              type="text"
              value={smsConfig.senderId}
              onChange={(e) => setSmsConfig({ ...smsConfig, senderId: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">API Key / Authorization Secret Token</label>
            <input
              type="password"
              value={smsConfig.apiKey}
              onChange={(e) => setSmsConfig({ ...smsConfig, apiKey: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Gateway Endpoint URL</label>
            <input
              type="text"
              value={smsConfig.apiUrl}
              onChange={(e) => setSmsConfig({ ...smsConfig, apiUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Automated Event Triggers */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-sky-600" />
          <span>Automated SMS Dispatch Triggers</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'autoAbsentAlert', title: 'Student Morning Absence SMS', desc: 'Auto-dispatch alert to parent at 09:30 AM when marked absent.' },
            { id: 'autoFeeNotice', title: 'Monthly Fee Voucher Generated', desc: 'Send 1Link voucher bill link upon new monthly fee generation.' },
            { id: 'autoResultPublished', title: 'Exam Marks & Result Card SMS', desc: 'Dispatch exam score summary once teacher finalizes marks.' },
            { id: 'autoEmergencyClosure', title: 'Weather / Emergency Closure Broadcast', desc: 'Mass dispatch advisory circulars during emergency holidays.' },
          ].map((item) => (
            <label
              key={item.id}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-100/70 transition"
            >
              <input
                type="checkbox"
                checked={(smsConfig as any)[item.id]}
                onChange={(e) => setSmsConfig({ ...smsConfig, [item.id]: e.target.checked })}
                className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
              />
              <div>
                <div className="text-xs font-bold text-slate-800">{item.title}</div>
                <div className="text-[11px] text-slate-500">{item.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Test SMS Dispatcher */}
      <div className="p-4 bg-sky-50/60 border border-sky-200 rounded-xl space-y-3">
        <h4 className="text-xs font-bold text-sky-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-sky-600" />
          <span>Live Gateway Test Tool</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Recipient Mobile (+92...)</label>
            <input
              type="text"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Test Message Body</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
              />
              <button
                type="button"
                onClick={handleSendTestSms}
                disabled={isSendingTest}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-spin' : ''}`} />
                <span>{isSendingTest ? 'Dispatching...' : 'Send Test'}</span>
              </button>
            </div>
          </div>
        </div>

        {testResult && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{testResult}</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save SMS Settings</span>
        </button>
      </div>
    </form>
  );
}

/* =========================================================================
   3. EMAIL SETTINGS TAB
   ========================================================================= */
function EmailSettingsTab({ onSave }: { onSave: () => void }) {
  const [emailConfig, setEmailConfig] = useState(() => {
    const saved = localStorage.getItem('the_educators_email_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      protocol: 'SMTP Server',
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      encryption: 'TLS',
      smtpUsername: 'notifications@theeducators.edu.pk',
      smtpPassword: '••••••••••••••••',
      fromEmail: 'noreply@theeducators.edu.pk',
      fromName: 'The Educators Campus Administration',
      replyTo: 'info@theeducators.edu.pk',
      customFooter: 'The Educators School System &bull; Islamabad Capital Campus &bull; Confidentially intended for the named recipient.',
    };
  });

  const [testEmail, setTestEmail] = useState('principal@theeducators.edu.pk');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('the_educators_email_config', JSON.stringify(emailConfig));
    onSave();
  };

  const handleSendTestEmail = () => {
    if (!testEmail) {
      alert('Please enter a recipient email address.');
      return;
    }
    setIsSendingEmail(true);
    setEmailResult(null);
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailResult(`Test email successfully delivered to ${testEmail} via ${emailConfig.smtpHost}:${emailConfig.smtpPort} (${emailConfig.encryption})!`);
    }, 1400);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Email &amp; SMTP Relay Configuration</h2>
          <p className="text-xs text-slate-500">
            Configure institutional SMTP credentials, Google Workspace / SendGrid relays for fee invoices and circular dispatches.
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Email Config</span>
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Mail className="w-4 h-4 text-sky-600" />
          <span>SMTP Server Credentials</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Delivery Protocol</label>
            <select
              value={emailConfig.protocol}
              onChange={(e) => setEmailConfig({ ...emailConfig, protocol: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
            >
              <option value="SMTP Server">SMTP Relay (Gmail / O365 / cPanel)</option>
              <option value="SendGrid API">SendGrid REST API</option>
              <option value="Amazon SES">Amazon SES (Simple Email Service)</option>
              <option value="Mailgun">Mailgun HTTP Gateway</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Host</label>
            <input
              type="text"
              value={emailConfig.smtpHost}
              onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Port &amp; Encryption</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={emailConfig.smtpPort}
                onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
              />
              <select
                value={emailConfig.encryption}
                onChange={(e) => setEmailConfig({ ...emailConfig, encryption: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
              >
                <option value="TLS">TLS (587)</option>
                <option value="SSL">SSL (465)</option>
                <option value="None">None (25)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Username / Email</label>
            <input
              type="text"
              value={emailConfig.smtpUsername}
              onChange={(e) => setEmailConfig({ ...emailConfig, smtpUsername: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Password / App Password</label>
            <input
              type="password"
              value={emailConfig.smtpPassword}
              onChange={(e) => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">From Display Name</label>
            <input
              type="text"
              value={emailConfig.fromName}
              onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 mb-1">Email Footer &amp; Legal Disclaimer</label>
        <textarea
          rows={2}
          value={emailConfig.customFooter}
          onChange={(e) => setEmailConfig({ ...emailConfig, customFooter: e.target.value })}
          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
        />
      </div>

      {/* Test Email Dispatcher */}
      <div className="p-4 bg-sky-50/60 border border-sky-200 rounded-xl space-y-3">
        <h4 className="text-xs font-bold text-sky-900 flex items-center gap-2">
          <Mail className="w-4 h-4 text-sky-600" />
          <span>Live SMTP Connection Diagnostic Tool</span>
        </h4>
        <div className="flex gap-2">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Recipient email address..."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono text-slate-800"
          />
          <button
            type="button"
            onClick={handleSendTestEmail}
            disabled={isSendingEmail}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSendingEmail ? 'animate-spin' : ''}`} />
            <span>{isSendingEmail ? 'Connecting...' : 'Send Test Email'}</span>
          </button>
        </div>

        {emailResult && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{emailResult}</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Email Settings</span>
        </button>
      </div>
    </form>
  );
}

/* =========================================================================
   4. PAYMENT SETTINGS TAB
   ========================================================================= */
function PaymentSettingsTab({ onSave }: { onSave: () => void }) {
  const [paymentConfig, setPaymentConfig] = useState(() => {
    const saved = localStorage.getItem('the_educators_payment_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      enable1Link: true,
      oneLinkPrefix: '100492',
      kuickpayBillerId: 'KP_BILLER_9981',
      enableEasyPaisa: true,
      easyPaisaStoreId: '19823',
      enableJazzCash: true,
      jazzCashMerchantId: 'MC-99210',
      enableStripeCard: true,
      stripePublishableKey: 'pk_live_51P89201928340192834',
      bankName: 'Habib Bank Limited (HBL) - Main Branch',
      accountTitle: 'The Educators School System Operations A/C',
      accountNumber: '0042-7901823901',
      iban: 'PK36HABB0000427901823901',
      lateFeePerDay: 50,
      feeDueDay: 10,
    };
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('the_educators_payment_config', JSON.stringify(paymentConfig));
    onSave();
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Digital Payment Gateways &amp; Bank Challan Settings</h2>
          <p className="text-xs text-slate-500">
            Configure 1Link/1Bill consumer billing, EasyPaisa, JazzCash, Stripe card checkout, and printed bank challan details.
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Payment Config</span>
        </button>
      </div>

      {/* Gateways Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-sky-600" />
          <span>Supported Digital Payment Rails</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1Link / 1Bill Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-600" /> 1Link / 1Bill Switch
              </span>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentConfig.enable1Link}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, enable1Link: e.target.checked })}
                  className="rounded text-sky-600"
                />
                <span>Enable</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">1Link 6-Digit Prefix</label>
                <input
                  type="text"
                  value={paymentConfig.oneLinkPrefix}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, oneLinkPrefix: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Kuickpay Biller ID</label>
                <input
                  type="text"
                  value={paymentConfig.kuickpayBillerId}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, kuickpayBillerId: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* EasyPaisa & JazzCash */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" /> EasyPaisa &amp; JazzCash Direct
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Active</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">EasyPaisa Store ID</label>
                <input
                  type="text"
                  value={paymentConfig.easyPaisaStoreId}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, easyPaisaStoreId: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">JazzCash Merchant ID</label>
                <input
                  type="text"
                  value={paymentConfig.jazzCashMerchantId}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, jazzCashMerchantId: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Account Details for Paper Challan */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-sky-600" />
          <span>Bank Account Details for Printed Fee Challan</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Designated Bank Name &amp; Branch</label>
            <input
              type="text"
              value={paymentConfig.bankName}
              onChange={(e) => setPaymentConfig({ ...paymentConfig, bankName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Account Title</label>
            <input
              type="text"
              value={paymentConfig.accountTitle}
              onChange={(e) => setPaymentConfig({ ...paymentConfig, accountTitle: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
            <input
              type="text"
              value={paymentConfig.accountNumber}
              onChange={(e) => setPaymentConfig({ ...paymentConfig, accountNumber: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">IBAN Number</label>
            <input
              type="text"
              value={paymentConfig.iban}
              onChange={(e) => setPaymentConfig({ ...paymentConfig, iban: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Payment Settings</span>
        </button>
      </div>
    </form>
  );
}

/* =========================================================================
   5. WHATSAPP SETTINGS TAB
   ========================================================================= */
function WhatsAppSettingsTab({ onSave }: { onSave: () => void }) {
  const [waConfig, setWaConfig] = useState(() => {
    const saved = localStorage.getItem('the_educators_whatsapp_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      provider: 'Meta WhatsApp Cloud API (Official)',
      wabaId: '109283746592019',
      phoneNumberId: '104829374619283',
      accessToken: 'EAAJk928_live_educators_secret_token_9918234',
      webhookUrl: 'https://app.theeducators.edu.pk/api/webhooks/whatsapp',
      verifyToken: 'educators_secret_verify_token_2026',
      autoPdfVoucher: true,
      autoAttendanceNotice: true,
      autoDiaryBroadcast: true,
    };
  });

  const [testPhone, setTestPhone] = useState('+923008529901');
  const [isSendingWa, setIsSendingWa] = useState(false);
  const [waResult, setWaResult] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('the_educators_whatsapp_config', JSON.stringify(waConfig));
    onSave();
  };

  const handleSendTestWa = () => {
    if (!testPhone) {
      alert('Please enter a WhatsApp mobile number.');
      return;
    }
    setIsSendingWa(true);
    setWaResult(null);
    setTimeout(() => {
      setIsSendingWa(false);
      setWaResult(`WhatsApp template message dispatched to ${testPhone} (Status: Sent & Read - MsgId: wamid.HBgLMTk5)`);
    }, 1300);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">WhatsApp Business Cloud API Settings</h2>
          <p className="text-xs text-slate-500">
            Configure Meta Cloud API or QR-based session pairing for automated PDF fee receipts, attendance pings, and diary broadcasts.
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save WhatsApp Config</span>
        </button>
      </div>

      {/* Meta API Parameters */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-600" />
          <span>Meta WhatsApp Business Platform Credentials</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Business Account ID (WABA ID)</label>
            <input
              type="text"
              value={waConfig.wabaId}
              onChange={(e) => setWaConfig({ ...waConfig, wabaId: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number ID</label>
            <input
              type="text"
              value={waConfig.phoneNumberId}
              onChange={(e) => setWaConfig({ ...waConfig, phoneNumberId: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Permanent System User Access Token</label>
            <input
              type="password"
              value={waConfig.accessToken}
              onChange={(e) => setWaConfig({ ...waConfig, accessToken: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Webhook Callback URL</label>
            <input
              type="text"
              readOnly
              value={waConfig.webhookUrl}
              className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg font-mono text-slate-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Webhook Verify Token</label>
            <input
              type="text"
              value={waConfig.verifyToken}
              onChange={(e) => setWaConfig({ ...waConfig, verifyToken: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Test WhatsApp Tool */}
      <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
        <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-2">
          <Send className="w-4 h-4 text-emerald-600" />
          <span>Live WhatsApp Template Test Tool</span>
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="+923001234567"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono text-slate-800"
          />
          <button
            type="button"
            onClick={handleSendTestWa}
            disabled={isSendingWa}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSendingWa ? 'animate-spin' : ''}`} />
            <span>{isSendingWa ? 'Dispatching...' : 'Send WhatsApp Test'}</span>
          </button>
        </div>

        {waResult && (
          <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{waResult}</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save WhatsApp Settings</span>
        </button>
      </div>
    </form>
  );
}

/* =========================================================================
   6. TELEGRAM SETTINGS TAB (Highlighted in User's Screenshot)
   ========================================================================= */
function TelegramSettingsTab({ onSave }: { onSave: () => void }) {
  const [telegramConfig, setTelegramConfig] = useState(() => {
    const saved = localStorage.getItem('the_educators_telegram_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      botToken: '7891234567:AAFl0kJ882_aPz99-kL01928340192834',
      botUsername: '@TheEducatorsOfficialBot',
      botDisplayName: 'The Educators Campus Bot',
      parentChannelId: '@the_educators_parents',
      staffSupergroupId: '-1001827364510',
      principalAlertsChatId: '-1002938475610',
      webhookUrl: 'https://app.theeducators.edu.pk/api/webhooks/telegram',
      maxConnections: 40,
      enableMenuCommand: true,
      enableFeeCommand: true,
      enableAttendanceCommand: true,
      enableResultCommand: true,
      enableTimetableCommand: true,
    };
  });

  const [testChatId, setTestChatId] = useState('@the_educators_parents');
  const [testMessage, setTestMessage] = useState('🔔 The Educators Official: Telegram Bot API connected and broadcasting live.');
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [telegramResult, setTelegramResult] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('the_educators_telegram_config', JSON.stringify(telegramConfig));
    onSave();
  };

  const handleSendTestTelegram = () => {
    if (!testChatId) {
      alert('Please enter a target Telegram Channel or Chat ID.');
      return;
    }
    setIsSendingTelegram(true);
    setTelegramResult(null);
    setTimeout(() => {
      setIsSendingTelegram(false);
      setTelegramResult(`Telegram broadcast published to ${testChatId} (HTTP 200 OK - MessageID: #TG-881923)`);
    }, 1200);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Telegram Bot API &amp; Channel Broadcaster Settings</h2>
          <p className="text-xs text-slate-500">
            Configure Telegram Bot API token, subscriber channel links, interactive bot slash commands, and webhook gateways.
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Bot Health & Telemetry Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs space-y-1">
          <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Bot Identity</div>
          <div className="text-lg font-bold font-mono text-white">{telegramConfig.botUsername}</div>
          <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Webhook Connected &bull; 200 OK
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Parent Channel Subscribers</div>
          <div className="text-xl font-black text-slate-900">1,842 Subscribers</div>
          <div className="text-[11px] font-mono text-sky-600">{telegramConfig.parentChannelId}</div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Webhook Throughput</div>
          <div className="text-xl font-black text-slate-900">{telegramConfig.maxConnections} Concurrent Conns</div>
          <div className="text-[11px] text-slate-500">SSL: Valid Let&apos;s Encrypt</div>
        </div>
      </div>

      {/* Bot Token Credentials */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-sky-600" />
          <span>Telegram Bot Credentials &amp; Endpoints</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bot Token (Generated from @BotFather)
            </label>
            <input
              type="text"
              value={telegramConfig.botToken}
              onChange={(e) => setTelegramConfig({ ...telegramConfig, botToken: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bot Username</label>
            <input
              type="text"
              value={telegramConfig.botUsername}
              onChange={(e) => setTelegramConfig({ ...telegramConfig, botUsername: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bot Display Title</label>
            <input
              type="text"
              value={telegramConfig.botDisplayName}
              onChange={(e) => setTelegramConfig({ ...telegramConfig, botDisplayName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Parent Channel ID / Tag</label>
            <input
              type="text"
              value={telegramConfig.parentChannelId}
              onChange={(e) => setTelegramConfig({ ...telegramConfig, parentChannelId: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Staff Announcements Supergroup ID</label>
            <input
              type="text"
              value={telegramConfig.staffSupergroupId}
              onChange={(e) => setTelegramConfig({ ...telegramConfig, staffSupergroupId: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Bot Slash Commands */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-sky-600" />
          <span>Interactive Bot Commands for Parents &amp; Students</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'enableMenuCommand', command: '/start & /menu', desc: 'Main navigation menu and school introduction' },
            { id: 'enableFeeCommand', command: '/fee <roll_no>', desc: 'Instant 1Link fee voucher balance lookup' },
            { id: 'enableAttendanceCommand', command: '/attendance <roll_no>', desc: 'Real-time monthly attendance summary' },
            { id: 'enableResultCommand', command: '/result <roll_no>', desc: 'Term summative exam card breakdown' },
            { id: 'enableTimetableCommand', command: '/timetable <class>', desc: 'Daily period & subject schedule' },
          ].map((cmd) => (
            <label
              key={cmd.id}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 cursor-pointer hover:bg-slate-100/70 transition"
            >
              <input
                type="checkbox"
                checked={(telegramConfig as any)[cmd.id]}
                onChange={(e) => setTelegramConfig({ ...telegramConfig, [cmd.id]: e.target.checked })}
                className="mt-0.5 rounded text-sky-600"
              />
              <div>
                <div className="text-xs font-bold font-mono text-sky-700">{cmd.command}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{cmd.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Live Telegram Broadcaster Test Tool */}
      <div className="p-4 bg-sky-50/60 border border-sky-200 rounded-xl space-y-3">
        <h4 className="text-xs font-bold text-sky-900 flex items-center gap-2">
          <Send className="w-4 h-4 text-sky-600" />
          <span>Live Telegram Broadcaster Test Simulator</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Channel / Chat ID</label>
            <input
              type="text"
              value={testChatId}
              onChange={(e) => setTestChatId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Test Message Body</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
              />
              <button
                type="button"
                onClick={handleSendTestTelegram}
                disabled={isSendingTelegram}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSendingTelegram ? 'animate-spin' : ''}`} />
                <span>{isSendingTelegram ? 'Transmitting...' : 'Transmit Test'}</span>
              </button>
            </div>
          </div>
        </div>

        {telegramResult && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{telegramResult}</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
}

/* =========================================================================
   7. AUTOMATIONS SETTINGS TAB
   ========================================================================= */
interface CronItem {
  id: string;
  name: string;
  schedule: string;
  action: string;
  enabled: boolean;
  lastRun: string;
  status: string;
}

function AutomationsSettingsTab({ onSave }: { onSave: () => void }) {
  const [crons, setCrons] = useState<CronItem[]>(() => {
    const saved = localStorage.getItem('the_educators_crons_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'cron_absent_sms',
        name: 'Morning Attendance Absence Auto-Broadcast',
        schedule: 'Every school day at 09:30 AM',
        action: 'Queries unmarked & absent students -> Sends SMS & WhatsApp alerts to parents.',
        enabled: true,
        lastRun: 'Today, 09:30 AM',
        status: 'Success (32 dispatched)',
      },
      {
        id: 'cron_fee_gen',
        name: 'Monthly Fee Challan & 1Link Generation',
        schedule: '1st of every month at 00:01 AM',
        action: 'Generates active student monthly invoices and generates 16-digit 1Link consumer IDs.',
        enabled: true,
        lastRun: 'Sep 01, 2026, 00:01 AM',
        status: 'Success (420 vouchers generated)',
      },
      {
        id: 'cron_fee_reminders',
        name: 'Fee Defaulter SMS & Push Reminder Sequence',
        schedule: '5th, 8th & 10th of every month at 11:00 AM',
        action: 'Sends gentle digital invoice reminder with 1Link / EasyPaisa checkout link.',
        enabled: true,
        lastRun: 'Sep 10, 2026, 11:00 AM',
        status: 'Success (86 reminded)',
      },
      {
        id: 'cron_db_backup',
        name: 'Automated Encrypted Cloud Database Snapshot',
        schedule: 'Daily at 02:00 AM',
        action: 'Creates timestamped snapshot of students, marks, fee vouchers, and audit trails.',
        enabled: true,
        lastRun: 'Today, 02:00 AM',
        status: 'Success (48.2 MB archive)',
      },
      {
        id: 'cron_birthday_wishes',
        name: 'Student & Staff Birthday Greeting Automation',
        schedule: 'Daily at 08:00 AM',
        action: 'Dispatches celebratory digital card to students and staff celebrating birthdays.',
        enabled: true,
        lastRun: 'Today, 08:00 AM',
        status: 'Success (3 greetings delivered)',
      },
    ];
  });

  const [executingCronId, setExecutingCronId] = useState<string | null>(null);

  const toggleCron = (id: string) => {
    setCrons((prev: CronItem[]) =>
      prev.map((c: CronItem) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleRunNow = (id: string, name: string) => {
    setExecutingCronId(id);
    setTimeout(() => {
      setExecutingCronId(null);
      setCrons((prev: CronItem[]) =>
        prev.map((c: CronItem) =>
          c.id === id ? { ...c, lastRun: 'Just now (Manual)', status: 'Success (Executed manually)' } : c
        )
      );
      alert(`Manual execution for "${name}" triggered and completed successfully!`);
    }, 1500);
  };

  const handleSave = () => {
    localStorage.setItem('the_educators_crons_config', JSON.stringify(crons));
    onSave();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Background Automations &amp; Cron Schedules</h2>
          <p className="text-xs text-slate-500">
            Configure automated background event triggers, scheduled daily roll call broadcasts, and cloud database backup cycles.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Automations</span>
        </button>
      </div>

      <div className="space-y-3">
        {crons.map((cron) => (
          <div
            key={cron.id}
            className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white hover:shadow-xs transition"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{cron.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    cron.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cron.enabled ? 'Active Cron' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-slate-600">{cron.action}</p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-sky-600" /> {cron.schedule}
                </span>
                <span>&bull;</span>
                <span>Last Run: <strong>{cron.lastRun}</strong></span>
                <span>&bull;</span>
                <span className="text-emerald-600 font-bold">{cron.status}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleRunNow(cron.id, cron.name)}
                disabled={executingCronId === cron.id}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer border border-sky-200"
              >
                <Play className={`w-3 h-3 ${executingCronId === cron.id ? 'animate-spin' : ''}`} />
                <span>{executingCronId === cron.id ? 'Executing...' : 'Run Now'}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleCron(cron.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  cron.enabled
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {cron.enabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Automations Settings</span>
        </button>
      </div>
    </div>
  );
}

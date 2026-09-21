import React, { useState } from 'react';
import {
  Send,
  MessageSquare,
  Smartphone,
  PhoneCall,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Search,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Radio,
  FileText,
  Plus,
} from 'lucide-react';
import { BroadcastCampaign, AutomatedTriggerRule } from '../types';
import { INITIAL_BROADCAST_CAMPAIGNS, INITIAL_AUTOMATED_TRIGGERS } from '../data/phase11Data';

interface BroadcastGatewayViewProps {
  onPrintCampaignReport?: (campaign: BroadcastCampaign) => void;
}

export default function BroadcastGatewayView({ onPrintCampaignReport }: BroadcastGatewayViewProps) {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'compose' | 'triggers' | 'gateway_status'>(
    'campaigns'
  );
  const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>(INITIAL_BROADCAST_CAMPAIGNS);
  const [triggers, setTriggers] = useState<AutomatedTriggerRule[]>(INITIAL_AUTOMATED_TRIGGERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');

  // New Campaign Form State
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState<BroadcastCampaign['channel']>('WhatsApp');
  const [audience, setAudience] = useState<BroadcastCampaign['audienceGroup']>('All School Parents');
  const [language, setLanguage] = useState<BroadcastCampaign['language']>('Bilingual (Urdu + English)');
  const [englishText, setEnglishText] = useState('');
  const [urduText, setUrduText] = useState('');
  const [gateway, setGateway] = useState<BroadcastCampaign['gatewayProvider']>(
    'WhatsApp Cloud Business API'
  );
  const [isDispatchedSuccess, setIsDispatchedSuccess] = useState(false);

  const filteredCampaigns = campaigns.filter((cmp) => {
    const matchSearch =
      cmp.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmp.messageBodyEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmp.messageBodyUrdu.includes(searchQuery);
    const matchChannel = selectedChannel === 'ALL' || cmp.channel === selectedChannel;
    return matchSearch && matchChannel;
  });

  const handleCreateAndDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (!englishText && !urduText)) return;

    let estCount = 1420;
    if (audience === 'Fee Defaulters (>1 Month)') estCount = 64;
    else if (audience === 'Class 9 & 10 Board Students') estCount = 180;
    else if (audience === 'Absentee Roll Today') estCount = 24;
    else if (audience === 'Teaching Staff') estCount = 78;
    else if (audience === 'Hostel Boarders') estCount = 110;

    const newCamp: BroadcastCampaign = {
      id: `CMP-${Date.now().toString().slice(-6)}`,
      campaignTitle: title,
      channel,
      audienceGroup: audience,
      recipientCount: estCount,
      deliveredCount: estCount - 2,
      failedCount: 2,
      readCount: Math.round(estCount * 0.95),
      language,
      messageBodyEnglish: englishText,
      messageBodyUrdu: urduText,
      status: 'Dispatched & Delivered',
      dispatchedAt: 'Just now (Instant Gateway API)',
      gatewayProvider: gateway,
      tags: ['Manual Broadcast', 'Instant Dispatch'],
    };

    setCampaigns([newCamp, ...campaigns]);
    setIsDispatchedSuccess(true);
    setTimeout(() => {
      setIsDispatchedSuccess(false);
      setActiveTab('campaigns');
      setTitle('');
      setEnglishText('');
      setUrduText('');
    }, 1500);
  };

  const handleToggleTrigger = (id: string) => {
    setTriggers(
      triggers.map((t) => (t.id === id ? { ...t, isEnabled: !t.isEnabled } : t))
    );
  };

  return (
    <div id="broadcast-gateway-view" className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#002147] to-emerald-950 rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/20 rounded-lg text-emerald-300 border border-emerald-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Multi-Channel Broadcast &amp; WhatsApp/SMS Gateway Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400 text-slate-950">
              Phase 11
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Real-time Pakistan telecom integration (Jazz, Telenor, Zong) &amp; Meta WhatsApp Business API for instant Urdu/English parent alerts, fee reminders &amp; emergency robocalls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('compose')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Compose Instant Broadcast</span>
          </button>
        </div>
      </div>

      {/* Gateway Telemetry Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900">4,504</div>
            <div className="text-[11px] text-slate-500 font-medium">WhatsApp Messages Sent</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900">12,890</div>
            <div className="text-[11px] text-slate-500 font-medium">Branded SMS Dispatched</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900">1,420</div>
            <div className="text-[11px] text-slate-500 font-medium">IVR Robocalls Placed</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-emerald-700">99.4%</div>
            <div className="text-[11px] text-slate-500 font-medium">Carrier Delivery SLA</div>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('campaigns')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'campaigns'
              ? 'border-emerald-600 text-emerald-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Broadcast Logs &amp; Campaigns ({campaigns.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compose')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'compose'
              ? 'border-emerald-600 text-emerald-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Compose &amp; Dispatch Alert</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('triggers')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'triggers'
              ? 'border-emerald-600 text-emerald-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Automated Event Triggers ({triggers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gateway_status')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'gateway_status'
              ? 'border-emerald-600 text-emerald-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4 text-blue-500" />
          <span>Telecom Gateways &amp; API Connectors</span>
        </button>
      </div>

      {/* TAB 1: CAMPAIGNS LOGS */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search alert title, English/Urdu text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">Channel:</span>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="p-2 border rounded-lg font-semibold bg-white text-xs"
              >
                <option value="ALL">All Channels</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="SMS">Branded SMS</option>
                <option value="Voice IVR Call">Voice Call</option>
                <option value="Multi-Channel Omnichannel">Multi-Channel</option>
              </select>
            </div>
          </div>

          {/* Campaign List */}
          <div className="space-y-3">
            {filteredCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-slate-500 text-[11px]">{camp.id}</span>
                      <h3 className="font-bold text-slate-900 text-sm">{camp.campaignTitle}</h3>
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          camp.channel === 'WhatsApp'
                            ? 'bg-emerald-100 text-emerald-800'
                            : camp.channel === 'SMS'
                            ? 'bg-blue-100 text-blue-800'
                            : camp.channel === 'Voice IVR Call'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {camp.channel}
                      </span>
                      <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-slate-200 text-slate-800">
                        {camp.audienceGroup}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                      <span>Gateway: <strong>{camp.gatewayProvider}</strong></span>
                      <span>Dispatched: <strong>{camp.dispatchedAt || camp.scheduledTime}</strong></span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">
                      {camp.deliveredCount} / {camp.recipientCount} Delivered
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">
                      {Math.round((camp.deliveredCount / (camp.recipientCount || 1)) * 100)}% Success Rate
                    </div>
                  </div>
                </div>

                {/* Message English & Urdu Preview Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-slate-200 text-xs">
                  {camp.messageBodyEnglish && (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-600 text-[10px] uppercase">English Version:</div>
                      <p className="text-slate-800 leading-relaxed font-sans">{camp.messageBodyEnglish}</p>
                    </div>
                  )}

                  {camp.messageBodyUrdu && (
                    <div className="space-y-1 text-right">
                      <div className="font-bold text-slate-600 text-[10px] uppercase text-left">
                        اردو پیغام (Nastaliq):
                      </div>
                      <p className="text-slate-900 leading-relaxed font-semibold dir-rtl" style={{ direction: 'rtl' }}>
                        {camp.messageBodyUrdu}
                      </p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {camp.tags.map((tg, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 border text-slate-600 rounded text-[10px]">
                      #{tg}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: COMPOSE NEW BROADCAST */}
      {activeTab === 'compose' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-6 space-y-5 shadow-xs text-xs">
          <div className="border-b pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Compose Multi-Channel Parent / Staff Broadcast
            </h3>
            <p className="text-slate-500 text-[11px]">
              Directly dispatches real-time WhatsApp templates, Branded SMS, or Voice robocalls via API connectors.
            </p>
          </div>

          {isDispatchedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Broadcast successfully queued &amp; dispatched across carrier gateways!</span>
            </div>
          )}

          <form onSubmit={handleCreateAndDispatch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Campaign Title / Notice Header *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Vacation Notification / PTM Reminder"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Broadcast Channel *</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full p-2 border rounded-lg text-xs bg-white"
                >
                  <option value="WhatsApp">Meta WhatsApp Business API</option>
                  <option value="SMS">Branded SMS Gateway (Jazz / Telenor)</option>
                  <option value="Voice IVR Call">Automated Voice Robocall</option>
                  <option value="Multi-Channel Omnichannel">Omnichannel (WhatsApp + SMS Fallback)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Target Recipient Cohort *</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as any)}
                  className="w-full p-2 border rounded-lg text-xs bg-white"
                >
                  <option value="All School Parents">All School Parents (1,420 Enrolled)</option>
                  <option value="Fee Defaulters (>1 Month)">Fee Defaulters (&gt;1 Month Overdue - 64)</option>
                  <option value="Class 9 & 10 Board Students">Class 9 &amp; 10 Board Students (180)</option>
                  <option value="Absentee Roll Today">Today's Absent Students Roll (18)</option>
                  <option value="Teaching Staff">Faculty &amp; Teaching Staff (78)</option>
                  <option value="Hostel Boarders">Hostel Residential Boarders (110)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Telecom Gateway Routing</label>
                <select
                  value={gateway}
                  onChange={(e) => setGateway(e.target.value as any)}
                  className="w-full p-2 border rounded-lg text-xs bg-white"
                >
                  <option value="WhatsApp Cloud Business API">WhatsApp Cloud Business API (Direct)</option>
                  <option value="Jazz Corporate SMS">Jazz Corporate Masking API (Brand: EDUCATORS)</option>
                  <option value="Telenor Connect API">Telenor Corporate Connect Hub</option>
                  <option value="Zong Bulk IVR">Zong Voice Broadcast Engine</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">English Text Content</label>
                <textarea
                  rows={4}
                  placeholder="Type English announcement message here..."
                  value={englishText}
                  onChange={(e) => setEnglishText(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-right block">
                  اردو متن (اردو نستعلیق پیغام)
                </label>
                <textarea
                  rows={4}
                  dir="rtl"
                  placeholder="یہاں اردو میں پیغام درج کریں..."
                  value={urduText}
                  onChange={(e) => setUrduText(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-xs font-semibold text-right"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setActiveTab('campaigns')}
                className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center gap-2 shadow"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Alert Now</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: AUTOMATED TRIGGERS */}
      {activeTab === 'triggers' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="border-b pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Automated Event Triggers &amp; System Event Webhooks
            </h3>
            <p className="text-slate-500 text-[11px]">
              Rules that fire instant SMS/WhatsApp alerts without manual staff intervention based on attendance roll calls, overdue fees, or visitor security checks.
            </p>
          </div>

          <div className="space-y-3">
            {triggers.map((trig) => (
              <div
                key={trig.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{trig.eventTrigger}</span>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-indigo-100 text-indigo-800">
                      {trig.channel}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] bg-white p-2 rounded border border-slate-200 font-mono">
                    {trig.templatePreview}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Last Fired: <strong>{trig.lastTriggeredTime}</strong> ({trig.lastTriggeredCount} recipients) • Audience: {trig.targetAudience}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleTrigger(trig.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                      trig.isEnabled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {trig.isEnabled ? 'Enabled & Active' : 'Paused / Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TELECOM GATEWAYS */}
      {activeTab === 'gateway_status' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <h3 className="font-bold text-slate-900 text-sm">
            Telecom Aggregator Connectors &amp; Webhook Health Status
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-sm">Meta WhatsApp Cloud Business API</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                  Connected (200 OK)
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Official verified green badge sender ID: <strong>+92 42 111-EDUCATORS</strong>. Supports interactive CTA buttons, quick replies, and PDF challan attachment dispatches.
              </p>
              <div className="text-[10px] text-slate-500">Rate Limit: 250 msgs / second • Webhook Latency: 42ms</div>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-sm">Jazz Branded SMS Masking</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">
                  Mask: EDUCATORS
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                PTA verified alphanumeric sender masking for nationwide broadcast across all Mobilink, Telenor, Zong &amp; Ufone networks.
              </p>
              <div className="text-[10px] text-slate-500">TPS: 500 SMS / sec • Gateway Balance: 84,200 SMS credits</div>
            </div>

            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-sm">Telenor Corporate Connect Hub</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold text-[10px]">
                  Active
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Primary fallback route for non-delivered WhatsApp notifications and automatic DND (Do Not Disturb) bypass for critical school emergencies.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-sm">Zong Bulk Voice Robocall Engine</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                  SIP Trunk Ready
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Automated audio broadcast dialer with IVR DTMF key detection (Press 1 to acknowledge, Press 2 for transport helpdesk).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

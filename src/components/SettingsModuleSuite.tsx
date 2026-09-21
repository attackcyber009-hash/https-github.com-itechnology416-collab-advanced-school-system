import React, { useState } from 'react';
import { Settings, MessageSquare, Mail, CreditCard, Bot, Send, Zap } from 'lucide-react';

export function SettingsView() {
  const [activeSubTab, setActiveSubTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'whatsapp', label: 'WhatsApp', icon: Send },
    { id: 'telegram', label: 'Telegram', icon: Send },
    { id: 'automations', label: 'Automations', icon: Zap },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium ${activeSubTab === tab.id ? 'border-sky-500 text-sky-700 bg-sky-50' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          <SettingsContent activeSubTab={activeSubTab} />
        </div>
      </div>
    </div>
  );
}

function SettingsContent({ activeSubTab }: { activeSubTab: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 capitalize">{activeSubTab} Settings</h2>
      <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
        <p className="text-sm text-slate-600">Configure your {activeSubTab} settings here.</p>
        <button className="mt-4 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 text-sm font-medium">Save Changes</button>
      </div>
    </div>
  );
}

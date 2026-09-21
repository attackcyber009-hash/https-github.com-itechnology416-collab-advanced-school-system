import React, { useState, useEffect } from 'react';
import {
  Fingerprint,
  Wifi,
  WifiOff,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Radio,
  RefreshCw,
  Clock,
  UserCheck,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Upload,
  Download,
  Settings,
  Sliders,
  Users,
  Search,
  Zap,
} from 'lucide-react';
import { Student, StaffMember } from '../types';

interface BiometricRfidSyncViewProps {
  students: Student[];
  staff: StaffMember[];
  onAutoMarkAttendance?: (record: any) => void;
}

export default function BiometricRfidSyncView({
  students,
  staff,
  onAutoMarkAttendance,
}: BiometricRfidSyncViewProps) {
  const [activeTab, setActiveTab] = useState<'stream' | 'devices' | 'enrollment' | 'relay_control'>('stream');
  const [isListening, setIsListening] = useState(true);
  const [autoSmsEnabled, setAutoSmsEnabled] = useState(true);

  // Mock Hardware Devices
  const [devices, setDevices] = useState([
    {
      id: 'DEV-01',
      name: 'Main Gate Ingress Turnstile A',
      ip: '192.168.10.201',
      port: 4370,
      protocol: 'ZKTeco Push SDK / Standalone',
      location: 'Campus Main Gate (Entry)',
      status: 'Online',
      lastPing: '2s ago',
      logsCount: 342,
      firmware: 'Ver 6.60 (Build 2026)',
    },
    {
      id: 'DEV-02',
      name: 'Main Gate Egress Turnstile B',
      ip: '192.168.10.202',
      port: 4370,
      protocol: 'ZKTeco Push SDK / Standalone',
      location: 'Campus Main Gate (Exit)',
      status: 'Online',
      lastPing: '4s ago',
      logsCount: 298,
      firmware: 'Ver 6.60 (Build 2026)',
    },
    {
      id: 'DEV-03',
      name: 'Junior Wing Facial & RFID Terminal',
      ip: '192.168.10.205',
      port: 8000,
      protocol: 'Hikvision ISAPI / Face Match',
      location: 'Junior Wing Entrance',
      status: 'Online',
      lastPing: '1s ago',
      logsCount: 185,
      firmware: 'V3.2.30_20260115',
    },
    {
      id: 'DEV-04',
      name: 'Faculty & Administration Bio-Reader',
      ip: '192.168.10.210',
      port: 5005,
      protocol: 'ZKTeco SilkID Biometric',
      location: 'Staff Common Room',
      status: 'Online',
      lastPing: '5s ago',
      logsCount: 42,
      firmware: 'Ver 8.1.0',
    },
  ]);

  // Live incoming punch stream
  const [punches, setPunches] = useState<any[]>([
    {
      id: 'PUNCH-1001',
      timestamp: '07:54:12 AM',
      personName: students[0]?.name || 'Ahmad Ali',
      role: 'Student',
      code: students[0]?.studentCode || 'STD-2024-001',
      method: 'RFID Card (Tap)',
      rfidNumber: 'E28011928340192',
      device: 'Main Gate Turnstile A',
      status: 'Present (On Time)',
      smsSent: true,
    },
    {
      id: 'PUNCH-1002',
      timestamp: '07:55:40 AM',
      personName: staff[0]?.name || 'Prof. Muhammad Asif',
      role: 'Staff',
      code: staff[0]?.employeeCode || 'TCH-001',
      method: 'Fingerprint Biometric',
      rfidNumber: 'BIO-MATCH-99.2%',
      device: 'Faculty Bio-Reader',
      status: 'Present (On Time)',
      smsSent: false,
    },
    {
      id: 'PUNCH-1003',
      timestamp: '08:02:18 AM',
      personName: students[1]?.name || 'Fatima Zahra',
      role: 'Student',
      code: students[1]?.studentCode || 'STD-2024-002',
      method: 'Face Recognition',
      rfidNumber: 'FACE-CONF-98.7%',
      device: 'Junior Wing Facial',
      status: 'Late (+2 min)',
      smsSent: true,
    },
  ]);

  // Simulate incoming real-time biometric pulses when listening is active
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      const randomStd = students[Math.floor(Math.random() * students.length)] || {
        name: 'Hamza Tariq',
        studentCode: 'STD-2024-088',
      };

      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      const isLate = now.getSeconds() % 3 === 0;

      const newPunch = {
        id: `PUNCH-${Date.now().toString().slice(-4)}`,
        timestamp: timeStr,
        personName: randomStd.name,
        role: 'Student',
        code: randomStd.studentCode,
        method: Math.random() > 0.5 ? 'RFID Card (Tap)' : 'Face Recognition',
        rfidNumber: `RFID-${Math.floor(10000000 + Math.random() * 90000000)}`,
        device: 'Main Gate Turnstile A',
        status: isLate ? 'Late Attendance' : 'Present (On Time)',
        smsSent: autoSmsEnabled,
      };

      setPunches((prev) => [newPunch, ...prev.slice(0, 19)]);
    }, 6000);

    return () => clearInterval(interval);
  }, [isListening, autoSmsEnabled, students]);

  const handleTriggerRelay = (action: string) => {
    alert(`Hardware Relay Command [${action}] dispatched to all ZKTeco & Hikvision controllers.`);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-400 text-blue-950 uppercase tracking-wide">
                Hardware Sync Hub
              </span>
              <span className="text-xs bg-white/15 px-2 py-0.5 rounded border border-white/20 text-blue-100 flex items-center gap-1">
                <Fingerprint className="w-3.5 h-3.5 text-blue-300" />
                ZKTeco &bull; Hikvision &bull; RFID Turnstiles
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Biometric Attendance &amp; Turnstile Listener
            </h1>
            <p className="text-blue-100 text-xs mt-1 max-w-2xl">
              Real-time hardware socket connection syncing physical gate punches, RFID card taps, and facial recognition with automated Parent SMS alerts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsListening(!isListening)}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer ${
                isListening
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950'
                  : 'bg-amber-500 hover:bg-amber-400 text-amber-950'
              }`}
            >
              {isListening ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isListening ? 'Live Stream Active' : 'Stream Paused'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleTriggerRelay('PULSE_UNLOCK')}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Pulse Unlock Gate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 pt-2 rounded-t-xl">
        <div className="flex gap-2">
          {[
            { id: 'stream', label: 'Live Punch Stream', icon: Activity },
            { id: 'devices', label: 'Registered Hardware Terminals', icon: Radio },
            { id: 'enrollment', label: 'RFID / Card Template Sync', icon: Users },
            { id: 'relay_control', label: 'Emergency Gate Relay Controls', icon: ShieldAlert },
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
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 font-medium">
            <input
              type="checkbox"
              checked={autoSmsEnabled}
              onChange={(e) => setAutoSmsEnabled(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            <span>Auto-SMS to Parents</span>
          </label>
        </div>
      </div>

      {/* TAB 1: LIVE PUNCH STREAM */}
      {activeTab === 'stream' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 className="text-sm font-bold text-slate-800">Hardware TCP/IP Push Event Stream</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Listening on Port: 4370 / 8000</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Student / Staff Name</th>
                    <th className="py-2.5 px-3">ID Code</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Gate Terminal</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3 text-right">Parent SMS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {punches.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-mono text-slate-500 font-bold">{p.timestamp}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{p.personName}</td>
                      <td className="py-2.5 px-3 font-mono text-blue-600">{p.code}</td>
                      <td className="py-2.5 px-3 text-slate-600">{p.method}</td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">{p.device}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status.includes('Late')
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {p.smsSent ? (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Sent
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Disabled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Metrics & Terminal Health */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Today's Gate Ingress Stats
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="text-[10px] text-emerald-600 font-bold">Total Punches</div>
                  <div className="text-lg font-black text-emerald-900 mt-0.5">867</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="text-[10px] text-blue-600 font-bold">On-Time Arrivals</div>
                  <div className="text-lg font-black text-blue-900 mt-0.5">94.2%</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Automated SMS Dispatch Format</span>
                </div>
                <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                  "Dear Parent, your child [Student Name] entered the school campus via Main Turnstile at [Time]. Attendance marked: Present."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED HARDWARE TERMINALS */}
      {activeTab === 'devices' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Connected Attendance Readers &amp; Turnstiles</h3>
              <p className="text-xs text-slate-500">
                Manage hardware network IP configurations, sync logs, and test ping health.
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert('Device ping sweep completed: All 4 hardware controllers responsive.')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ping All Devices</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((d) => (
              <div key={d.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h4 className="text-xs font-bold text-slate-900">{d.name}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {d.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400">IP &amp; Port:</span>
                    <div className="font-mono font-bold text-slate-800">{d.ip}:{d.port}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Location:</span>
                    <div className="font-medium text-slate-800">{d.location}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Protocol:</span>
                    <div className="text-[11px] text-slate-700">{d.protocol}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Firmware:</span>
                    <div className="text-[11px] font-mono text-slate-700">{d.firmware}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">Today's Logs: <strong>{d.logsCount}</strong></span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => alert(`Synced 100% of punch records from ${d.name}`)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-[11px] font-bold cursor-pointer"
                    >
                      Pull Logs
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Pushing student and staff card database to ${d.ip}...`)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-bold cursor-pointer"
                    >
                      Sync Users
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RFID & BIOMETRIC TEMPLATE ENROLLMENT */}
      {activeTab === 'enrollment' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Student &amp; Staff RFID Card Assignment</h3>
              <p className="text-xs text-slate-500">
                Enroll physical smart cards or write Mifare/EM-Marine card serial numbers to user profiles.
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert('Pushed RFID card credentials to all turnstile controllers.')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Batch Push to Turnstiles</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Student Code</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">RFID Card UID</th>
                  <th className="py-2.5 px-3">Face Template Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.slice(0, 8).map((std, idx) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-800">{std.name}</td>
                    <td className="py-2.5 px-3 font-mono text-blue-600">{std.studentCode}</td>
                    <td className="py-2.5 px-3 text-slate-600">{std.className}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      {idx % 2 === 0 ? `E28011928340${idx}` : 'Unassigned'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          idx % 2 === 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {idx % 2 === 0 ? 'Enrolled' : 'Pending Capture'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Enrolling RFID card for ${std.name}... Please tap card on USB reader.`)}
                        className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[10px] font-bold cursor-pointer"
                      >
                        Enroll Card
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: EMERGENCY GATE RELAYS */}
      {activeTab === 'relay_control' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Physical Turnstile Relay &amp; Access Override</h3>
            <p className="text-xs text-slate-500">
              Immediate override commands for building security, fire evacuation, and visitor gates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Normal Operating Mode</span>
              </div>
              <p className="text-xs text-emerald-700">
                Turnstiles locked by default; opens only upon authorized biometric or RFID verification.
              </p>
              <button
                type="button"
                onClick={() => handleTriggerRelay('NORMAL_LOCK')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
              >
                Set Normal Lock
              </button>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
              <div className="font-bold text-rose-900 text-sm flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Fire / Emergency Evacuation</span>
              </div>
              <p className="text-xs text-rose-700">
                Immediately drops all turnstile arms and unlocks all electronic magnetic doors for free exit.
              </p>
              <button
                type="button"
                onClick={() => handleTriggerRelay('EMERGENCY_DROP_ARMS')}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition cursor-pointer shadow-xs"
              >
                Drop All Arms (Free Exit)
              </button>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
              <div className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Campus Lockdown</span>
              </div>
              <p className="text-xs text-amber-700">
                Freezes all RFID credentials and restricts ingress/egress until lifted by administrator.
              </p>
              <button
                type="button"
                onClick={() => handleTriggerRelay('CAMPUS_LOCKDOWN')}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
              >
                Trigger Lockdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Bus,
  Navigation,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Users,
  CheckCircle2,
  Radio,
  RefreshCw,
  Sliders,
  Send,
  Fuel,
  Gauge,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { Student } from '../types';

interface LiveBusGpsTrackerViewProps {
  students?: Student[];
}

export default function LiveBusGpsTrackerView({ students = [] }: LiveBusGpsTrackerViewProps) {
  const [selectedBusId, setSelectedBusId] = useState('BUS-01');
  const [activeTab, setActiveTab] = useState<'live_map' | 'manifest' | 'alerts' | 'drivers'>('live_map');
  const [isSimulatingMove, setIsSimulatingMove] = useState(true);
  const [busTrackerNotice, setBusTrackerNotice] = useState<string | null>(null);

  // Fleet data
  const [buses, setBuses] = useState([
    {
      id: 'BUS-01',
      numberPlate: 'ICT-LES-9821',
      routeTitle: 'Islamabad Express (F-6 to Campus)',
      driverName: 'Muhammad Tariq',
      driverPhone: '0300-8849102',
      speedKmh: 42,
      fuelPct: 78,
      status: 'In Transit',
      ignition: 'ON',
      currentLocation: '7th Avenue near Blue Area',
      nextStop: 'G-8 Markaz Stop',
      etaNextStop: '4 mins',
      totalCapacity: 45,
      studentsOnboard: 38,
      progressPct: 65,
      routeStops: [
        { id: 1, name: 'F-6/1 Super Market', time: '07:15 AM', status: 'Completed', students: 8 },
        { id: 2, name: 'F-8/3 Postal Colony', time: '07:28 AM', status: 'Completed', students: 12 },
        { id: 3, name: 'G-8 Markaz Stop', time: '07:42 AM', status: 'Next Stop', students: 10 },
        { id: 4, name: 'H-9 Higher Education Commission', time: '07:55 AM', status: 'Upcoming', students: 8 },
        { id: 5, name: 'The Educators Main Campus', time: '08:05 AM', status: 'Destination', students: 0 },
      ],
    },
    {
      id: 'BUS-02',
      numberPlate: 'ICT-RIZ-4412',
      routeTitle: 'Rawalpindi Satellite Town Route',
      driverName: 'Abdul Rehman',
      driverPhone: '0333-5192834',
      speedKmh: 35,
      fuelPct: 84,
      status: 'In Transit',
      ignition: 'ON',
      currentLocation: 'Murree Road near Chandni Chowk',
      nextStop: 'Faizabad Interchange',
      etaNextStop: '6 mins',
      totalCapacity: 45,
      studentsOnboard: 41,
      progressPct: 50,
      routeStops: [
        { id: 1, name: 'Commercial Market', time: '07:10 AM', status: 'Completed', students: 14 },
        { id: 2, name: '6th Road Flyover', time: '07:25 AM', status: 'Completed', students: 15 },
        { id: 3, name: 'Faizabad Interchange', time: '07:45 AM', status: 'Next Stop', students: 12 },
        { id: 4, name: 'I-8/2 Sector Stop', time: '07:58 AM', status: 'Upcoming', students: 0 },
        { id: 5, name: 'The Educators Main Campus', time: '08:10 AM', status: 'Destination', students: 0 },
      ],
    },
    {
      id: 'VAN-05',
      numberPlate: 'ICT-ISB-1190',
      routeTitle: 'Junior Wing Kindergarten Van',
      driverName: 'Sajid Mehmood',
      driverPhone: '0321-9982341',
      speedKmh: 28,
      fuelPct: 92,
      status: 'In Transit',
      ignition: 'ON',
      currentLocation: 'F-10/2 Roundabout',
      nextStop: 'F-11 Markaz',
      etaNextStop: '3 mins',
      totalCapacity: 18,
      studentsOnboard: 15,
      progressPct: 75,
      routeStops: [
        { id: 1, name: 'E-11/3 MPCHS', time: '07:20 AM', status: 'Completed', students: 5 },
        { id: 2, name: 'F-10 Markaz', time: '07:35 AM', status: 'Completed', students: 6 },
        { id: 3, name: 'F-11 Markaz', time: '07:48 AM', status: 'Next Stop', students: 4 },
        { id: 4, name: 'Junior Wing Campus', time: '08:00 AM', status: 'Destination', students: 0 },
      ],
    },
  ]);

  const activeBus = buses.find((b) => b.id === selectedBusId) || buses[0];

  // Simulated GPS Telemetry Drift
  useEffect(() => {
    if (!isSimulatingMove) return;

    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((b) => {
          if (b.id === selectedBusId) {
            const newSpeed = Math.floor(30 + Math.random() * 20);
            return {
              ...b,
              speedKmh: newSpeed,
            };
          }
          return b;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingMove, selectedBusId]);

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wide">
                Live Fleet GPS Engine
              </span>
              <span className="text-xs bg-white/15 px-2 py-0.5 rounded border border-white/20 text-amber-100 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                Real-Time Transport Telemetry &bull; Geofenced Parent Alerts
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              School Bus GPS Tracker &amp; Manifest
            </h1>
            <p className="text-amber-100 text-xs mt-1 max-w-2xl">
              Live tracking for parents and transport dispatchers with student RFID boarding manifests, speed telemetry, and proximity SMS triggers.
            </p>
          </div>

          {/* Vehicle Selector */}
          <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-lg border border-white/15">
            {buses.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBusId(b.id)}
                className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedBusId === b.id
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-amber-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>{b.id}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {busTrackerNotice && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>✓ {busTrackerNotice}</span>
          <button type="button" onClick={() => setBusTrackerNotice(null)} className="text-amber-700 hover:text-amber-950 font-bold">✕</button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 pt-2 rounded-t-xl">
        <div className="flex gap-2">
          {[
            { id: 'live_map', label: 'Interactive Live GPS Map', icon: Navigation },
            { id: 'manifest', label: 'Student Boarding Manifest', icon: Users },
            { id: 'alerts', label: 'Parent Geofence Alerts', icon: Radio },
            { id: 'drivers', label: 'Driver Dossier & Telemetry', icon: ShieldCheck },
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
                    ? 'border-amber-600 text-amber-700 bg-amber-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live GPS Satellite Feed (GPS / GLONASS Active)</span>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE LIVE GPS MAP & TELEMETRY */}
      {activeTab === 'live_map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Map Simulation Canvas */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Bus className="w-4 h-4 text-amber-600" />
                  <span>{activeBus.routeTitle}</span>
                </h3>
                <span className="text-[11px] text-slate-500">Plate: {activeBus.numberPlate} &bull; Driver: {activeBus.driverName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {activeBus.status}
                </span>
                <button
                  type="button"
                  onClick={() => alert('GPS coordinates refreshed from vehicle IoT transceiver.')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Custom Interactive Map Viewport Graphic */}
            <div className="w-full h-80 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
              {/* Map Road Grid Graphic Background */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]"></div>
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-blue-500 opacity-60"></div>

              {/* Map Floating HUD Info */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="bg-black/70 backdrop-blur-xs border border-white/20 p-2.5 rounded-lg text-white text-xs space-y-1">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">Current GPS Fix</div>
                  <div className="font-bold">{activeBus.currentLocation}</div>
                  <div className="text-[10px] text-slate-300">Lat: 33.7294° N &bull; Long: 73.0931° E</div>
                </div>

                <div className="bg-black/70 backdrop-blur-xs border border-white/20 p-2.5 rounded-lg text-right text-white text-xs space-y-1">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">Next Stop ETA</div>
                  <div className="font-bold text-amber-300">{activeBus.nextStop}</div>
                  <div className="text-[10px] text-slate-300 font-mono">Arriving in approx {activeBus.etaNextStop}</div>
                </div>
              </div>

              {/* Central Visual Route Progress Indicator */}
              <div className="relative z-10 my-auto">
                <div className="flex items-center justify-between text-xs text-white px-2 mb-2">
                  <span className="text-emerald-400 font-bold">Route Origin</span>
                  <div className="flex items-center gap-2 bg-amber-500 text-slate-950 px-3 py-1 rounded-full font-bold shadow-lg">
                    <Bus className="w-4 h-4 animate-bounce" />
                    <span>{activeBus.speedKmh} km/h</span>
                  </div>
                  <span className="text-blue-400 font-bold">Main Campus</span>
                </div>

                {/* Progress bar with stop checkpoints */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-1000"
                    style={{ width: `${activeBus.progressPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Map Footer Control Ribbon */}
              <div className="relative z-10 flex justify-between items-center text-[11px] text-slate-300 bg-black/60 backdrop-blur-xs p-2 rounded-lg border border-white/10">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" /> Speed: <strong>{activeBus.speedKmh} km/h</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-emerald-400" /> Fuel Level: <strong>{activeBus.fuelPct}%</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBusTrackerNotice(`Proximity notification dispatched to parents on ${activeBus.nextStop}!`);
                    setTimeout(() => setBusTrackerNotice(null), 4500);
                  }}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[10px] transition cursor-pointer"
                >
                  Trigger Parent 500m Alert
                </button>
              </div>
            </div>

            {/* Stops Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Scheduled Route Stops &amp; ETAs</h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {activeBus.routeStops.map((stop) => (
                  <div
                    key={stop.id}
                    className={`p-2.5 rounded-lg border text-xs ${
                      stop.status === 'Completed'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : stop.status === 'Next Stop'
                        ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-400'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                      <span>Stop #{stop.id}</span>
                      <span>{stop.time}</span>
                    </div>
                    <div className="font-bold truncate">{stop.name}</div>
                    <div className="text-[10px] mt-1 text-slate-500">
                      {stop.status === 'Completed' ? 'Departed' : stop.status === 'Next Stop' ? 'In Approach' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Driver Contact & Quick Telemetry */}
          <div className="lg:col-span-4 space-y-4">
            {/* Driver Dossier Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Assigned Vehicle Crew
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold text-sm">
                  MT
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{activeBus.driverName}</h5>
                  <p className="text-[11px] text-slate-500">Official Campus Transport Pilot</p>
                  <div className="text-[11px] font-mono text-blue-600 mt-0.5">{activeBus.driverPhone}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400">Onboard Students</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {activeBus.studentsOnboard} / {activeBus.totalCapacity}
                  </div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400">Ignition &amp; AC</div>
                  <div className="font-bold text-emerald-600 mt-0.5">Operational</div>
                </div>
              </div>

              <div className="pt-1 flex gap-2">
                <a
                  href={`tel:${activeBus.driverPhone}`}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg text-center transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Driver</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setBusTrackerNotice(`Broadcasting SOS security ping for ${activeBus.id} to Campus Admin!`);
                    setTimeout(() => setBusTrackerNotice(null), 5000);
                  }}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg transition border border-rose-200 cursor-pointer"
                >
                  SOS Alert
                </button>
              </div>
            </div>

            {/* Parent View Simulator Banner */}
            <div className="p-4 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-xl space-y-2">
              <div className="text-xs text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                <span>Parent Portal Mobile View</span>
              </div>
              <p className="text-xs text-slate-200">
                Parents see live bus ETA for their assigned pickup stop directly on their smartphone dashboard.
              </p>
              <div className="p-2.5 bg-white/10 rounded-lg text-[11px] text-amber-200 space-y-1">
                <div className="font-bold text-white">Pickup: G-8 Markaz Stop</div>
                <div>Status: Approaching &bull; ETA: ~4 mins</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT BOARDING MANIFEST */}
      {activeTab === 'manifest' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Passenger Manifest &bull; {activeBus.routeTitle} ({activeBus.studentsOnboard} Onboard)
              </h3>
              <p className="text-xs text-slate-500">
                Real-time RFID card tap records as students step onto the bus.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setBusTrackerNotice('Dispatched batch SMS to all remaining parents: Bus on route to school.');
                setTimeout(() => setBusTrackerNotice(null), 5000);
              }}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Route SMS</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Roll / Code</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Assigned Stop</th>
                  <th className="py-2.5 px-3">Boarding Status</th>
                  <th className="py-2.5 px-3">Tap Time</th>
                  <th className="py-2.5 px-3 text-right">Parent Notified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.slice(0, 7).map((std, idx) => {
                  const isBoarded = idx < 5;
                  return (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{std.name}</td>
                      <td className="py-2.5 px-3 font-mono text-blue-600">{std.studentCode}</td>
                      <td className="py-2.5 px-3 text-slate-600">{std.className}</td>
                      <td className="py-2.5 px-3 text-slate-700">{idx % 2 === 0 ? 'F-6/1 Stop' : 'F-8/3 Colony'}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isBoarded ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isBoarded ? 'On Board' : 'Awaiting Pickup'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                        {isBoarded ? `07:${15 + idx * 3} AM` : '--'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {isBoarded ? (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> SMS Sent
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PARENT GEOFENCE ALERTS */}
      {activeTab === 'alerts' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Geofence Proximity Automation Logs</h3>
            <p className="text-xs text-slate-500">
              Automatic triggers executed when school buses enter designated 500-meter radius zones of student homes.
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              { time: '07:27 AM', stop: 'F-8/3 Postal Colony', bus: 'BUS-01', count: 12, status: 'Triggered & Delivered' },
              { time: '07:14 AM', stop: 'F-6/1 Super Market', bus: 'BUS-01', count: 8, status: 'Triggered & Delivered' },
              { time: '07:08 AM', stop: 'Commercial Market', bus: 'BUS-02', count: 14, status: 'Triggered & Delivered' },
            ].map((log, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="font-bold text-slate-800">{log.stop}</span>
                    <span className="text-slate-500 text-[11px] ml-2">({log.bus})</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="text-slate-500">{log.count} Parents Notified</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {log.status}
                  </span>
                  <span className="font-mono text-slate-400">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DRIVERS & VEHICLE TELEMETRY */}
      {activeTab === 'drivers' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Fleet Drivers &amp; IoT Transceiver Telemetry</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {buses.map((b) => (
              <div key={b.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{b.id} &bull; {b.numberPlate}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {b.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>Driver: <strong>{b.driverName}</strong></div>
                  <div>Phone: <strong className="text-blue-600 font-mono">{b.driverPhone}</strong></div>
                  <div>Speed: <strong>{b.speedKmh} km/h</strong></div>
                  <div>Fuel: <strong>{b.fuelPct}%</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

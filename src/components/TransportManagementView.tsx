import { useState, useEffect } from 'react';
import {
  Bus,
  MapPin,
  Users,
  Fuel,
  Navigation,
  Clock,
  Phone,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Printer,
  Search,
  Sliders,
  DollarSign,
  Compass,
  FileSpreadsheet,
  Play,
  Pause,
  RotateCcw,
  Radio,
  BellRing,
} from 'lucide-react';
import {
  TransportVehicle,
  TransportRoute,
  StudentTransportEnrollment,
  VehicleFuelExpenseLog,
  Student,
} from '../types';
import {
  INITIAL_VEHICLES,
  INITIAL_ROUTES,
  INITIAL_STUDENT_TRANSPORT,
  INITIAL_FUEL_LOGS,
} from '../data/phase6Data';

interface TransportManagementViewProps {
  students: Student[];
  onAddExpense?: (exp: any) => void;
}

export default function TransportManagementView({
  students,
  onAddExpense,
}: TransportManagementViewProps) {
  const [activeTab, setActiveTab] = useState<'routes' | 'fleet' | 'students' | 'gps' | 'fuel' | 'report'>('routes');

  // Stores
  const [vehicles, setVehicles] = useState<TransportVehicle[]>(INITIAL_VEHICLES);
  const [routes, setRoutes] = useState<TransportRoute[]>(INITIAL_ROUTES);
  const [enrollments, setEnrollments] = useState<StudentTransportEnrollment[]>(INITIAL_STUDENT_TRANSPORT);
  const [fuelLogs, setFuelLogs] = useState<VehicleFuelExpenseLog[]>(INITIAL_FUEL_LOGS);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || 'rt-01');

  // New Student Enrollment Modal
  const [enrollModal, setEnrollModal] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    studentId: students[0]?.id || '',
    routeId: routes[0]?.id || '',
    stopName: routes[0]?.stops[0]?.stopName || '',
    monthlyFare: routes[0]?.monthlyFare || 5000,
  });

  // Fuel Log Modal
  const [fuelModal, setFuelModal] = useState(false);
  const [fuelForm, setFuelForm] = useState({
    vehicleId: vehicles[0]?.id || '',
    liters: 40,
    costPerLiter: 285,
    fuelStation: 'PSO Garrison Walton Road',
    odometerKm: 45000,
  });

  // Interactive Live GPS Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStopIndex, setActiveStopIndex] = useState(1);
  const [boardedStatus, setBoardedStatus] = useState<Record<string, 'Boarded' | 'Pending' | 'Absent'>>({
    'std-001': 'Boarded',
    'std-002': 'Boarded',
  });
  const [lastSmsAlert, setLastSmsAlert] = useState<string | null>(null);

  const currentRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const currentVehicle =
    vehicles.find((v) => v.vehicleNo === currentRoute?.vehicleNo) || vehicles[0];

  // GPS Step Simulation Loop
  useEffect(() => {
    let interval: any = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setActiveStopIndex((prev) => {
          const maxStops = currentRoute.stops.length;
          if (prev >= maxStops) {
            setIsSimulating(false);
            return maxStops;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, currentRoute.stops.length]);

  // Handle Enrollment
  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === enrollForm.studentId);
    const rt = routes.find((r) => r.id === enrollForm.routeId);
    if (!st || !rt) return;

    const stop = rt.stops.find((s) => s.stopName === enrollForm.stopName) || rt.stops[0];

    const newEnr: StudentTransportEnrollment = {
      id: `ste-${Date.now()}`,
      studentId: st.id,
      studentName: st.name,
      fatherName: st.fatherName,
      className: st.className,
      rollNo: st.rollNo,
      routeId: rt.id,
      routeName: rt.routeName,
      stopName: stop?.stopName || 'Campus Main Gate',
      monthlyFare: Number(enrollForm.monthlyFare),
      parentPhone: st.parentPhone,
      pickupTime: stop?.morningPickupTime || '07:30 AM',
      dropTime: stop?.afternoonDropTime || '02:15 PM',
      status: 'Active',
    };

    setEnrollments([newEnr, ...enrollments]);
    setEnrollModal(false);
    alert(`Student ${st.name} allocated to Route ${rt.routeCode} (${stop?.stopName})!`);
  };

  // Handle Fuel Log
  const handleAddFuel = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find((v) => v.id === fuelForm.vehicleId);
    if (!veh) return;

    const cost = Number(fuelForm.liters) * Number(fuelForm.costPerLiter);
    const newFuel: VehicleFuelExpenseLog = {
      id: `fuel-${Date.now()}`,
      vehicleId: veh.id,
      vehicleNo: veh.vehicleNo,
      date: new Date().toISOString().split('T')[0],
      fuelType: veh.fuelType,
      liters: Number(fuelForm.liters),
      costPerLiter: Number(fuelForm.costPerLiter),
      totalCost: cost,
      odometerKm: Number(fuelForm.odometerKm),
      fuelStation: fuelForm.fuelStation,
      driverName: veh.driverName,
    };

    setFuelLogs([newFuel, ...fuelLogs]);
    setFuelModal(false);

    if (onAddExpense) {
      onAddExpense({
        title: `Transport Fuel: ${veh.vehicleNo} (${fuelForm.liters}L ${veh.fuelType})`,
        category: 'Transport Fuel',
        amount: cost,
        date: newFuel.date,
        paidTo: fuelForm.fuelStation,
        paymentMode: 'Cash',
        receiptNo: `REC-FUEL-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }
    alert(`Fuel refill entry of PKR ${cost.toLocaleString()} logged in ledger!`);
  };

  return (
    <div id="transport-management-suite" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold shadow">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Transport &amp; Campus Fleet Management System
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Live Fleet Tracking
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Routes, pickup stops, student transport manifests, vehicle fitness, fuel logbooks &amp; GPS simulator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEnrollModal(true)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enroll Student in Van</span>
          </button>
          <button
            type="button"
            onClick={() => setFuelModal(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow transition"
          >
            <Fuel className="w-3.5 h-3.5 text-amber-300" />
            <span>Log Fuel Refill</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-xs flex flex-wrap items-center gap-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('routes')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'routes'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Navigation className="w-4 h-4 text-amber-400" />
          <span>Routes &amp; Stops Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fleet')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'fleet'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bus className="w-4 h-4 text-sky-400" />
          <span>Campus Fleet Registry</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('students')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'students'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Student Manifest &amp; Billing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gps')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'gps'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4 text-rose-400" />
          <span>Live GPS Route Tracker</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fuel')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'fuel'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Fuel className="w-4 h-4 text-amber-300" />
          <span>Fuel &amp; Maintenance Ledger</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('report')}
          className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeTab === 'report'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-violet-400" />
          <span>Transport Report</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: ROUTES & STOPS MATRIX */}
      {/* ============================================================ */}
      {activeTab === 'routes' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-amber-50/70 border-amber-500 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-[#002147] text-amber-300 font-bold font-mono text-xs">
                      {route.routeCode}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      PKR {route.monthlyFare.toLocaleString()}/mo
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{route.routeName}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-1">
                      <Bus className="w-3.5 h-3.5 text-amber-600" />
                      <span>{route.vehicleNo}</span>
                      <span>•</span>
                      <span>{route.driverName}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t flex items-center justify-between text-[11px] text-slate-600">
                    <span>{route.stops.length} Designated Stops</span>
                    <span className="font-bold text-emerald-700">
                      {route.totalStudentsEnrolled} Students Boarding
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Route Stops Detail Table */}
          {currentRoute && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-amber-600" />
                    <span>
                      Stops &amp; Timetable Routine: {currentRoute.routeName} ({currentRoute.routeCode})
                    </span>
                  </h3>
                  <p className="text-slate-500 text-[11px]">
                    Assigned Vehicle: {currentRoute.vehicleNo} • Driver: {currentRoute.driverName} (
                    {currentRoute.driverPhone})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert(`Driver manifest printed for ${currentRoute.routeName}!`)}
                    className="px-3 py-1.5 bg-[#002147] text-white rounded font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Print Driver Run Sheet</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">Stop #</th>
                      <th className="py-2.5 px-3">Designated Stop / Landmark</th>
                      <th className="py-2.5 px-3 text-center">Morning Pickup</th>
                      <th className="py-2.5 px-3 text-center">Afternoon Drop</th>
                      <th className="py-2.5 px-3 text-center">Enrolled Students</th>
                      <th className="py-2.5 px-3 text-right">Route Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentRoute.stops.map((st, i) => (
                      <tr key={st.id} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400">
                          {i + 1}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{st.stopName}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold text-emerald-800">
                          {st.morningPickupTime}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold text-sky-800">
                          {st.afternoonDropTime}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                          {st.studentsCount} Students
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-400">
                          Sequential Stop #{i + 1}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: CAMPUS FLEET REGISTRY */}
      {/* ============================================================ */}
      {activeTab === 'fleet' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {vehicles.map((veh) => {
              const occupancyPct = Math.round((veh.occupiedSeats / veh.seatingCapacity) * 100);
              return (
                <div
                  key={veh.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex items-start justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center font-mono font-black text-sm shadow">
                        {veh.vehicleNo.split('-')[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900 font-mono">
                            {veh.vehicleNo}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                            {veh.vehicleType}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs">{veh.model}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        veh.trackerStatus.includes('Moving')
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                          : veh.trackerStatus === 'Stationary'
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{veh.trackerStatus}</span>
                    </span>
                  </div>

                  {/* Driver & Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Driver Name</span>
                      <span className="font-bold text-slate-800">{veh.driverName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Driver Phone</span>
                      <span className="font-mono font-semibold text-indigo-700">{veh.driverPhone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">License #</span>
                      <span className="font-mono text-slate-700">{veh.driverLicenseNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Fuel Type</span>
                      <span className="font-bold text-amber-800">{veh.fuelType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Fitness Expiry</span>
                      <span className="font-mono text-slate-700">{veh.fitnessExpiryDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Current Location</span>
                      <span className="font-medium text-slate-800 truncate block">
                        {veh.currentLocationName.slice(0, 20)}...
                      </span>
                    </div>
                  </div>

                  {/* Seating Occupancy Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600">
                        Seating Capacity ({veh.occupiedSeats}/{veh.seatingCapacity} Seats Filled)
                      </span>
                      <span className="font-mono font-bold text-slate-800">{occupancyPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          occupancyPct > 90
                            ? 'bg-rose-500'
                            : occupancyPct > 70
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: STUDENT MANIFEST & BILLING */}
      {/* ============================================================ */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Student Transport Manifest &amp; Monthly Van Fee Roster
              </h3>
              <p className="text-slate-500 text-xs">
                Active students registered for school van service with pickup times &amp; guardian contacts
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEnrollModal(true)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enroll Student</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Printing Official Van Passenger Manifest...')}
                className="px-3.5 py-1.5 bg-[#002147] text-white rounded font-bold flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Print Van Manifest</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class &amp; Roll #</th>
                  <th className="py-2.5 px-3">Route Allocated</th>
                  <th className="py-2.5 px-3">Designated Stop</th>
                  <th className="py-2.5 px-3 text-center">Pickup / Drop</th>
                  <th className="py-2.5 px-3">Guardian Phone</th>
                  <th className="py-2.5 px-3 text-center">Monthly Fare</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {enr.studentName}
                      <span className="text-[10px] text-slate-400 block font-normal">
                        S/O {enr.fatherName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-800">{enr.className}</span>
                      <span className="font-mono text-sky-800 block text-[10px]">
                        Roll #{enr.rollNo}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{enr.routeName}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-amber-900 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        {enr.stopName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-600">
                      <div>{enr.pickupTime}</div>
                      <div className="text-slate-400 text-[10px]">{enr.dropTime}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-indigo-700 font-semibold">
                      {enr.parentPhone}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                      PKR {enr.monthlyFare.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        {enr.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: LIVE GPS ROUTE SIMULATOR */}
      {/* ============================================================ */}
      {activeTab === 'gps' && (
        <div className="space-y-4 text-xs">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Compass className={`w-4 h-4 text-rose-600 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>Live GPS Fleet Telematics Simulator</span>
              </h3>
              <p className="text-slate-500 text-xs">
                Real-time tracking of school vans and coasters across Lahore transit routes with automated parent SMS alerts
              </p>
            </div>

            {/* Simulation Control Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedRouteId}
                onChange={(e) => {
                  setSelectedRouteId(e.target.value);
                  setActiveStopIndex(0);
                  setIsSimulating(false);
                }}
                className="px-3 py-1.5 border rounded text-xs bg-white font-bold text-slate-800"
              >
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.routeCode} - {r.routeName}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-3.5 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 shadow-sm transition ${
                  isSimulating
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-900'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isSimulating ? 'Pause GPS Trip' : 'Start Live Trip'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveStopIndex(0);
                  setIsSimulating(false);
                  setLastSmsAlert(null);
                }}
                className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-bold text-xs flex items-center gap-1"
                title="Reset Route to Origin"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                SATELLITE SYNC OK
              </span>
            </div>
          </div>

          {/* SMS Broadcast Banner Alert if triggered */}
          {lastSmsAlert && (
            <div className="p-3 bg-emerald-900 text-white rounded-xl flex items-center justify-between border border-emerald-700 animate-fadeIn">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="font-semibold text-xs">{lastSmsAlert}</span>
              </div>
              <button
                type="button"
                onClick={() => setLastSmsAlert(null)}
                className="text-emerald-300 hover:text-white text-xs font-bold px-2 py-0.5"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Interactive Route Map Simulation Visualizer */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-6 relative overflow-hidden border border-slate-800">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-xs text-slate-400">Selected Route: </span>
                <span className="font-bold text-amber-400 text-sm">{currentRoute.routeName}</span>
                <span className="ml-2 px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">
                  {currentVehicle?.vehicleType || 'Van'} • Capacity {currentVehicle?.seatingCapacity || 18} Seats
                </span>
              </div>
              <div className="text-right font-mono flex items-center gap-2">
                <span className="text-xs text-slate-400">Vehicle Reg: </span>
                <span className="font-black text-sky-400 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                  {currentRoute.vehicleNo}
                </span>
              </div>
            </div>

            {/* Visual Route Track Waypoints */}
            <div className="py-6 px-4">
              <div className="relative flex items-center justify-between">
                {/* Connecting Track Line */}
                <div className="absolute left-0 right-0 h-1.5 bg-slate-700 top-1/2 -translate-y-1/2 z-0" />
                <div
                  className="absolute left-0 h-1.5 bg-gradient-to-r from-emerald-500 to-amber-500 top-1/2 -translate-y-1/2 z-0 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      100,
                      (activeStopIndex / Math.max(1, currentRoute.stops.length)) * 100
                    )}%`,
                  }}
                />

                {/* Waypoints */}
                {currentRoute.stops.map((st, idx) => {
                  const isPassed = idx < activeStopIndex;
                  const isCurrent = idx === activeStopIndex;
                  return (
                    <div
                      key={st.id}
                      onClick={() => setActiveStopIndex(idx)}
                      className="relative z-10 flex flex-col items-center text-center space-y-2 cursor-pointer group"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition transform group-hover:scale-110 ${
                          isCurrent
                            ? 'bg-amber-400 text-slate-900 ring-4 ring-amber-400/40 animate-bounce'
                            : isPassed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isCurrent ? <Bus className="w-5 h-5" /> : isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div className="max-w-[110px]">
                        <div
                          className={`font-bold text-[11px] ${
                            isCurrent ? 'text-amber-300 underline' : isPassed ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        >
                          {st.stopName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {st.morningPickupTime}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Destination Campus Terminal */}
                <div
                  onClick={() => setActiveStopIndex(currentRoute.stops.length)}
                  className="relative z-10 flex flex-col items-center text-center space-y-2 cursor-pointer group"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition transform group-hover:scale-110 ${
                      activeStopIndex >= currentRoute.stops.length
                        ? 'bg-emerald-400 text-slate-900 ring-4 ring-emerald-400/40'
                        : 'bg-indigo-700 text-amber-300'
                    }`}
                  >
                    {activeStopIndex >= currentRoute.stops.length ? <CheckCircle2 className="w-5 h-5" /> : 'TE'}
                  </div>
                  <div className="max-w-[110px]">
                    <div className="font-bold text-[11px] text-emerald-400">School Campus</div>
                    <div className="text-[10px] text-slate-400 font-mono">08:00 AM Gate In</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Telematics Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-[10px]">Transit Status / Speed</div>
                <div className="text-lg font-black text-emerald-400">
                  {activeStopIndex >= currentRoute.stops.length
                    ? 'Arrived at Campus (0 km/h)'
                    : isSimulating
                    ? '42 km/h In-Transit'
                    : 'Stopped at Waypoint'}
                </div>
                <div className="text-[10px] text-slate-500">Speed limit 45 km/h strictly adhered</div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-[10px]">Active Waypoint / ETA</div>
                <div className="text-lg font-black text-amber-400">
                  {activeStopIndex < currentRoute.stops.length
                    ? currentRoute.stops[activeStopIndex]?.stopName
                    : 'Campus Main Gate'}
                </div>
                <div className="text-[10px] text-slate-400 font-sans">
                  {activeStopIndex < currentRoute.stops.length
                    ? `Scheduled: ${currentRoute.stops[activeStopIndex]?.morningPickupTime}`
                    : 'Trip Completed'}
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-[10px]">Driver &amp; Conductor</div>
                <div className="text-sm font-bold text-sky-400">{currentRoute.driverName}</div>
                <div className="text-[10px] text-slate-300">{currentRoute.driverPhone}</div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                <div className="text-slate-400 text-[10px]">Stop Arrival Auto-SMS</div>
                <button
                  type="button"
                  onClick={() => {
                    const stopTitle =
                      activeStopIndex < currentRoute.stops.length
                        ? currentRoute.stops[activeStopIndex]?.stopName
                        : 'Main Campus Gate';
                    setLastSmsAlert(
                      `Automated SMS dispatched via mask [EDUCATORS]: "Van #${currentRoute.vehicleNo} has arrived at ${stopTitle}. Please send student to stop immediately."`
                    );
                  }}
                  className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-[10px] flex items-center justify-center gap-1 transition shadow cursor-pointer"
                >
                  <Radio className="w-3 h-3" />
                  <span>Send Arrival SMS</span>
                </button>
              </div>
            </div>

            {/* Passenger Boarding Checklist at Active Stop */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/60 font-sans">
              <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-sm text-slate-100">
                    Stop Passenger Boarding Checklist:{' '}
                    <span className="text-amber-300">
                      {activeStopIndex < currentRoute.stops.length
                        ? currentRoute.stops[activeStopIndex]?.stopName
                        : 'All Route Stops Completed'}
                    </span>
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {enrollments.filter((e) => e.routeId === currentRoute.id).length} Students Assigned
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {enrollments
                  .filter((e) => e.routeId === currentRoute.id)
                  .map((std) => {
                    const status = boardedStatus[std.studentId] || 'Pending';
                    return (
                      <div
                        key={std.id}
                        className="bg-slate-900/90 p-3 rounded-lg border border-slate-700 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-200">{std.studentName}</div>
                          <div className="text-[10px] text-slate-400">
                            {std.className} • {std.stopName}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setBoardedStatus((prev) => ({
                                ...prev,
                                [std.studentId]: status === 'Boarded' ? 'Pending' : 'Boarded',
                              }))
                            }
                            className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                              status === 'Boarded'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                          >
                            {status === 'Boarded' ? '✓ Boarded' : 'Board'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setBoardedStatus((prev) => ({
                                ...prev,
                                [std.studentId]: status === 'Absent' ? 'Pending' : 'Absent',
                              }))
                            }
                            className={`px-1.5 py-1 rounded text-[10px] font-bold transition ${
                              status === 'Absent'
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                            title="Mark Absent"
                          >
                            {status === 'Absent' ? 'Absent' : '✕'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: FUEL & MAINTENANCE LEDGER */}
      {/* ============================================================ */}
      {activeTab === 'fuel' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Vehicle Fuel &amp; Maintenance Expense Ledger
              </h3>
              <p className="text-slate-500 text-xs">
                Itemized diesel, petrol, and CNG refueling logs synchronized with the school accounts ledger
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFuelModal(true)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Log Refueling Entry</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Vehicle #</th>
                  <th className="py-2.5 px-3">Fuel Type</th>
                  <th className="py-2.5 px-3 text-center">Volume (Liters)</th>
                  <th className="py-2.5 px-3 text-center">Rate / Liter</th>
                  <th className="py-2.5 px-3 text-center">Total PKR Cost</th>
                  <th className="py-2.5 px-3 text-center">Odometer (KM)</th>
                  <th className="py-2.5 px-3">Fuel Station / Vendor</th>
                  <th className="py-2.5 px-3">Driver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {fuelLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 text-slate-600">{log.date}</td>
                    <td className="py-2.5 px-3 font-bold text-sky-800">{log.vehicleNo}</td>
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">
                      {log.fuelType}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                      {log.liters} L
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">PKR {log.costPerLiter}</td>
                    <td className="py-2.5 px-3 text-center font-black text-emerald-800 bg-emerald-50/50">
                      PKR {log.totalCost.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-700 font-bold">
                      {log.odometerKm.toLocaleString()} KM
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-700">{log.fuelStation}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                      {log.driverName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {enrollModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-300 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Bus className="w-4 h-4 text-amber-600" />
                <span>Enroll Student in School Van</span>
              </h4>
              <button
                type="button"
                onClick={() => setEnrollModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnrollStudent} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  value={enrollForm.studentId}
                  onChange={(e) => setEnrollForm({ ...enrollForm, studentId: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.className} - Roll #{st.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Van Route</label>
                <select
                  value={enrollForm.routeId}
                  onChange={(e) => {
                    const r = routes.find((rt) => rt.id === e.target.value);
                    setEnrollForm({
                      ...enrollForm,
                      routeId: e.target.value,
                      stopName: r?.stops[0]?.stopName || '',
                      monthlyFare: r?.monthlyFare || 5000,
                    });
                  }}
                  className="w-full px-3 py-1.5 border rounded bg-white"
                >
                  {routes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.routeCode}: {rt.routeName} (PKR {rt.monthlyFare}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Designated Boarding Stop</label>
                <select
                  value={enrollForm.stopName}
                  onChange={(e) => setEnrollForm({ ...enrollForm, stopName: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white"
                >
                  {routes
                    .find((r) => r.id === enrollForm.routeId)
                    ?.stops.map((st) => (
                      <option key={st.id} value={st.stopName}>
                        {st.stopName} (Pickup: {st.morningPickupTime})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Monthly Van Fare (PKR)</label>
                <input
                  type="number"
                  value={enrollForm.monthlyFare}
                  onChange={(e) => setEnrollForm({ ...enrollForm, monthlyFare: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border rounded font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEnrollModal(false)}
                  className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fuel Refill Modal */}
      {fuelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-300 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Fuel className="w-4 h-4 text-amber-600" />
                <span>Log Vehicle Refueling &amp; Odometer</span>
              </h4>
              <button
                type="button"
                onClick={() => setFuelModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFuel} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Vehicle</label>
                <select
                  value={fuelForm.vehicleId}
                  onChange={(e) => setFuelForm({ ...fuelForm, vehicleId: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded bg-white font-mono"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vehicleNo} ({v.model} - {v.fuelType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fuel Volume (Liters)</label>
                  <input
                    type="number"
                    value={fuelForm.liters}
                    onChange={(e) => setFuelForm({ ...fuelForm, liters: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate / Liter (PKR)</label>
                  <input
                    type="number"
                    value={fuelForm.costPerLiter}
                    onChange={(e) => setFuelForm({ ...fuelForm, costPerLiter: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Odometer (KM)</label>
                <input
                  type="number"
                  value={fuelForm.odometerKm}
                  onChange={(e) => setFuelForm({ ...fuelForm, odometerKm: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border rounded font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Petrol Pump / Station Name</label>
                <input
                  type="text"
                  value={fuelForm.fuelStation}
                  onChange={(e) => setFuelForm({ ...fuelForm, fuelStation: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded"
                />
              </div>

              <div className="p-2.5 bg-slate-50 rounded border text-[11px] flex justify-between items-center font-mono">
                <span className="text-slate-500 font-sans">Total Expenditure:</span>
                <span className="text-sm font-black text-emerald-800">
                  PKR {(fuelForm.liters * fuelForm.costPerLiter).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setFuelModal(false)}
                  className="px-3 py-1.5 border rounded text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white rounded font-bold"
                >
                  Save Fuel Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ============================================================ */}
      {/* TAB 6: TRANSPORT REPORT & FINANCIAL SUMMARY */}
      {/* ============================================================ */}
      {activeTab === 'report' && (
        <div className="space-y-4 text-xs">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Route Efficiency &amp; Financial Analytical Ledger</h3>
                <p className="text-[10px] text-slate-500">Comprehensive overview of route capacity, monthly recoveries, and fleet maintenance overheads.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alert('Exporting Transport Report to Microsoft Excel Worksheet (XLSX)...');
                  }}
                  className="px-2.5 py-1.5 bg-white border hover:bg-slate-50 text-slate-700 rounded font-bold flex items-center gap-1 transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="px-2.5 py-1.5 bg-[#002147] hover:bg-black text-white rounded font-bold flex items-center gap-1 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>
              </div>
            </div>

            {/* KPI Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <span className="text-[10px] uppercase font-black text-emerald-800 block">Total Est. Fare Collection</span>
                <span className="text-base font-black text-emerald-950 block mt-1">PKR 485,000 / month</span>
                <div className="text-[9px] text-emerald-700 mt-1">98.2% Fee recovery target achieved</div>
              </div>

              <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-[10px] uppercase font-black text-red-800 block">Logged Fuel Expense</span>
                <span className="text-base font-black text-red-950 block mt-1">
                  PKR {fuelLogs.reduce((acc, f) => acc + f.totalCost, 0).toLocaleString()}
                </span>
                <div className="text-[9px] text-red-700 mt-1">Based on {fuelLogs.length} recent refuel logs</div>
              </div>

              <div className="p-3 bg-sky-50 rounded-lg border border-sky-100">
                <span className="text-[10px] uppercase font-black text-sky-800 block">Average Fleet Occupancy</span>
                <span className="text-base font-black text-sky-950 block mt-1">84.5%</span>
                <div className="text-[9px] text-sky-700 mt-1">112 Students registered of 135 capacity</div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <span className="text-[10px] uppercase font-black text-amber-800 block">Fleet Operational Margin</span>
                <span className="text-base font-black text-amber-950 block mt-1">PKR 292,500</span>
                <div className="text-[9px] text-amber-700 mt-1">After fuel and driver salary logs</div>
              </div>
            </div>

            {/* Financial Spreadsheet Table */}
            <div className="border rounded-lg overflow-hidden mb-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-2.5 font-black text-slate-700">Route Info</th>
                    <th className="p-2.5 font-black text-slate-700 text-center">Enrolled Pupils</th>
                    <th className="p-2.5 font-black text-slate-700 text-right">Est. Monthly Fare (PKR)</th>
                    <th className="p-2.5 font-black text-slate-700 text-right">Fuel Logged (PKR)</th>
                    <th className="p-2.5 font-black text-slate-700 text-right">Driver Wages (PKR)</th>
                    <th className="p-2.5 font-black text-slate-700 text-right">Net Margin</th>
                    <th className="p-2.5 font-black text-slate-700 text-center">Route Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {routes.map((rt) => {
                    const enrCount = enrollments.filter((e) => e.routeId === rt.id).length;
                    const routeFuel = fuelLogs
                      .filter((f) => f.vehicleNo === rt.vehicleNo)
                      .reduce((acc, fl) => acc + fl.totalCost, 0);
                    const estFare = rt.monthlyFare * (enrCount || 15);
                    const driverSalary = 35000;
                    const netMargin = estFare - routeFuel - driverSalary;
                    const isProfit = netMargin > 0;

                    return (
                      <tr key={rt.id} className="hover:bg-slate-50 font-mono text-[11px]">
                        <td className="p-2.5 font-sans font-bold text-slate-900">
                          <div>{rt.routeName}</div>
                          <div className="text-[9px] text-slate-500 font-normal mt-0.5">
                            Van {rt.vehicleNo} • Route Code: {rt.routeCode}
                          </div>
                        </td>
                        <td className="p-2.5 text-center font-sans font-semibold text-slate-800">
                          {enrCount || 15} Students
                        </td>
                        <td className="p-2.5 text-right font-semibold text-emerald-800">
                          PKR {estFare.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-right text-red-700">
                          PKR {routeFuel.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-right text-slate-600">
                          PKR {driverSalary.toLocaleString()}
                        </td>
                        <td className={`p-2.5 text-right font-black ${isProfit ? 'text-emerald-700' : 'text-red-700'}`}>
                          PKR {netMargin.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Profit-Making
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Driver Performance Matrix */}
            <div className="bg-slate-50 p-3 rounded-lg border">
              <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-600" />
                <span>Driver Road Compliance &amp; Punctuality Matrix</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Driver: Muhammad Altaf</span>
                    <span className="text-xs text-emerald-600 font-black">4.9 ★</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Route Code: RT-01 • Vehicle: LXT-2026</p>
                  <div className="mt-2 text-[9px] text-emerald-800 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Speed compliance check: 100% OK</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Driver: Sajjad Bhatti</span>
                    <span className="text-xs text-emerald-600 font-black">4.7 ★</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Route Code: RT-02 • Vehicle: LZR-7110</p>
                  <div className="mt-2 text-[9px] text-emerald-800 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Speed compliance check: 100% OK</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Driver: Riaz Ahmed</span>
                    <span className="text-xs text-amber-600 font-black">4.3 ★</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Route Code: RT-03 • Vehicle: LHA-4200</p>
                  <div className="mt-2 text-[9px] text-amber-800 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Minor delay logs (due to road repairs)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

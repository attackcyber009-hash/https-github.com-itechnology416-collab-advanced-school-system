import React, { useState } from 'react';
import {
  Wrench,
  Truck,
  Sun,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Printer,
  Plus,
  Search,
  Filter,
  Activity,
  Shield,
  Fuel,
  MapPin,
  Flame,
  BatteryCharging,
  Layers,
  FileText,
} from 'lucide-react';
import {
  CampusFacilityWorkOrder,
  SchoolFleetVehicleLog,
  CampusEnergySolarTelemetry,
} from '../types';
import {
  INITIAL_FACILITY_WORK_ORDERS,
  INITIAL_FLEET_VEHICLE_LOGS,
  INITIAL_ENERGY_SOLAR_TELEMETRY,
} from '../data/phase13Data';

interface FacilityFleetMaintenanceViewProps {
  onPrintWorkOrder?: (wo: CampusFacilityWorkOrder) => void;
  onPrintFleetLog?: (fleet: SchoolFleetVehicleLog) => void;
}

export default function FacilityFleetMaintenanceView({
  onPrintWorkOrder,
  onPrintFleetLog,
}: FacilityFleetMaintenanceViewProps) {
  const [activeTab, setActiveTab] = useState<'work_orders' | 'fleet_logs' | 'energy_telemetry'>('work_orders');
  const [workOrders, setWorkOrders] = useState<CampusFacilityWorkOrder[]>(INITIAL_FACILITY_WORK_ORDERS);
  const [fleetLogs, setFleetLogs] = useState<SchoolFleetVehicleLog[]>(INITIAL_FLEET_VEHICLE_LOGS);
  const [energyTelemetry, setEnergyTelemetry] = useState<CampusEnergySolarTelemetry>(INITIAL_ENERGY_SOLAR_TELEMETRY);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isCreatingWO, setIsCreatingWO] = useState(false);

  // New Work Order Form States
  const [woCategory, setWoCategory] = useState<CampusFacilityWorkOrder['category']>('HVAC & Air Conditioning');
  const [location, setLocation] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [priority, setPriority] = useState<CampusFacilityWorkOrder['priority']>('Standard Preventive');
  const [problemSummary, setProblemSummary] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(5000);
  const [assignedTechnician, setAssignedTechnician] = useState('Ustad Aslam (HVAC)');

  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchSearch =
      wo.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.problemSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.assignedTechnician.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || wo.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleCreateWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !problemSummary) return;

    const newWO: CampusFacilityWorkOrder = {
      id: `WO-${Date.now().toString().slice(-4)}`,
      workOrderNumber: `WO-2024-${Math.floor(100 + Math.random() * 900)}`,
      category: woCategory,
      location,
      reportedBy: reportedBy || 'Campus Duty Incharge',
      reportedAt: 'Today, Just now',
      priority,
      status: 'Reported / Queued',
      assignedTechnician,
      estimatedCostPkr: Number(estimatedCost),
      problemSummary,
      materialsUsed: ['Standard Maintenance Kit / Spare Parts'],
    };

    setWorkOrders([newWO, ...workOrders]);
    setIsCreatingWO(false);
    setLocation('');
    setProblemSummary('');
  };

  const handleUpdateStatus = (id: string, status: CampusFacilityWorkOrder['status']) => {
    setWorkOrders(
      workOrders.map((wo) =>
        wo.id === id
          ? {
              ...wo,
              status,
              actualCostPkr: status === 'Resolved & Closed' ? wo.estimatedCostPkr : wo.actualCostPkr,
            }
          : wo
      )
    );
  };

  return (
    <div id="facility-fleet-view" className="space-y-4">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-950 via-[#002147] to-amber-950 rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/20 rounded-lg text-amber-300 border border-amber-500/30">
              <Wrench className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Campus Facility, Fleet Maintenance &amp; Solar Telemetry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950">
              Phase 13
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Computerized Maintenance Management System (CMMS), School Van/Coaster GPS fleet tracker, Genset fuel audit &amp; on-grid solar telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreatingWO(!isCreatingWO)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingWO ? 'Close Form' : 'Create Work Order'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('work_orders')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'work_orders'
              ? 'border-amber-600 text-amber-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4 text-amber-600" />
          <span>Facility Work Orders ({workOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fleet_logs')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'fleet_logs'
              ? 'border-amber-600 text-amber-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="w-4 h-4 text-blue-600" />
          <span>School Fleet &amp; GPS Telemetry ({fleetLogs.length} Vehicles)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('energy_telemetry')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'energy_telemetry'
              ? 'border-amber-600 text-amber-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Solar Net-Metering &amp; Genset Fuel Audit</span>
        </button>
      </div>

      {/* TAB 1: WORK ORDERS (CMMS) */}
      {activeTab === 'work_orders' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          {isCreatingWO && (
            <form onSubmit={handleCreateWorkOrder} className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
              <div className="font-bold text-amber-900 text-sm">Issue New Facility Work Order:</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block">Category *</label>
                  <select
                    value={woCategory}
                    onChange={(e) => setWoCategory(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="HVAC & Air Conditioning">HVAC &amp; Air Conditioning</option>
                    <option value="Electrical & Genset">Electrical &amp; Genset</option>
                    <option value="Plumbing & Water Filtration">Plumbing &amp; Water Filtration (RO)</option>
                    <option value="Civil & Furniture">Civil &amp; Furniture</option>
                    <option value="IT & Smart Board">IT &amp; Smart Board</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">Location / Wing *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Science Wing Room 204"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">Reported By</label>
                  <input
                    type="text"
                    placeholder="e.g. Sir Tariq Jamil"
                    value={reportedBy}
                    onChange={(e) => setReportedBy(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="Critical (Safety / Exam Impact)">Critical (Safety / Exam Impact)</option>
                    <option value="High Priority">High Priority</option>
                    <option value="Standard Preventive">Standard Preventive</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">Assigned Specialist Technician</label>
                  <select
                    value={assignedTechnician}
                    onChange={(e) => setAssignedTechnician(e.target.value)}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="Ustad Aslam (HVAC Master Electrician)">Ustad Aslam (HVAC Master)</option>
                    <option value="Rashid Plumber (RO Plant Lead)">Rashid Plumber (RO Lead)</option>
                    <option value="Engr. Zohaib (Genset Tech)">Engr. Zohaib (Genset Tech)</option>
                    <option value="IT Support Fahad">IT Support Fahad</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">Estimated Budget (PKR)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block">Problem Breakdown Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe technical defect or maintenance requirement..."
                  value={problemSummary}
                  onChange={(e) => setProblemSummary(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreatingWO(false)}
                  className="px-4 py-1.5 border rounded font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-amber-700 text-white rounded font-bold hover:bg-amber-800"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          )}

          {/* Search & Filter */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search work order #, location, technician..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-1.5 border rounded bg-white text-xs font-semibold"
              >
                <option value="ALL">All Categories</option>
                <option value="HVAC & Air Conditioning">HVAC</option>
                <option value="Electrical & Genset">Electrical &amp; Genset</option>
                <option value="Plumbing & Water Filtration">Plumbing / RO</option>
                <option value="IT & Smart Board">IT Smart Board</option>
              </select>
            </div>
          </div>

          {/* Work Orders List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWorkOrders.map((wo) => (
              <div
                key={wo.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-sm transition space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-900 text-sm">
                        {wo.workOrderNumber}
                      </span>
                      <span className="px-2 py-0.2 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                        {wo.category}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs mt-1">{wo.location}</div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      wo.status === 'Resolved & Closed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : wo.status === 'Work in Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {wo.status}
                  </span>
                </div>

                <p className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100 text-[11px]">
                  {wo.problemSummary}
                </p>

                {wo.resolutionNotes && (
                  <div className="text-[11px] text-emerald-900 bg-emerald-50/70 p-2 rounded border border-emerald-200">
                    <strong>Tech Findings:</strong> {wo.resolutionNotes}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-[11px] border-t pt-2 text-slate-600">
                  <div>
                    <div>Technician: <strong>{wo.assignedTechnician}</strong></div>
                    <div>Reported by: {wo.reportedBy}</div>
                  </div>
                  <div className="text-right">
                    <div>Est. Cost: <strong>Rs. {wo.estimatedCostPkr.toLocaleString()}</strong></div>
                    {wo.actualCostPkr && (
                      <div className="text-emerald-700 font-bold">
                        Actual: Rs. {wo.actualCostPkr.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(wo.id, 'Work in Progress')}
                      className="px-2 py-0.5 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded text-[10px] font-bold"
                    >
                      In Progress
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(wo.id, 'Resolved & Closed')}
                      className="px-2 py-0.5 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 rounded text-[10px] font-bold"
                    >
                      Close Order
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onPrintWorkOrder) onPrintWorkOrder(wo);
                      else alert(`Printing Official Work Order Slip for ${wo.workOrderNumber}`);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-[11px] flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FLEET LOGS & GPS TELEMETRY */}
      {activeTab === 'fleet_logs' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Campus Transport Fleet Live GPS Tracking &amp; Fitness Compliance
              </h3>
              <p className="text-slate-500 text-[11px]">
                Active GPS speed telemetry, fuel efficiency (Km/L), driver safety records &amp; periodic fitness certification.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px]">
              🟢 GPS Server Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fleetLogs.map((fleet) => (
              <div
                key={fleet.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 hover:bg-white transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono font-bold text-slate-900 text-base">{fleet.vehicleNumber}</div>
                    <div className="text-[11px] text-slate-600 font-semibold">{fleet.vehicleType}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      fleet.gpsTrackingStatus.includes('In Transit')
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {fleet.gpsTrackingStatus}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Assigned Route:</div>
                  <div className="font-bold text-slate-900">{fleet.routeAssigned}</div>
                  <div className="text-slate-600 flex justify-between pt-1">
                    <span>Driver: <strong>{fleet.driverName}</strong></span>
                    <span className="font-mono text-cyan-800">{fleet.driverPhone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2 bg-white rounded border text-center text-[10px]">
                  <div>
                    <div className="text-slate-500">Live Speed</div>
                    <div className="font-bold text-emerald-700 text-xs">{fleet.currentGpsSpeedKmh} km/h</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Odometer</div>
                    <div className="font-bold text-slate-900 text-xs">{fleet.currentOdometerKm.toLocaleString()} km</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Efficiency</div>
                    <div className="font-bold text-slate-900 text-xs">{fleet.fuelEfficiencyKmPerLiter} km/L</div>
                  </div>
                </div>

                <div className="text-[10px] space-y-1 text-slate-600 border-t pt-2">
                  <div className="flex justify-between">
                    <span>Monthly Fuel Consumed:</span>
                    <strong>Rs. {fleet.monthlyFuelConsumedPkr.toLocaleString()} / {fleet.monthlyFuelBudgetPkr.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Fitness Certificate:</span>
                    <strong className="text-emerald-800">{fleet.fitnessCertificateExpiry}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Safety Metric:</span>
                    <strong className="text-slate-900">{fleet.safetyRating}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onPrintFleetLog) onPrintFleetLog(fleet);
                    else alert(`Printing Official Vehicle Dossier for ${fleet.vehicleNumber}`);
                  }}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-[11px] flex items-center justify-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Vehicle Fitness &amp; Fuel Dossier</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SOLAR NET-METERING & GENSET FUEL */}
      {activeTab === 'energy_telemetry' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="border-b pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Campus Green Energy Telemetry &amp; Power Infrastructure Monitor
            </h3>
            <p className="text-slate-500 text-[11px]">
              Real-time solar PV generation (kW), NEPRA net-metering export units, diesel generator reserve and daily carbon offset tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-1">
              <Sun className="w-6 h-6 text-amber-600 mx-auto" />
              <div className="text-slate-600 text-[10px] uppercase font-bold">Solar Generation</div>
              <div className="text-2xl font-black text-amber-900">{energyTelemetry.solarGenerationKw} kW</div>
              <div className="text-[10px] text-amber-700 font-semibold">100 kW On-Grid System Active</div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center space-y-1">
              <Zap className="w-6 h-6 text-blue-600 mx-auto" />
              <div className="text-slate-600 text-[10px] uppercase font-bold">Grid Import (LESCO)</div>
              <div className="text-2xl font-black text-blue-900">{energyTelemetry.gridImportKw} kW</div>
              <div className="text-[10px] text-blue-700 font-semibold">Net Metering Feed Active</div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1">
              <Flame className="w-6 h-6 text-emerald-600 mx-auto" />
              <div className="text-slate-600 text-[10px] uppercase font-bold">Exported Units (Month)</div>
              <div className="text-2xl font-black text-emerald-900">{energyTelemetry.netMeteringUnitsExported} kWh</div>
              <div className="text-[10px] text-emerald-700 font-semibold">~Rs. 185,000 WAPDA Credit</div>
            </div>

            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-center space-y-1">
              <Fuel className="w-6 h-6 text-slate-700 mx-auto" />
              <div className="text-slate-600 text-[10px] uppercase font-bold">Genset Diesel Reserve</div>
              <div className="text-2xl font-black text-slate-900">{energyTelemetry.dieselGensetFuelLiters} L</div>
              <div className="text-[10px] text-slate-600 font-semibold">150 kVA Cummins (Standby)</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>Campus Micro-Grid Operational Status:</span>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                {energyTelemetry.gridPowerStatus}
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              The primary academic block is running under 82% solar self-consumption. Excess 24.2 kW power is currently being injected into the LESCO 11kV distribution feeder through the bidirectional net meter.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

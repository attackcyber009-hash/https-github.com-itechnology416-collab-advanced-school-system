import React, { useState } from 'react';
import {
  FlaskConical,
  Microscope,
  Cpu,
  Atom,
  AlertOctagon,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Wrench,
  Printer,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import {
  ScienceLabAsset,
  LabMaintenanceLog,
} from '../types';
import {
  INITIAL_LAB_ASSETS,
  INITIAL_LAB_MAINTENANCE,
} from '../data/phase8Data';

interface LabAssetsInventoryViewProps {
  onPrintAssetTag?: (data: any) => void;
}

export default function LabAssetsInventoryView({
  onPrintAssetTag,
}: LabAssetsInventoryViewProps) {
  const [assets, setAssets] = useState<ScienceLabAsset[]>(INITIAL_LAB_ASSETS);
  const [maintenanceLogs, setMaintenanceLogs] = useState<LabMaintenanceLog[]>(INITIAL_LAB_MAINTENANCE);

  const [selectedLabType, setSelectedLabType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  // New Asset Form State
  const [assetForm, setAssetForm] = useState<{
    labType: 'Physics Lab' | 'Chemistry Lab' | 'Biology Lab' | 'Computer & Robotics Lab';
    itemName: string;
    specification: string;
    category: any;
    totalQty: number;
    workingQty: number;
    rackLocation: string;
    unitCostPkr: number;
    safetyHazard: any;
    inCharge: string;
  }>({
    labType: 'Physics Lab',
    itemName: 'Digital Multimeter (True RMS 600V)',
    specification: 'Auto-ranging digital DMM with thermocouple temperature probe',
    category: 'Precision Instrument',
    totalQty: 10,
    workingQty: 10,
    rackLocation: 'Physics Locker Station D',
    unitCostPkr: 4500,
    safetyHazard: 'Safe',
    inCharge: 'Sir Tariq Jamil',
  });

  // Filtered Assets
  const filteredAssets = assets.filter((a) => {
    const matchesLab = selectedLabType === 'All' || a.labType === selectedLabType;
    const matchesSearch =
      a.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.specification.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLab && matchesSearch;
  });

  const totalAssetValue = assets.reduce((acc, a) => acc + a.totalQuantity * a.unitCostPkr, 0);
  const totalWorkingItems = assets.reduce((acc, a) => acc + a.workingQuantity, 0);
  const hazardousItemsCount = assets.filter((a) => a.safetyHazardLevel === 'Corrosive / Hazardous').length;

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const labPrefixMap: Record<string, string> = {
      'Physics Lab': 'LAB-PHY',
      'Chemistry Lab': 'LAB-CHM',
      'Biology Lab': 'LAB-BIO',
      'Computer & Robotics Lab': 'LAB-IT',
    };

    const newAsset: ScienceLabAsset = {
      id: `lab-${Date.now()}`,
      assetCode: `${labPrefixMap[assetForm.labType] || 'LAB'}-${Math.floor(100 + Math.random() * 900)}`,
      labType: assetForm.labType,
      itemName: assetForm.itemName,
      specification: assetForm.specification,
      category: assetForm.category,
      totalQuantity: Number(assetForm.totalQty),
      workingQuantity: Number(assetForm.workingQty),
      underRepairQuantity: Number(assetForm.totalQty) - Number(assetForm.workingQty),
      rackCabinetLocation: assetForm.rackLocation,
      purchaseDate: new Date().toISOString().split('T')[0],
      unitCostPkr: Number(assetForm.unitCostPkr),
      safetyHazardLevel: assetForm.safetyHazard,
      status: 'Operational',
      inChargeStaff: assetForm.inCharge,
    };

    setAssets([newAsset, ...assets]);
    setShowAddAssetModal(false);
    alert(`Added Lab Asset: ${newAsset.assetCode} - ${newAsset.itemName}`);
  };

  return (
    <div id="lab-assets-suite" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-cyan-400/20 rounded-lg text-cyan-300 border border-cyan-400/30">
              <FlaskConical className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Science, IT &amp; STEM Robotics Lab Equipment Directorate
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-400 text-slate-900">
              Phase 8
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Asset tracking for Physics, Chemistry, Biology &amp; Computer Workstations, PCSIR calibration standards, chemical vault safety tags, and printable barcode labels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddAssetModal(true)}
            className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lab Equipment</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Lab Inventory Value
            </div>
            <div className="text-xl font-black text-[#002147] mt-0.5">
              PKR {(totalAssetValue / 1000000).toFixed(2)}M
            </div>
            <div className="text-[10px] text-slate-400">Physics, Chem, Bio, IT Labs</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Working Apparatus
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">
              {totalWorkingItems} Units
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold">98.2% Operational State</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              High-Risk Chemical Vaults
            </div>
            <div className="text-xl font-black text-rose-600 mt-0.5">
              {hazardousItemsCount} Vaults
            </div>
            <div className="text-[10px] text-rose-600 font-medium">Fume Sealed &amp; Padlocked</div>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              PCSIR Calibrations
            </div>
            <div className="text-xl font-black text-cyan-700 mt-0.5">All Clear</div>
            <div className="text-[10px] text-cyan-600 font-medium">Next Due: Nov 2024</div>
          </div>
          <div className="p-2.5 bg-cyan-50 text-cyan-700 rounded-lg">
            <Wrench className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap gap-1.5 font-bold">
            {['All', 'Physics Lab', 'Chemistry Lab', 'Biology Lab', 'Computer & Robotics Lab'].map(
              (lab) => (
                <button
                  key={lab}
                  type="button"
                  onClick={() => setSelectedLabType(lab)}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    selectedLabType === lab
                      ? 'bg-[#002147] text-white border-[#002147]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lab}
                </button>
              )
            )}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Search apparatus, code, specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1 border border-slate-200 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Table of Assets */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#002147] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Asset Code</th>
                <th className="p-3">Lab Division</th>
                <th className="p-3">Apparatus &amp; Model</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">Qty (Working/Total)</th>
                <th className="p-3">Cabinet / Rack</th>
                <th className="p-3">Safety Tag</th>
                <th className="p-3">Incharge</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono font-bold text-cyan-900">{asset.assetCode}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[10px]">
                      {asset.labType}
                    </span>
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="font-bold text-slate-900">{asset.itemName}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{asset.specification}</div>
                  </td>
                  <td className="p-3 font-medium text-slate-700">{asset.category}</td>
                  <td className="p-3 text-center font-mono font-bold">
                    <span className="text-emerald-700">{asset.workingQuantity}</span>
                    <span className="text-slate-400"> / </span>
                    <span className="text-slate-800">{asset.totalQuantity}</span>
                  </td>
                  <td className="p-3 font-medium text-slate-600">{asset.rackCabinetLocation}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        asset.safetyHazardLevel === 'Corrosive / Hazardous'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : asset.safetyHazardLevel === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {asset.safetyHazardLevel === 'Corrosive / Hazardous' ? '⚠️ ' : ''}
                      {asset.safetyHazardLevel}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{asset.inChargeStaff}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (onPrintAssetTag) {
                          onPrintAssetTag({
                            assetCode: asset.assetCode,
                            itemName: asset.itemName,
                            labType: asset.labType,
                            rackLocation: asset.rackCabinetLocation,
                            inCharge: asset.inChargeStaff,
                            purchaseDate: asset.purchaseDate,
                            hazardLevel: asset.safetyHazardLevel,
                          });
                        } else {
                          alert(`Printing Barcode Tag for ${asset.assetCode}`);
                        }
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-[10px] inline-flex items-center gap-1 shadow-xs"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Barcode Tag</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance & Safety Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-700" />
            <h3 className="font-bold text-slate-900 text-sm">
              Calibration, Reagent Replenishment &amp; Safety Eyewash Logs
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {maintenanceLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs flex justify-between items-center"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-[#002147]">{log.assetName}</div>
                <div className="text-slate-600">
                  {log.maintenanceType} • Technician: <strong>{log.technicianName}</strong>
                </div>
                <div className="text-[10px] text-slate-500">
                  Completed on: {log.date} • Next Due: <strong>{log.nextScheduledDate}</strong>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                  {log.status}
                </span>
                <div className="text-[11px] font-mono font-bold text-slate-700 mt-1">
                  PKR {log.costPkr.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: ADD LAB EQUIPMENT */}
      {showAddAssetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-slate-900 text-base">Add Lab Apparatus / Hardware</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAssetModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Laboratory *</label>
                <select
                  value={assetForm.labType}
                  onChange={(e) =>
                    setAssetForm({ ...assetForm, labType: e.target.value as any })
                  }
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="Physics Lab">Physics Lab</option>
                  <option value="Chemistry Lab">Chemistry Lab</option>
                  <option value="Biology Lab">Biology Lab</option>
                  <option value="Computer & Robotics Lab">Computer & Robotics Lab</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Equipment / Item Name *</label>
                <input
                  type="text"
                  required
                  value={assetForm.itemName}
                  onChange={(e) => setAssetForm({ ...assetForm, itemName: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Technical Specification</label>
                <textarea
                  rows={2}
                  value={assetForm.specification}
                  onChange={(e) => setAssetForm({ ...assetForm, specification: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={assetForm.category}
                    onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Precision Instrument">Precision Instrument</option>
                    <option value="Glassware">Glassware</option>
                    <option value="Chemical Reagent">Chemical Reagent</option>
                    <option value="Specimen / Model">Specimen / Model</option>
                    <option value="IT Hardware">IT Hardware</option>
                    <option value="Robotics / Microcontroller">Robotics / Microcontroller</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Safety Hazard</label>
                  <select
                    value={assetForm.safetyHazard}
                    onChange={(e) => setAssetForm({ ...assetForm, safetyHazard: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Safe">Safe</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Corrosive / Hazardous">Corrosive / Hazardous</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Quantity *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={assetForm.totalQty}
                    onChange={(e) =>
                      setAssetForm({
                        ...assetForm,
                        totalQty: Number(e.target.value),
                        workingQty: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Cost (PKR)</label>
                  <input
                    type="number"
                    value={assetForm.unitCostPkr}
                    onChange={(e) =>
                      setAssetForm({ ...assetForm, unitCostPkr: Number(e.target.value) })
                    }
                    className="w-full p-2 border rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rack / Cabinet Location</label>
                <input
                  type="text"
                  value={assetForm.rackLocation}
                  onChange={(e) => setAssetForm({ ...assetForm, rackLocation: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Incharge Staff</label>
                <input
                  type="text"
                  value={assetForm.inCharge}
                  onChange={(e) => setAssetForm({ ...assetForm, inCharge: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import {
  Home,
  Utensils,
  ShoppingBag,
  Bed,
  CheckCircle,
  AlertCircle,
  Users,
  Printer,
  Plus,
  Search,
  Award,
  Coffee,
  Heart,
  ShieldCheck,
  Tag,
  DollarSign,
  Package,
} from 'lucide-react';
import {
  HostelRoomBedAllotment,
  MessWeeklyNutritionMenu,
  CafeteriaInventoryItem,
} from '../types';
import {
  INITIAL_HOSTEL_ROOMS,
  INITIAL_MESS_MENUS,
  INITIAL_CAFETERIA_INVENTORY,
} from '../data/phase14Data';

interface HostelCafeteriaInventoryViewProps {
  onPrintHostelDossier?: (room: HostelRoomBedAllotment) => void;
  onPrintMessMenu?: (menu: MessWeeklyNutritionMenu) => void;
  onPrintInventoryTag?: (item: CafeteriaInventoryItem) => void;
}

export default function HostelCafeteriaInventoryView({
  onPrintHostelDossier,
  onPrintMessMenu,
  onPrintInventoryTag,
}: HostelCafeteriaInventoryViewProps) {
  const [activeTab, setActiveTab] = useState<'hostel' | 'mess' | 'cafeteria'>('hostel');

  const [hostelRooms, setHostelRooms] = useState<HostelRoomBedAllotment[]>(INITIAL_HOSTEL_ROOMS);
  const [messMenus, setMessMenus] = useState<MessWeeklyNutritionMenu[]>(INITIAL_MESS_MENUS);
  const [inventory, setInventory] = useState<CafeteriaInventoryItem[]>(INITIAL_CAFETERIA_INVENTORY);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  // New Room State
  const [roomNumber, setRoomNumber] = useState('');
  const [wingName, setWingName] = useState<HostelRoomBedAllotment['wingName']>('Jinnah Boys Boarding Wing');
  const [capacityBeds, setCapacityBeds] = useState(2);
  const [wardenName, setWardenName] = useState('Major (R) Shafqat Ali');
  const [studentNamesInput, setStudentNamesInput] = useState('');

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber) return;

    const students = studentNamesInput.split(',').map((s) => s.trim()).filter(Boolean);

    const newRoom: HostelRoomBedAllotment = {
      id: `HST-${Date.now().toString().slice(-4)}`,
      roomNumber,
      wingName,
      capacityBeds: Number(capacityBeds),
      occupiedBeds: students.length,
      bedIdentifiers: students.map((_, i) => `Bed ${roomNumber.split('-').pop()?.trim() || ''}-${String.fromCharCode(65 + i)}`),
      assignedStudentNames: students,
      wardenName,
      monthlyHostelFeePkr: 35000,
      airConditioningStatus: 'Central AC Operating',
      roomInspectionGrade: 'Grade A (Pristine Cleanliness)',
    };

    setHostelRooms([newRoom, ...hostelRooms]);
    setIsAddingRoom(false);
    setRoomNumber('');
    setStudentNamesInput('');
  };

  const filteredRooms = hostelRooms.filter(
    (r) =>
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.wingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assignedStudentNames.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredInventory = inventory.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="hostel-cafeteria-view" className="space-y-4 text-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#002147] to-amber-950 rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/20 rounded-lg text-emerald-300 border border-emerald-500/30">
              <Home className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Boarding Hostel Allotment, Mess Nutrition &amp; Cafeteria POS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400 text-slate-950">
              Phase 14
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Boarder student bed allocations, Warden supervision logs, Mess weekly dietary planner (Halal certified) &amp; Tuck Shop POS inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingRoom(!isAddingRoom)}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>{isAddingRoom ? 'Close Form' : 'Allot Hostel Room'}</span>
        </button>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('hostel')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'hostel'
              ? 'border-emerald-600 text-emerald-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bed className="w-4 h-4 text-emerald-600" />
          <span>Boarding Hostel Bed Allotments ({hostelRooms.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mess')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'mess'
              ? 'border-emerald-600 text-emerald-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Utensils className="w-4 h-4 text-amber-600" />
          <span>Mess Weekly Dietary &amp; Caloric Menu</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cafeteria')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'cafeteria'
              ? 'border-emerald-600 text-emerald-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-blue-600" />
          <span>Tuck Shop &amp; Cafeteria POS Inventory</span>
        </button>
      </div>

      {/* TAB 1: BOARDING HOSTEL ROOMS */}
      {activeTab === 'hostel' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          {isAddingRoom && (
            <form onSubmit={handleCreateRoom} className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
              <div className="font-bold text-emerald-950 text-sm">Register Boarder Room &amp; Bed Allotment:</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block">Hostel Wing *</label>
                  <select
                    value={wingName}
                    onChange={(e) => setWingName(e.target.value as any)}
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="Jinnah Boys Boarding Wing">Jinnah Boys Boarding Wing</option>
                    <option value="Iqbal Senior Boarding Wing">Iqbal Senior Boarding Wing</option>
                    <option value="Fatima Jinnah Girls Wing">Fatima Jinnah Girls Wing</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">Room Number / Hall *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jinnah Hall - Room 305"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">Bed Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    value={capacityBeds}
                    onChange={(e) => setCapacityBeds(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block">House Warden Incharge</label>
                  <input
                    type="text"
                    value={wardenName}
                    onChange={(e) => setWardenName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-slate-700 block">Assigned Boarder Students (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Muhammad Saad (10-A), Hassan Ali (10-B)"
                    value={studentNamesInput}
                    onChange={(e) => setStudentNamesInput(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingRoom(false)}
                  className="px-4 py-1.5 border rounded font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-emerald-700 text-white rounded font-bold hover:bg-emerald-800"
                >
                  Save Bed Allotment
                </button>
              </div>
            </form>
          )}

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search room number, wing or boarder name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-sm transition space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{room.roomNumber}</div>
                    <div className="text-[10px] text-emerald-800 font-bold">{room.wingName}</div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                    {room.occupiedBeds} / {room.capacityBeds} Beds Filled
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded border space-y-1 text-[11px]">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Assigned Boarder Students:</div>
                  {room.assignedStudentNames.length > 0 ? (
                    <ul className="list-disc list-inside text-slate-800 font-semibold space-y-0.5">
                      {room.assignedStudentNames.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-slate-400 italic">No boarders currently assigned</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 border-t pt-2">
                  <div>
                    <div>Warden: <strong>{room.wardenName}</strong></div>
                    <div>AC Status: {room.airConditioningStatus}</div>
                  </div>
                  <div className="text-right">
                    <div>Fee: <strong>Rs. {room.monthlyHostelFeePkr.toLocaleString()}</strong></div>
                    <div className="text-emerald-700 font-bold">{room.roomInspectionGrade}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onPrintHostelDossier) onPrintHostelDossier(room);
                    else alert(`Printing Official Hostel Clearance Dossier for ${room.roomNumber}`);
                  }}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-[11px] flex items-center justify-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Boarder Room Dossier</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MESS WEEKLY NUTRITION MENU */}
      {activeTab === 'mess' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="border-b pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Boarding Mess Weekly Dietary Planner &amp; Halal Caloric Schedule
              </h3>
              <p className="text-slate-500 text-[11px]">
                Nutritional balancing for sports performance, high-protein prep snacks &amp; night almond milk ration.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-[11px]">
              Halal &amp; Hygiene Certified Kitchen
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messMenus.map((menu) => (
              <div key={menu.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-950 font-bold rounded text-[10px]">
                      {menu.dayOfWeek} • {menu.mealType}
                    </span>
                    <div className="font-bold text-slate-900 text-xs mt-1.5">{menu.dishItems}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-amber-900 text-sm">{menu.caloricContentKcal} Kcal</span>
                    <div className="text-[10px] text-amber-700">Rating: ★ {menu.studentSatisfactionRating}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {menu.dietaryTags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.2 bg-white border border-amber-200 text-amber-900 rounded text-[10px] font-semibold">
                      ✓ {tag}
                    </span>
                  ))}
                </div>

                {menu.specialOccasionNote && (
                  <div className="text-[10px] text-emerald-900 bg-emerald-50 p-2 rounded border border-emerald-200 font-bold">
                    🎉 Note: {menu.specialOccasionNote}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t text-[11px]">
                  <span className="text-slate-600">Chef Incharge: <strong>{menu.chefInCharge}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onPrintMessMenu) onPrintMessMenu(menu);
                      else alert(`Printing Mess Menu Schedule for ${menu.dayOfWeek}`);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-[11px] flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Menu Card</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TUCK SHOP & CAFETERIA POS INVENTORY */}
      {activeTab === 'cafeteria' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="border-b pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Tuck Shop POS Inventory, Stock Reorder Alerts &amp; Sales Summary
            </h3>
            <p className="text-slate-500 text-[11px]">
              Point of Sale inventory tracking for beverages, hygienic bakery items, stationery &amp; dairy.
            </p>
          </div>

          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search item name, code or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs"
            />
          </div>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                  <th className="p-2.5">Item Code &amp; Name</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5 text-right">Unit Price</th>
                  <th className="p-2.5 text-center">Stock Level</th>
                  <th className="p-2.5 text-right">Monthly Revenue</th>
                  <th className="p-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-800">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-2.5">
                      <div className="font-mono font-bold text-slate-900 text-[11px]">{item.itemCode}</div>
                      <div className="font-bold text-slate-900">{item.itemName}</div>
                      <div className="text-[10px] text-slate-500">Supplier: {item.supplierName}</div>
                    </td>
                    <td className="p-2.5 font-semibold text-slate-600">{item.category}</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">Rs. {item.unitPricePkr}</td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          item.currentStockQty <= item.reorderThresholdQty
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.currentStockQty} units
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-bold text-emerald-800">
                      Rs. {item.monthlyRevenuePkr.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (onPrintInventoryTag) onPrintInventoryTag(item);
                          else alert(`Printing Barcode Tag for ${item.itemCode}`);
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-[10px] inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Tag</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

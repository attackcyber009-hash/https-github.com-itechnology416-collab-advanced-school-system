import React, { useState } from 'react';
import {
  Bed,
  Home,
  Utensils,
  Calendar,
  UserCheck,
  UserX,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Shield,
  Coffee,
  Sparkles,
  Key,
  Printer,
  ChevronRight,
  Search,
} from 'lucide-react';
import { HostelRoomBed, HostelOutingLeavePass, HostelMessDayMenu, Student } from '../types';
import {
  INITIAL_HOSTEL_ROOMS,
  INITIAL_HOSTEL_LEAVES,
  INITIAL_MESS_MENU,
} from '../data/phase7Data';

interface HostelBoardingViewProps {
  students: Student[];
  onPrintHostelPass?: (leave: HostelOutingLeavePass) => void;
}

export default function HostelBoardingView({
  students,
  onPrintHostelPass,
}: HostelBoardingViewProps) {
  const [rooms, setRooms] = useState<HostelRoomBed[]>(INITIAL_HOSTEL_ROOMS);
  const [leaves, setLeaves] = useState<HostelOutingLeavePass[]>(INITIAL_HOSTEL_LEAVES);
  const [messMenu, setMessMenu] = useState<HostelMessDayMenu[]>(INITIAL_MESS_MENU);

  const [activeTab, setActiveTab] = useState<'rooms' | 'leaves' | 'mess' | 'rollcall'>('rooms');
  const [selectedWing, setSelectedWing] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedBedForAllocation, setSelectedBedForAllocation] = useState<HostelRoomBed | null>(
    null
  );

  // Allocation Form State
  const [allocationForm, setAllocationForm] = useState({
    studentId: students[0]?.id || '',
  });

  // Outing Leave Form State
  const [leaveForm, setLeaveForm] = useState({
    studentId: students[0]?.id || '',
    leaveType: 'Weekend Home Outing' as any,
    destinationAddress: 'Main Lahore City',
    departureDate: '2024-09-20 (04:30 PM)',
    expectedReturnDate: '2024-09-22 (07:00 PM)',
  });

  // Stats
  const totalBeds = rooms.length;
  const occupiedBeds = rooms.filter((r) => r.isOccupied).length;
  const vacantBeds = totalBeds - occupiedBeds;
  const activeOutings = leaves.filter((l) => l.status === 'Active Outing').length;

  const filteredRooms = rooms.filter((r) => {
    const matchesWing = selectedWing === 'All' || r.wingName === selectedWing;
    const matchesSearch =
      r.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.bedNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.studentName && r.studentName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesWing && matchesSearch;
  });

  const handleAllocateBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBedForAllocation) return;

    const std = students.find((s) => s.id === allocationForm.studentId) || students[0];

    setRooms(
      rooms.map((r) =>
        r.id === selectedBedForAllocation.id
          ? {
              ...r,
              isOccupied: true,
              studentId: std.id,
              studentName: std.name,
              className: std.className,
            }
          : r
      )
    );

    setShowAllocateModal(false);
    alert(`Bed ${selectedBedForAllocation.bedNo} in ${selectedBedForAllocation.roomNo} allocated to ${std.name}!`);
  };

  const handleVacateBed = (roomId: string) => {
    if (confirm('Are you sure you want to de-allocate and mark this hostel bed as vacant?')) {
      setRooms(
        rooms.map((r) =>
          r.id === roomId
            ? {
                ...r,
                isOccupied: false,
                studentId: undefined,
                studentName: undefined,
                className: undefined,
              }
            : r
        )
      );
      alert('Bed vacated successfully and returned to hostel inventory.');
    }
  };

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find((s) => s.id === leaveForm.studentId) || students[0];
    const stdRoom = rooms.find((r) => r.studentId === std.id);

    const newPass: HostelOutingLeavePass = {
      id: `hlp-${Date.now()}`,
      leaveCode: `HLP-2024-${String(leaves.length + 83).padStart(4, '0')}`,
      studentId: std.id,
      studentName: std.name,
      roomNo: stdRoom ? stdRoom.roomNo : 'Room 101',
      wingName: stdRoom ? stdRoom.wingName : 'Allama Iqbal Wing (Boys)',
      leaveType: leaveForm.leaveType,
      departureDate: leaveForm.departureDate,
      expectedReturnDate: leaveForm.expectedReturnDate,
      destinationAddress: leaveForm.destinationAddress,
      parentContactVerified: true,
      wardenSignoff: 'Ustadh Saeed Ahmad (Approved)',
      status: 'Active Outing',
    };

    setLeaves([newPass, ...leaves]);
    setShowLeaveModal(false);
    alert(`Hostel Outing Pass #${newPass.leaveCode} approved for ${newPass.studentName}`);
  };

  return (
    <div id="hostel-boarding-suite" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003366] via-[#104880] to-[#1c5d99] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-400/20 rounded-lg text-amber-300 border border-amber-400/30">
              <Home className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Hostel &amp; Residential Boarding Management Suite
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900">
              Phase 7
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Wing &amp; bed allocation, warden night roll-call rosters, weekend outing gate passes with parent SMS verification, and 7-day nutritional mess menus.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLeaveModal(true)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Clock className="w-4 h-4" />
            <span>Issue Outing / Leave Pass</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Hostel Beds
            </div>
            <div className="text-xl font-black text-[#002147] mt-0.5">{totalBeds}</div>
            <div className="text-[10px] text-slate-400">3 Wings (Senior, Junior, Girls)</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <Bed className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Occupied Beds
            </div>
            <div className="text-xl font-black text-amber-600 mt-0.5">{occupiedBeds}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">{vacantBeds} Vacant &amp; Ready</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Outing Leaves
            </div>
            <div className="text-xl font-black text-rose-600 mt-0.5">{activeOutings}</div>
            <div className="text-[10px] text-rose-600 font-medium">Weekend Home Visits</div>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Today's Mess Special
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1 truncate max-w-[130px]">
              Chicken Biryani &amp; Kheer
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold">Mess Fee Included</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Utensils className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('rooms')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'rooms'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Room &amp; Bed Allocation Ledger</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('leaves')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'leaves'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Outing &amp; Weekend Home Passes ({leaves.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mess')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'mess'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Weekly Mess Menu &amp; Dining Schedule</span>
        </button>
      </div>

      {/* TAB 1: ROOM & BED ALLOCATIONS */}
      {activeTab === 'rooms' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Room #, Bed, Assigned Student Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#002147]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={selectedWing}
                onChange={(e) => setSelectedWing(e.target.value)}
                className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
              >
                <option value="All">All Hostel Wings</option>
                <option value="Allama Iqbal Wing (Boys)">Allama Iqbal Wing (Boys)</option>
                <option value="Quaid-e-Azam Wing (Boys Senior)">Quaid-e-Azam Wing (Boys Senior)</option>
                <option value="Fatima Jinnah Wing (Girls)">Fatima Jinnah Wing (Girls)</option>
              </select>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                  room.isOccupied
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-emerald-200 bg-emerald-50/20'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{room.wingName}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        room.isOccupied
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {room.isOccupied ? 'Occupied' : 'Vacant'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h3 className="text-base font-black text-[#002147]">{room.roomNo}</h3>
                    <span className="text-xs font-mono font-bold text-slate-600">[{room.bedNo}]</span>
                    <span className="text-[11px] text-slate-500 font-medium">({room.roomType})</span>
                  </div>

                  {room.isOccupied ? (
                    <div className="p-2.5 bg-white border border-amber-200 rounded-lg text-xs space-y-1">
                      <div className="font-bold text-slate-900">{room.studentName}</div>
                      <div className="text-[10px] text-slate-500">{room.className}</div>
                      <div className="text-[10px] font-mono text-emerald-700 font-bold">
                        Hostel Fee: PKR {room.monthlyHostelFee.toLocaleString()}/mo
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-white border border-emerald-200 rounded-lg text-xs text-center text-slate-500">
                      Bed is clean, sanitized and available for allocation.
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 space-y-0.5">
                    <div>Warden: <strong>{room.wardenName}</strong> ({room.wardenPhone})</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {room.amenities.map((am, i) => (
                        <span key={i} className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[9px]">
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                  {room.isOccupied ? (
                    <button
                      type="button"
                      onClick={() => handleVacateBed(room.id)}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-bold text-[10px] border border-rose-200 transition"
                    >
                      Vacate Bed
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBedForAllocation(room);
                        setShowAllocateModal(true);
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] flex items-center gap-1 shadow-xs transition"
                    >
                      <Key className="w-3 h-3" />
                      <span>Allocate to Student</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: OUTING LEAVES */}
      {activeTab === 'leaves' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Hostel Student Weekend &amp; Emergency Outing Logs</span>
            </h3>
            <span className="text-xs text-slate-500">Parent telephonic confirmation mandatory</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#002147] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Leave Code</th>
                  <th className="p-3">Student &amp; Room</th>
                  <th className="p-3">Leave Category</th>
                  <th className="p-3">Departure &amp; Expected Return</th>
                  <th className="p-3">Destination Address</th>
                  <th className="p-3">Warden Approval</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-[#002147]">{l.leaveCode}</td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">{l.studentName}</div>
                      <div className="text-[10px] text-slate-500">
                        {l.wingName} • {l.roomNo}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-medium text-[10px]">
                        {l.leaveType}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-slate-700">
                      <div>Out: {l.departureDate}</div>
                      <div className="text-amber-700 font-bold">Return: {l.expectedReturnDate}</div>
                    </td>

                    <td className="p-3 text-slate-600 max-w-xs truncate">{l.destinationAddress}</td>

                    <td className="p-3 text-[11px] text-emerald-800 font-medium">
                      {l.wardenSignoff}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          l.status === 'Active Outing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (onPrintHostelPass) {
                            onPrintHostelPass(l);
                          } else {
                            alert(`Printing Hostel Outing Pass #${l.leaveCode} for ${l.studentName}`);
                          }
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-[10px] flex items-center gap-1 ml-auto shadow-xs"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print Pass</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WEEKLY MESS MENU */}
      {activeTab === 'mess' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#002147]">
                7-Day Boarding Mess Nutritional Dining Schedule
              </h3>
              <p className="text-xs text-slate-500">
                Prepared by Executive Chef under nutritionist guidelines with clean mineral water &amp; hygienic poultry.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {messMenu.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-black text-sm text-[#002147]">{m.day}</span>
                  <span className="p-1.5 bg-amber-100 text-amber-800 rounded">
                    <Utensils className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase">Breakfast (07:00 AM)</span>
                    <p className="text-slate-800 font-medium">{m.breakfast}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">Lunch (01:30 PM)</span>
                    <p className="text-slate-800 font-medium">{m.lunch}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-sky-700 uppercase">Evening Refreshment (05:00 PM)</span>
                    <p className="text-slate-800 font-medium">{m.eveningTea}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-purple-700 uppercase">Dinner (08:30 PM)</span>
                    <p className="text-slate-800 font-medium">{m.dinner}</p>
                  </div>
                </div>

                {m.specialDietNote && (
                  <div className="pt-2 border-t text-[10px] text-amber-800 italic bg-amber-50 p-1.5 rounded">
                    {m.specialDietNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALLOCATE BED MODAL */}
      {showAllocateModal && selectedBedForAllocation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-[#002147]" />
                <h3 className="font-bold text-slate-900 text-base">Allocate Hostel Bed</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAllocateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 border rounded-lg text-xs space-y-1">
              <div>Wing: <strong>{selectedBedForAllocation.wingName}</strong></div>
              <div>Room: <strong>{selectedBedForAllocation.roomNo}</strong> ({selectedBedForAllocation.bedNo})</div>
              <div className="text-emerald-700 font-bold">
                Monthly Boarding Charge: PKR {selectedBedForAllocation.monthlyHostelFee.toLocaleString()}/mo
              </div>
            </div>

            <form onSubmit={handleAllocateBed} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student *</label>
                <select
                  value={allocationForm.studentId}
                  onChange={(e) => setAllocationForm({ studentId: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.studentCode} - {s.name} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#002147] hover:bg-[#0b3366] text-white rounded-lg font-bold shadow-sm"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OUTING LEAVE PASS MODAL */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">Create Hostel Outing / Leave Pass</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLeave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Boarder Student *</label>
                <select
                  value={leaveForm.studentId}
                  onChange={(e) => setLeaveForm({ ...leaveForm, studentId: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.studentCode} - {s.name} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Leave Category</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as any })}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="Weekend Home Outing">Weekend Home Outing</option>
                  <option value="Medical / Emergency">Medical / Emergency</option>
                  <option value="Day Market Pass">Day Market Pass</option>
                  <option value="Family Function">Family Function</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Departure Date &amp; Time</label>
                  <input
                    type="text"
                    value={leaveForm.departureDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, departureDate: e.target.value })}
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected Return Date &amp; Time</label>
                  <input
                    type="text"
                    value={leaveForm.expectedReturnDate}
                    onChange={(e) =>
                      setLeaveForm({ ...leaveForm, expectedReturnDate: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination Address *</label>
                <input
                  type="text"
                  required
                  value={leaveForm.destinationAddress}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, destinationAddress: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-bold shadow-sm"
                >
                  Authorize &amp; Sign Leave Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

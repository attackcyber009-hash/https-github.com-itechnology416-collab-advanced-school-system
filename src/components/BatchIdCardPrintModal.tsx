import { useState } from 'react';
import { CreditCard, Printer, X, CheckSquare, Square, Filter } from 'lucide-react';
import { Student } from '../types';

interface BatchIdCardPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

export default function BatchIdCardPrintModal({
  isOpen,
  onClose,
  students,
}: BatchIdCardPrintModalProps) {
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>(students.map((s) => s.id));
  const [showBackSide, setShowBackSide] = useState(false);

  if (!isOpen) return null;

  const filteredStudents = students.filter(
    (s) => selectedClass === 'All' || s.className === selectedClass
  );

  const printableStudents = students.filter((s) => selectedIds.includes(s.id));

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-auto overflow-hidden border border-slate-300 flex flex-col max-h-[95vh]">
        {/* Header (No-print) */}
        <div className="bg-[#002147] text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">Bulk Student Identity Cards Generator</h3>
              <p className="text-[11px] text-sky-200">
                Ready for standard A4 PVC / Heavy Paper printing ({printableStudents.length} Selected)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBackSide(!showBackSide)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded"
            >
              {showBackSide ? 'Show Front Side' : 'Show Reverse Side'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print All Cards</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Strip (No-print) */}
        <div className="bg-slate-100 p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700">Filter Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-medium"
            >
              <option value="All">All Classes ({students.length})</option>
              <option value="Class One">Class One</option>
              <option value="Class Two">Class Two</option>
              <option value="Class Three">Class Three</option>
              <option value="Class Four">Class Four</option>
              <option value="Class Five">Class Five</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="text-sky-700 hover:underline font-bold"
            >
              {selectedIds.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600">
              Selected <strong>{printableStudents.length}</strong> of {filteredStudents.length}
            </span>
          </div>
        </div>

        {/* Printable Grid Canvas */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-200 flex justify-center">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-sm border border-slate-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {printableStudents.map((std) => (
                <div
                  key={std.id}
                  className="w-full max-w-[280px] mx-auto bg-white rounded-xl shadow-md border-2 border-[#002147] overflow-hidden flex flex-col text-slate-900 select-none relative print:border-slate-800"
                >
                  {!showBackSide ? (
                    /* FRONT OF ID CARD */
                    <>
                      {/* Card Navy Header */}
                      <div className="bg-[#002147] text-white p-2.5 text-center relative border-b-2 border-amber-400">
                        <div className="font-black text-xs uppercase tracking-wider text-amber-300">
                          THE EDUCATORS
                        </div>
                        <div className="text-[7px] tracking-widest text-slate-300 uppercase">
                          A Project of Beaconhouse
                        </div>
                        <div className="text-[8px] font-bold text-sky-100 mt-0.5">
                          Model Town Main Campus • Session 2024–2025
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-3 space-y-2 flex-1 flex flex-col items-center">
                        <div className="relative">
                          <img
                            src={std.avatarUrl}
                            alt={std.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-[#002147] shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-red-600 text-white font-bold text-[8px] rounded">
                            {std.bloodGroup}
                          </span>
                        </div>

                        <div className="text-center">
                          <div className="font-black text-sm text-slate-900 leading-tight uppercase">
                            {std.name}
                          </div>
                          <div className="text-[10px] text-slate-600 font-medium">
                            S/O {std.fatherName}
                          </div>
                          <div className="mt-1 inline-block px-2 py-0.5 bg-sky-100 text-sky-900 font-bold text-[10px] rounded-full">
                            {std.className} • Sec {std.section} • Roll: {std.rollNo}
                          </div>
                        </div>

                        {/* ID Data Table */}
                        <div className="w-full text-[9px] bg-slate-50 p-2 rounded border border-slate-200 space-y-0.5">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Student Code:</span>
                            <span className="font-mono font-bold text-slate-800">{std.studentCode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Emergency Phone:</span>
                            <span className="font-mono font-bold text-slate-800">{std.parentPhone}</span>
                          </div>
                        </div>

                        {/* Simulated Barcode */}
                        <div className="w-full text-center mt-1">
                          <div className="font-mono tracking-widest text-[9px] font-black uppercase text-slate-700">
                            ||| | |||| | || ||||| | |||
                          </div>
                          <div className="text-[8px] font-mono text-slate-400">{std.studentCode}</div>
                        </div>
                      </div>

                      {/* Card Footer Signature Line */}
                      <div className="bg-slate-100 p-1.5 text-center border-t border-slate-200 flex justify-between items-center px-3">
                        <span className="text-[7px] text-slate-500 font-bold uppercase">Issuing Authority</span>
                        <span className="text-[8px] text-[#002147] font-serif font-bold italic">Principal</span>
                      </div>
                    </>
                  ) : (
                    /* REVERSE SIDE OF ID CARD */
                    <div className="p-3 flex-1 flex flex-col justify-between text-[9px] text-slate-700 space-y-2">
                      <div className="text-center font-bold text-[#002147] uppercase border-b pb-1">
                        Institutional Rules &amp; Terms
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-[8px] leading-tight text-slate-600">
                        <li>This card is non-transferable and remains property of The Educators.</li>
                        <li>Student must display this card on campus and during official transit.</li>
                        <li>Loss of this card must be immediately reported to Campus Admin.</li>
                        <li>Replacement card fee: Rs. 500.</li>
                      </ul>
                      <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-center text-[8px]">
                        <div className="font-bold text-slate-800">Return If Found To:</div>
                        <div>Model Town Main Campus, Lahore</div>
                        <div>Phone: +92 42 35881234</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

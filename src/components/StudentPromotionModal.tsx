import { useState } from 'react';
import {
  ArrowRightLeft,
  X,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Users,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Student, ClassInfo } from '../types';

interface StudentPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  classes: ClassInfo[];
  onExecutePromotion: (
    updatedStudents: Student[],
    sourceClass: string,
    targetClass: string
  ) => void;
}

export default function StudentPromotionModal({
  isOpen,
  onClose,
  students,
  classes,
  onExecutePromotion,
}: StudentPromotionModalProps) {
  const [sourceClass, setSourceClass] = useState('Class One');
  const [targetClass, setTargetClass] = useState('Class Two');
  const [targetSection, setTargetSection] = useState('A');
  const [targetSession, setTargetSession] = useState('2025-2026');
  const [rollStartSeed, setRollStartSeed] = useState(201);
  const [autoSequenceRoll, setAutoSequenceRoll] = useState(true);
  const [feeIncrementPct, setFeeIncrementPct] = useState(10);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter students by source class
  const classStudents = students.filter((s) => s.className === sourceClass);

  // Toggle selection
  const handleToggleSelectAll = () => {
    setValidationError(null);
    if (selectedStudentIds.length === classStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(classStudents.map((s) => s.id));
    }
  };

  const handleToggleStudent = (id: string) => {
    setValidationError(null);
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((sid) => sid !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const handlePromote = () => {
    if (selectedStudentIds.length === 0) {
      setValidationError('Please select at least one student to promote.');
      return;
    }
    setValidationError(null);

    let nextRoll = rollStartSeed;
    const updated = students.map((std) => {
      if (selectedStudentIds.includes(std.id)) {
        const assignedRoll = autoSequenceRoll ? String(nextRoll++) : std.rollNo;
        const newFee = Math.round(std.monthlyFee * (1 + feeIncrementPct / 100));
        return {
          ...std,
          className: targetClass,
          section: targetSection,
          rollNo: assignedRoll,
          monthlyFee: newFee,
        };
      }
      return std;
    });

    onExecutePromotion(updated, sourceClass, targetClass);
    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-auto overflow-hidden border border-slate-300 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#1b3b6f] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ArrowRightLeft className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-sm">Class Promotion &amp; Roll Number Sequencer</h3>
              <p className="text-[11px] text-sky-200">
                Bulk promote cohorts, update roll numbers, and calibrate new session fees
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-slate-800">
              Student Cohort Successfully Promoted!
            </h4>
            <p className="text-xs text-slate-500">
              All selected students have been promoted from {sourceClass} to {targetClass} for Session {targetSession}.
            </p>
          </div>
        ) : (
          <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4">
            {/* Step 1: Transition Controls */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Source Class
                </label>
                <select
                  value={sourceClass}
                  onChange={(e) => {
                    setSourceClass(e.target.value);
                    setSelectedStudentIds([]);
                  }}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-800 outline-none"
                >
                  <option value="Class One">Class One</option>
                  <option value="Class Two">Class Two</option>
                  <option value="Class Three">Class Three</option>
                  <option value="Class Four">Class Four</option>
                  <option value="Class Five">Class Five</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Target Promoted Class
                </label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-indigo-700 outline-none"
                >
                  <option value="Class Two">Class Two</option>
                  <option value="Class Three">Class Three</option>
                  <option value="Class Four">Class Four</option>
                  <option value="Class Five">Class Five</option>
                  <option value="Class Six">Class Six</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Target Session
                </label>
                <select
                  value={targetSession}
                  onChange={(e) => setTargetSession(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-800 outline-none"
                >
                  <option value="2024-2025">Session 2024–2025</option>
                  <option value="2025-2026">Session 2025–2026</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Target Section
                </label>
                <select
                  value={targetSection}
                  onChange={(e) => setTargetSection(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-800 outline-none"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </div>

            {/* Step 2: Roll Number & Fee Sequencer Rules */}
            <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 font-bold text-indigo-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSequenceRoll}
                    onChange={(e) => setAutoSequenceRoll(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Auto-Sequence New Roll Numbers</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">Start from Roll #:</span>
                  <input
                    type="number"
                    value={rollStartSeed}
                    onChange={(e) => setRollStartSeed(Number(e.target.value))}
                    disabled={!autoSequenceRoll}
                    className="w-24 bg-white border border-slate-300 rounded px-2 py-1 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-indigo-900">Annual Tuition Fee Revision</div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">Annual Increment:</span>
                  <select
                    value={feeIncrementPct}
                    onChange={(e) => setFeeIncrementPct(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-700"
                  >
                    <option value={0}>0% (Same Fee)</option>
                    <option value={5}>+5% Revision</option>
                    <option value={10}>+10% Revision</option>
                    <option value={15}>+15% Revision</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Student Selection Roster */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span>Enrolled in {sourceClass}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                    {classStudents.length} Students
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="text-xs text-sky-700 font-bold hover:underline cursor-pointer"
                >
                  {selectedStudentIds.length === classStudents.length
                    ? 'Deselect All'
                    : 'Select All Eligible'}
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                {classStudents.length > 0 ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 w-8">
                          <input
                            type="checkbox"
                            checked={
                              classStudents.length > 0 &&
                              selectedStudentIds.length === classStudents.length
                            }
                            onChange={handleToggleSelectAll}
                          />
                        </th>
                        <th className="py-2 px-3">Student Name</th>
                        <th className="py-2 px-3">Roll No</th>
                        <th className="py-2 px-3">Father Name</th>
                        <th className="py-2 px-3">Current Fee</th>
                        <th className="py-2 px-3">Attendance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classStudents.map((std) => {
                        const isSelected = selectedStudentIds.includes(std.id);
                        return (
                          <tr
                            key={std.id}
                            onClick={() => handleToggleStudent(std.id)}
                            className={`hover:bg-sky-50/60 cursor-pointer transition ${
                              isSelected ? 'bg-indigo-50/50 font-medium' : ''
                            }`}
                          >
                            <td className="py-2 px-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleStudent(std.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </td>
                            <td className="py-2 px-3 font-bold text-slate-800 flex items-center gap-2">
                              <img
                                src={std.avatarUrl}
                                alt={std.name}
                                className="w-6 h-6 rounded-full object-cover border"
                                referrerPolicy="no-referrer"
                              />
                              <span>{std.name}</span>
                            </td>
                            <td className="py-2 px-3 font-mono">{std.rollNo}</td>
                            <td className="py-2 px-3 text-slate-600">{std.fatherName}</td>
                            <td className="py-2 px-3 font-mono">Rs. {std.monthlyFee.toLocaleString()}</td>
                            <td className="py-2 px-3">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                {std.attendanceRate || 96}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 text-center text-slate-400">
                    No active students found in {sourceClass}.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {validationError && (
          <div className="bg-rose-50 border-t border-rose-200 text-rose-700 px-5 py-2 text-xs font-semibold flex items-center justify-between">
            <span>{validationError}</span>
            <button type="button" onClick={() => setValidationError(null)} className="text-rose-500 hover:text-rose-700 font-bold">✕</button>
          </div>
        )}

        {!isDone && (
          <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-600">
              Selected to Promote: <strong>{selectedStudentIds.length}</strong> / {classStudents.length} Students
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePromote}
                disabled={selectedStudentIds.length === 0}
                className="px-5 py-1.5 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white font-bold rounded shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Promote {selectedStudentIds.length} Students to {targetClass}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

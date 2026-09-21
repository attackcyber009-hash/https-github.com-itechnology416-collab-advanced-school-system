import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Award,
  Compass,
  Briefcase,
  Search,
  Plus,
  Printer,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Building2,
  Mail,
  UserCheck,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { AlumniPlacementRecord, CareerCounselingAppointment } from '../types';
import {
  INITIAL_ALUMNI_PLACEMENTS,
  INITIAL_CAREER_COUNSELING_APPOINTMENTS,
} from '../data/phase9Data';

interface AlumniUniversityPlacementViewProps {
  onPrintRecommendationLetter?: (alumni: AlumniPlacementRecord) => void;
  onPrintCounselingDossier?: (appointment: CareerCounselingAppointment) => void;
}

export default function AlumniUniversityPlacementView({
  onPrintRecommendationLetter,
  onPrintCounselingDossier,
}: AlumniUniversityPlacementViewProps) {
  const [activeTab, setActiveTab] = useState<'placements' | 'counseling' | 'mentorship'>('placements');
  const [alumniList, setAlumniList] = useState<AlumniPlacementRecord[]>(INITIAL_ALUMNI_PLACEMENTS);
  const [counselingList, setCounselingList] = useState<CareerCounselingAppointment[]>(
    INITIAL_CAREER_COUNSELING_APPOINTMENTS
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('All');
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [showCounselingModal, setShowCounselingModal] = useState(false);

  // Form State for Alumni
  const [alumniForm, setAlumniForm] = useState({
    name: '',
    passingBatch: 'Matric Batch 2023',
    programCompleted: 'Matric (Science)' as any,
    boardRollNo: '',
    boardMarks: '',
    bisePositionOrDistinction: '',
    currentUniversityOrInstitution: '',
    degreeProgram: '',
    scholarshipOrMerit: '',
    currentDesignationOrStatus: '',
    linkedinOrContact: '',
    willingToMentor: true,
  });

  // Form State for Counseling
  const [counselingForm, setCounselingForm] = useState({
    studentName: '',
    className: 'Class 9 (Science)',
    counselorName: 'Dr. Shahbaz Cheema (Senior Career Counselor)',
    aptitudeCategory: 'Engineering & Computing' as any,
    recommendedUniversities: 'NUST Islamabad, FAST-NUCES, GIKI',
    sessionSummary: '',
    actionItem1: '',
    actionItem2: '',
  });

  const filteredAlumni = alumniList.filter((a) => {
    const matchesBatch = selectedBatchFilter === 'All' || a.passingBatch.includes(selectedBatchFilter);
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.currentUniversityOrInstitution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.degreeProgram.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  const handleAddAlumni = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlumni: AlumniPlacementRecord = {
      id: `alm-${Date.now()}`,
      alumniCode: `ALM-2023-${Math.floor(100 + Math.random() * 900)}`,
      name: alumniForm.name,
      passingBatch: alumniForm.passingBatch,
      programCompleted: alumniForm.programCompleted,
      boardRollNo: alumniForm.boardRollNo || '600123',
      boardMarks: alumniForm.boardMarks || '1020/1100 (92.7%)',
      bisePositionOrDistinction: alumniForm.bisePositionOrDistinction,
      currentUniversityOrInstitution: alumniForm.currentUniversityOrInstitution,
      degreeProgram: alumniForm.degreeProgram,
      scholarshipOrMerit: alumniForm.scholarshipOrMerit || 'Merit Admitted',
      currentDesignationOrStatus: alumniForm.currentDesignationOrStatus || 'Undergraduate Student',
      linkedinOrContact: alumniForm.linkedinOrContact || 'alumni@educators.edu.pk',
      willingToMentor: alumniForm.willingToMentor,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    };

    setAlumniList([newAlumni, ...alumniList]);
    setShowAlumniModal(false);
    alert(`Alumni record for ${newAlumni.name} added to placement directory!`);
  };

  const handleAddCounseling = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: CareerCounselingAppointment = {
      id: `coun-${Date.now()}`,
      appointmentNo: `CCA-2024-${Math.floor(100 + Math.random() * 900)}`,
      studentId: `std-${Date.now()}`,
      studentName: counselingForm.studentName,
      className: counselingForm.className,
      counselorName: counselingForm.counselorName,
      date: new Date().toISOString().split('T')[0],
      timeSlot: '11:30 AM - 12:15 PM',
      aptitudeCategory: counselingForm.aptitudeCategory,
      recommendedUniversities: counselingForm.recommendedUniversities.split(',').map((s) => s.trim()),
      sessionSummary:
        counselingForm.sessionSummary ||
        'Comprehensive psychometric mapping and academic path guidance session.',
      actionItemsForStudent: [
        counselingForm.actionItem1 || 'Focus on strengthening core analytical concepts.',
        counselingForm.actionItem2 || 'Explore university entrance test syllabus requirements.',
      ],
      status: 'Completed',
    };

    setCounselingList([newAppointment, ...counselingList]);
    setShowCounselingModal(false);
    alert(`Career Counseling Session registered for ${newAppointment.studentName}!`);
  };

  return (
    <div id="alumni-placement-suite" className="space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-[#002147] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-cyan-400/20 rounded-lg text-cyan-300 border border-cyan-400/30">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Alumni Network, University Placements &amp; Career Counseling Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-400 text-slate-900">
              Phase 9
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Tracking graduates in premier universities (NUST, FAST, LUMS, KEMU, PMA Kakul), career counseling appointments, alumni mentorship network, and official recommendation letters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAlumniModal(true)}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Alumni Placement</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCounselingModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-cyan-500/30 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Compass className="w-4 h-4" />
            <span>Book Counseling Session</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Top Tier Placements
            </div>
            <div className="text-xl font-black text-[#002147] mt-0.5">85+ Graduates</div>
            <div className="text-[10px] text-cyan-700 font-semibold">NUST, LUMS, KEMU, FAST</div>
          </div>
          <div className="p-2.5 bg-cyan-50 text-cyan-700 rounded-lg">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Merit Scholarships
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">Rs. 18.5M+</div>
            <div className="text-[10px] text-emerald-600 font-medium">PEEF, NOP &amp; HEC Grants</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Mentors
            </div>
            <div className="text-xl font-black text-blue-700 mt-0.5">
              {alumniList.filter((a) => a.willingToMentor).length} Mentors
            </div>
            <div className="text-[10px] text-blue-600 font-medium">Volunteering Guidance</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Counseling Sessions
            </div>
            <div className="text-xl font-black text-amber-600 mt-0.5">
              {counselingList.length + 24} Sessions
            </div>
            <div className="text-[10px] text-amber-600 font-medium">Matric &amp; FSc Guidance</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <Compass className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('placements')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'placements'
              ? 'border-cyan-700 text-cyan-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>University &amp; Defense Cadet Placements</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('counseling')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'counseling'
              ? 'border-cyan-700 text-cyan-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Career Counseling &amp; Aptitude Roadmaps</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mentorship')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'mentorship'
              ? 'border-cyan-700 text-cyan-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Alumni Mentorship Network</span>
        </button>
      </div>

      {/* TAB 1: PLACEMENTS */}
      {activeTab === 'placements' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Filter Batch:</span>
              <select
                value={selectedBatchFilter}
                onChange={(e) => setSelectedBatchFilter(e.target.value)}
                className="p-1.5 border rounded-lg bg-white"
              >
                <option value="All">All Batches</option>
                <option value="2023">Batch 2023</option>
                <option value="2022">Batch 2022</option>
                <option value="2021">Batch 2021</option>
                <option value="2020">Batch 2020</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search alumni, university, degree..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAlumni.map((alumni) => (
              <div
                key={alumni.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 hover:shadow-xs transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img
                      src={alumni.avatarUrl}
                      alt={alumni.name}
                      className="w-12 h-12 rounded-full object-cover border border-cyan-300"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{alumni.name}</h4>
                      <div className="text-slate-500 text-[11px]">
                        {alumni.passingBatch} • Board: <strong>{alumni.boardMarks}</strong>
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded font-mono font-bold text-[10px]">
                    {alumni.alumniCode}
                  </span>
                </div>

                {alumni.bisePositionOrDistinction && (
                  <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px] font-medium flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{alumni.bisePositionOrDistinction}</span>
                  </div>
                )}

                <div className="space-y-1 p-3 bg-slate-50 rounded-lg text-[11px] border border-slate-100">
                  <div>
                    <strong className="text-slate-700">Admitted Institution:</strong>
                    <div className="font-bold text-slate-900">{alumni.currentUniversityOrInstitution}</div>
                  </div>
                  <div>
                    <strong className="text-slate-700">Degree Program:</strong>
                    <div className="text-slate-800">{alumni.degreeProgram}</div>
                  </div>
                  <div>
                    <strong className="text-slate-700">Scholarship / Standing:</strong>
                    <div className="text-emerald-700 font-semibold">{alumni.scholarshipOrMerit}</div>
                  </div>
                  <div>
                    <strong className="text-slate-700">Current Role / Status:</strong>
                    <div className="text-slate-700">{alumni.currentDesignationOrStatus}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{alumni.linkedinOrContact}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (onPrintRecommendationLetter) {
                        onPrintRecommendationLetter(alumni);
                      } else {
                        alert(`Generating Principal Recommendation Letter for ${alumni.name}`);
                      }
                    }}
                    className="px-2.5 py-1.5 bg-[#002147] hover:bg-[#0b3366] text-white rounded font-bold text-[11px] flex items-center gap-1 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Recommendation Letter</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: COUNSELING */}
      {activeTab === 'counseling' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Matric &amp; Intermediate Career Guidance Consultations
              </h3>
              <p className="text-slate-500">
                Tailored aptitude mapping for Medical (MDCAT), Engineering (ECAT/NET), and Computing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCounselingModal(true)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-bold text-xs"
            >
              + Book New Counseling Appointment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {counselingList.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{app.studentName}</h4>
                    <div className="text-slate-500 text-[11px]">
                      {app.className} • Counselor: <strong>{app.counselorName}</strong>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded font-bold text-[10px]">
                    {app.aptitudeCategory}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border text-[11px] space-y-1">
                  <strong className="text-slate-700">Target Universities Recommended:</strong>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {app.recommendedUniversities.map((u, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white rounded border font-semibold text-slate-800">
                        {u}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-700 bg-cyan-50/50 p-2.5 rounded border border-cyan-100 space-y-1">
                  <strong>Consultation Summary:</strong>
                  <p className="text-slate-600">{app.sessionSummary}</p>
                </div>

                <div className="space-y-1 text-[11px]">
                  <strong className="text-slate-700 uppercase tracking-wider text-[10px]">
                    Action Roadmap for Student:
                  </strong>
                  <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                    {app.actionItemsForStudent.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (onPrintCounselingDossier) {
                        onPrintCounselingDossier(app);
                      } else {
                        alert(`Printing Career Dossier for ${app.studentName}`);
                      }
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Counseling Dossier</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MENTORSHIP */}
      {activeTab === 'mentorship' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Alumni Mentorship &amp; Guest Lecture Registry
            </h3>
            <p className="text-slate-500">
              Graduates committed to conducting university entrance webinars, mock MDCAT/ECAT interviews, and career counseling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {alumniList
              .filter((a) => a.willingToMentor)
              .map((mentor) => (
                <div
                  key={mentor.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-center flex flex-col items-center justify-between"
                >
                  <img
                    src={mentor.avatarUrl}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{mentor.name}</h4>
                    <div className="text-cyan-800 font-semibold text-[11px]">
                      {mentor.currentDesignationOrStatus}
                    </div>
                    <div className="text-slate-500 text-[10px]">
                      {mentor.currentUniversityOrInstitution}
                    </div>
                  </div>

                  <div className="w-full pt-2 border-t border-slate-200 flex justify-between items-center text-[10px]">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      Verified Mentor
                    </span>
                    <a
                      href={`mailto:${mentor.linkedinOrContact}`}
                      className="px-2 py-1 bg-[#002147] text-white rounded font-bold flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Connect</span>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD ALUMNI PLACEMENT */}
      {showAlumniModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-700" />
                <h3 className="font-bold text-slate-900 text-base">Register Alumni Placement</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAlumniModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAlumni} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alumni Full Name *</label>
                <input
                  type="text"
                  required
                  value={alumniForm.name}
                  onChange={(e) => setAlumniForm({ ...alumniForm, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g. Hamna Farooq"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Passing Batch</label>
                  <select
                    value={alumniForm.passingBatch}
                    onChange={(e) => setAlumniForm({ ...alumniForm, passingBatch: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Matric Batch 2024">Matric Batch 2024</option>
                    <option value="Matric Batch 2023">Matric Batch 2023</option>
                    <option value="Matric Batch 2022">Matric Batch 2022</option>
                    <option value="FSc Batch 2023">FSc Batch 2023</option>
                    <option value="FSc Batch 2022">FSc Batch 2022</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Board Total Marks</label>
                  <input
                    type="text"
                    placeholder="e.g. 1060/1100 (96.4%)"
                    value={alumniForm.boardMarks}
                    onChange={(e) => setAlumniForm({ ...alumniForm, boardMarks: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Admitted University / Military Academy *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National University of Sciences & Technology (NUST)"
                  value={alumniForm.currentUniversityOrInstitution}
                  onChange={(e) =>
                    setAlumniForm({
                      ...alumniForm,
                      currentUniversityOrInstitution: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Degree Program</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BS Software Engineering"
                    value={alumniForm.degreeProgram}
                    onChange={(e) => setAlumniForm({ ...alumniForm, degreeProgram: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scholarship Awarded</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% PEEF Merit Scholarship"
                    value={alumniForm.scholarshipOrMerit}
                    onChange={(e) =>
                      setAlumniForm({ ...alumniForm, scholarshipOrMerit: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Status / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Undergraduate Student / Researcher"
                    value={alumniForm.currentDesignationOrStatus}
                    onChange={(e) =>
                      setAlumniForm({
                        ...alumniForm,
                        currentDesignationOrStatus: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email / Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. student@nust.edu.pk"
                    value={alumniForm.linkedinOrContact}
                    onChange={(e) =>
                      setAlumniForm({ ...alumniForm, linkedinOrContact: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="mentorCheck"
                  checked={alumniForm.willingToMentor}
                  onChange={(e) =>
                    setAlumniForm({ ...alumniForm, willingToMentor: e.target.checked })
                  }
                  className="rounded text-cyan-600"
                />
                <label htmlFor="mentorCheck" className="font-bold text-slate-700">
                  Willing to mentor current high school students and conduct webinars
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAlumniModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg font-bold shadow-sm"
                >
                  Save Alumni Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BOOK COUNSELING */}
      {showCounselingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-700" />
                <h3 className="font-bold text-slate-900 text-base">Book Career Counseling Consultation</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCounselingModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCounseling} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={counselingForm.studentName}
                    onChange={(e) =>
                      setCounselingForm({ ...counselingForm, studentName: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. Zayd Ali"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <input
                    type="text"
                    required
                    value={counselingForm.className}
                    onChange={(e) =>
                      setCounselingForm({ ...counselingForm, className: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Counselor Assigned</label>
                  <input
                    type="text"
                    required
                    value={counselingForm.counselorName}
                    onChange={(e) =>
                      setCounselingForm({ ...counselingForm, counselorName: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Aptitude Domain</label>
                  <select
                    value={counselingForm.aptitudeCategory}
                    onChange={(e) =>
                      setCounselingForm({
                        ...counselingForm,
                        aptitudeCategory: e.target.value as any,
                      })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Engineering & Computing">Engineering &amp; Computing</option>
                    <option value="Medical & Biological Sciences">Medical &amp; Biological Sciences</option>
                    <option value="Business & Chartered Accountancy (CA)">
                      Business &amp; Chartered Accountancy (CA)
                    </option>
                    <option value="Armed Forces & Civil Services">Armed Forces &amp; Civil Services</option>
                    <option value="Arts, Law & Social Sciences">Arts, Law &amp; Social Sciences</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Universities (Comma separated)
                </label>
                <input
                  type="text"
                  value={counselingForm.recommendedUniversities}
                  onChange={(e) =>
                    setCounselingForm({
                      ...counselingForm,
                      recommendedUniversities: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Counselor Findings &amp; Summary</label>
                <textarea
                  rows={2}
                  value={counselingForm.sessionSummary}
                  onChange={(e) =>
                    setCounselingForm({ ...counselingForm, sessionSummary: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g. Student demonstrates high spatial reasoning and interest in robotic systems."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Action Roadmap Item 1</label>
                  <input
                    type="text"
                    value={counselingForm.actionItem1}
                    onChange={(e) =>
                      setCounselingForm({ ...counselingForm, actionItem1: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. Prepare for NET 1 Engineering test."
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Action Roadmap Item 2</label>
                  <input
                    type="text"
                    value={counselingForm.actionItem2}
                    onChange={(e) =>
                      setCounselingForm({ ...counselingForm, actionItem2: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. Maintain 92% in Mathematics."
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCounselingModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg font-bold shadow-sm"
                >
                  Save Counseling Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

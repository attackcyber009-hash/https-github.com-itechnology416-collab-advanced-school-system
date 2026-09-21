import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Medal,
  Users,
  Flag,
  Flame,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  Printer,
  ChevronRight,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';
import {
  HouseRecord,
  HousePointLog,
  SportsTournamentFixture,
  CoCurricularClub,
  Student,
} from '../types';
import {
  INITIAL_HOUSES,
  INITIAL_HOUSE_POINTS_LOG,
  INITIAL_SPORTS_FIXTURES,
  INITIAL_CLUBS,
} from '../data/phase8Data';

interface SportsHousesViewProps {
  students: Student[];
  onPrintHouseCertificate?: (data: any) => void;
}

export default function SportsHousesView({
  students,
  onPrintHouseCertificate,
}: SportsHousesViewProps) {
  const [houses, setHouses] = useState<HouseRecord[]>(INITIAL_HOUSES);
  const [pointLogs, setPointLogs] = useState<HousePointLog[]>(INITIAL_HOUSE_POINTS_LOG);
  const [fixtures, setFixtures] = useState<SportsTournamentFixture[]>(INITIAL_SPORTS_FIXTURES);
  const [clubs, setClubs] = useState<CoCurricularClub[]>(INITIAL_CLUBS);

  const [activeTab, setActiveTab] = useState<'houses' | 'sports' | 'clubs' | 'points_log'>('houses');
  const [showAwardPointsModal, setShowAwardPointsModal] = useState(false);
  const [showNewFixtureModal, setShowNewFixtureModal] = useState(false);

  // Award Points Form State
  const [awardForm, setAwardForm] = useState<{
    houseCode: 'JINNAH' | 'IQBAL' | 'SIR_SYED' | 'LIAQUAT';
    category: any;
    title: string;
    points: number;
    studentName: string;
    awardedBy: string;
    notes: string;
  }>({
    houseCode: 'JINNAH',
    category: 'Sports & Athletics',
    title: 'Inter-House 100m Sprint Gold Medal',
    points: 100,
    studentName: students[0]?.name || 'Hamza Aslam',
    awardedBy: 'Sir Tariq Mahmood (Principal)',
    notes: 'Exceptional athletic display with record time.',
  });

  // New Fixture Form State
  const [fixtureForm, setFixtureForm] = useState<{
    sportName: any;
    tournamentTitle: string;
    round: any;
    teamA: string;
    teamB: string;
    date: string;
    timeSlot: string;
    venueGround: string;
  }>({
    sportName: 'Cricket',
    tournamentTitle: 'Inter-House Autumn T20 Trophy',
    round: 'Final',
    teamA: 'Jinnah House Eagles',
    teamB: 'Sir Syed House Lions',
    date: '2024-09-30',
    timeSlot: '03:00 PM',
    venueGround: 'Main Cricket Oval',
  });

  // Calculate dynamic sorted houses
  const sortedHouses = [...houses].sort((a, b) => b.totalPoints - a.totalPoints);
  const leadingHouse = sortedHouses[0];
  const totalPointsDistributed = houses.reduce((acc, h) => acc + h.totalPoints, 0);

  const handleAwardPoints = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: HousePointLog = {
      id: `hpl-${Date.now()}`,
      houseCode: awardForm.houseCode,
      activityCategory: awardForm.category,
      title: awardForm.title,
      pointsAwarded: Number(awardForm.points),
      awardedToStudent: awardForm.studentName,
      awardedBy: awardForm.awardedBy,
      date: new Date().toISOString().split('T')[0],
      notes: awardForm.notes,
    };

    // Update house totals
    setHouses(
      houses.map((h) =>
        h.code === awardForm.houseCode
          ? { ...h, totalPoints: h.totalPoints + Number(awardForm.points) }
          : h
      )
    );

    setPointLogs([newLog, ...pointLogs]);
    setShowAwardPointsModal(false);
    alert(`Successfully awarded ${awardForm.points} points to ${awardForm.houseCode} House!`);
  };

  const handleCreateFixture = (e: React.FormEvent) => {
    e.preventDefault();
    const newFix: SportsTournamentFixture = {
      id: `stf-${Date.now()}`,
      sportName: fixtureForm.sportName,
      tournamentTitle: fixtureForm.tournamentTitle,
      round: fixtureForm.round,
      teamA: fixtureForm.teamA,
      teamB: fixtureForm.teamB,
      date: fixtureForm.date,
      timeSlot: fixtureForm.timeSlot,
      venueGround: fixtureForm.venueGround,
      scoreOrResult: 'Match Scheduled',
      status: 'Scheduled',
    };

    setFixtures([newFix, ...fixtures]);
    setShowNewFixtureModal(false);
    alert(`New fixture scheduled: ${newFix.teamA} vs ${newFix.teamB} (${newFix.sportName})`);
  };

  return (
    <div id="sports-houses-suite" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#002147] via-[#0b3366] to-[#124e8a] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-400/20 rounded-lg text-amber-300 border border-amber-400/30">
              <Trophy className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              House System, Sports Olympiad &amp; Co-Curricular Societies
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900">
              Phase 8
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Live institutional House Championship rankings (Jinnah, Iqbal, Sir Syed, Liaquat), inter-house tournament fixtures, debating &amp; STEM clubs, and student merit awards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAwardPointsModal(true)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Zap className="w-4 h-4" />
            <span>Award House Points</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNewFixtureModal(true)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 border border-white/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Fixture</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Leading Champion House
            </div>
            <div className="text-base font-black text-emerald-700 mt-0.5">
              {leadingHouse.name.split(' ')[0]} House
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold">
              {leadingHouse.totalPoints.toLocaleString()} Pts ({leadingHouse.trophiesWon} Trophies)
            </div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Points Awarded
            </div>
            <div className="text-xl font-black text-[#002147] mt-0.5">
              {totalPointsDistributed.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Across 4 Institutional Houses</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Sports Meets / Tournaments
            </div>
            <div className="text-xl font-black text-amber-600 mt-0.5">{fixtures.length} Fixtures</div>
            <div className="text-[10px] text-amber-600 font-medium">Cricket, Football, Relay</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Co-Curricular Clubs
            </div>
            <div className="text-xl font-black text-purple-700 mt-0.5">{clubs.length} Societies</div>
            <div className="text-[10px] text-purple-600 font-semibold">181 Active Student Members</div>
          </div>
          <div className="p-2.5 bg-purple-50 text-purple-700 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('houses')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'houses'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>House Championship Leaderboard</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sports')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'sports'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Sports Tournament &amp; Matches ({fixtures.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('clubs')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'clubs'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Societies &amp; Debate Clubs ({clubs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('points_log')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'points_log'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Points Merit Ledger ({pointLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: HOUSES LEADERBOARD */}
      {activeTab === 'houses' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedHouses.map((house, idx) => {
              const borderColors: Record<string, string> = {
                emerald: 'border-emerald-500 bg-emerald-50/20',
                blue: 'border-blue-500 bg-blue-50/20',
                amber: 'border-amber-500 bg-amber-50/20',
                rose: 'border-rose-500 bg-rose-50/20',
              };

              const badgeColors: Record<string, string> = {
                emerald: 'bg-emerald-700 text-white',
                blue: 'bg-blue-700 text-white',
                amber: 'bg-amber-600 text-white',
                rose: 'bg-rose-700 text-white',
              };

              return (
                <div
                  key={house.id}
                  className={`p-4 rounded-xl border-2 transition flex flex-col justify-between space-y-3 relative shadow-xs ${
                    borderColors[house.color] || 'border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${badgeColors[house.color]}`}>
                        Rank #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{house.trophiesWon} Cups</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-[#002147]">{house.name}</h3>
                      <div className="text-[11px] text-slate-600 font-medium italic mt-0.5">
                        "{house.motto}"
                      </div>
                      <div className="text-xs text-slate-500 font-serif font-semibold mt-0.5">
                        {house.mottoUrdu}
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        CHAMPIONSHIP SCORE
                      </div>
                      <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                        {house.totalPoints.toLocaleString()} <span className="text-xs font-normal text-slate-500">pts</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>Master: <strong>{house.houseMasterTeacher}</strong></div>
                      <div>Mistress: <strong>{house.houseMistressTeacher}</strong></div>
                      <div className="pt-1 border-t border-slate-200">
                        Captains: <strong>{house.boyCaptain}</strong> &amp; <strong>{house.girlCaptain}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (onPrintHouseCertificate) {
                          onPrintHouseCertificate({
                            studentName: house.boyCaptain,
                            houseName: house.name,
                            category: 'House Leadership & Sportsmanship Honor',
                            issuedBy: house.houseMasterTeacher,
                            date: '2024-09-20',
                          });
                        } else {
                          alert(`Printing Certificate of Distinction for ${house.name}`);
                        }
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-[10px] flex items-center gap-1 shadow-xs ml-auto"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Merit Award</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SPORTS FIXTURES */}
      {activeTab === 'sports' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Inter-House Sports Fixtures &amp; Championship Schedule
              </h3>
              <p className="text-xs text-slate-500">
                Matches hosted at main cricket oval, turf pitch, and indoor gymnasium under PCB/POA certified coaches.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fixtures.map((fix) => (
              <div
                key={fix.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition bg-gradient-to-b from-slate-50/50 to-white flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">
                      {fix.sportName} • {fix.round}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        fix.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {fix.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{fix.tournamentTitle}</h4>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div className="font-black text-[#002147] text-center flex-1">{fix.teamA}</div>
                    <div className="px-2 text-slate-400 font-bold italic text-[10px]">VS</div>
                    <div className="font-black text-[#002147] text-center flex-1">{fix.teamB}</div>
                  </div>

                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                    <div className="font-semibold text-emerald-800 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>{fix.scoreOrResult}</span>
                    </div>
                    {fix.manOfTheMatchOrMVP && (
                      <div className="text-[11px] text-purple-700 font-medium">
                        ⭐ MVP / Player of Match: <strong>{fix.manOfTheMatchOrMVP}</strong>
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                      📍 {fix.venueGround} • {fix.date} ({fix.timeSlot})
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                  {fix.status === 'Completed' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onPrintHouseCertificate) {
                          onPrintHouseCertificate({
                            studentName: fix.manOfTheMatchOrMVP || 'Champion Athlete',
                            houseName: fix.winnerTeam || 'Victor Squad',
                            category: `${fix.sportName} Tournament Distinction`,
                            issuedBy: 'Director of Physical Education',
                            date: fix.date,
                          });
                        }
                      }}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded font-bold text-[10px] flex items-center gap-1 shadow-xs"
                    >
                      <Medal className="w-3 h-3" />
                      <span>Issue Sports Certificate</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CO-CURRICULAR CLUBS */}
      {activeTab === 'clubs' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold text-[10px]">
                    {club.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {club.membersCount} Active Members
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-[#002147] text-sm">{club.clubName}</h4>
                  <div className="text-xs text-slate-600 mt-1">
                    Mentor: <strong>{club.mentorTeacher}</strong> • President: <strong>{club.studentPresident}</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="text-slate-800 font-semibold">
                    📅 Schedule: {club.meetingDay}
                  </div>
                  <div className="text-blue-700 font-medium">
                    🚀 Upcoming Event: {club.upcomingEvent}
                  </div>
                  <div className="text-emerald-700 text-[11px] italic">
                    🏆 "{club.achievements}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: POINTS LOG */}
      {activeTab === 'points_log' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#002147] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">House</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Activity / Competition</th>
                  <th className="p-3">Awardee Student</th>
                  <th className="p-3 text-center">Points Awarded</th>
                  <th className="p-3">Authorized By</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {pointLogs.map((log) => {
                  const houseColors: Record<string, string> = {
                    JINNAH: 'text-emerald-700 bg-emerald-50',
                    IQBAL: 'text-blue-700 bg-blue-50',
                    SIR_SYED: 'text-amber-700 bg-amber-50',
                    LIAQUAT: 'text-rose-700 bg-rose-50',
                  };

                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${houseColors[log.houseCode]}`}>
                          {log.houseCode}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{log.activityCategory}</td>
                      <td className="p-3 font-semibold text-slate-900 max-w-xs">{log.title}</td>
                      <td className="p-3 font-bold text-[#002147]">{log.awardedToStudent || 'House Squad'}</td>
                      <td className="p-3 text-center font-mono font-black text-emerald-700 text-sm">
                        +{log.pointsAwarded}
                      </td>
                      <td className="p-3 text-slate-600">{log.awardedBy}</td>
                      <td className="p-3 font-mono text-slate-500">{log.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: AWARD HOUSE POINTS */}
      {showAwardPointsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">Award Official House Points</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAwardPointsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAwardPoints} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target House *</label>
                <select
                  value={awardForm.houseCode}
                  onChange={(e) =>
                    setAwardForm({ ...awardForm, houseCode: e.target.value as any })
                  }
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="JINNAH">Jinnah House (Eagles - Green)</option>
                  <option value="IQBAL">Iqbal House (Falcons - Blue)</option>
                  <option value="SIR_SYED">Sir Syed House (Lions - Amber)</option>
                  <option value="LIAQUAT">Liaquat House (Stallions - Rose)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Activity Category</label>
                <select
                  value={awardForm.category}
                  onChange={(e) => setAwardForm({ ...awardForm, category: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="Sports & Athletics">Sports & Athletics</option>
                  <option value="Debates & Declamation">Debates & Declamation</option>
                  <option value="STEM & Robotics">STEM & Robotics</option>
                  <option value="Academics & Quizzes">Academics & Quizzes</option>
                  <option value="Discipline & Assembly">Discipline & Assembly</option>
                  <option value="Arts & Calligraphy">Arts & Calligraphy</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Competition / Achievement Title *</label>
                <input
                  type="text"
                  required
                  value={awardForm.title}
                  onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Points to Award *</label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={500}
                    value={awardForm.points}
                    onChange={(e) => setAwardForm({ ...awardForm, points: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg font-mono font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Awardee Student / Squad</label>
                  <input
                    type="text"
                    value={awardForm.studentName}
                    onChange={(e) => setAwardForm({ ...awardForm, studentName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Authorizing Official</label>
                <input
                  type="text"
                  value={awardForm.awardedBy}
                  onChange={(e) => setAwardForm({ ...awardForm, awardedBy: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAwardPointsModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-bold shadow-sm"
                >
                  Credit House Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW FIXTURE */}
      {showNewFixtureModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Schedule Sports Fixture</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewFixtureModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFixture} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sport Type</label>
                  <select
                    value={fixtureForm.sportName}
                    onChange={(e) =>
                      setFixtureForm({ ...fixtureForm, sportName: e.target.value as any })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Cricket">Cricket</option>
                    <option value="Football">Football</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Athletics & Relay">Athletics & Relay</option>
                    <option value="Table Tennis">Table Tennis</option>
                    <option value="Tug of War">Tug of War</option>
                    <option value="Chess">Chess</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Round</label>
                  <select
                    value={fixtureForm.round}
                    onChange={(e) =>
                      setFixtureForm({ ...fixtureForm, round: e.target.value as any })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="League Stage">League Stage</option>
                    <option value="Quarter Final">Quarter Final</option>
                    <option value="Semi Final">Semi Final</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tournament Title *</label>
                <input
                  type="text"
                  required
                  value={fixtureForm.tournamentTitle}
                  onChange={(e) =>
                    setFixtureForm({ ...fixtureForm, tournamentTitle: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Team / House A *</label>
                  <input
                    type="text"
                    required
                    value={fixtureForm.teamA}
                    onChange={(e) => setFixtureForm({ ...fixtureForm, teamA: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Team / House B *</label>
                  <input
                    type="text"
                    required
                    value={fixtureForm.teamB}
                    onChange={(e) => setFixtureForm({ ...fixtureForm, teamB: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Match Date</label>
                  <input
                    type="date"
                    value={fixtureForm.date}
                    onChange={(e) => setFixtureForm({ ...fixtureForm, date: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={fixtureForm.timeSlot}
                    onChange={(e) => setFixtureForm({ ...fixtureForm, timeSlot: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Venue / Ground</label>
                <input
                  type="text"
                  value={fixtureForm.venueGround}
                  onChange={(e) => setFixtureForm({ ...fixtureForm, venueGround: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewFixtureModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#002147] hover:bg-[#0b3366] text-white rounded-lg font-bold shadow-sm"
                >
                  Save Fixture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

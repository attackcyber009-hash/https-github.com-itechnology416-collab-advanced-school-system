import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Flag,
  Calendar,
  Users,
  Search,
  Plus,
  Printer,
  Sparkles,
  CheckCircle,
  TrendingUp,
  MapPin,
  Flame,
  Award,
} from 'lucide-react';
import { SportsOlympiadEvent, HouseSportsMedalStanding } from '../types';
import {
  INITIAL_SPORTS_OLYMPIAD_EVENTS,
  INITIAL_HOUSE_MEDAL_STANDINGS,
} from '../data/phase10Data';

interface SportsOlympiadTournamentViewProps {
  onPrintSportsCertificate?: (event: SportsOlympiadEvent) => void;
}

export default function SportsOlympiadTournamentView({
  onPrintSportsCertificate,
}: SportsOlympiadTournamentViewProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'leaderboard' | 'national_olympiad'>('events');
  const [events, setEvents] = useState<SportsOlympiadEvent[]>(INITIAL_SPORTS_OLYMPIAD_EVENTS);
  const [standings, setStandings] = useState<HouseSportsMedalStanding[]>(
    INITIAL_HOUSE_MEDAL_STANDINGS
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // Form State for new Event
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Athletics & Track' as SportsOlympiadEvent['category'],
    competitionLevel: 'Intra-Campus Gala' as SportsOlympiadEvent['competitionLevel'],
    date: new Date().toISOString().split('T')[0],
    venue: 'Main Campus Stadium',
    ageCategory: 'Under-18 (Senior / Matric)' as SportsOlympiadEvent['ageCategory'],
    officialJudge: 'Coach Shaukat Hayat (Sports Director)',
    goldName: '',
    goldHouse: 'Iqbal House',
    goldRecord: '',
    silverName: '',
    silverHouse: 'Jinnah House',
    silverRecord: '',
    bronzeName: '',
    bronzeHouse: 'Sir Syed House',
    bronzeRecord: '',
  });

  const filteredEvents = events.filter((ev) => {
    const matchesCategory =
      selectedCategoryFilter === 'All' || ev.category === selectedCategoryFilter;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.eventCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.goldWinner.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: SportsOlympiadEvent = {
      id: `spo-${Date.now()}`,
      eventCode: `SPO-2024-${Math.floor(100 + Math.random() * 900)}`,
      title: eventForm.title,
      category: eventForm.category,
      competitionLevel: eventForm.competitionLevel,
      date: eventForm.date,
      venue: eventForm.venue,
      ageCategory: eventForm.ageCategory,
      participatingHousesOrSchools: ['Jinnah House', 'Iqbal House', 'Sir Syed House', 'Fatima Jinnah House'],
      goldWinner: {
        name: eventForm.goldName || 'TBD Winner',
        houseOrSchool: eventForm.goldHouse,
        scoreOrRecord: eventForm.goldRecord || 'Finalist 1st Place',
      },
      silverWinner: {
        name: eventForm.silverName || 'TBD Runner-up',
        houseOrSchool: eventForm.silverHouse,
        scoreOrRecord: eventForm.silverRecord || 'Finalist 2nd Place',
      },
      bronzeWinner: {
        name: eventForm.bronzeName || 'TBD 3rd Place',
        houseOrSchool: eventForm.bronzeHouse,
        scoreOrRecord: eventForm.bronzeRecord || 'Bronze Position',
      },
      status: 'Concluded',
      officialJudge: eventForm.officialJudge,
    };

    setEvents([newEvent, ...events]);
    setShowAddEventModal(false);
    alert(`Championship Event "${newEvent.title}" recorded with podium winners!`);
  };

  return (
    <div id="sports-olympiad-hub" className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-[#002147] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-400/20 rounded-lg text-emerald-300 border border-emerald-400/30">
              <Trophy className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Annual Sports Gala, House Championship &amp; National Olympiad Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900">
              Phase 10
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Inter-house athletics track &amp; field records, cricket and team sports fixtures, Kangourou Mathematics (IKMC), Science contests, and digital championship certificate generator.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddEventModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Record Championship Event</span>
          </button>
        </div>
      </div>

      {/* House Medal Tallies Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {standings.map((h) => (
          <div
            key={h.houseName}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: h.color }}
                />
                <h4 className="font-bold text-slate-900 text-sm">{h.houseName}</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
                Rank #{h.rank}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 py-3 text-center my-1 bg-slate-50 rounded-lg border">
              <div>
                <div className="text-[10px] text-amber-600 font-bold flex items-center justify-center gap-0.5">
                  <Medal className="w-3 h-3 text-amber-500" /> Gold
                </div>
                <div className="text-base font-black text-slate-900">{h.gold}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold flex items-center justify-center gap-0.5">
                  <Medal className="w-3 h-3 text-slate-400" /> Silver
                </div>
                <div className="text-base font-black text-slate-900">{h.silver}</div>
              </div>
              <div>
                <div className="text-[10px] text-amber-800 font-bold flex items-center justify-center gap-0.5">
                  <Medal className="w-3 h-3 text-amber-700" /> Bronze
                </div>
                <div className="text-base font-black text-slate-900">{h.bronze}</div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[11px]">Cumulative Score</span>
              <span className="font-black text-slate-900 text-sm">{h.totalPoints} Pts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('events')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'events'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Annual Sports Gala &amp; Championship Events</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('leaderboard')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'leaderboard'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Inter-House Leaderboard &amp; Points Matrix</span>
        </button>
      </div>

      {/* TAB 1: EVENTS & RESULTS */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Category:</span>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="p-1.5 border rounded-lg bg-white"
              >
                <option value="All">All Categories</option>
                <option value="Athletics & Track">Athletics &amp; Track</option>
                <option value="Team Sports (Cricket/Football)">Team Sports (Cricket/Football)</option>
                <option value="Academic Olympiad (IKMC/IKSC)">Academic Olympiad (IKMC/IKSC)</option>
                <option value="Islamic & Literary Contests">Islamic &amp; Literary Contests</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search event title, venue, winner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 hover:shadow-xs transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-[10px]">
                      {ev.eventCode} • {ev.ageCategory}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-bold">
                      {ev.competitionLevel}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{ev.title}</h4>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {ev.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> {ev.venue}
                    </span>
                  </div>

                  {/* Podium Display */}
                  <div className="p-3 bg-slate-50 rounded-lg border space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-amber-700">
                        <Medal className="w-4 h-4 text-amber-500" /> 1st (Gold):
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {ev.goldWinner.name} ({ev.goldWinner.houseOrSchool}) -{' '}
                        <span className="text-emerald-700 font-mono">{ev.goldWinner.scoreOrRecord}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t pt-1">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                        <Medal className="w-4 h-4 text-slate-400" /> 2nd (Silver):
                      </span>
                      <span className="text-slate-800 font-medium">
                        {ev.silverWinner.name} ({ev.silverWinner.houseOrSchool}) -{' '}
                        <span className="text-slate-600 font-mono">{ev.silverWinner.scoreOrRecord}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t pt-1">
                      <span className="flex items-center gap-1.5 font-medium text-amber-900">
                        <Medal className="w-4 h-4 text-amber-700" /> 3rd (Bronze):
                      </span>
                      <span className="text-slate-700">
                        {ev.bronzeWinner.name} ({ev.bronzeWinner.houseOrSchool}) -{' '}
                        <span className="text-slate-500 font-mono">{ev.bronzeWinner.scoreOrRecord}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Judge: {ev.officialJudge}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onPrintSportsCertificate) {
                        onPrintSportsCertificate(ev);
                      } else {
                        alert(`Generating Sports Award Certificate for ${ev.goldWinner.name}`);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#002147] hover:bg-[#0b3366] text-white rounded font-bold text-[11px] flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Print Award Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LEADERBOARD MATRIX */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">
              Official Inter-House Sports Championship Trophy Leaderboard
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b">
                  <th className="p-2.5">Standing Rank</th>
                  <th className="p-2.5">House Name</th>
                  <th className="p-2.5 text-center">Gold (15 Pts)</th>
                  <th className="p-2.5 text-center">Silver (10 Pts)</th>
                  <th className="p-2.5 text-center">Bronze (5 Pts)</th>
                  <th className="p-2.5 text-right">Total Championship Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {standings.map((st) => (
                  <tr key={st.houseName} className="hover:bg-slate-50">
                    <td className="p-2.5 font-black text-slate-900 text-sm">
                      #{st.rank} {st.rank === 1 && '🏆'}
                    </td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: st.color }}
                        />
                        {st.houseName}
                      </div>
                    </td>
                    <td className="p-2.5 text-center font-bold text-amber-600">{st.gold}</td>
                    <td className="p-2.5 text-center font-semibold text-slate-600">{st.silver}</td>
                    <td className="p-2.5 text-center font-medium text-amber-800">{st.bronze}</td>
                    <td className="p-2.5 text-right font-black text-emerald-800 text-sm">
                      {st.totalPoints} Pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD EVENT */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-base">Record Sports Gala / Olympiad Event</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddEventModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4x100m Inter-House Relay Championship"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        category: e.target.value as SportsOlympiadEvent['category'],
                      })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Athletics & Track">Athletics &amp; Track</option>
                    <option value="Team Sports (Cricket/Football)">Team Sports (Cricket/Football)</option>
                    <option value="Academic Olympiad (IKMC/IKSC)">Academic Olympiad (IKMC/IKSC)</option>
                    <option value="Islamic & Literary Contests">Islamic &amp; Literary Contests</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age Bracket</label>
                  <select
                    value={eventForm.ageCategory}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        ageCategory: e.target.value as SportsOlympiadEvent['ageCategory'],
                      })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Under-12 (Primary)">Under-12 (Primary)</option>
                    <option value="Under-15 (Middle)">Under-15 (Middle)</option>
                    <option value="Under-18 (Senior / Matric)">Under-18 (Senior / Matric)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Gold Winner Inputs */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
                <div className="font-bold text-amber-900 flex items-center gap-1">
                  <Medal className="w-4 h-4 text-amber-600" /> 1st Place (Gold Medal Winner)
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Athlete Name"
                    value={eventForm.goldName}
                    onChange={(e) => setEventForm({ ...eventForm, goldName: e.target.value })}
                    className="p-1.5 border rounded bg-white"
                  />
                  <select
                    value={eventForm.goldHouse}
                    onChange={(e) => setEventForm({ ...eventForm, goldHouse: e.target.value })}
                    className="p-1.5 border rounded bg-white"
                  >
                    <option value="Iqbal House">Iqbal House</option>
                    <option value="Jinnah House">Jinnah House</option>
                    <option value="Sir Syed House">Sir Syed House</option>
                    <option value="Fatima Jinnah House">Fatima Jinnah House</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Time / Score Record"
                    value={eventForm.goldRecord}
                    onChange={(e) => setEventForm({ ...eventForm, goldRecord: e.target.value })}
                    className="p-1.5 border rounded bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-sm"
                >
                  Save Event &amp; Award
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

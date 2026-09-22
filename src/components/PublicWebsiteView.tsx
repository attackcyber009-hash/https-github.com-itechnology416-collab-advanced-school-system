import { useState } from 'react';
import {
  GraduationCap,
  Shield,
  BookOpen,
  Award,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  LogIn,
  ChevronRight,
  Clock,
  Sparkles,
  Bus,
  Laptop,
  CheckCircle2,
  Calendar,
  FileText,
  Search,
  School,
  Activity,
  ArrowRight
} from 'lucide-react';

interface PublicWebsiteViewProps {
  onOpenLogin: () => void;
  onNavigateSection?: (section: string) => void;
}

export default function PublicWebsiteView({ onOpenLogin }: PublicWebsiteViewProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'programs' | 'features' | 'contact' | 'notices'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [inquiryForm, setInquiryForm] = useState({
    parentName: '',
    phone: '',
    email: '',
    studentClass: 'Class One',
    message: '',
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquirySuccessMessage, setInquirySuccessMessage] = useState<string | null>(null);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.parentName || !inquiryForm.phone) return;
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryForm({ parentName: '', phone: '', email: '', studentClass: 'Class One', message: '' });
      setInquirySuccessMessage('Admission inquiry submitted successfully! Our campus counselor will contact you shortly.');
      setTimeout(() => setInquirySuccessMessage(null), 6000);
    }, 800);
  };

  return (
    <div id="public-website" className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Top Emergency/Hotline Announcement Ribbon */}
      <div className="bg-[#002147] text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admissions Open 2026-2027 Session</span>
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <Phone className="w-3 h-3 text-sky-400" />
              <span>Hotline: +92 (042) 111-777-888</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="hidden md:inline text-slate-300">Single National Curriculum (SNC) &amp; Cambridge O-Level</span>
            <button
              type="button"
              onClick={onOpenLogin}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded text-xs transition flex items-center gap-1 shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Portal Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Public Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* School Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#002147] via-[#0b3c5d] to-[#1d2731] flex items-center justify-center text-white shadow-md border border-amber-400/40">
              <div className="text-center">
                <GraduationCap className="w-6 h-6 mx-auto text-amber-300" />
              </div>
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-[#002147] uppercase leading-tight">
                THE EDUCATORS
              </div>
              <div className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
                A Project of Beaconhouse
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-700">
            {(
              [
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Us' },
                { id: 'programs', label: 'Academic Programs' },
                { id: 'features', label: 'Smart Campus' },
                { id: 'notices', label: 'Notices & News' },
                { id: 'contact', label: 'Contact & Inquiry' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-sky-50 text-sky-700 font-extrabold'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Authentication Page Action Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="landing-header-login-btn"
              onClick={onOpenLogin}
              className="px-4 py-2 bg-[#002147] hover:bg-[#003366] active:bg-[#00152e] text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-amber-300" />
              <span>LOGIN</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Public Website Content */}
      <main className="flex-1">
        {/* TAB 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div>
            {/* Hero Banner */}
            <section className="relative bg-gradient-to-r from-[#002147] via-[#093563] to-[#1a4a75] text-white py-16 px-4 overflow-hidden">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-amber-300/30 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Nationwide Network of 900+ Campuses</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
                    Empowering Generations Through Quality Education
                  </h1>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal max-w-2xl">
                    The Educators, a project of Beaconhouse, provides standardized quality education grounded in national values, modern STEM labs, and digital parent-school synergy across Pakistan.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('programs')}
                      className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg shadow-lg transition flex items-center gap-2"
                    >
                      <span>Explore Curriculum</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={onOpenLogin}
                      className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4 text-emerald-400" />
                      <span>Access Student / Parent Portal</span>
                    </button>
                  </div>
                </div>

                {/* Right Card: Quick Admission Inquiry */}
                <div className="lg:col-span-5 bg-white text-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-100">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-lg font-black text-[#002147] flex items-center gap-2">
                      <School className="w-5 h-5 text-emerald-600" />
                      <span>Admission Inquiry Form</span>
                    </h3>
                    <p className="text-xs text-slate-500">Apply for 2026-2027 Academic Session</p>
                  </div>

                  {inquirySuccessMessage && (
                    <div className="p-3 mb-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs">
                      <span>✓ {inquirySuccessMessage}</span>
                      <button type="button" onClick={() => setInquirySuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800 font-bold">✕</button>
                    </div>
                  )}

                  <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Parent / Guardian Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Muhammad Aslam"
                        value={inquiryForm.parentName}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, parentName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#002147]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Mobile Phone *</label>
                        <input
                          type="text"
                          required
                          placeholder="+92 300 1234567"
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#002147]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Grade / Class *</label>
                        <select
                          value={inquiryForm.studentClass}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, studentClass: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#002147]"
                        >
                          <option>Playgroup / Nursery</option>
                          <option>Class One</option>
                          <option>Class Five</option>
                          <option>Class Nine (SNC)</option>
                          <option>Matric / O-Levels</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Message / Questions</label>
                      <textarea
                        rows={2}
                        placeholder="Inquire about fee structure, transport or merit assessment..."
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#002147]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={inquirySubmitted}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-md shadow transition text-xs"
                    >
                      {inquirySubmitted ? 'Submitting Inquiry...' : 'Submit Admission Inquiry'}
                    </button>
                  </form>
                </div>
              </div>
            </section>

            {/* Core Institutional Highlights */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-black uppercase text-emerald-700 tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  EXCELLENCE IN EDUCATION
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#002147] mt-2">
                  Why Choose The Educators?
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Over two decades of academic distinction supported by Beaconhouse pedagogy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: GraduationCap,
                    title: 'Standardized SNC Curriculum',
                    desc: 'Fully aligned with Pakistan Single National Curriculum and BISE Board standards.',
                    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
                  },
                  {
                    icon: Shield,
                    title: 'Biometric & RFID Safety',
                    desc: 'Real-time turnstile gate logging with immediate SMS entry/exit alerts to parents.',
                    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                  },
                  {
                    icon: Laptop,
                    title: 'AI & Digital Portal',
                    desc: 'Integrated parent helpdesk, daily homework diary, online fee voucher payment gateway.',
                    color: 'text-sky-600 bg-sky-50 border-sky-200',
                  },
                  {
                    icon: Award,
                    title: 'Proven Merit Records',
                    desc: 'Consistent 98.4% board pass percentage with top positions in matric and science olympiads.',
                    color: 'text-amber-600 bg-amber-50 border-amber-200',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition"
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mb-4 ${item.color}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Portal Action Banner */}
            <section className="bg-slate-900 text-white py-12 px-4 border-y border-slate-800">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black text-amber-300">Registered Student, Parent or Faculty?</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Access your personalized dashboard for fee payment, attendance records, homework diary, report cards, and online exam results.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg shadow-lg transition flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Secure Sign In</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: ABOUT US */}
        {activeTab === 'about' && (
          <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-widest">ABOUT THE EDUCATORS</span>
              <h2 className="text-3xl font-black text-[#002147]">A Beaconhouse Educational Legacy</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Launched in November 2002, The Educators has grown to become one of the largest school networks in Pakistan, extending quality education across 200+ cities. Operating under the administrative vision of Beaconhouse, The Educators delivers modern academic rigor with cultural values.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-[#002147]">22+</div>
                  <div className="text-xs font-bold text-slate-600">Years of Educational Leadership</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-emerald-700">250,000+</div>
                  <div className="text-xs font-bold text-slate-600">Active Students Enrolled</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-2xl font-black text-amber-700">900+</div>
                  <div className="text-xs font-bold text-slate-600">Operational Campus Branches</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACADEMIC PROGRAMS */}
        {activeTab === 'programs' && (
          <div className="max-w-7xl mx-auto py-12 px-4 space-y-6">
            <div className="text-center max-w-xl mx-auto mb-6">
              <h2 className="text-2xl font-black text-[#002147]">Academic Offerings</h2>
              <p className="text-xs text-slate-600">Structured growth stages from Early Years to Matric/O-Level</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Early Years (Playgroup - KG)',
                  desc: 'Montessori-inspired activity based learning fostering early cognitive, social, and fine motor skills.',
                  badge: 'Ages 3 - 5',
                },
                {
                  title: 'Primary Wing (Classes 1 - 5)',
                  desc: 'Core grounding in Mathematics, Science, English, Urdu, Islamiyat and digital literacy.',
                  badge: 'Classes I - V',
                },
                {
                  title: 'Secondary & O-Levels (Classes 6 - 10)',
                  desc: 'Rigorous BISE Board & Cambridge preparation supported by STEM practical science labs.',
                  badge: 'Classes VI - X',
                },
              ].map((prog, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono">
                    {prog.badge}
                  </span>
                  <h3 className="font-black text-base text-slate-900 mt-2 mb-1">{prog.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{prog.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SMART CAMPUS FEATURES */}
        {activeTab === 'features' && (
          <div className="max-w-7xl mx-auto py-12 px-4 space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-[#002147]">Smart Campus Technology Stack</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'Biometric & RFID Attendance Gateways',
                  'Online Fee Voucher 1Link/Kuickpay Gateway',
                  'AI Exam Paper Studio & SNC Grading',
                  'Live Fleet GPS Bus Tracker',
                  'Digital Library & E-Learning Portal',
                  'Parent Mobile SMS & WhatsApp Alerts',
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: NOTICES */}
        {activeTab === 'notices' && (
          <div className="max-w-7xl mx-auto py-12 px-4 space-y-4">
            <h2 className="text-2xl font-black text-[#002147]">Official Campus Announcements</h2>
            <div className="space-y-3">
              {[
                { title: 'BISE Matriculation Board Exam Datesheet 2026', date: '2026-09-18', tag: 'Academic' },
                { title: 'Annual Sports Olympiad & Athletics Roster', date: '2026-09-15', tag: 'Events' },
                { title: 'October Fee Voucher Online Payment Portal Active', date: '2026-09-10', tag: 'Finance' },
              ].map((n, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                      {n.tag}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">{n.title}</h4>
                    <span className="text-[11px] text-slate-400">Published: {n.date}</span>
                  </div>
                  <button type="button" onClick={onOpenLogin} className="text-xs font-bold text-sky-700 hover:underline">
                    View In Portal →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CONTACT & INQUIRY */}
        {activeTab === 'contact' && (
          <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-black text-[#002147]">Campus Location &amp; Contact</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Main Model Town Campus</div>
                    <div className="text-slate-600">Block B, Model Town, Lahore, Punjab, Pakistan</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-800 font-semibold">+92 (042) 35881234, +92 300 1234567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="text-slate-800 font-semibold">info@theeducators.edu.pk</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black text-[#002147] mb-4">Portals Quick Access</h3>
              <p className="text-xs text-slate-600 mb-4">
                Students, Parents, Teachers, Accountants and Administrators must sign in via the secure authentication gateway.
              </p>
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full py-3 bg-[#002147] hover:bg-[#003366] text-white font-extrabold rounded-xl shadow transition text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>Go To Secure Login Screen</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Public Footer */}
      <footer className="bg-[#00152e] text-slate-300 py-8 px-4 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="font-black text-white text-sm">THE EDUCATORS SCHOOL SYSTEM</div>
            <div className="text-slate-400 text-[11px] mt-0.5">A Project of Beaconhouse • Standardized Quality Education</div>
          </div>
          <div className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} The Educators. All rights reserved. Secure Auth Gateway Enforced.
          </div>
        </div>
      </footer>
    </div>
  );
}

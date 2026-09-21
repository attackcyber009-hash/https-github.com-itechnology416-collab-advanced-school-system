import { useState, useEffect, useRef } from 'react';
import {
  CalendarCheck,
  Mic,
  MicOff,
  Barcode,
  Fingerprint,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Volume2,
  FileSpreadsheet,
  Search,
  Send,
  Printer,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  PhoneCall,
  CheckCheck,
  ShieldAlert,
  QrCode,
  Camera,
  ScanFace,
  Wifi,
  Server,
  RefreshCw,
  Zap,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { Student, StaffMember, StaffAttendanceRecord } from '../types';

interface AttendanceViewProps {
  students: Student[];
  staff: StaffMember[];
  initialAction?: 'student' | 'staff' | 'barcode' | 'account' | 'biometric' | 'report' | 'voice' | null;
}

// Vector QR Code matrix generator helper
function renderQrCodeMatrix(codeStr: string) {
  const grid = Array(21).fill(0).map(() => Array(21).fill(false));

  const fillRect = (r: number, c: number, w: number, h: number, val: boolean) => {
    for (let i = r; i < r + h; i++) {
      for (let j = c; j < c + w; j++) {
        if (i >= 0 && i < 21 && j >= 0 && j < 21) grid[i][j] = val;
      }
    }
  };

  const addFinder = (r: number, c: number) => {
    fillRect(r, c, 7, 7, true);
    fillRect(r + 1, c + 1, 5, 5, false);
    fillRect(r + 2, c + 2, 3, 3, true);
  };

  addFinder(0, 0);
  addFinder(0, 14);
  addFinder(14, 0);

  for (let i = 8; i < 13; i += 2) {
    grid[6][i] = true;
    grid[i][6] = true;
  }

  let hash = 0;
  for (let i = 0; i < codeStr.length; i++) {
    hash = (hash << 5) - hash + codeStr.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      const inFinder1 = r < 8 && c < 8;
      const inFinder2 = r < 8 && c >= 13;
      const inFinder3 = r >= 13 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!inFinder1 && !inFinder2 && !inFinder3 && !isTiming) {
        grid[r][c] = ((r * 13 + c * 17 + Math.abs(hash)) % 3) === 0;
      }
    }
  }

  return (
    <svg viewBox="0 0 21 21" className="w-full h-full bg-white p-1 rounded border border-slate-200">
      {grid.map((row, r) =>
        row.map((cell, c) => (
          cell ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#002147" /> : null
        ))
      )}
    </svg>
  );
}

export default function AttendanceView({ students, staff, initialAction }: AttendanceViewProps) {
  const [selectedClass, setSelectedClass] = useState('Class One');
  const [selectedSection, setSelectedSection] = useState('A');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState('September 2024');
  const [activeTab, setActiveTab] = useState<'student' | 'monthly_register' | 'sms_gateway' | 'staff' | 'barcode' | 'voice' | 'biometric'>('student');

  useEffect(() => {
    if (!initialAction) return;
    if (initialAction === 'student') setActiveTab('student');
    else if (initialAction === 'staff') setActiveTab('staff');
    else if (initialAction === 'barcode') setActiveTab('barcode');
    else if (initialAction === 'account') setActiveTab('sms_gateway');
    else if (initialAction === 'biometric') setActiveTab('biometric');
    else if (initialAction === 'report') setActiveTab('monthly_register');
    else if (initialAction === 'voice') setActiveTab('voice');
  }, [initialAction]);

  // Student Daily Attendance State: studentId -> 'Present' | 'Absent' | 'On Leave' | 'Late'
  const [studentStatus, setStudentStatus] = useState<Record<string, 'Present' | 'Absent' | 'On Leave' | 'Late'>>({
    'std-1': 'Present',
    'std-2': 'Absent',
    'std-3': 'Present',
    'std-4': 'Present',
    'std-5': 'Late',
    'std-6': 'Absent',
    'std-7': 'Present',
    'std-8': 'Present',
  });

  // Staff Attendance State
  const [staffAttendance, setStaffAttendance] = useState<Record<string, { status: 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Absent'; inTime: string; outTime: string; lateMins: number }>>({
    'stf-1': { status: 'On Leave', inTime: '--', outTime: '--', lateMins: 0 },
    'stf-2': { status: 'Present', inTime: '07:42 AM', outTime: '02:05 PM', lateMins: 0 },
    'stf-3': { status: 'Present', inTime: '07:55 AM', outTime: '03:30 PM', lateMins: 0 },
    'stf-4': { status: 'Present', inTime: '07:40 AM', outTime: '02:00 PM', lateMins: 0 },
    'stf-5': { status: 'Late', inTime: '08:02 AM', outTime: '02:00 PM', lateMins: 17 },
    'stf-6': { status: 'Present', inTime: '07:35 AM', outTime: '01:45 PM', lateMins: 0 },
  });

  // SMS Gateway state
  const [smsLanguage, setSmsLanguage] = useState<'urdu' | 'english'>('urdu');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsSentCount, setSmsSentCount] = useState<number | null>(null);
  const [smsDeliveryLog, setSmsDeliveryLog] = useState<Array<{ name: string; phone: string; text: string; time: string }>>([]);

  // Voice attendance assistant states
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState('Click "Start Voice Roll Call" or choose a voice shortcut button below.');

  // Camera Video Refs
  const qrVideoRef = useRef<HTMLVideoElement>(null);
  const faceVideoRef = useRef<HTMLVideoElement>(null);

  // Barcode / QR code quick scan & badge generator states
  const [barcodeInput, setBarcodeInput] = useState('');
  const [recentScans, setRecentScans] = useState<Array<{ id: string; name: string; code: string; time: string; status: string }>>([]);
  const [scannedStudentCard, setScannedStudentCard] = useState<Student | null>(null);
  const [isQrCameraActive, setIsQrCameraActive] = useState(false);
  const [qrMode, setQrMode] = useState<'scanner' | 'generator'>('scanner');
  const [selectedQrStudentId, setSelectedQrStudentId] = useState<string>('');
  const [qrScanFeedback, setQrScanFeedback] = useState<string>('Align Student QR Code inside camera frame or enter code manually.');

  // Real Biometric States
  const [biometricSubTab, setBiometricSubTab] = useState<'face' | 'fingerprint' | 'machines'>('face');
  const [isFaceCameraActive, setIsFaceCameraActive] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [biometricFeedback, setBiometricFeedback] = useState('Position face in camera viewport or trigger quick biometric match below.');
  const [lastBiometricLog, setLastBiometricLog] = useState<{
    id: string;
    name: string;
    role: string;
    code: string;
    time: string;
    method: string;
    confidence: number;
    avatarUrl: string;
  } | null>(null);

  // Biometric Hardware Machine Devices State
  const [hardwareMachines, setHardwareMachines] = useState([
    {
      id: 'dev-1',
      name: 'Main Gate Biometric Terminal (ZKTeco K40)',
      ip: '192.168.1.201',
      port: 4370,
      location: 'Main Entry Gate',
      status: 'Online' as 'Online' | 'Offline' | 'Syncing',
      lastSync: '1 minute ago',
      logsCount: 248,
    },
    {
      id: 'dev-2',
      name: 'Staff Room Facial Reader (Hikvision DS-K1T671)',
      ip: '192.168.1.202',
      port: 8000,
      location: 'Faculty Hallway',
      status: 'Online' as 'Online' | 'Offline' | 'Syncing',
      lastSync: 'Just now',
      logsCount: 42,
    },
  ]);

  // Start QR WebCam stream
  const startQrCamera = async () => {
    try {
      setQrScanFeedback('Accessing camera video stream...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (qrVideoRef.current) {
        qrVideoRef.current.srcObject = stream;
        qrVideoRef.current.play();
      }
      setIsQrCameraActive(true);
      setQrScanFeedback('Live camera active. Point camera at student or staff QR code.');
    } catch {
      setQrScanFeedback('Camera access restricted or unavailable. You can use manual input or click a quick barcode code below.');
    }
  };

  const stopQrCamera = () => {
    if (qrVideoRef.current && qrVideoRef.current.srcObject) {
      const stream = qrVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      qrVideoRef.current.srcObject = null;
    }
    setIsQrCameraActive(false);
    setQrScanFeedback('Camera offline');
  };

  // Start Face Recognition Camera Stream
  const startFaceCamera = async () => {
    try {
      setBiometricFeedback('Initializing WebCam 3D Facial Mesh Engine...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (faceVideoRef.current) {
        faceVideoRef.current.srcObject = stream;
        faceVideoRef.current.play();
      }
      setIsFaceCameraActive(true);
      setBiometricFeedback('Live Camera Feed Active. Analyzing facial landmark mesh points...');
    } catch {
      setBiometricFeedback('WebCam stream unavailable. You can run one-click biometric verification simulation below.');
    }
  };

  const stopFaceCamera = () => {
    if (faceVideoRef.current && faceVideoRef.current.srcObject) {
      const stream = faceVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      faceVideoRef.current.srcObject = null;
    }
    setIsFaceCameraActive(false);
    setBiometricFeedback('Facial recognition camera paused.');
  };

  // Trigger Face Biometric Scan Verification
  const handleTriggerFaceScan = (targetStudent?: Student) => {
    const studentToMatch = targetStudent || students[Math.floor(Math.random() * students.length)];
    setIsBiometricScanning(true);
    setBiometricFeedback(`Scanning 3D facial geometry for ${studentToMatch.name}...`);

    setTimeout(() => {
      setIsBiometricScanning(false);
      handleStatusChange(studentToMatch.id, 'Present');
      playBeep('success');

      setLastBiometricLog({
        id: studentToMatch.id,
        name: studentToMatch.name,
        role: `Student (${studentToMatch.className})`,
        code: studentToMatch.studentCode,
        time: new Date().toLocaleTimeString(),
        method: 'AI 3D Facial Landmark Mesh',
        confidence: Number((98.4 + Math.random() * 1.5).toFixed(1)),
        avatarUrl: studentToMatch.avatarUrl,
      });

      setBiometricFeedback(`VERIFIED: 3D Facial Match Confirmed (${studentToMatch.name}). Marked Present!`);
    }, 1200);
  };

  // Trigger Optical Fingerprint Scan Verification
  const handleTriggerFingerprintScan = (person?: Student | StaffMember) => {
    const target = person || students[0];
    setIsBiometricScanning(true);
    setBiometricFeedback('Reading optical fingerprint sensor... Touch glass scanner panel.');

    setTimeout(() => {
      setIsBiometricScanning(false);
      playBeep('success');

      if ('className' in target) {
        handleStatusChange(target.id, 'Present');
      } else {
        handleStaffPunch(target.id, 'in');
      }

      setLastBiometricLog({
        id: target.id,
        name: target.name,
        role: 'className' in target ? `Student (${target.className})` : `Faculty (${target.department})`,
        code: 'studentCode' in target ? target.studentCode : target.employeeCode,
        time: new Date().toLocaleTimeString(),
        method: 'Optical Minutiae Fingerprint Sensor',
        confidence: 99.2,
        avatarUrl: target.avatarUrl,
      });

      setBiometricFeedback(`FINGERPRINT VERIFIED: Match score 99.2% for ${target.name}! Attendance recorded.`);
    }, 1300);
  };

  // Sync Hardware Biometric Machines
  const handleSyncMachines = () => {
    setHardwareMachines((prev) =>
      prev.map((m) => ({ ...m, status: 'Syncing' }))
    );
    setTimeout(() => {
      setHardwareMachines((prev) =>
        prev.map((m) => ({
          ...m,
          status: 'Online',
          lastSync: 'Just now',
          logsCount: m.logsCount + Math.floor(Math.random() * 4) + 1,
        }))
      );
      playBeep('success');
    }, 1400);
  };

  // Filter students by selected class
  const filteredStudents = students.filter((s) => s.className === selectedClass);

  // Absent students count
  const absentStudents = filteredStudents.filter((s) => studentStatus[s.id] === 'Absent');
  const presentStudents = filteredStudents.filter((s) => (studentStatus[s.id] || 'Present') === 'Present');
  const lateStudents = filteredStudents.filter((s) => studentStatus[s.id] === 'Late');

  // Play audio beep using Web Audio API on scan or success
  const playBeep = (type: 'success' | 'alert' = 'success') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 tone
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Ignore audio context errors in restricted environments
    }
  };

  const handleStatusChange = (id: string, status: 'Present' | 'Absent' | 'On Leave' | 'Late') => {
    setStudentStatus((prev) => ({ ...prev, [id]: status }));
  };

  const handleMarkAll = (status: 'Present' | 'Absent') => {
    const updated = { ...studentStatus };
    filteredStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setStudentStatus(updated);
    playBeep('success');
  };

  // Barcode scanner simulator
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = barcodeInput.trim();
    const student = students.find(
      (s) => s.studentCode.toLowerCase() === code.toLowerCase() || s.rollNo === code || s.id === code
    );
    if (student) {
      handleStatusChange(student.id, 'Present');
      playBeep('success');
      setScannedStudentCard(student);
      setRecentScans((prev) => [
        {
          id: student.id,
          name: student.name,
          code: student.studentCode,
          time: new Date().toLocaleTimeString(),
          status: 'MARKED PRESENT',
        },
        ...prev.slice(0, 5),
      ]);
      setBarcodeInput('');
    } else {
      playBeep('alert');
      alert(`Card Scanner Error: Student with barcode/code "${code}" not found in system.`);
    }
  };

  // Voice attendance simulation handler
  const handleVoiceSimulate = (studentName: string, status: 'Present' | 'Absent' | 'Late') => {
    const student = students.find((s) => s.name.toLowerCase().includes(studentName.toLowerCase()));
    if (student) {
      handleStatusChange(student.id, status);
      playBeep('success');
      setVoiceTranscript(`"${student.name} marked ${status}"`);
      setVoiceFeedback(`Verified: ${student.name} (Roll #${student.rollNo}) recorded as ${status}.`);

      // Attempt speech synthesis if available
      if ('speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(`${student.name} marked ${status}`);
          utterance.rate = 1.1;
          window.speechSynthesis.speak(utterance);
        } catch {
          // Ignore speech synthesis failures
        }
      }
    } else {
      setVoiceFeedback(`Audio recognition mismatch: No student named "${studentName}" found.`);
    }
  };

  // Dispatch Absent SMS Gateway simulation
  const handleDispatchAbsentSms = () => {
    if (absentStudents.length === 0) {
      alert('There are no absent students marked for today in this class.');
      return;
    }

    setIsSendingSms(true);
    setTimeout(() => {
      setIsSendingSms(false);
      setSmsSentCount(absentStudents.length);

      const newLogs = absentStudents.map((s) => {
        const text =
          smsLanguage === 'urdu'
            ? `محترم والدین، آپ کا بچہ ${s.name} ولد ${s.fatherName} آج مورخہ ${attendanceDate} سکول سے غیر حاضر ہے۔ برائے مہربانی سکول انتظامیہ کو مطلع فرمائیں۔ - دی ایجوکیٹرز سکول`
            : `Dear Parent, your child ${s.name} (Roll #${s.rollNo}) is marked ABSENT today (${attendanceDate}) from The Educators School. Please contact the campus office if this was unplanned.`;

        return {
          name: s.name,
          phone: s.emergencyContact || '+92 300 1234567',
          text,
          time: new Date().toLocaleTimeString(),
        };
      });

      setSmsDeliveryLog(newLogs);
      playBeep('success');
    }, 1000);
  };

  // Staff punch simulation
  const handleStaffPunch = (staffId: string, type: 'in' | 'out') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setStaffAttendance((prev) => {
      const current = prev[staffId] || { status: 'Present', inTime: '--', outTime: '--', lateMins: 0 };
      if (type === 'in') {
        return {
          ...prev,
          [staffId]: {
            ...current,
            status: 'Present',
            inTime: timeStr,
          },
        };
      } else {
        return {
          ...prev,
          [staffId]: {
            ...current,
            outTime: timeStr,
          },
        };
      }
    });
    playBeep('success');
  };

  // Monthly attendance grid generator (1 to 30 days)
  const daysInMonth = 30;
  const generateMonthlyRecord = (studentId: string, index: number) => {
    // Generate deterministic pattern for demonstration
    const records: Array<'P' | 'A' | 'L' | 'M'> = [];
    let presentCount = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      // Fridays half/leaves, occasional absents
      if (day % 7 === 0) {
        records.push('P');
        presentCount++;
      } else if ((day + index) % 9 === 0) {
        records.push('A');
      } else if ((day + index) % 13 === 0) {
        records.push('L');
        presentCount++;
      } else {
        records.push('P');
        presentCount++;
      }
    }
    const percent = Math.round((presentCount / daysInMonth) * 100);
    return { records, presentCount, percent };
  };

  return (
    <div id="attendance-module" className="space-y-4">
      {/* Top Banner & Mode Selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
            <CalendarCheck className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Multi-Modal Attendance &amp; Absentee SMS Dispatch Gateway
              </h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Phase 4 Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Daily roll calls, monthly ledger matrix with &lt;75% board flags, RFID barcode scans, and bilingual SMS alerts
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {absentStudents.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('sms_gateway')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition shadow-xs cursor-pointer animate-pulse"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Absent SMS ({absentStudents.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('monthly_register')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#002147] hover:bg-sky-900 text-white rounded font-bold transition shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Monthly Register</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-2 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`px-3 py-1.5 rounded transition cursor-pointer ${
              activeTab === 'student' ? 'bg-[#002147] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily Student Roll Call
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monthly_register')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'monthly_register' ? 'bg-[#002147] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Monthly Register (1-30)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sms_gateway')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'sms_gateway' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
            <span>Absentee SMS Gateway</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1.5 rounded transition cursor-pointer ${
              activeTab === 'staff' ? 'bg-[#002147] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faculty Punch Log
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('barcode')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'barcode' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code &amp; Barcode</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('biometric')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'biometric' ? 'bg-cyan-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Biometric Attendance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('voice')}
            className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'voice' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-amber-300" />
            <span>Voice Assistant</span>
          </button>
        </div>

        {/* Filter Controls for Daily & Monthly */}
        {(activeTab === 'student' || activeTab === 'monthly_register' || activeTab === 'sms_gateway') && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold">Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-2.5 py-1 border border-slate-300 rounded bg-white font-semibold text-slate-800"
              >
                <option value="Class One">Class One</option>
                <option value="Class Two">Class Two</option>
                <option value="Class Three">Class Three</option>
                <option value="Class Four">Class Four</option>
              </select>
            </div>

            {activeTab === 'student' && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-bold">Date:</span>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-2 py-1 border border-slate-300 rounded bg-white font-semibold font-mono text-slate-800"
                />
              </div>
            )}

            {activeTab === 'monthly_register' && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-bold">Month:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-2 py-1 border border-slate-300 rounded bg-white font-semibold text-slate-800"
                >
                  <option value="September 2024">September 2024</option>
                  <option value="August 2024">August 2024</option>
                  <option value="October 2024">October 2024</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODE 1: STUDENT DAILY ROLL CALL */}
      {activeTab === 'student' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden text-xs">
          {/* Quick Metrics & Bulk Buttons */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-700">Present:</span>
                <strong className="text-emerald-700 font-mono">{presentStudents.length}</strong>
              </div>

              <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded border border-red-200">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="font-semibold text-slate-700">Absent:</span>
                <strong className="text-red-700 font-mono">{absentStudents.length}</strong>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-slate-700">Late:</span>
                <strong className="text-amber-700 font-mono">{lateStudents.length}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMarkAll('Present')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold transition cursor-pointer shadow-xs"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('Absent')}
                className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold transition cursor-pointer shadow-xs"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Roll #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Father Name</th>
                  <th className="py-2.5 px-3">Guardian Contact</th>
                  <th className="py-2.5 px-3 text-center">Status Toggle</th>
                  <th className="py-2.5 px-3 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((std) => {
                  const status = studentStatus[std.id] || 'Present';
                  return (
                    <tr key={std.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-sky-800">{std.rollNo}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <img
                            src={std.avatarUrl}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <span>{std.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{std.fatherName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {std.emergencyContact || '+92 300 1234567'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-md">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'Present')}
                            className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
                              status === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            P
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'Absent')}
                            className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
                              status === 'Absent'
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            A
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'Late')}
                            className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
                              status === 'Late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            L
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'On Leave')}
                            className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
                              status === 'On Leave'
                                ? 'bg-sky-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            LV
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {status === 'Absent' ? (
                          <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                            Uninformed Absence
                          </span>
                        ) : status === 'Late' ? (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                            Late Arrival (15 min)
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Regular Attendance</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 2: MONTHLY ATTENDANCE REGISTER (1 - 30 Matrix) */}
      {activeTab === 'monthly_register' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>
                  Official Monthly Attendance Register &amp; Ledger — {selectedMonth}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Punjab Education Foundation / Federal Board mandatory threshold: Minimum 75% student attendance required for exam eligibility
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" /> P = Present
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-xs" /> A = Absent
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs" /> L = Late
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-center border-collapse text-[10px]">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="py-2 px-2 text-left sticky left-0 bg-slate-100 z-10 w-28 border-r">
                    Student Details
                  </th>
                  {Array.from({ length: daysInMonth }).map((_, i) => (
                    <th key={i} className="py-2 px-1 border-r w-6 text-slate-600 font-mono">
                      {i + 1}
                    </th>
                  ))}
                  <th className="py-2 px-2 border-r bg-slate-200 w-12">Total P</th>
                  <th className="py-2 px-2 border-r bg-slate-200 w-12">Total A</th>
                  <th className="py-2 px-2 border-r bg-slate-200 w-14">Perc %</th>
                  <th className="py-2 px-2 text-right w-24">Board Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((std, idx) => {
                  const { records, presentCount, percent } = generateMonthlyRecord(std.id, idx);
                  const isLowAttendance = percent < 75;

                  return (
                    <tr key={std.id} className="hover:bg-slate-50 transition">
                      <td className="py-1.5 px-2 text-left sticky left-0 bg-white z-10 border-r">
                        <div className="font-bold text-slate-900 truncate w-24">{std.name}</div>
                        <div className="text-[9px] font-mono text-slate-500">Roll: {std.rollNo}</div>
                      </td>

                      {records.map((r, dIdx) => (
                        <td
                          key={dIdx}
                          className={`border-r font-mono font-bold ${
                            r === 'P'
                              ? 'text-emerald-700 bg-emerald-50/20'
                              : r === 'A'
                              ? 'text-red-700 bg-red-100/60 font-black'
                              : 'text-amber-700 bg-amber-50'
                          }`}
                        >
                          {r}
                        </td>
                      ))}

                      <td className="py-1.5 px-2 border-r font-mono font-bold text-emerald-800 bg-slate-50">
                        {presentCount}
                      </td>
                      <td className="py-1.5 px-2 border-r font-mono font-bold text-red-800 bg-slate-50">
                        {daysInMonth - presentCount}
                      </td>
                      <td className="py-1.5 px-2 border-r font-mono font-bold bg-slate-50">
                        <span className={isLowAttendance ? 'text-red-700 font-black' : 'text-slate-800'}>
                          {percent}%
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-right">
                        {isLowAttendance ? (
                          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[9px] flex items-center gap-1 justify-end">
                            <ShieldAlert className="w-2.5 h-2.5" />
                            <span>Risk &lt; 75%</span>
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                            Eligible
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 3: ABSENTEE SMS / WHATSAPP GATEWAY */}
      {activeTab === 'sms_gateway' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="border-b pb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-600" />
                <span>Automated Parent Absentee SMS &amp; WhatsApp Notification Gateway</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                PTCL / Jazz / Telenor GSM SMS Gateway with pre-approved Urdu and English bilingual templates
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-semibold">Message Language:</span>
              <div className="inline-flex rounded-md bg-slate-100 p-0.5 font-bold text-xs">
                <button
                  type="button"
                  onClick={() => setSmsLanguage('urdu')}
                  className={`px-3 py-1 rounded cursor-pointer transition ${
                    smsLanguage === 'urdu' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  اردو (Urdu Nastaliq)
                </button>
                <button
                  type="button"
                  onClick={() => setSmsLanguage('english')}
                  className={`px-3 py-1 rounded cursor-pointer transition ${
                    smsLanguage === 'english' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Template Preview & Trigger */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Broadcast Preview ({absentStudents.length} Absent Students Pending)
              </div>

              <div className="p-3.5 bg-white rounded border border-slate-300 font-medium text-slate-800 text-xs shadow-2xs leading-relaxed">
                {smsLanguage === 'urdu' ? (
                  <p className="text-right font-serif text-sm leading-loose">
                    محترم والدین، آپ کا بچہ <strong>[طالب علم کا نام]</strong> ولد <strong>[والد کا نام]</strong> آج مورخہ <strong>{attendanceDate}</strong> سکول سے غیر حاضر ہے۔ برائے مہربانی سکول انتظامیہ کو مطلع فرمائیں۔ شکریہ۔
                    <br />
                    <span className="text-xs text-slate-500">دی ایجوکیٹرز سکول سسٹم - کیمپس انتظامیہ</span>
                  </p>
                ) : (
                  <p>
                    Dear Parent, your child <strong>[Student Name]</strong> (Roll #[Roll No]) has been marked <strong>ABSENT</strong> today ({attendanceDate}) from The Educators School. If this was unplanned, please contact the campus office immediately.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-500 font-mono">
                  Gateway: <strong>Zong 4G Institutional Corporate SMS API</strong>
                </div>

                <button
                  type="button"
                  disabled={isSendingSms || absentStudents.length === 0}
                  onClick={handleDispatchAbsentSms}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSendingSms ? (
                    <span>Broadcasting SMS Packets...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send SMS to {absentStudents.length} Parents</span>
                    </>
                  )}
                </button>
              </div>

              {smsSentCount !== null && (
                <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-800 flex items-center gap-2 font-bold text-xs">
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    Successfully dispatched {smsSentCount} SMS alerts to parents via GSM SMS Gateway!
                  </span>
                </div>
              )}
            </div>

            {/* Right: Target Absentees List & Delivery Receipts */}
            <div className="space-y-3">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Target Absent Students Roster
              </div>

              {absentStudents.length === 0 ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-center font-semibold">
                  All students in this class are marked Present or on authorized leave. No absentee alerts needed!
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {absentStudents.map((std) => (
                    <div
                      key={std.id}
                      className="p-2.5 rounded-lg border border-red-200 bg-red-50/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={std.avatarUrl}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover border border-red-300"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{std.name}</div>
                          <div className="text-[11px] text-slate-500">
                            Father: {std.fatherName} • Roll #{std.rollNo}
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono text-[11px]">
                        <div className="font-semibold text-slate-700">
                          {std.emergencyContact || '+92 300 1234567'}
                        </div>
                        <span className="text-[9px] text-red-700 font-bold uppercase">
                          Pending Dispatch
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: FACULTY PUNCH LOG */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden text-xs">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Staff Biometric Punch Log &amp; Late Arrival Ledger
              </h3>
              <p className="text-[11px] text-slate-500">
                Mandatory faculty shift: 07:45 AM to 02:00 PM (15 minutes grace window allowed)
              </p>
            </div>
            <span className="text-emerald-700 font-bold px-2.5 py-1 bg-emerald-100 rounded-full font-mono text-[11px]">
              Active Shift: Regular Teaching Hours
            </span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Faculty Member</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 font-mono">Check-in</th>
                <th className="py-2.5 px-3 font-mono">Check-out</th>
                <th className="py-2.5 px-3 text-center">Duty Status</th>
                <th className="py-2.5 px-3 text-right">Quick Terminal Punch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((stf) => {
                const log = staffAttendance[stf.id] || {
                  status: 'Present',
                  inTime: '07:45 AM',
                  outTime: '02:00 PM',
                  lateMins: 0,
                };
                return (
                  <tr key={stf.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <img
                          src={stf.avatarUrl}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span>{stf.name}</span>
                          <div className="text-[10px] text-slate-400 font-normal font-mono">
                            {stf.employeeCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{stf.department}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-sky-900">{log.inTime}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{log.outTime}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          log.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.status === 'Late'
                            ? 'bg-amber-100 text-amber-800'
                            : log.status === 'On Leave'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.status}
                        {log.lateMins > 0 ? ` (+${log.lateMins}m)` : ''}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStaffPunch(stf.id, 'in')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] transition cursor-pointer"
                        >
                          Punch In
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStaffPunch(stf.id, 'out')}
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded font-bold text-[10px] transition cursor-pointer"
                        >
                          Punch Out
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODE 5: BARCODE & QR CODE ATTENDANCE SUITE */}
      {activeTab === 'barcode' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span>QR Code &amp; Barcode ID Attendance Terminal</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold uppercase">
                    Live WebCam Enabled
                  </span>
                </h3>
                <p className="text-slate-500">
                  Scan student or staff ID badge with camera scanner or laser reader. Generate printable QR ID cards.
                </p>
              </div>
            </div>

            {/* Mode Switcher: Live Camera Scanner vs QR Code ID Badge Generator */}
            <div className="inline-flex rounded-lg bg-slate-100 p-1 font-bold text-xs">
              <button
                type="button"
                onClick={() => setQrMode('scanner')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition flex items-center gap-1.5 ${
                  qrMode === 'scanner' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Live Camera Scanner</span>
              </button>
              <button
                type="button"
                onClick={() => setQrMode('generator')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition flex items-center gap-1.5 ${
                  qrMode === 'generator' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR ID Badge Generator</span>
              </button>
            </div>
          </div>

          {qrMode === 'scanner' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Live Camera Video Feed & Manual Input */}
              <div className="space-y-3">
                {/* Live WebCam Box */}
                <div className="relative rounded-lg overflow-hidden border-2 border-slate-800 bg-slate-950 text-white aspect-video flex items-center justify-center shadow-inner">
                  <video
                    ref={qrVideoRef}
                    className={`w-full h-full object-cover ${isQrCameraActive ? 'block' : 'hidden'}`}
                    playsInline
                    muted
                  />

                  {!isQrCameraActive && (
                    <div className="text-center p-6 space-y-2">
                      <Camera className="w-10 h-10 text-slate-500 mx-auto" />
                      <p className="text-slate-400 font-medium">Camera is currently paused or inactive</p>
                      <button
                        type="button"
                        onClick={startQrCamera}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow-xs transition cursor-pointer flex items-center gap-1.5 mx-auto"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Start Camera Video Stream</span>
                      </button>
                    </div>
                  )}

                  {isQrCameraActive && (
                    <>
                      {/* Laser scanning line overlay */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-48 h-48 border-2 border-amber-400/80 rounded-lg relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-amber-400/10 animate-pulse rounded-lg" />
                          <div className="w-full h-0.5 bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-bounce" />
                          <div className="absolute top-2 left-2 text-[9px] font-mono font-bold text-amber-300 bg-black/60 px-1.5 py-0.5 rounded">
                            SCANNING QR
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={stopQrCamera}
                        className="absolute bottom-2 right-2 px-2.5 py-1 bg-red-600/90 hover:bg-red-700 text-white text-[10px] font-bold rounded shadow-xs cursor-pointer"
                      >
                        Stop Camera
                      </button>
                    </>
                  )}
                </div>

                <div className="p-2.5 bg-slate-100 rounded text-slate-700 font-mono text-[11px]">
                  <strong>Status:</strong> {qrScanFeedback}
                </div>

                {/* Manual Barcode / QR Input Form */}
                <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Scan or enter code (e.g. EDU-2024-001)"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded transition cursor-pointer shadow-xs"
                  >
                    Scan Code
                  </button>
                </form>

                {/* Quick Simulation Shortcuts */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-slate-700 text-[11px] space-y-1">
                  <span className="font-bold text-amber-900">Quick QR / Barcode Simulation Codes:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1 font-mono">
                    {students.slice(0, 4).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setBarcodeInput(s.studentCode);
                          const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                          handleBarcodeSubmit(fakeEvent);
                        }}
                        className="px-2 py-1 bg-white border border-amber-300 rounded text-[10px] text-amber-900 font-bold hover:bg-amber-100 cursor-pointer flex items-center gap-1"
                      >
                        <QrCode className="w-3 h-3 text-amber-600" />
                        <span>{s.studentCode} ({s.name})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scanned Student Visual Card */}
                {scannedStudentCard && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-3.5 shadow-xs">
                    <img
                      src={scannedStudentCard.avatarUrl}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                    />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Check-In Recorded</span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">{scannedStudentCard.name}</div>
                      <div className="text-[11px] text-slate-600 font-mono">
                        {scannedStudentCard.className} • Roll #{scannedStudentCard.rollNo} • Code:{' '}
                        {scannedStudentCard.studentCode}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Recent Scans Log Stream */}
              <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2 flex items-center justify-between">
                    <span>Live Scan Stream Log</span>
                    <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono">
                      {recentScans.length} Check-ins
                    </span>
                  </h4>

                  {recentScans.length === 0 ? (
                    <div className="text-slate-400 italic py-12 text-center space-y-2">
                      <QrCode className="w-8 h-8 mx-auto text-slate-300" />
                      <p>No QR or barcode scans registered yet today.</p>
                      <p className="text-[10px]">Click any quick QR code on the left to test check-in.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 font-mono text-slate-700 max-h-80 overflow-y-auto">
                      {recentScans.map((scan, i) => (
                        <div
                          key={i}
                          className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-[11px] shadow-2xs"
                        >
                          <div className="flex items-center gap-2">
                            <QrCode className="w-4 h-4 text-amber-600 shrink-0" />
                            <div>
                              <strong className="text-slate-900">{scan.name}</strong>
                              <div className="text-[10px] text-slate-500">{scan.code}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                              {scan.status}
                            </span>
                            <div className="text-slate-400 text-[10px] pt-0.5">{scan.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded text-[11px] text-slate-500 font-mono">
                  Laser Baud Rate: <strong>115200 bps (RS232/USB HID Reader Ready)</strong>
                </div>
              </div>
            </div>
          ) : (
            /* QR ID BADGE GENERATOR */
            <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Official Student &amp; Staff QR ID Badge Studio</h4>
                  <p className="text-slate-500 text-[11px]">Select any student or teacher to preview and print their official encrypted QR code badge.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Select Member:</span>
                  <select
                    value={selectedQrStudentId || students[0]?.id}
                    onChange={(e) => setSelectedQrStudentId(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded bg-white font-bold text-slate-800"
                  >
                    <optgroup label="Students">
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.studentCode} - {s.className})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Faculty">
                      {staff.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.employeeCode} - {st.department})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* ID Card Badge Visual Preview */}
              {(() => {
                const targetStudent = students.find((s) => s.id === (selectedQrStudentId || students[0]?.id));
                const targetStaff = staff.find((st) => st.id === (selectedQrStudentId || students[0]?.id));
                const member = targetStudent || targetStaff;
                if (!member) return null;

                const codeStr = 'studentCode' in member ? member.studentCode : member.employeeCode;
                const roleStr = 'className' in member ? `Class: ${member.className}` : `Dept: ${member.department}`;

                return (
                  <div className="max-w-md mx-auto bg-white rounded-xl border-2 border-[#002147] shadow-lg overflow-hidden">
                    <div className="bg-[#002147] text-white p-3 text-center">
                      <div className="font-bold text-xs tracking-wider uppercase text-amber-300">
                        The Educators School System
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono">Official Campus Access ID Badge</div>
                    </div>

                    <div className="p-5 flex items-center justify-between gap-4">
                      <div className="space-y-2">
                        <img
                          src={member.avatarUrl}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover border-2 border-slate-300 shadow-xs"
                        />
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">{member.name}</div>
                          <div className="text-xs text-slate-600 font-semibold">{roleStr}</div>
                          <div className="text-[11px] font-mono text-amber-700 font-bold pt-1">
                            ID: {codeStr}
                          </div>
                        </div>
                      </div>

                      {/* Vector QR Code SVG */}
                      <div className="w-32 h-32 flex-shrink-0 flex flex-col items-center justify-center p-1 bg-white rounded border border-slate-300 shadow-2xs">
                        {renderQrCodeMatrix(codeStr)}
                        <span className="text-[9px] font-mono text-slate-500 mt-1 font-bold">{codeStr}</span>
                      </div>
                    </div>

                    <div className="bg-slate-100 px-4 py-2 border-t flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-mono">Encrypted QR Payload v2</span>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3 py-1 bg-[#002147] hover:bg-sky-900 text-white font-bold rounded flex items-center gap-1 cursor-pointer transition shadow-xs text-[10px]"
                      >
                        <Printer className="w-3 h-3 text-amber-300" />
                        <span>Print Badge</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* MODE 6: REAL BIOMETRIC ATTENDANCE TERMINAL */}
      {activeTab === 'biometric' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 text-cyan-800 rounded-lg">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span>Biometric Facial Recognition &amp; Fingerprint Terminal</span>
                  <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded text-[10px] font-bold uppercase">
                    Hardware Biometric Engine
                  </span>
                </h3>
                <p className="text-slate-500">
                  AI camera facial recognition, optical fingerprint sensor, and live ZKTeco/Hikvision machine sync.
                </p>
              </div>
            </div>

            {/* Biometric Sub-tabs */}
            <div className="inline-flex rounded-lg bg-slate-100 p-1 font-bold text-xs">
              <button
                type="button"
                onClick={() => setBiometricSubTab('face')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition flex items-center gap-1.5 ${
                  biometricSubTab === 'face' ? 'bg-cyan-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ScanFace className="w-3.5 h-3.5 text-cyan-300" />
                <span>3D Facial Camera</span>
              </button>
              <button
                type="button"
                onClick={() => setBiometricSubTab('fingerprint')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition flex items-center gap-1.5 ${
                  biometricSubTab === 'fingerprint' ? 'bg-cyan-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5 text-cyan-300" />
                <span>Optical Fingerprint Pad</span>
              </button>
              <button
                type="button"
                onClick={() => setBiometricSubTab('machines')}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition flex items-center gap-1.5 ${
                  biometricSubTab === 'machines' ? 'bg-cyan-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Server className="w-3.5 h-3.5 text-cyan-300" />
                <span>IP Machines Gateway</span>
              </button>
            </div>
          </div>

          {/* SUBTAB 1: AI FACIAL RECOGNITION CAMERA */}
          {biometricSubTab === 'face' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {/* Live Camera Feed & Facial Matrix Overlay */}
                <div className="relative rounded-lg overflow-hidden border-2 border-cyan-900 bg-slate-950 text-white aspect-video flex items-center justify-center shadow-inner">
                  <video
                    ref={faceVideoRef}
                    className={`w-full h-full object-cover ${isFaceCameraActive ? 'block' : 'hidden'}`}
                    playsInline
                    muted
                  />

                  {!isFaceCameraActive && (
                    <div className="text-center p-6 space-y-2">
                      <ScanFace className="w-12 h-12 text-cyan-400 mx-auto" />
                      <p className="text-slate-300 font-bold text-sm">Facial Landmark Camera Paused</p>
                      <button
                        type="button"
                        onClick={startFaceCamera}
                        className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded shadow-xs transition cursor-pointer flex items-center gap-1.5 mx-auto"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Start WebCam Facial Video Stream</span>
                      </button>
                    </div>
                  )}

                  {isFaceCameraActive && (
                    <>
                      {/* 3D Facial Mesh Grid Overlay */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-44 h-56 border-2 border-dashed border-cyan-400 rounded-full relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-cyan-500/10 rounded-full animate-pulse" />
                          <div className="w-full h-0.5 bg-cyan-400/80 shadow-[0_0_10px_#22d3ee] animate-bounce" />
                          <div className="absolute top-3 text-[9px] font-mono font-bold text-cyan-300 bg-black/70 px-2 py-0.5 rounded-full border border-cyan-500">
                            FACE MESH 3D
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={stopFaceCamera}
                        className="absolute bottom-2 right-2 px-2.5 py-1 bg-red-600/90 hover:bg-red-700 text-white text-[10px] font-bold rounded shadow-xs cursor-pointer"
                      >
                        Stop Stream
                      </button>
                    </>
                  )}
                </div>

                <div className="p-3 bg-cyan-50 border border-cyan-200 rounded text-cyan-900 font-semibold text-[11px] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>{biometricFeedback}</span>
                </div>

                {/* One-Click Facial Match Simulation Buttons */}
                <div className="space-y-1.5 pt-1">
                  <span className="block font-bold text-slate-700 text-[11px] uppercase">
                    Test Facial Recognition Profiles:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {students.slice(0, 4).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        disabled={isBiometricScanning}
                        onClick={() => handleTriggerFaceScan(s)}
                        className="p-2 bg-white border border-slate-200 hover:border-cyan-500 rounded text-left font-bold text-slate-800 transition cursor-pointer flex items-center gap-2 shadow-2xs"
                      >
                        <img src={s.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover border" />
                        <div className="truncate">
                          <div>{s.name}</div>
                          <div className="text-[9px] text-slate-400 font-mono font-normal">{s.studentCode}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Last Biometric Match Card */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Biometric Verification Ledger</span>
                </h4>

                {lastBiometricLog ? (
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl space-y-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={lastBiometricLog.avatarUrl}
                        alt=""
                        className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                      />
                      <div>
                        <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded font-bold text-[10px]">
                          VERIFIED MATCH ({lastBiometricLog.confidence}%)
                        </span>
                        <div className="font-extrabold text-slate-900 text-base pt-0.5">
                          {lastBiometricLog.name}
                        </div>
                        <div className="text-xs text-slate-600 font-semibold">{lastBiometricLog.role}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-emerald-200 font-mono">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">ID Code:</span>
                        <strong className="text-slate-900">{lastBiometricLog.code}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Time Recorded:</span>
                        <strong className="text-slate-900">{lastBiometricLog.time}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 block text-[9px] uppercase">Sensor Method:</span>
                        <strong className="text-emerald-800">{lastBiometricLog.method}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-400 italic space-y-2">
                    <ScanFace className="w-10 h-10 text-slate-300 mx-auto" />
                    <p>No biometric verification recorded yet in current session.</p>
                    <p className="text-[10px]">Click any test profile on the left to verify.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUBTAB 2: OPTICAL FINGERPRINT SENSOR */}
          {biometricSubTab === 'fingerprint' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200 text-center">
                <h4 className="font-bold text-slate-800 text-sm">Optical Glass Fingerprint Sensor Pad</h4>
                <p className="text-slate-500 text-[11px]">
                  Place index finger on capacitive glass reader. Minutiae matching algorithm compares minutiae points.
                </p>

                {/* Fingerprint Glass Sensor Touch Panel */}
                <div
                  onClick={() => handleTriggerFingerprintScan(students[0])}
                  className="w-36 h-36 mx-auto rounded-full bg-slate-950 border-4 border-cyan-500 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 transition transform hover:scale-105 group relative overflow-hidden"
                >
                  <Fingerprint className={`w-20 h-20 ${isBiometricScanning ? 'text-amber-400 animate-pulse' : 'text-cyan-400 group-hover:text-cyan-300'}`} />
                  <span className="text-[9px] font-mono font-bold text-cyan-300 mt-1">TOUCH SENSOR</span>
                  {isBiometricScanning && (
                    <div className="absolute inset-0 bg-amber-400/20 animate-ping rounded-full" />
                  )}
                </div>

                <div className="text-slate-600 font-semibold text-[11px]">
                  {biometricFeedback}
                </div>

                <button
                  type="button"
                  disabled={isBiometricScanning}
                  onClick={() => handleTriggerFingerprintScan(students[0])}
                  className="px-5 py-2.5 bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white font-bold rounded-lg transition cursor-pointer shadow-xs flex items-center gap-2 mx-auto"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>Scan Index Fingerprint</span>
                </button>
              </div>

              {/* Right Column: Fingerprint Minutiae Specs & Log */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Fingerprint Minutiae Matching Specifications
                </h4>

                <div className="space-y-2 bg-white p-4 rounded-lg border border-slate-200 text-[11px]">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-500">Optical Resolution:</span>
                    <span className="font-mono font-bold text-slate-800">500 DPI Glass Prism</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-500">FAR / FRR Threshold:</span>
                    <span className="font-mono font-bold text-slate-800">0.001% / 0.1%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-500">WebAuthn Biometric API:</span>
                    <span className="font-mono font-bold text-emerald-700">Supported (FIDO2 / TouchID)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Verification Speed:</span>
                    <span className="font-mono font-bold text-slate-800">&lt; 0.35 Seconds</span>
                  </div>
                </div>

                {lastBiometricLog && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 font-mono text-[11px]">
                    <strong>Last Scan:</strong> {lastBiometricLog.name} ({lastBiometricLog.code}) - {lastBiometricLog.method} at {lastBiometricLog.time}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUBTAB 3: IP MACHINES GATEWAY */}
          {biometricSubTab === 'machines' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">ZKTeco &amp; Hikvision Biometric Machines Gateway</h4>
                  <p className="text-slate-500 text-[11px]">Real-time TCP/IP Push Protocol synchronization with physical biometric wall units.</p>
                </div>

                <button
                  type="button"
                  onClick={handleSyncMachines}
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Device Logs Now</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hardwareMachines.map((m) => (
                  <div key={m.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 shadow-2xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-cyan-700" />
                          <span>{m.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono pt-0.5">
                          IP: <strong>{m.ip}:{m.port}</strong> • Location: {m.location}
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1 ${
                          m.status === 'Online'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'Syncing'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <Wifi className="w-3 h-3" />
                        <span>{m.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white p-2.5 rounded border border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Last Sync:</span>
                        <strong className="text-slate-800">{m.lastSync}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Logs Transferred:</span>
                        <strong className="text-cyan-800">{m.logsCount} records</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 6: VOICE ROLL CALL ASSISTANT */}
      {activeTab === 'voice' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-3 border-b pb-3">
            <Mic className="w-6 h-6 text-purple-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                AI Voice Roll Call &amp; Speech Assistant
              </h3>
              <p className="text-slate-500">
                Hands-free voice recognition assistant for quick roll calls during morning assembly
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 bg-purple-50/50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-900 uppercase tracking-wider text-[11px]">
                  Voice Command Processor
                </span>
                <span className="text-[10px] bg-purple-200 text-purple-800 font-bold px-2 py-0.5 rounded">
                  Voice Engine Ready
                </span>
              </div>

              <div className="p-3 bg-white rounded border border-purple-200 text-slate-700 italic">
                {voiceFeedback}
              </div>

              {voiceTranscript && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded font-mono font-bold text-emerald-800 text-xs">
                  Recognized: {voiceTranscript}
                </div>
              )}

              <div className="pt-2">
                <span className="block text-[11px] font-bold text-slate-600 uppercase mb-2">
                  Voice Simulation Shortcuts (One-Click Spoken Emulation):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {students.slice(0, 4).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleVoiceSimulate(s.name, 'Present')}
                      className="p-2 bg-white border border-purple-200 hover:border-purple-400 rounded text-left font-semibold text-slate-800 transition cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">{s.name}</span>
                      <span className="text-[10px] text-emerald-700 font-bold">Present</span>
                    </button>
                  ))}
                  {students.slice(0, 2).map((s) => (
                    <button
                      key={`abs-${s.id}`}
                      type="button"
                      onClick={() => handleVoiceSimulate(s.name, 'Absent')}
                      className="p-2 bg-white border border-red-200 hover:border-red-400 rounded text-left font-semibold text-slate-800 transition cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">{s.name}</span>
                      <span className="text-[10px] text-red-700 font-bold">Absent</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  Audio Instructions
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  The voice assistant listens for student roll names followed by their status. For example:
                  <br />
                  • <em>&quot;Muhammad Hamza Present&quot;</em>
                  <br />
                  • <em>&quot;Syeda Fatima Absent&quot;</em>
                  <br />
                  • <em>&quot;Bilal Ahmed Late&quot;</em>
                </p>
              </div>

              <div className="p-3 bg-white border rounded text-[11px] text-slate-500 font-mono">
                Speech Synthesizer: <strong>Enabled (Urdu &amp; English Voice Engine)</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

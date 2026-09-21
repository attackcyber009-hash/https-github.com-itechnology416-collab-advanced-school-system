import {
  Plus,
  GraduationCap,
  Check,
  Users,
  CreditCard,
  DollarSign,
  ThumbsUp,
  Briefcase,
  PieChart,
  UserCheck,
  MessageSquare,
  MessageCircle,
  Bell,
  RefreshCw,
  Settings,
  BookOpen,
  Edit3,
  FileSpreadsheet,
  Bus,
  Award,
} from 'lucide-react';
import { ActiveNavTab } from '../types';

interface QuickActionRibbonProps {
  onSelectTab: (tab: ActiveNavTab) => void;
  onQuickAdmissionModal: () => void;
  onRefreshData: () => void;
}

export default function QuickActionRibbon({
  onSelectTab,
  onQuickAdmissionModal,
  onRefreshData,
}: QuickActionRibbonProps) {
  const actions = [
    {
      id: 'quick-add-student',
      label: 'Admit Student',
      icon: Plus,
      bg: 'bg-[#28a745] hover:bg-[#218838]',
      action: onQuickAdmissionModal,
    },
    {
      id: 'quick-student-list',
      label: 'Students',
      icon: GraduationCap,
      bg: 'bg-[#dc3545] hover:bg-[#c82333]',
      action: () => onSelectTab('students'),
    },
    {
      id: 'quick-attendance',
      label: 'Attendance',
      icon: Check,
      bg: 'bg-[#28a745] hover:bg-[#218838]',
      action: () => onSelectTab('attendance'),
    },
    {
      id: 'quick-classes',
      label: 'Classes',
      icon: Users,
      bg: 'bg-[#17a2b8] hover:bg-[#138496]',
      action: () => onSelectTab('classes'),
    },
    {
      id: 'quick-vouchers',
      label: 'Fee Vouchers',
      icon: CreditCard,
      bg: 'bg-[#fd7e14] hover:bg-[#e06b0b]',
      action: () => onSelectTab('fee_vouchers'),
    },
    {
      id: 'quick-accounting',
      label: 'Direct Fee',
      icon: DollarSign,
      bg: 'bg-[#20c997] hover:bg-[#1ba87e]',
      action: () => onSelectTab('accounting'),
    },
    {
      id: 'quick-leave',
      label: 'Leaves',
      icon: ThumbsUp,
      bg: 'bg-[#007bff] hover:bg-[#0069d9]',
      action: () => onSelectTab('attendance'),
    },
    {
      id: 'quick-staff',
      label: 'Staff',
      icon: Briefcase,
      bg: 'bg-[#d39e00] hover:bg-[#b08300]',
      action: () => onSelectTab('staff'),
    },
    {
      id: 'quick-expenses',
      label: 'Expenses',
      icon: PieChart,
      bg: 'bg-[#e83e8c] hover:bg-[#d63384]',
      action: () => onSelectTab('expenses'),
    },
    {
      id: 'quick-parents',
      label: 'Parents',
      icon: UserCheck,
      bg: 'bg-[#6610f2] hover:bg-[#520dc2]',
      action: () => onSelectTab('parents'),
    },
    {
      id: 'quick-sms',
      label: 'SMS Broadcast',
      icon: MessageSquare,
      bg: 'bg-[#82c91e] hover:bg-[#6fa818]',
      action: () => onSelectTab('communications'),
    },
    {
      id: 'quick-whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      bg: 'bg-[#495057] hover:bg-[#343a40]',
      action: () => onSelectTab('communications'),
    },
    {
      id: 'quick-notices',
      label: 'Notice Board',
      icon: Bell,
      bg: 'bg-[#fd7e14] hover:bg-[#e06b0b]',
      action: () => onSelectTab('communications'),
    },
    {
      id: 'quick-sync',
      label: 'Refresh Sync',
      icon: RefreshCw,
      bg: 'bg-[#17a2b8] hover:bg-[#138496]',
      action: onRefreshData,
    },
    {
      id: 'quick-settings',
      label: 'Settings',
      icon: Settings,
      bg: 'bg-[#007bff] hover:bg-[#0069d9]',
      action: () => onSelectTab('settings'),
    },
    {
      id: 'quick-diary',
      label: 'Daily Diary',
      icon: BookOpen,
      bg: 'bg-[#f08c00] hover:bg-[#cc7700]',
      action: () => onSelectTab('diary'),
    },
    {
      id: 'quick-marks',
      label: 'Marks Entry',
      icon: Edit3,
      bg: 'bg-[#e03131] hover:bg-[#c92a2a]',
      action: () => onSelectTab('exams'),
    },
    {
      id: 'quick-tabulation',
      label: 'Tabulation',
      icon: FileSpreadsheet,
      bg: 'bg-[#2f9e44] hover:bg-[#2b8a3e]',
      action: () => onSelectTab('exams'),
    },
    {
      id: 'quick-certificates',
      label: 'Certificates & SLC',
      icon: Award,
      bg: 'bg-[#002147] hover:bg-[#072e5e]',
      action: () => onSelectTab('certifications'),
    },
    {
      id: 'quick-transport',
      label: 'Transport Fleet & GPS',
      icon: Bus,
      bg: 'bg-[#e67700] hover:bg-[#d9480f]',
      action: () => onSelectTab('transport'),
    },
  ];

  return (
    <div
      id="quick-action-ribbon"
      className="bg-white rounded-lg shadow-sm border border-slate-200 p-2 overflow-x-auto select-none mb-4"
    >
      <div className="flex items-center gap-1.5 min-w-max">
        {actions.map((act) => (
          <button
            key={act.id}
            id={act.id}
            type="button"
            title={act.label}
            onClick={act.action}
            className={`w-9 h-8 rounded text-white flex items-center justify-center shadow-xs transition duration-150 active:scale-90 cursor-pointer ${act.bg}`}
          >
            <act.icon className="w-4 h-4 stroke-[2.2]" />
          </button>
        ))}
      </div>
    </div>
  );
}

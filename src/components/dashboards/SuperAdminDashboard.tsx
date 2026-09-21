import React from 'react';
import DashboardView from '../DashboardView';
import {
  Student,
  StaffMember,
  FeeVoucher,
  ClassInfo,
  ExpenseRecord,
  CampusBranch,
  AcademicSession,
  NoticeItem,
  ActiveNavTab,
  StudentMarkEntry,
} from '../../types';

interface SuperAdminDashboardProps {
  students: Student[];
  staff: StaffMember[];
  vouchers: FeeVoucher[];
  classes: ClassInfo[];
  expenses?: ExpenseRecord[];
  campuses?: CampusBranch[];
  selectedCampus?: string;
  onSelectCampus?: (campus: string) => void;
  sessions?: AcademicSession[];
  notices?: NoticeItem[];
  marks?: StudentMarkEntry[];
  onNavigate: (tab: ActiveNavTab) => void;
  onAdmitClick: () => void;
  onPrintVoucher?: (voucher: FeeVoucher) => void;
  onPrintIdCard?: (student: Student) => void;
}

export default function SuperAdminDashboard(props: SuperAdminDashboardProps) {
  return <DashboardView {...props} />;
}

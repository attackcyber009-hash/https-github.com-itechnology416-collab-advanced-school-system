import {
  Student,
  StaffMember,
  ClassInfo,
  NoticeItem,
  DailyDiary,
  TimetablePeriod,
  StudentMarkEntry,
  StudyMaterial,
} from '../types';
import TeacherDashboard, { TeacherSectionTab } from './dashboards/TeacherDashboard';

interface TeacherPortalViewProps {
  students: Student[];
  materials?: StudyMaterial[];
  staff?: StaffMember[];
  classes?: ClassInfo[];
  notices?: NoticeItem[];
  diaries?: DailyDiary[];
  timetable?: TimetablePeriod[];
  marks?: StudentMarkEntry[];
  initialTab?: TeacherSectionTab;
  onUploadMaterial?: (material: Omit<StudyMaterial, 'id'>) => void;
  onNavigateTab: (tab: any) => void;
  onPrintMarkSheet?: (entry: any) => void;
  onPrintAdmitCard?: (entry: any) => void;
}

export default function TeacherPortalView({
  students,
  materials = [],
  staff = [],
  classes = [],
  notices = [],
  diaries = [],
  timetable = [],
  marks = [],
  initialTab = 'overview',
  onUploadMaterial,
  onNavigateTab,
  onPrintMarkSheet,
  onPrintAdmitCard,
}: TeacherPortalViewProps) {
  // If classes is empty, build standard classes from student data or fallback
  const resolvedClasses: ClassInfo[] = classes.length > 0 ? classes : [
    {
      id: 'cls-1',
      name: 'Class One',
      numericLevel: 1,
      monthlyTuition: 3500,
      sections: [{ name: 'A', strength: 24, roomNo: 'Room 101', classTeacher: 'Ms. Ayesha Siddiqa' }],
    },
    {
      id: 'cls-2',
      name: 'Class Two',
      numericLevel: 2,
      monthlyTuition: 3800,
      sections: [{ name: 'A', strength: 18, roomNo: 'Room 102', classTeacher: 'Ms. Ayesha Siddiqa' }],
    },
    {
      id: 'cls-3',
      name: 'Class Three',
      numericLevel: 3,
      monthlyTuition: 4000,
      sections: [{ name: 'A', strength: 22, roomNo: 'Room 103', classTeacher: 'Ms. Ayesha Siddiqa' }],
    },
  ];

  return (
    <div id="teacher-portal-integrated-view">
      <TeacherDashboard
        students={students}
        staff={staff}
        classes={resolvedClasses}
        notices={notices}
        diaries={diaries}
        materials={materials}
        timetable={timetable}
        marks={marks}
        initialTab={initialTab}
        onNavigate={onNavigateTab}
        onPrintMarkSheet={onPrintMarkSheet}
        onPrintAdmitCard={onPrintAdmitCard}
      />
    </div>
  );
}

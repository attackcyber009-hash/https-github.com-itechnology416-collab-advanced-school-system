import {
  TimetablePeriodSlot,
  ClassWeeklyTimetable,
  TeacherDailySubstitution,
  BellScheduleConfiguration,
} from '../types';

export const INITIAL_TIMETABLE_SLOTS: TimetablePeriodSlot[] = [
  { periodNumber: 0, periodLabel: 'Zero Period (Remedial / Coaching)', startTime: '07:30 AM', endTime: '08:00 AM' },
  { periodNumber: 1, periodLabel: 'Period 1', startTime: '08:00 AM', endTime: '08:45 AM' },
  { periodNumber: 2, periodLabel: 'Period 2', startTime: '08:45 AM', endTime: '09:30 AM' },
  { periodNumber: 3, periodLabel: 'Period 3', startTime: '09:30 AM', endTime: '10:15 AM' },
  { periodNumber: 4, periodLabel: 'Recess / Snack Break', startTime: '10:15 AM', endTime: '10:45 AM', isBreakOrPrayer: true },
  { periodNumber: 5, periodLabel: 'Period 4 (Lab Practical)', startTime: '10:45 AM', endTime: '11:30 AM' },
  { periodNumber: 6, periodLabel: 'Period 5', startTime: '11:30 AM', endTime: '12:15 PM' },
  { periodNumber: 7, periodLabel: 'Period 6 / Friday Prayer', startTime: '12:15 PM', endTime: '01:00 PM' },
  { periodNumber: 8, periodLabel: 'Period 7 (Dismissal Prep)', startTime: '01:00 PM', endTime: '01:45 PM' },
];

export const INITIAL_CLASS_TIMETABLES: ClassWeeklyTimetable[] = [
  {
    className: 'Class 9-A (Science)',
    section: 'A',
    roomNumber: 'Room 204 (First Floor)',
    classTeacher: 'Sir Tariq Jamil (Physics Lead)',
    days: [
      {
        dayName: 'Monday',
        periods: [
          { periodNumber: 1, subjectName: 'Physics (Mechanics)', subjectCode: 'PHY-901', teacherName: 'Sir Tariq Jamil', roomOrLab: 'Room 204' },
          { periodNumber: 2, subjectName: 'Chemistry', subjectCode: 'CHM-902', teacherName: 'Madam Shamim Akhtar', roomOrLab: 'Chemistry Lab A' },
          { periodNumber: 3, subjectName: 'Mathematics (Algebra)', subjectCode: 'MTH-903', teacherName: 'Sir Salman Ali', roomOrLab: 'Room 204' },
          { periodNumber: 5, subjectName: 'English Literature', subjectCode: 'ENG-904', teacherName: 'Madam Nadia Qureshi', roomOrLab: 'Room 204' },
          { periodNumber: 6, subjectName: 'Biology Lab Practical', subjectCode: 'BIO-905', teacherName: 'Dr. Fauzia Yasmin', roomOrLab: 'Biology Lab 2' },
          { periodNumber: 7, subjectName: 'Pakistan Studies', subjectCode: 'PKS-906', teacherName: 'Sir Usman Ghani', roomOrLab: 'Room 204' },
          { periodNumber: 8, subjectName: 'Islamiat Compulsory', subjectCode: 'ISL-907', teacherName: 'Qari Abdul Rauf', roomOrLab: 'Room 204' },
        ],
      },
      {
        dayName: 'Tuesday',
        periods: [
          { periodNumber: 1, subjectName: 'Mathematics', subjectCode: 'MTH-903', teacherName: 'Sir Salman Ali', roomOrLab: 'Room 204' },
          { periodNumber: 2, subjectName: 'Physics Practical Lab', subjectCode: 'PHY-901', teacherName: 'Sir Tariq Jamil', roomOrLab: 'Physics Lab 1' },
          { periodNumber: 3, subjectName: 'Chemistry Theory', subjectCode: 'CHM-902', teacherName: 'Madam Shamim Akhtar', roomOrLab: 'Room 204' },
          { periodNumber: 5, subjectName: 'Computer Science Lab', subjectCode: 'CS-908', teacherName: 'Sir Farrukh Shah', roomOrLab: 'IT Lab 1' },
          { periodNumber: 6, subjectName: 'Urdu Compulsory', subjectCode: 'URD-909', teacherName: 'Madam Rubina Kausar', roomOrLab: 'Room 204' },
          { periodNumber: 7, subjectName: 'English Grammar', subjectCode: 'ENG-904', teacherName: 'Madam Nadia Qureshi', roomOrLab: 'Room 204' },
          { periodNumber: 8, subjectName: 'Tarjuma-tul-Quran', subjectCode: 'TQ-910', teacherName: 'Qari Abdul Rauf', roomOrLab: 'Room 204' },
        ],
      },
      {
        dayName: 'Wednesday',
        periods: [
          { periodNumber: 1, subjectName: 'Biology', subjectCode: 'BIO-905', teacherName: 'Dr. Fauzia Yasmin', roomOrLab: 'Room 204' },
          { periodNumber: 2, subjectName: 'Mathematics', subjectCode: 'MTH-903', teacherName: 'Sir Salman Ali', roomOrLab: 'Room 204' },
          { periodNumber: 3, subjectName: 'Physics Theory', subjectCode: 'PHY-901', teacherName: 'Sir Tariq Jamil', roomOrLab: 'Room 204' },
          { periodNumber: 5, subjectName: 'Chemistry Lab', subjectCode: 'CHM-902', teacherName: 'Madam Shamim Akhtar', roomOrLab: 'Chemistry Lab A' },
          { periodNumber: 6, subjectName: 'Pakistan Studies', subjectCode: 'PKS-906', teacherName: 'Sir Usman Ghani', roomOrLab: 'Room 204' },
          { periodNumber: 7, subjectName: 'Urdu Literature', subjectCode: 'URD-909', teacherName: 'Madam Rubina Kausar', roomOrLab: 'Room 204' },
          { periodNumber: 8, subjectName: 'Physical Education / Sports', subjectCode: 'PE-911', teacherName: 'Coach Shaukat Hayat', roomOrLab: 'Main Sports Ground' },
        ],
      },
      {
        dayName: 'Thursday',
        periods: [
          { periodNumber: 1, subjectName: 'Chemistry', subjectCode: 'CHM-902', teacherName: 'Madam Shamim Akhtar', roomOrLab: 'Room 204' },
          { periodNumber: 2, subjectName: 'Physics', subjectCode: 'PHY-901', teacherName: 'Sir Tariq Jamil', roomOrLab: 'Room 204' },
          { periodNumber: 3, subjectName: 'Mathematics', subjectCode: 'MTH-903', teacherName: 'Sir Salman Ali', roomOrLab: 'Room 204' },
          { periodNumber: 5, subjectName: 'English Composition', subjectCode: 'ENG-904', teacherName: 'Madam Nadia Qureshi', roomOrLab: 'Room 204' },
          { periodNumber: 6, subjectName: 'Biology', subjectCode: 'BIO-905', teacherName: 'Dr. Fauzia Yasmin', roomOrLab: 'Room 204' },
          { periodNumber: 7, subjectName: 'Islamiat', subjectCode: 'ISL-907', teacherName: 'Qari Abdul Rauf', roomOrLab: 'Room 204' },
          { periodNumber: 8, subjectName: 'Library & Reading Period', subjectCode: 'LIB-912', teacherName: 'Librarian Altaf', roomOrLab: 'Central Library' },
        ],
      },
      {
        dayName: 'Friday',
        periods: [
          { periodNumber: 1, subjectName: 'Mathematics (Matrices)', subjectCode: 'MTH-903', teacherName: 'Sir Salman Ali', roomOrLab: 'Room 204' },
          { periodNumber: 2, subjectName: 'Physics (Vectors)', subjectCode: 'PHY-901', teacherName: 'Sir Tariq Jamil', roomOrLab: 'Room 204' },
          { periodNumber: 3, subjectName: 'Tarjuma-tul-Quran Recitation', subjectCode: 'TQ-910', teacherName: 'Qari Abdul Rauf', roomOrLab: 'Campus Mosque / Hall' },
          { periodNumber: 5, subjectName: 'Friday Congregational Prayer (Jummah)', subjectCode: 'JUM-999', teacherName: 'Qari Abdul Rauf', roomOrLab: 'Mosque Hall' },
          { periodNumber: 6, subjectName: 'Science Quiz & Olympiad Prep', subjectCode: 'OLY-900', teacherName: 'Sir Farrukh Shah', roomOrLab: 'IT Lab 1' },
        ],
      },
    ],
  },
  {
    className: 'Class 10-B (Matric)',
    section: 'B',
    roomNumber: 'Room 206 (First Floor)',
    classTeacher: 'Madam Shamim Akhtar (Chemistry Head)',
    days: [
      {
        dayName: 'Monday',
        periods: [
          { periodNumber: 1, subjectName: 'Mathematics', subjectCode: 'MTH-103', teacherName: 'Sir Salman Ali', roomOrLab: 'Room 206' },
          { periodNumber: 2, subjectName: 'Physics', subjectCode: 'PHY-101', teacherName: 'Sir Tariq Jamil', roomOrLab: 'Room 206' },
          { periodNumber: 3, subjectName: 'Chemistry', subjectCode: 'CHM-102', teacherName: 'Madam Shamim Akhtar', roomOrLab: 'Chemistry Lab B' },
          { periodNumber: 5, subjectName: 'Biology', subjectCode: 'BIO-105', teacherName: 'Dr. Fauzia Yasmin', roomOrLab: 'Room 206' },
          { periodNumber: 6, subjectName: 'English', subjectCode: 'ENG-104', teacherName: 'Madam Nadia Qureshi', roomOrLab: 'Room 206' },
          { periodNumber: 7, subjectName: 'Urdu', subjectCode: 'URD-109', teacherName: 'Madam Rubina Kausar', roomOrLab: 'Room 206' },
          { periodNumber: 8, subjectName: 'Pak Studies', subjectCode: 'PKS-106', teacherName: 'Sir Usman Ghani', roomOrLab: 'Room 206' },
        ],
      },
    ],
  },
];

export const INITIAL_TEACHER_SUBSTITUTIONS: TeacherDailySubstitution[] = [
  {
    id: 'SUB-2024-001',
    date: '2024-10-21 (Today)',
    absentTeacherName: 'Sir Tariq Jamil',
    absentTeacherSubject: 'Physics Lead',
    leaveReason: 'Casual Leave',
    affectedPeriods: [
      {
        periodNumber: 1,
        className: 'Class 9-A',
        subject: 'Physics (Mechanics)',
        assignedSubstituteTeacher: 'Sir Naveed Anwar (Physics Co-Faculty)',
        substituteSubjectSpecialty: 'Physics / Electronics',
        substituteStatus: 'Confirmed via SMS',
        notificationSent: true,
      },
      {
        periodNumber: 2,
        className: 'Class 10-B',
        subject: 'Physics (Electromagnetism)',
        assignedSubstituteTeacher: 'Sir Farrukh Shah',
        substituteSubjectSpecialty: 'Applied Sciences',
        substituteStatus: 'Confirmed via SMS',
        notificationSent: true,
      },
      {
        periodNumber: 7,
        className: 'Class 8-Green',
        subject: 'General Science',
        assignedSubstituteTeacher: 'Madam Shamim Akhtar',
        substituteSubjectSpecialty: 'Chemistry & Science',
        substituteStatus: 'Auto-Assigned',
        notificationSent: true,
      },
    ],
  },
  {
    id: 'SUB-2024-002',
    date: '2024-10-21 (Today)',
    absentTeacherName: 'Madam Nadia Qureshi',
    absentTeacherSubject: 'English Language',
    leaveReason: 'Medical Leave',
    affectedPeriods: [
      {
        periodNumber: 5,
        className: 'Class 9-A',
        subject: 'English Literature',
        assignedSubstituteTeacher: 'Madam Huma Tariq (English Dept)',
        substituteSubjectSpecialty: 'English & Creative Writing',
        substituteStatus: 'Confirmed via SMS',
        notificationSent: true,
      },
    ],
  },
];

export const INITIAL_BELL_SCHEDULES: BellScheduleConfiguration[] = [
  {
    id: 'SCH-001',
    scheduleName: 'Standard Regular Schedule',
    assemblyTime: '07:45 AM - 08:00 AM',
    totalPeriods: 8,
    periodDurationMinutes: 45,
    recessDurationMinutes: 30,
    dismissalTime: '01:45 PM',
    isActive: true,
    zeroPeriodEnabled: true,
    zeroPeriodDetails: '07:30 AM - 08:00 AM (Remedial & Olympiad Training)',
  },
  {
    id: 'SCH-002',
    scheduleName: 'Winter Revised Timing (Smog Compliant)',
    assemblyTime: '08:30 AM - 08:45 AM (Indoor Assembly)',
    totalPeriods: 7,
    periodDurationMinutes: 40,
    recessDurationMinutes: 25,
    dismissalTime: '01:30 PM',
    isActive: false,
    zeroPeriodEnabled: false,
    zeroPeriodDetails: 'Suspended during winter smog advisory',
  },
  {
    id: 'SCH-003',
    scheduleName: 'Friday Early Dismissal & Jummah',
    assemblyTime: '07:45 AM - 08:00 AM',
    totalPeriods: 5,
    periodDurationMinutes: 40,
    recessDurationMinutes: 20,
    dismissalTime: '12:30 PM (Post-Jummah Congregational Prayer)',
    isActive: false,
    zeroPeriodEnabled: true,
    zeroPeriodDetails: '07:30 AM - 08:00 AM (Quran Hifz Circle)',
  },
  {
    id: 'SCH-004',
    scheduleName: 'Ramadan Shortened Schedule',
    assemblyTime: '08:00 AM (Brief Dua in Classrooms)',
    totalPeriods: 6,
    periodDurationMinutes: 35,
    recessDurationMinutes: 15,
    dismissalTime: '12:00 PM Sharp',
    isActive: false,
    zeroPeriodEnabled: false,
  },
];

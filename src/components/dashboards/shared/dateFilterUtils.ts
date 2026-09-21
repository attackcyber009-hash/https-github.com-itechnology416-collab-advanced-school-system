import { DatePreset } from './DashboardHeader';

export function isDateWithinPreset(
  itemDateStr?: string,
  preset: DatePreset = 'This Academic Year',
  customStart?: string,
  customEnd?: string
): boolean {
  if (!itemDateStr) return true;

  const itemDate = new Date(itemDateStr);
  if (isNaN(itemDate.getTime())) return true;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  switch (preset) {
    case 'Today':
      return itemDate >= todayStart && itemDate <= todayEnd;

    case 'Yesterday': {
      const yestStart = new Date(todayStart);
      yestStart.setDate(yestStart.getDate() - 1);
      const yestEnd = new Date(todayEnd);
      yestEnd.setDate(yestEnd.getDate() - 1);
      return itemDate >= yestStart && itemDate <= yestEnd;
    }

    case 'This Week': {
      const day = todayStart.getDay(); // 0 is Sunday
      const diff = todayStart.getDate() - day + (day === 0 ? -6 : 1); // Monday
      const monday = new Date(todayStart.setDate(diff));
      return itemDate >= monday && itemDate <= todayEnd;
    }

    case 'This Month': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return itemDate >= monthStart && itemDate <= todayEnd;
    }

    case 'Last Month': {
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      return itemDate >= lastMonthStart && itemDate <= lastMonthEnd;
    }

    case 'This Term': {
      // 3-4 months term window
      const currentMonth = now.getMonth();
      const termStartMonth = Math.floor(currentMonth / 4) * 4;
      const termStart = new Date(now.getFullYear(), termStartMonth, 1);
      return itemDate >= termStart;
    }

    case 'This Academic Year': {
      // Academic year starts July/August
      const year = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
      const academicYearStart = new Date(year, 6, 1); // July 1st
      return itemDate >= academicYearStart;
    }

    case 'Custom Range': {
      if (customStart && itemDate < new Date(customStart)) return false;
      if (customEnd && itemDate > new Date(`${customEnd}T23:59:59`)) return false;
      return true;
    }

    default:
      return true;
  }
}

import dayjs, { Dayjs } from "dayjs";

type ViewDates = {
  isCurrentMonth: boolean;
  isToday: boolean;
  date: Dayjs;
};

export const generateCalendar = (
  month: number = dayjs().month(),
  year: number = dayjs().year()
): ViewDates[] => {
  const startOfMonth: Dayjs = dayjs().year(year).month(month).startOf("month");
  const endOfMonth: Dayjs = dayjs().year(year).month(month).endOf("month");

  const viewDates: ViewDates[] = [];

  // previous month
  for (let i = 0; i < startOfMonth.day(); i++) {
    viewDates.push({
      isCurrentMonth: false,
      isToday:
        startOfMonth.day(i).toDate().toDateString() ===
        dayjs().toDate().toDateString(),
      date: startOfMonth.day(i),
    });
  }

  // current month
  for (let i = startOfMonth.date(); i <= endOfMonth.date(); i++) {
    viewDates.push({
      isCurrentMonth: true,
      isToday:
        startOfMonth.date(i).toDate().toDateString() ===
        dayjs().toDate().toDateString(),
      date: startOfMonth.date(i),
    });
  }

  // next month
  const remainingGrids: number = 42 - viewDates.length;

  for (
    let i = endOfMonth.date() + 1;
    i <= endOfMonth.date() + remainingGrids;
    i++
  ) {
    viewDates.push({
      isCurrentMonth: false,
      isToday:
        endOfMonth.date(i).toDate().toDateString() ===
        dayjs().toDate().toDateString(),
      date: endOfMonth.date(i),
    });
  }

  return viewDates;
};

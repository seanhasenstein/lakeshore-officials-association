import { format, getDay, getDaysInMonth, subDays, subMonths } from 'date-fns';
import { CalendarCollection } from '../interfaces';
import { formatToTwoDigits } from './misc';

export type CurrentMonthDays = {
  date: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  [key: string]: any;
};

function createDaysForCurrentMonth(
  year: number,
  month: number
): CurrentMonthDays[] {
  const daysInMonth = getDaysInMonth(new Date(`${month}-01-${year}`));
  return [...Array(daysInMonth)].map((_, index) => {
    const dayOfMonth: number = index + 1;
    const m = formatToTwoDigits(month);
    const d = formatToTwoDigits(dayOfMonth);
    const date = new Date(`${year}-${m}-${d}T00:00:00`);

    return {
      date: format(date, 'MM-dd-yyyy'),
      dayOfMonth,
      isCurrentMonth: true,
    };
  });
}

function createDaysForPreviousMonth(
  year: number,
  month: number,
  currentMonthDays: CurrentMonthDays[]
): CurrentMonthDays[] {
  const firstDayOfTheMonthWeekday = getDay(
    new Date(`${currentMonthDays[0].date}`)
  );
  const prevMonth = subMonths(new Date(`${month}-01-${year}`), 1);
  const visibleNumberOfDaysFromPrevMonth = firstDayOfTheMonthWeekday;
  const prevMonthLastMondayOfMonth = subDays(
    new Date(`${currentMonthDays[0].date}`),
    visibleNumberOfDaysFromPrevMonth
  ).getDate();

  return [...Array(visibleNumberOfDaysFromPrevMonth)].map((_, index) => {
    return {
      date: format(
        new Date(
          `${prevMonth.getFullYear()}-${formatToTwoDigits(
            prevMonth.getMonth() + 1
          )}-${formatToTwoDigits(prevMonthLastMondayOfMonth + index)}T00:00:00`
        ),
        'MM-dd-yyyy'
      ),
      dayOfMonth: prevMonthLastMondayOfMonth + index,
      isCurrentMonth: false,
    };
  });
}

function createDaysForNextMonth(
  year: number,
  month: number,
  totalPrevAndCurrentDays: number
): CurrentMonthDays[] {
  const visibleNumberOfDaysFromNextMonth = 42 - totalPrevAndCurrentDays;

  return [...Array(visibleNumberOfDaysFromNextMonth)].map((_, index) => {
    return {
      date: format(
        new Date(
          `${
            Number(month) === 12 ? Number(year) + 1 : Number(year)
          }-${formatToTwoDigits(
            Number(month) === 12 ? 1 : Number(month) + 1
          )}-${formatToTwoDigits(index + 1)}T00:00:00`
        ),
        'MM-dd-yyyy'
      ),
      dayOfMonth: index + 1,
      isCurrentMonth: false,
    };
  });
}

export function getMonthCalendarData(date: Date) {
  const initialYear = date.getFullYear();
  const initialMonth = date.getMonth() + 1;
  const currentMonthDays = createDaysForCurrentMonth(initialYear, initialMonth);
  const previousMonthDays = createDaysForPreviousMonth(
    initialYear,
    initialMonth,
    currentMonthDays
  );
  const nextMonthDays = createDaysForNextMonth(
    initialYear,
    initialMonth,
    previousMonthDays.length + currentMonthDays.length
  );

  return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
}

export function getUpdatedCalendarYear(
  data: CalendarCollection,
  year: string,
  month: string,
  day: string,
  userId: string
) {
  let update;

  if (
    data.calendar[year] &&
    data.calendar[year][month] &&
    data.calendar[year][month][day]
  ) {
    update = {
      ...data.calendar,
      [year]: {
        ...data.calendar[year],
        [month]: {
          ...data.calendar[year][month],
          [day]: [...data.calendar[year][month][day], userId],
        },
      },
    };
  } else if (data.calendar[year] && data.calendar[year][month]) {
    update = {
      ...data.calendar,
      [year]: {
        ...data.calendar[year],
        [month]: { ...data.calendar[year][month], [day]: [userId] },
      },
    };
  } else if (data.calendar[year]) {
    update = {
      ...data.calendar,
      [year]: { ...data.calendar[year], [month]: { [day]: [userId] } },
    };
  } else {
    update = { ...data.calendar, [year]: { [month]: { [day]: [userId] } } };
  }

  return update;
}

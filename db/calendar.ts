import { Db, ObjectId } from 'mongodb';
import { Calendar } from '../interfaces';

// TODO move to util file?
function getUpdatedCalendarYear(
  data: Calendar,
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

export async function getCalendarData(db: Db) {
  const result = await db
    .collection('calendar')
    .findOne<Calendar>({ _id: new ObjectId('62e1f20d9bb0a90c47736dc6') });
  return result;
}

export async function updateCalendarDay(
  db: Db,
  userId: string,
  dateString: string,
  status: 'available' | 'unavailable'
) {
  const data = await getCalendarData(db);
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString();
  const day = date.getDate().toString();

  if (!data) {
    throw new Error('Failed to find the calendar data');
  }

  if (status === 'available') {
    // add userId to the day array
    const update = getUpdatedCalendarYear(data, year, month, day, userId);
    const result = await db
      .collection('calendar')
      .findOneAndUpdate(
        { _id: new ObjectId('62e1f20d9bb0a90c47736dc6') },
        { $set: { calendar: update } },
        { upsert: true, returnDocument: 'after' }
      );

    return result.value;
  }

  if (status === 'unavailable') {
    // remove userId from the day array
    const updatedDayArray = data.calendar[year][month][day].filter(
      id => id !== userId
    );
    const update = {
      ...data.calendar,
      [year]: {
        ...data.calendar[year],
        [month]: { ...data.calendar[year][month], [day]: updatedDayArray },
      },
    };

    const result = await db
      .collection('calendar')
      .findOneAndUpdate(
        { _id: new ObjectId('62e1f20d9bb0a90c47736dc6') },
        { $set: { calendar: update } },
        { returnDocument: 'after' }
      );

    return result.value;
  }
}

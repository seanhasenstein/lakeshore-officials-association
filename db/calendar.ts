import { Db, ObjectId } from 'mongodb';
import { CalendarCollection } from '../interfaces';
import { getUpdatedCalendarYear } from '../utils/calendar';

export async function getAllCalendarData(db: Db) {
  const result = await db.collection('calendar').findOne<CalendarCollection>({
    _id: new ObjectId('62e1f20d9bb0a90c47736dc6'),
  });
  return result;
}

export async function getYearCalendarData(db: Db, year: string) {
  const result = await db
    .collection('calendar')
    .aggregate([
      { $match: { _id: new ObjectId('62e1f20d9bb0a90c47736dc6') } },
      {
        $project: {
          [`calendar.${Number(year) - 1}`]: 1,
          [`calendar.${year}`]: 1,
          [`calendar.${Number(year) + 1}`]: 1,
        },
      },
    ])
    .toArray();
  return result[0].calendar;
}

export async function updateCalendarDay(
  db: Db,
  userId: string,
  dateString: string,
  status: 'available' | 'unavailable'
) {
  const data = await getAllCalendarData(db);
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

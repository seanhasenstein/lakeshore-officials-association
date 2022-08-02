import { Sport, User } from '../interfaces';
import { formatToTitleCase } from './misc';

export async function fetchUserById(_id: string | undefined | null) {
  if (!_id) return;
  const response = await fetch(`/api/get-user?_id=${_id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch the user');
  }

  const data: User = await response.json();
  return data;
}

export async function fetchUserByEmail(email: string | undefined | null) {
  if (!email) return;
  const response = await fetch(`/api/get-user?email=${email}`);

  if (!response.ok) {
    throw new Error('Failed to fetch the user');
  }

  const data: User = await response.json();
  return data;
}

export async function fetchUsersBySport(sport: Sport | undefined) {
  if (!sport) return;
  const response = await fetch(
    `/api/get-users-by-sport?sport=${formatToTitleCase(sport)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch users for ${sport}`);
  }

  const data: User[] = await response.json();
  return data;
}

export async function fetchCalendarData(selectedDate: string) {
  const response = await fetch(
    `/api/get-calendar-data?year=${new Date(selectedDate).getFullYear()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch the calendar data');
  }

  const data = await response.json();
  return data;
}

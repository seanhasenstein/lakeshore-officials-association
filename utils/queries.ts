import { Sport, User } from '../interfaces';
import { formatToTitleCase } from './misc';

export async function getUsersBySport(sport: Sport | undefined) {
  if (!sport) return;
  const res = await fetch(
    `/api/get-users-by-sport?sport=${formatToTitleCase(sport)}`
  );
  const data: User[] = await res.json();
  return data;
}

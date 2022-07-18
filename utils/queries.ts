import { Sport, User } from '../interfaces';
import { formatToTitleCase } from './misc';

export async function fetchUser(_id: string | undefined) {
  if (!_id) return;
  const res = await fetch(`/api/get-user?_id=${_id}`);
  const data: User = await res.json();
  return data;
}

export async function fetchUsersBySport(sport: Sport | undefined) {
  if (!sport) return;
  const res = await fetch(
    `/api/get-users-by-sport?sport=${formatToTitleCase(sport)}`
  );
  const data: User[] = await res.json();
  return data;
}

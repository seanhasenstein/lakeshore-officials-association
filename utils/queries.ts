import { Sport, User } from '../interfaces';
import { formatToTitleCase } from './misc';

export async function fetchUser(email: string | undefined | null) {
  if (!email) return;
  const res = await fetch(`/api/get-user?email=${email}`);
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

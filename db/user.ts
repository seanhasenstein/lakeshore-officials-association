import { Db, ObjectId } from 'mongodb';
import { Sport, User } from '../interfaces';

export async function getUser(db: Db, _id: string) {
  const result = await db
    .collection('users')
    .aggregate<User>([
      { $match: { _id: new ObjectId(_id) } },
      { $set: { _id: { $toString: '$_id' } } },
    ])
    .toArray();
  return result[0];
}

export async function getUsers(db: Db) {
  const result = await db
    .collection('users')
    .aggregate<User>([{ $match: {} }, { $set: { _id: { $toString: '$_id' } } }])
    .toArray();
  return result;
}

interface SportsAccumulator {
  Baseball: User[];
  Basketball: User[];
  Football: User[];
  Softball: User[];
  Volleyball: User[];
}

export async function getAllUsersSeparatedBySport(db: Db) {
  const allUsers = await getUsers(db);
  const usersBySport = allUsers.reduce(
    (accumulator: SportsAccumulator, currentUser) => {
      currentUser.sports.forEach(sport => {
        accumulator[sport.name] = [...accumulator[sport.name], currentUser];
      });
      return accumulator;
    },
    { Baseball: [], Basketball: [], Football: [], Softball: [], Volleyball: [] }
  );
  return usersBySport;
}

export async function getUsersForSingleSport(db: Db, sport: Sport) {
  const result = await db
    .collection('users')
    .aggregate<User>([
      { $match: { 'sports.name': sport } },
      { $set: { _id: { $toString: '$_id' } } },
    ])
    .toArray();
  return result;
}

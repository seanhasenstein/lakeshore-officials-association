import { Db, ObjectId } from 'mongodb';
import { ProfileFormValues, Sport, User, UsersBySports } from '../interfaces';

export async function getUserById(db: Db, _id: string) {
  const result = await db
    .collection('users')
    .aggregate<User>([
      { $match: { _id: new ObjectId(_id) } },
      { $set: { _id: { $toString: '$_id' } } },
    ])
    .toArray();
  return result[0];
}

export async function getUserByEmail(db: Db, email: string) {
  const result = await db
    .collection('users')
    .aggregate<User>([
      { $match: { email } },
      { $set: { _id: { $toString: '$_id' } } },
    ])
    .toArray();
  return result[0];
}

export async function getUsers(db: Db) {
  const result = await db
    .collection('users')
    .aggregate<User>([
      { $match: {} },
      { $sort: { lastName: 1, firstName: 1 } },
      { $set: { _id: { $toString: '$_id' } } },
    ])
    .toArray();
  return result;
}

export async function getUsersBySports(db: Db) {
  const allUsers = await getUsers(db);
  const usersBySport = allUsers.reduce(
    (accumulator: UsersBySports, currentUser) => {
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
      { $sort: { lastName: 1, firstName: 1 } },
      { $set: { _id: { $toString: '$_id' } } },
    ])
    .toArray();
  return result;
}

export async function createUser(db: Db, newUser: ProfileFormValues) {
  const result = await db
    .collection<ProfileFormValues>('users')
    .insertOne(newUser);
  const user = await getUserById(db, result.insertedId.toString());
  return user;
}

export async function updateUser(
  db: Db,
  _id: string,
  formValues: ProfileFormValues
) {
  const result = await db.collection('users').findOneAndUpdate(
    { _id: new ObjectId(_id) },
    { $set: formValues },
    {
      returnDocument: 'after',
    }
  );
  return result.value;
}

export async function deleteUser(db: Db, _id: string) {
  const result = await db
    .collection('users')
    .findOneAndDelete({ _id: new ObjectId(_id) });
  return result.ok;
}

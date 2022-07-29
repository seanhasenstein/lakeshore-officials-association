import { mongoClientPromise } from './connect';
import * as user from './user';
import * as calendar from './calendar';

async function connectToDb() {
  const client = await mongoClientPromise;
  return client.db();
}

export { connectToDb, user, calendar };

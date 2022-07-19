import { mongoClientPromise } from './connect';
import * as user from './user';

async function connectToDb() {
  const client = await mongoClientPromise;
  return client.db();
}

export { connectToDb, user };

import { mongoClientPromise } from "./connect";

async function connectToDb() {
  const client = await mongoClientPromise;
  return client.db();
}

export { connectToDb };

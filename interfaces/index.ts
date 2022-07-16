import { Db, MongoClient } from 'mongodb';
import { NextApiRequest } from 'next';

export type Sport =
  | 'Baseball'
  | 'Basketball'
  | 'Football'
  | 'Softball'
  | 'Volleyball';

export type Level = 'MS' | 'L5' | 'L4' | 'L3' | 'L2' | 'L1';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  city: string;
  homePhone: string;
  cellPhone: string;
  workPhone: {
    number: string;
    extension: string;
  };
  email: string;
  sports: {
    name: Sport;
    level: Level;
  }[];
}

export interface Request extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
}

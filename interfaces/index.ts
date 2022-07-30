import { Db, MongoClient } from 'mongodb';
import { NextApiRequest } from 'next';

export type Sport =
  | 'Baseball'
  | 'Basketball'
  | 'Football'
  | 'Softball'
  | 'Volleyball';

export type Level =
  | 'MS'
  | 'L5'
  | 'L4'
  | 'L3'
  | 'L2'
  | 'L1'
  | 'L0'
  | 'NAO'
  | 'default';

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
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersBySports {
  Baseball: User[];
  Basketball: User[];
  Football: User[];
  Softball: User[];
  Volleyball: User[];
}

export type ProfileFormValues = Omit<User, '_id'>;

export type CalendarMonth = {
  [date: string]: string[];
};

export type CalendarYear = {
  [month: string]: CalendarMonth;
};

export type Calendar = {
  [year: string]: CalendarYear;
};

export interface CalendarCollection {
  _id: string;
  calendar: Calendar;
}

export interface Request extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
}

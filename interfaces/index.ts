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

export type FilterLevels = { name: string; checked: boolean }[];

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    street2: string;
    city: string;
    state: string;
    zipcode: string;
  };
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

export type BulkEmailGroup = 'All' | Sport;

export interface SendEmailFormValues {
  user: {
    email: string | undefined;
  };
  group: BulkEmailGroup | '';
  subject: string;
  body: string;
}

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

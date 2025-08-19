import fs from 'fs';
import { Event, Order, Ticket, User } from './types';

type DB = {
  users: User[];
  events: Event[];
  tickets: Ticket[];
  orders: Order[];
};

// Read from db.json
export const getData = (dbPath: string): DB => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

// Write to db.json
export const writeDB = (data: DB, dbPath: string) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};

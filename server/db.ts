import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";

const sqlitePath = process.env.SQLITE_PATH || './local.db';
const sqlite = new Database(sqlitePath);
export const db = drizzle(sqlite, { schema });

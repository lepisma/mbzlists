import Database from 'better-sqlite3';
import path from 'node:path';
import { building } from '$app/environment';

let db;

if (!building) {
  let dbPath: string;
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    if (!process.env.DATA_DIR) {
      console.error('DATA_DIR not set');
      process.exit(1);
    }

    dbPath = path.join(process.env.DATA_DIR, 'lists.db');
  } else {
    dbPath = 'lists.db';
  }

  db = new Database(dbPath);

  db.exec(`
  CREATE TABLE IF NOT EXISTS lists (
    id TEXT PRIMARY KEY,
    edit_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_on TEXT NOT NULL,
    last_modified_on TEXT NOT NULL,
    description TEXT,
    cover_art BLOB,
    is_public BOOLEAN DEFAULT FALSE,
    items TEXT DEFAULT '[]'
  )`);
}

export default db;

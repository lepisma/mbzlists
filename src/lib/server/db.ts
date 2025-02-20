import Database from 'better-sqlite3';
const db = new Database('lists.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS lists (
    id TEXT PRIMARY KEY,
    edit_id TEXT,
    name TEXT,
    items TEXT DEFAULT '[]'
)`);

export default db;

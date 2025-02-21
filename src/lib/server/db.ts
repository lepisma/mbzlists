import Database from 'better-sqlite3';
const db = new Database('lists.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS lists (
    id TEXT PRIMARY KEY,
    edit_id TEXT,
    name TEXT,
    created_on TEXT,
    last_modified_on TEXT,
    items TEXT DEFAULT '[]'
)`);

export default db;

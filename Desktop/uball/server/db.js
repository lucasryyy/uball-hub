import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'transfers.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transfers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player TEXT,
      age INTEGER,
      nationality TEXT,
      position TEXT,
      fromClub TEXT,
      toClub TEXT,
      fee TEXT,
      transferType TEXT,
      playerImg TEXT,
      date TEXT,
      UNIQUE(player, fromClub, toClub, fee, transferType)
    )
  `);
});

export default db;
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'football.db');
const db = new sqlite3.Database(dbPath);

// Enable verbose mode to get more detailed error information
sqlite3.verbose();

// Set up global error handler for database
db.on('error', (err) => {
  console.error('SQLite Database Error:', err);
});

// Force SQLite to be more strict about data types
db.run('PRAGMA foreign_keys = ON');
db.run('PRAGMA strict = ON');

db.serialize(() => {
  // Transfers table
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
  `, function(err) {
    if (err) console.error('Error creating transfers table:', err);
  });

  // Live scores table
  db.run(`
    CREATE TABLE IF NOT EXISTS livescores (
      id INTEGER PRIMARY KEY,
      homeTeam TEXT,
      awayTeam TEXT,
      homeScore INTEGER,
      awayScore INTEGER,
      homeLogo TEXT,
      awayLogo TEXT,
      status TEXT,
      competition TEXT,
      matchTime TEXT,
      date TEXT
    )
  `, function(err) {
    if (err) console.error('Error creating livescores table:', err);
  });

  // League tables
  db.run(`
    CREATE TABLE IF NOT EXISTS league_tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      position INTEGER,
      teamName TEXT,
      teamLogo TEXT,
      played INTEGER,
      wins INTEGER,
      draws INTEGER,
      losses INTEGER,
      goalsFor INTEGER,
      goalsAgainst INTEGER,
      goalDiff INTEGER,
      points INTEGER,
      form TEXT,
      leagueId TEXT,
      date TEXT,
      UNIQUE(teamName, leagueId)
    )
  `, function(err) {
    if (err) console.error('Error creating league_tables table:', err);
  });

  // Fixtures table
  db.run(`
    CREATE TABLE IF NOT EXISTS fixtures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      homeTeam TEXT,
      awayTeam TEXT,
      homeLogo TEXT,
      awayLogo TEXT,
      date TEXT,
      time TEXT,
      competition TEXT,
      leagueId TEXT,
      venue TEXT,
      createdAt TEXT
    )
  `, function(err) {
    if (err) console.error('Error creating fixtures table:', err);
  });

  // Match events table (for detailed match info)
  db.run(`
    CREATE TABLE IF NOT EXISTS match_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      matchId INTEGER,
      minute INTEGER,
      eventType TEXT,
      player TEXT,
      team TEXT,
      details TEXT,
      createdAt TEXT
    )
  `, function(err) {
    if (err) console.error('Error creating match_events table:', err);
  });

  // Teams table
  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT,
      logo TEXT,
      stadium TEXT,
      capacity INTEGER,
      manager TEXT,
      founded INTEGER,
      leagueId TEXT,
      date TEXT
    )
  `, function(err) {
    if (err) console.error('Error creating teams table:', err);
  });

  // Team players table
  db.run(`
    CREATE TABLE IF NOT EXISTS team_players (
      id TEXT PRIMARY KEY,
      teamId TEXT,
      name TEXT,
      number INTEGER,
      position TEXT,
      age INTEGER,
      nationality TEXT,
      photo TEXT,
      marketValue TEXT,
      appearances INTEGER,
      goals INTEGER,
      assists INTEGER,
      yellowCards INTEGER,
      redCards INTEGER,
      FOREIGN KEY (teamId) REFERENCES teams(id)
    )
  `, function(err) {
    if (err) console.error('Error creating team_players table:', err);
  });

  // Team fixtures table
  db.run(`
    CREATE TABLE IF NOT EXISTS team_fixtures (
      id TEXT PRIMARY KEY,
      teamId TEXT,
      date TEXT,
      time TEXT,
      homeTeam TEXT,
      awayTeam TEXT,
      competition TEXT,
      venue TEXT,
      isHome INTEGER,
      FOREIGN KEY (teamId) REFERENCES teams(id)
    )
  `, function(err) {
    if (err) console.error('Error creating team_fixtures table:', err);
  });

  // Team stats table
  db.run(`
    CREATE TABLE IF NOT EXISTS team_stats (
      teamId TEXT PRIMARY KEY,
      goalsScored INTEGER,
      goalsConceded INTEGER,
      cleanSheets INTEGER,
      wins INTEGER,
      draws INTEGER,
      losses INTEGER,
      possession INTEGER,
      passAccuracy INTEGER,
      shotsPerGame REAL,
      tacklesPerGame REAL,
      yellowCards INTEGER,
      redCards INTEGER,
      FOREIGN KEY (teamId) REFERENCES teams(id)
    )
  `, function(err) {
    if (err) console.error('Error creating team_stats table:', err);
  });
});

export default db;
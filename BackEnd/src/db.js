const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Updated path: data/race-timer.db (relative to BackEnd/src)
const dbPath = path.join(__dirname, '..', 'data', 'race-timer.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Ensure laps table exists
db.run(`
  CREATE TABLE IF NOT EXISTS laps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id TEXT NOT NULL,
    time TEXT NOT NULL
  )
`, (err) => {
  if (err) {
    console.error('Failed to create laps table:', err.message);
  } else {
    console.log('Verified laps table exists.');
  }
});

module.exports = db;

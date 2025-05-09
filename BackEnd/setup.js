// setup.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'database.sqlite');

// 1. Ensure /data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 2. Delete old database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('⚠️ Old database deleted');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to open DB:', err.message);
    process.exit(1);
  }
});

// 3. Create table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS laps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL,
      time TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating table:', err.message);
      process.exit(1);
    } else {
      console.log('✅ Database and table created successfully.');
    }
  });
});

db.close();

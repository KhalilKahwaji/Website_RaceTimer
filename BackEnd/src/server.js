// src/server.js
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 8080;

//  Serve the frontend from /FrontEnd
app.use(express.static(path.join(__dirname, '..', '..', 'FrontEnd')));

// Optional: also serve from /public if needed (you can remove if unused)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.json());

//  POST /api/lap — store a single lap
app.post('/api/lap', (req, res) => {
  const { time } = req.body;
  if (!time) return res.status(400).send('Missing lap time');
  
  db.run(`INSERT INTO laps (time) VALUES (?)`, [time], function (err) {
    if (err) return res.status(500).send(err.message);
    res.status(201).json({ id: this.lastID });
  });
});

//  POST /api/lap/bulk — store multiple laps
app.post('/api/lap/bulk', (req, res) => {
  const { laps, event_id } = req.body;

  if (!event_id || typeof event_id !== 'string') {
    return res.status(400).send("Missing or invalid event_id.");
  }

  if (!Array.isArray(laps) || laps.length === 0) {
    return res.status(400).send("Invalid lap data.");
  }

  const stmt = db.prepare("INSERT INTO laps (event_id, time) VALUES (?, ?)");

  db.serialize(() => {
    laps.forEach(time => {
      stmt.run(event_id, time);
    });
    stmt.finalize();
    res.status(201).json({ message: "Laps saved." });
  });
});


app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

app.get('/api/lap', (req, res) => {
    db.all(`SELECT * FROM laps ORDER BY id ASC`, [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// GET /api/lap/:event_id — get slaps by event ID
app.get('/api/lap/:event_id', (req, res) => {
  const eventId = req.params.event_id;

  db.all(`SELECT * FROM laps WHERE event_id = ? ORDER BY id ASC`, [eventId], (err, rows) => {
    if (err) {
      console.error(" DB error:", err.message);
      return res.status(500).send(err.message);
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: `No laps found for event ID: ${eventId}` });
    }

    res.json(rows);
  });
});

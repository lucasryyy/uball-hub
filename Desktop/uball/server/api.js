import express from "express";
import cors from "cors";
import { scrapeAndStoreTransfers } from "./transfermarktScraper.js";
import db from './db.js';
const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/transfers', (req, res) => {
  db.all('SELECT * FROM transfers ORDER BY date DESC LIMIT 25', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

setInterval(() => {
  scrapeAndStoreTransfers();
}, 60 * 1000);

app.listen(PORT, () => {
  console.log(`✅ Transfer API running on http://localhost:${PORT}`);
});
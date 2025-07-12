import express from "express";
import cors from "cors";
import { scrapeAndStoreTransfers } from "./transfermarktScraper.js";
import {
  scrapePremierLeague,
  scrapeLaLiga,
  scrapeBundesliga,
  scrapeSerieA,
  scrapeLigue1,
} from "./scrapers/index.js";
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

app.get('/api/league/:id', async (req, res) => {
  try {
    let data;
    switch (req.params.id) {
      case 'premier-league':
        data = await scrapePremierLeague();
        break;
      case 'la-liga':
        data = await scrapeLaLiga();
        break;
      case 'bundesliga':
        data = await scrapeBundesliga();
        break;
      case 'serie-a':
        data = await scrapeSerieA();
        break;
      case 'ligue-1':
        data = await scrapeLigue1();
        break;
      default:
        return res.status(404).json({ error: 'League not found' });
    }
    res.json(data);
  } catch (err) {
    console.error('Failed to scrape league:', err);
    res.status(500).json({ error: 'Scrape failed' });
  }
});

setInterval(() => {
  scrapeAndStoreTransfers();
}, 60 * 1000);

app.listen(PORT, () => {
  console.log(`✅ Transfer API running on http://localhost:${PORT}`);
});
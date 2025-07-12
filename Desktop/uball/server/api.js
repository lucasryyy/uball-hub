import express from "express";
import cors from "cors";
import { scrapeAndStoreTransfers } from "./transfermarktScraper.js";
import { scrapeAndStoreLeagues } from "./leagueScraper.js";
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

app.get('/api/league/:id', (req, res) => {
  const leagueId = req.params.id;
  
  // Get all teams for the league, let the client handle any deduplication
  db.all(
    `SELECT * FROM league_tables 
     WHERE leagueId = ? 
     ORDER BY position ASC`,
    [leagueId],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'League not found or no data available' });
      }
      
      // Since we have UNIQUE constraint on (teamName, leagueId), we should only have one row per team
      // Sort by position to ensure correct order
      const sortedRows = rows.sort((a, b) => a.position - b.position);
      
      res.json(sortedRows);
    }
  );
});

// Get all leagues
app.get('/api/leagues', (req, res) => {
  db.all(
    'SELECT * FROM league_tables ORDER BY leagueId, position ASC',
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Group by league
      const leagues = {};
      rows.forEach(row => {
        if (!leagues[row.leagueId]) {
          leagues[row.leagueId] = [];
        }
        leagues[row.leagueId].push(row);
      });
      
      res.json(leagues);
    }
  );
});

// Set up periodic scraping
setInterval(() => {
  scrapeAndStoreTransfers();
}, 60 * 1000); // Every minute

// Update league data every 30 minutes
setInterval(() => {
  console.log('🔄 Updating league data...');
  scrapeAndStoreLeagues();
}, 30 * 60 * 1000); // Every 30 minutes

app.listen(PORT, () => {
  console.log(`✅ Football API Server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   - GET /api/transfers - Get latest transfers`);
  console.log(`   - GET /api/leagues - Get all league tables`);
  console.log(`   - GET /api/league/:id - Get specific league table`);
});

// Initial data load after server starts
setTimeout(() => {
  console.log('🚀 Loading initial data...');
  scrapeAndStoreLeagues().then(() => {
    console.log('✅ Initial league data loaded');
  }).catch(err => {
    console.error('❌ Failed to load initial league data:', err);
  });
}, 2000); // Wait 2 seconds for server to be ready
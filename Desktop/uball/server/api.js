// Add this to your api.js file

// Team detail endpoint
app.get('/api/team/:teamId', async (req, res) => {
  const { teamId } = req.params;
  const { league: leagueId } = req.query;
  
  try {
    // Get team info from league_tables
    const teamInfo = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM league_tables 
         WHERE LOWER(REPLACE(teamName, ' ', '-')) = ? AND leagueId = ?
         ORDER BY date DESC LIMIT 1`,
        [teamId, leagueId || 'premier-league'],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!teamInfo) {
      // Try to find team without league filter
      const anyTeam = await new Promise((resolve, reject) => {
        db.get(
          `SELECT * FROM league_tables 
           WHERE LOWER(REPLACE(teamName, ' ', '-')) = ?
           ORDER BY date DESC LIMIT 1`,
          [teamId],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (!anyTeam) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      teamInfo = anyTeam;
    }

    // Get team details from teams table if exists
    const teamDetails = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM teams WHERE id = ?`,
        [teamId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // Get squad
    const squad = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM team_players 
         WHERE teamId = ?
         ORDER BY number ASC`,
        [teamId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });

    // Get fixtures
    const fixtures = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM team_fixtures 
         WHERE teamId = ?
         ORDER BY date ASC, time ASC`,
        [teamId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });

    // Get stats
    const stats = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM team_stats WHERE teamId = ?`,
        [teamId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // Build response
    const response = {
      team: {
        id: teamId,
        name: teamInfo.teamName,
        logo: teamInfo.teamLogo,
        stadium: teamDetails?.stadium || `${teamInfo.teamName} Stadium`,
        capacity: teamDetails?.capacity || 40000,
        manager: teamDetails?.manager || 'Manager Name',
        founded: teamDetails?.founded || 1900,
        league: getLeagueName(teamInfo.leagueId),
        leagueId: teamInfo.leagueId,
        position: teamInfo.position,
        points: teamInfo.points,
        played: teamInfo.played,
        wins: teamInfo.wins,
        draws: teamInfo.draws,
        losses: teamInfo.losses,
        goalsFor: teamInfo.goalsFor,
        goalsAgainst: teamInfo.goalsAgainst,
        form: teamInfo.form
      },
      squad: squad.length > 0 ? squad : generateMockSquad(teamId),
      fixtures: fixtures.length > 0 ? fixtures : generateMockFixtures(teamId, teamInfo.teamName),
      stats: stats || generateMockStats()
    };

    res.json(response);

  } catch (error) {
    console.error('Error fetching team data:', error);
    res.status(500).json({ error: 'Failed to fetch team data' });
  }
});

// Helper function to get league name
function getLeagueName(leagueId) {
  const names = {
    'premier-league': 'Premier League',
    'la-liga': 'La Liga',
    'serie-a': 'Serie A',
    'bundesliga': 'Bundesliga',
    'ligue-1': 'Ligue 1'
  };
  return names[leagueId] || leagueId;
}

// Mock data generators
function generateMockSquad(teamId) {
  const positions = ['GK', 'DEF', 'MID', 'FWD'];
  const nationalities = ['England', 'Brazil', 'France', 'Spain', 'Germany', 'Argentina', 'Belgium', 'Portugal'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `${teamId}-player-${i}`,
    teamId: teamId,
    name: `Player ${i + 1}`,
    number: i + 1,
    position: i < 3 ? 'GK' : i < 10 ? 'DEF' : i < 18 ? 'MID' : 'FWD',
    age: Math.floor(Math.random() * 15) + 18,
    nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
    photo: `https://via.placeholder.com/150?text=P${i + 1}`,
    marketValue: `€${Math.floor(Math.random() * 50 + 5)}M`,
    appearances: Math.floor(Math.random() * 30),
    goals: Math.floor(Math.random() * 15),
    assists: Math.floor(Math.random() * 10),
    yellowCards: Math.floor(Math.random() * 5),
    redCards: Math.floor(Math.random() * 2)
  }));
}

function generateMockFixtures(teamId, teamName) {
  const opponents = ['Arsenal', 'Liverpool', 'Man City', 'Man United', 'Tottenham', 'Chelsea', 'Newcastle', 'Brighton'];
  const filteredOpponents = opponents.filter(opp => !teamName.includes(opp));
  
  return Array.from({ length: 10 }, (_, i) => {
    const isHome = Math.random() > 0.5;
    const opponent = filteredOpponents[i % filteredOpponents.length];
    const date = new Date();
    date.setDate(date.getDate() + (i - 3) * 7); // Some past, some future
    
    const isPast = i < 3;
    
    return {
      id: `${teamId}-fixture-${i}`,
      teamId: teamId,
      date: date.toISOString().split('T')[0],
      time: '15:00',
      homeTeam: isHome ? teamName : opponent,
      awayTeam: isHome ? opponent : teamName,
      homeLogo: isHome ? `https://via.placeholder.com/50?text=${teamName.substring(0, 3)}` : `https://via.placeholder.com/50?text=${opponent.substring(0, 3)}`,
      awayLogo: isHome ? `https://via.placeholder.com/50?text=${opponent.substring(0, 3)}` : `https://via.placeholder.com/50?text=${teamName.substring(0, 3)}`,
      competition: 'Premier League',
      venue: isHome ? `${teamName} Stadium` : `${opponent} Stadium`,
      isHome: isHome ? 1 : 0,
      status: isPast ? 'FT' : undefined,
      homeScore: isPast ? Math.floor(Math.random() * 4) : undefined,
      awayScore: isPast ? Math.floor(Math.random() * 4) : undefined
    };
  });
}

function generateMockStats() {
  return {
    goalsScored: Math.floor(Math.random() * 50) + 20,
    goalsConceded: Math.floor(Math.random() * 40) + 15,
    cleanSheets: Math.floor(Math.random() * 10) + 5,
    wins: Math.floor(Math.random() * 15) + 5,
    draws: Math.floor(Math.random() * 10) + 3,
    losses: Math.floor(Math.random() * 10) + 2,
    possession: Math.floor(Math.random() * 20) + 40,
    passAccuracy: Math.floor(Math.random() * 15) + 75,
    shotsPerGame: (Math.random() * 10 + 10).toFixed(1),
    tacklesPerGame: (Math.random() * 10 + 15).toFixed(1),
    yellowCards: Math.floor(Math.random() * 50) + 20,
    redCards: Math.floor(Math.random() * 5)
  };
}

// Add this endpoint to trigger team data scraping
app.post('/api/team/:teamId/scrape', async (req, res) => {
  const { teamId } = req.params;
  const { leagueId } = req.body;
  
  try {
    // Import the team scraper
    const { scrapeAndStoreTeamDetails } = await import('./teamScraper.js');
    
    // Scrape team data
    const teamData = await scrapeAndStoreTeamDetails(teamId, leagueId);
    
    res.json({ 
      success: true, 
      message: 'Team data scraped successfully',
      data: teamData
    });
    
  } catch (error) {
    console.error('Error scraping team data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to scrape team data' 
    });
  }
});
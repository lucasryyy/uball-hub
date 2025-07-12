import fetch from "node-fetch";
import * as cheerio from "cheerio";
import db from './db.js';

// Map team names to IDs and URLs for scraping
const TEAM_MAPPINGS = {
  "premier-league": {
    "Manchester City": { id: "manchester-city", url: "https://www.premierleague.com/clubs/11/Manchester-City/overview" },
    "Arsenal": { id: "arsenal", url: "https://www.premierleague.com/clubs/1/Arsenal/overview" },
    "Liverpool": { id: "liverpool", url: "https://www.premierleague.com/clubs/10/Liverpool/overview" },
    "Chelsea": { id: "chelsea", url: "https://www.premierleague.com/clubs/4/Chelsea/overview" },
    "Manchester United": { id: "manchester-united", url: "https://www.premierleague.com/clubs/12/Manchester-United/overview" },
    "Tottenham": { id: "tottenham", url: "https://www.premierleague.com/clubs/21/Tottenham-Hotspur/overview" },
    "Newcastle": { id: "newcastle", url: "https://www.premierleague.com/clubs/23/Newcastle-United/overview" },
    "Brighton": { id: "brighton", url: "https://www.premierleague.com/clubs/131/Brighton-and-Hove-Albion/overview" },
    "Aston Villa": { id: "aston-villa", url: "https://www.premierleague.com/clubs/2/Aston-Villa/overview" },
    "Bournemouth": { id: "bournemouth", url: "https://www.premierleague.com/clubs/127/Bournemouth/overview" },
    "Fulham": { id: "fulham", url: "https://www.premierleague.com/clubs/34/Fulham/overview" },
    "Wolves": { id: "wolves", url: "https://www.premierleague.com/clubs/38/Wolverhampton-Wanderers/overview" },
    "West Ham": { id: "west-ham", url: "https://www.premierleague.com/clubs/25/West-Ham-United/overview" },
    "Crystal Palace": { id: "crystal-palace", url: "https://www.premierleague.com/clubs/6/Crystal-Palace/overview" },
    "Everton": { id: "everton", url: "https://www.premierleague.com/clubs/7/Everton/overview" },
    "Brentford": { id: "brentford", url: "https://www.premierleague.com/clubs/130/Brentford/overview" },
    "Nottingham Forest": { id: "nottingham-forest", url: "https://www.premierleague.com/clubs/15/Nottingham-Forest/overview" },
    "Luton": { id: "luton", url: "https://www.premierleague.com/clubs/163/Luton-Town/overview" },
    "Burnley": { id: "burnley", url: "https://www.premierleague.com/clubs/43/Burnley/overview" },
    "Sheffield United": { id: "sheffield-united", url: "https://www.premierleague.com/clubs/18/Sheffield-United/overview" }
  }
};

export async function scrapeTeamDetails(teamId, leagueId) {
  try {
    // For now, return mock data - in production, this would scrape actual team pages
    const mockTeam = generateMockTeamData(teamId, leagueId);
    return mockTeam;
  } catch (error) {
    console.error(`Failed to scrape team ${teamId}:`, error);
    return generateMockTeamData(teamId, leagueId);
  }
}

function generateMockTeamData(teamId, leagueId) {
  const positions = ['GK', 'DEF', 'MID', 'FWD'];
  const nationalities = ['England', 'Brazil', 'France', 'Spain', 'Germany', 'Argentina', 'Belgium', 'Portugal'];
  
  // Generate squad
  const squad = [];
  const squadSize = 25;
  
  for (let i = 0; i < squadSize; i++) {
    const position = i < 3 ? 'GK' : i < 10 ? 'DEF' : i < 18 ? 'MID' : 'FWD';
    squad.push({
      id: `${teamId}-player-${i}`,
      name: `Player ${i + 1}`,
      number: i + 1,
      position: position,
      age: Math.floor(Math.random() * 15) + 18,
      nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
      photo: `https://via.placeholder.com/150?text=P${i + 1}`,
      marketValue: `€${Math.floor(Math.random() * 50 + 5)}M`,
      appearances: Math.floor(Math.random() * 30),
      goals: position === 'FWD' ? Math.floor(Math.random() * 15) : Math.floor(Math.random() * 5),
      assists: Math.floor(Math.random() * 10),
      yellowCards: Math.floor(Math.random() * 5),
      redCards: Math.floor(Math.random() * 2)
    });
  }

  // Generate fixtures
  const fixtures = [];
  const teams = ['Manchester United', 'Liverpool', 'Chelsea', 'Arsenal', 'Tottenham', 'Man City'];
  
  for (let i = 0; i < 10; i++) {
    const isHome = Math.random() > 0.5;
    const opponent = teams[Math.floor(Math.random() * teams.length)];
    const date = new Date();
    date.setDate(date.getDate() + i * 7);
    
    fixtures.push({
      id: `${teamId}-fixture-${i}`,
      date: date.toISOString().split('T')[0],
      time: `${15 + Math.floor(Math.random() * 5)}:${Math.random() > 0.5 ? '00' : '30'}`,
      homeTeam: isHome ? teamId : opponent,
      awayTeam: isHome ? opponent : teamId,
      competition: 'Premier League',
      venue: isHome ? 'Home Stadium' : 'Away Stadium',
      isHome: isHome
    });
  }

  // Generate recent results
  const recentResults = [];
  for (let i = 0; i < 5; i++) {
    const isHome = Math.random() > 0.5;
    const opponent = teams[Math.floor(Math.random() * teams.length)];
    const date = new Date();
    date.setDate(date.getDate() - (i + 1) * 7);
    
    const homeScore = Math.floor(Math.random() * 4);
    const awayScore = Math.floor(Math.random() * 4);
    
    recentResults.push({
      id: `${teamId}-result-${i}`,
      date: date.toISOString().split('T')[0],
      homeTeam: isHome ? teamId : opponent,
      awayTeam: isHome ? opponent : teamId,
      homeScore: homeScore,
      awayScore: awayScore,
      competition: 'Premier League',
      result: isHome ? 
        (homeScore > awayScore ? 'W' : homeScore < awayScore ? 'L' : 'D') :
        (awayScore > homeScore ? 'W' : awayScore < homeScore ? 'L' : 'D')
    });
  }

  // Team stats
  const stats = {
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

  return {
    id: teamId,
    name: teamId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    logo: `https://via.placeholder.com/200?text=${teamId.substring(0, 3).toUpperCase()}`,
    stadium: `${teamId.split('-')[0]} Stadium`,
    capacity: Math.floor(Math.random() * 40000) + 20000,
    manager: `Manager Name`,
    founded: 1900 + Math.floor(Math.random() * 100),
    leagueId: leagueId,
    squad: squad,
    fixtures: fixtures,
    recentResults: recentResults,
    stats: stats,
    trophies: {
      leagueTitles: Math.floor(Math.random() * 20),
      cupWins: Math.floor(Math.random() * 15),
      europeanTitles: Math.floor(Math.random() * 5)
    }
  };
}

export async function scrapeAndStoreTeamDetails(teamId, leagueId) {
  const teamData = await scrapeTeamDetails(teamId, leagueId);
  
  // Store team basic info
  db.run(
    `INSERT OR REPLACE INTO teams 
     (id, name, logo, stadium, capacity, manager, founded, leagueId, date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      teamData.id,
      teamData.name,
      teamData.logo,
      teamData.stadium,
      teamData.capacity,
      teamData.manager,
      teamData.founded,
      teamData.leagueId,
      new Date().toISOString()
    ]
  );

  // Store squad
  teamData.squad.forEach(player => {
    db.run(
      `INSERT OR REPLACE INTO team_players 
       (id, teamId, name, number, position, age, nationality, photo, marketValue, 
        appearances, goals, assists, yellowCards, redCards)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        player.id,
        teamId,
        player.name,
        player.number,
        player.position,
        player.age,
        player.nationality,
        player.photo,
        player.marketValue,
        player.appearances,
        player.goals,
        player.assists,
        player.yellowCards,
        player.redCards
      ]
    );
  });

  // Store fixtures
  teamData.fixtures.forEach(fixture => {
    db.run(
      `INSERT OR REPLACE INTO team_fixtures 
       (id, teamId, date, time, homeTeam, awayTeam, competition, venue, isHome)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fixture.id,
        teamId,
        fixture.date,
        fixture.time,
        fixture.homeTeam,
        fixture.awayTeam,
        fixture.competition,
        fixture.venue,
        fixture.isHome ? 1 : 0
      ]
    );
  });

  // Store stats
  db.run(
    `INSERT OR REPLACE INTO team_stats 
     (teamId, goalsScored, goalsConceded, cleanSheets, wins, draws, losses, 
      possession, passAccuracy, shotsPerGame, tacklesPerGame, yellowCards, redCards)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      teamId,
      teamData.stats.goalsScored,
      teamData.stats.goalsConceded,
      teamData.stats.cleanSheets,
      teamData.stats.wins,
      teamData.stats.draws,
      teamData.stats.losses,
      teamData.stats.possession,
      teamData.stats.passAccuracy,
      teamData.stats.shotsPerGame,
      teamData.stats.tacklesPerGame,
      teamData.stats.yellowCards,
      teamData.stats.redCards
    ]
  );

  return teamData;
}

export async function getTeamIdFromName(teamName, leagueId) {
  // Convert team name to ID format
  const teamId = teamName.toLowerCase().replace(/\s+/g, '-');
  
  // Check if we have this team in our mappings
  if (TEAM_MAPPINGS[leagueId] && TEAM_MAPPINGS[leagueId][teamName]) {
    return TEAM_MAPPINGS[leagueId][teamName].id;
  }
  
  return teamId;
}
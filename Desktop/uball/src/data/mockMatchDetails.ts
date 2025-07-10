// src/data/mockMatchDetails.ts - Updated with statistics
export type MatchEvent = {
  minute: number;
  team: 'home' | 'away';
  player: string;
  type: 'goal' | 'yellow' | 'red' | 'sub';
  assist?: string;
  replaced?: string;
  score?: string;
};

export type PlayerRating = {
  name: string;
  rating: number;
  position: string;
  number: number;
};

export type MatchStatistics = {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  offsides: { home: number; away: number };
  passAccuracy: { home: number; away: number };
  aerialDuels: { home: number; away: number };
  tackles: { home: number; away: number };
  interceptions: { home: number; away: number };
  clearances: { home: number; away: number };
  crosses: { home: number; away: number };
  saves: { home: number; away: number };
};

export type MatchDetails = {
  events: MatchEvent[];
  homePlayers: PlayerRating[];
  awayPlayers: PlayerRating[];
  statistics: MatchStatistics;
};

export const mockMatchDetails: Record<number, MatchDetails> = {
  1: {
    events: [
      { minute: 27, team: 'away', player: 'Lionel Messi', type: 'goal', score: '0 - 1' },
      { minute: 34, team: 'away', player: 'Baltasar Rodriguez', type: 'yellow' },
      { minute: 38, team: 'away', player: 'Lionel Messi', type: 'goal', assist: 'Sergio Busquets', score: '0 - 2' },
      { minute: 51, team: 'home', player: 'Leonardo Campana', type: 'yellow' },
      { minute: 55, team: 'away', player: 'Federico Redondo', type: 'yellow' },
      { minute: 62, team: 'away', player: 'Tomas Chancalay', type: 'sub', replaced: 'Tanner Beason' },
      { minute: 63, team: 'away', player: 'Telasco Segovia', type: 'sub', replaced: 'Baltasar Rodriguez' },
      { minute: 70, team: 'home', player: 'Luis Diaz', type: 'sub', replaced: 'Luca Langoni' },
      { minute: 75, team: 'away', player: 'Maximiliano Falcon', type: 'yellow' },
      { minute: 76, team: 'home', player: 'Maximiliano Nicolas Urruti', type: 'sub', replaced: 'Brandon Bye' },
      { minute: 80, team: 'home', player: 'Carles Gil', type: 'goal', score: '1 - 2' },
      { minute: 81, team: 'away', player: 'Benjamin Cremaschi', type: 'sub', replaced: 'Tadeo Allende' },
      { minute: 87, team: 'away', player: 'Hector Martinez', type: 'sub', replaced: 'Luis Suarez' }
    ],
    homePlayers: [
      { name: 'Caleb Porter', rating: 6.5, position: 'GK', number: 1 },
      { name: 'Beason', rating: 5.4, position: 'CB', number: 4 },
      { name: 'Miller', rating: 6.7, position: 'CB', number: 25 },
      { name: 'Polster', rating: 6.8, position: 'CB', number: 8 },
      { name: 'Fofana', rating: 6.2, position: 'LB', number: 2 },
      { name: 'Ivacic', rating: 5.3, position: 'RB', number: 31 },
      { name: 'Yusuf', rating: 7.4, position: 'CDM', number: 80 },
      { name: 'Campana', rating: 7.5, position: 'CM', number: 9 },
      { name: 'Langoni', rating: 6.6, position: 'CM', number: 41 },
      { name: 'Gil', rating: 7.9, position: 'CAM', number: 10 },
      { name: 'Bye', rating: 6.3, position: 'ST', number: 15 }
    ],
    awayPlayers: [
      { name: 'Allende', rating: 5.4, position: 'GK', number: 21 },
      { name: 'Weigandt', rating: 6.9, position: 'CB', number: 57 },
      { name: 'Messi', rating: 9.1, position: 'RW', number: 10 },
      { name: 'Redondo', rating: 7.1, position: 'CM', number: 55 },
      { name: 'Falcon', rating: 6.9, position: 'CB', number: 37 },
      { name: 'Ustari', rating: 7.2, position: 'RB', number: 19 },
      { name: 'Busquets', rating: 7.5, position: 'CDM', number: 5 },
      { name: 'Aviles', rating: 6.6, position: 'LB', number: 6 },
      { name: 'Rodriguez', rating: 6.9, position: 'LW', number: 11 },
      { name: 'Alba', rating: 7.4, position: 'LM', number: 18 },
      { name: 'Suarez', rating: 7.0, position: 'ST', number: 9 }
    ],
    statistics: {
      possession: { home: 42, away: 58 },
      shots: { home: 8, away: 14 },
      shotsOnTarget: { home: 3, away: 7 },
      corners: { home: 4, away: 6 },
      fouls: { home: 12, away: 9 },
      yellowCards: { home: 1, away: 3 },
      redCards: { home: 0, away: 0 },
      offsides: { home: 2, away: 1 },
      passAccuracy: { home: 78, away: 85 },
      aerialDuels: { home: 15, away: 12 },
      tackles: { home: 18, away: 14 },
      interceptions: { home: 7, away: 9 },
      clearances: { home: 12, away: 8 },
      crosses: { home: 8, away: 11 },
      saves: { home: 5, away: 2 }
    }
  },
  2: {
    events: [
      { minute: 33, team: 'home', player: 'Player M', type: 'goal', score: '1 - 0' },
      { minute: 67, team: 'away', player: 'Player N', type: 'red' }
    ],
    homePlayers: [
      { name: 'Player M', rating: 8.1, position: 'ST', number: 9 },
      { name: 'Player O', rating: 7.0, position: 'CM', number: 8 },
      { name: 'Player P', rating: 6.5, position: 'CB', number: 4 },
      { name: 'Player Q', rating: 6.8, position: 'GK', number: 1 }
    ],
    awayPlayers: [
      { name: 'Player N', rating: 5.4, position: 'CM', number: 10 },
      { name: 'Player R', rating: 6.2, position: 'ST', number: 9 },
      { name: 'Player S', rating: 6.7, position: 'CB', number: 5 },
      { name: 'Player T', rating: 6.0, position: 'GK', number: 1 }
    ],
    statistics: {
      possession: { home: 65, away: 35 },
      shots: { home: 12, away: 4 },
      shotsOnTarget: { home: 6, away: 1 },
      corners: { home: 7, away: 2 },
      fouls: { home: 8, away: 15 },
      yellowCards: { home: 0, away: 1 },
      redCards: { home: 0, away: 1 },
      offsides: { home: 1, away: 3 },
      passAccuracy: { home: 82, away: 71 },
      aerialDuels: { home: 18, away: 10 },
      tackles: { home: 12, away: 22 },
      interceptions: { home: 5, away: 8 },
      clearances: { home: 6, away: 16 },
      crosses: { home: 9, away: 3 },
      saves: { home: 1, away: 5 }
    }
  }
};
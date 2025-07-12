// src/components/team/teamTypes.ts

export interface Player {
  id: string;
  name: string;
  position: string;
  photo: string;
  nationality: string;
}

export interface Fixture {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeScore?: number;
  awayScore?: number;
}

export interface Stat {
  key: string;
  value: number;
}

export interface TeamDetail {
  id: string;
  name: string;
  logo: string;
  league: string;
  position: number;
  points: number;
  nextFixture?: Fixture;
  fixtures: Fixture[];
  recentResults: Fixture[];
  squad: Player[];
  stats: Stat[];
}

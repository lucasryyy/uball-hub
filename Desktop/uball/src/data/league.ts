// data/leagues.ts

export type Player = {
  id: number;
  name: string;
  position: string;
  age: number;
};

export type Fixture = {
  id: number;
  date: string;
  time: string;
  opponent: string;
  home: boolean;
  logo: string;
};

export type TeamStats = {
  goals: number;
  conceded: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
};

export type Team = {
  id: string;
  name: string;
  logo: string;
  position: number;
  players: Player[];
  fixtures: Fixture[];
  stats: TeamStats;
};

export type League = {
  id: string;
  name: string;
  logo: string;
  season: string;
  teams: Team[];
};

export const leagues = [
  {
    id: "premier-league",
    name: "Premier League",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
    seasons: ["2024/25", "2023/24"],
    teams: [
      {
        id: "arsenal",
        name: "Arsenal",
        logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
        stats: {
          goals: 60,
          conceded: 30,
          cleanSheets: 12,
          yellowCards: 45,
          redCards: 2,
        },
        fixtures: []
      },
      {
        id: "chelsea",
        name: "Chelsea",
        logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
        stats: {
          goals: 50,
          conceded: 35,
          cleanSheets: 10,
          yellowCards: 40,
          redCards: 1,
        },
        fixtures: []
      },
      {
        id: "man-city",
        name: "Man City",
        logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
        stats: {
          goals: 70,
          conceded: 25,
          cleanSheets: 15,
          yellowCards: 38,
          redCards: 0,
        },
        fixtures: []
      }
    ]
  }
];
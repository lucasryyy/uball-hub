// src/data/mockScores.ts
export type Goal = {
  player: string;
  minute: number;
  team: 'home' | 'away';
};

export type Match = {
  id: number
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  status: string
  time: string
  homeLogo: string
  awayLogo: string
  goals?: Goal[]
}

export const groupedMockScores: { tournament: string; matches: Match[] }[] = [
  {
    tournament: "CONCACAF Gold Cup Semifinale",
    matches: [
      {
        id: 1,
        homeTeam: "New England Revolution",
        awayTeam: "Inter Miami CF",
        homeScore: 1,
        awayScore: 2,
        status: "FT",
        time: "FT",
        homeLogo: "https://logos-world.net/wp-content/uploads/2020/06/New-England-Revolution-Logo.png",
        awayLogo: "https://logos-world.net/wp-content/uploads/2020/06/Inter-Miami-CF-Logo.png",
        goals: [
          { player: "Lionel Messi", minute: 27, team: "away" },
          { player: "Lionel Messi", minute: 38, team: "away" },
          { player: "Carles Gil", minute: 80, team: "home" }
        ]
      },
      {
        id: 2,
        homeTeam: "Mexico",
        awayTeam: "Honduras",
        homeScore: 1,
        awayScore: 0,
        status: "FT",
        time: "FT",
        homeLogo: "https://flagcdn.com/mx.svg",
        awayLogo: "https://flagcdn.com/hn.svg",
        goals: [
          { player: "Player M", minute: 33, team: "home" }
        ]
      }
    ]
  },
  {
    tournament: "EM for kvinder",
    matches: [
      {
        id: 3,
        homeTeam: "Belgien",
        awayTeam: "Italien",
        homeScore: null,
        awayScore: null,
        status: "NS",
        time: "18:00",
        homeLogo: "https://flagcdn.com/be.svg",
        awayLogo: "https://flagcdn.com/it.svg"
      },
      {
        id: 4,
        homeTeam: "Spanien",
        awayTeam: "Portugal",
        homeScore: null,
        awayScore: null,
        status: "NS",
        time: "21:00",
        homeLogo: "https://flagcdn.com/es.svg",
        awayLogo: "https://flagcdn.com/pt.svg"
      }
    ]
  }
];
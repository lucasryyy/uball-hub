// src/data/mockScores.ts
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
}

export const groupedMockScores: { tournament: string; matches: Match[] }[] = [
  {
    tournament: "CONCACAF Gold Cup Semifinale",
    matches: [
      {
        id: 1,
        homeTeam: "USA",
        awayTeam: "Guatemala",
        homeScore: 2,
        awayScore: 1,
        status: "FT",
        time: "FT",
        homeLogo: "https://flagcdn.com/us.svg",
        awayLogo: "https://flagcdn.com/gt.svg"
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
        awayLogo: "https://flagcdn.com/hn.svg"
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

// src/data/mockScores.ts
export const groupedMockScores = [
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
        events: [
        { minute: 2, type: "yellow", player: "Kevin Long", team: "home" },
        { minute: 20, type: "goal", player: "Hannes Wolf", assist: "Mitja Ilenic", score: "1 - 0", team: "home" },
        { minute: 58, type: "sub", player: "Deandre Kerr", replaced: "Tyrese Spicer", team: "away" },
        { minute: 70, type: "own goal", player: "Tomas Romero", score: "2 - 1", team: "away" }
        ],
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

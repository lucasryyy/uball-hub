export type Team = {
  id: string;
  name: string;
  logo: string;
  position: number;
  players: {
    id: number;
    name: string;
    position: string;
    age: number;
  }[];
  fixtures: {
    id: number;
    date: string;
    time: string;
    opponent: string;
    home: boolean;
    logo: string;
  }[];
  stats: {
    goals: number;
    conceded: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
  };
};

export const teams: Team[] = [
  {
    id: "arsenal",
    name: "Arsenal",
    logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
    position: 3,
    players: [
      { id: 1, name: "Bukayo Saka", position: "Winger", age: 22 },
      { id: 2, name: "Martin Ødegaard", position: "Midfielder", age: 25 },
      { id: 3, name: "William Saliba", position: "Defender", age: 23 },
    ],
    fixtures: [
      {
        id: 1,
        date: "Sun 15 Sep",
        time: "17:30",
        opponent: "Spurs",
        home: true,
        logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
      },
      {
        id: 2,
        date: "Sat 21 Sep",
        time: "16:00",
        opponent: "Man City",
        home: false,
        logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
      },
    ],
    stats: {
      goals: 58,
      conceded: 24,
      cleanSheets: 13,
      yellowCards: 42,
      redCards: 2,
    },
  },

  // Add more teams here like:
  {
    id: "chelsea",
    name: "Chelsea",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
    position: 10,
    players: [
      { id: 1, name: "Raheem Sterling", position: "Winger", age: 28 },
      { id: 2, name: "Enzo Fernández", position: "Midfielder", age: 23 },
    ],
    fixtures: [],
    stats: {
      goals: 43,
      conceded: 38,
      cleanSheets: 8,
      yellowCards: 45,
      redCards: 3,
    },
  },

  {
  id: "man-city",
  name: "Man City",
  logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  position: 1,
  players: [
    { id: 1, name: "Erling Haaland", position: "Striker", age: 24 },
    { id: 2, name: "Kevin De Bruyne", position: "Midfielder", age: 32 },
    { id: 3, name: "Rúben Dias", position: "Defender", age: 26 },
  ],
  fixtures: [
    {
      id: 1,
      date: "Sat 21 Sep",
      time: "16:00",
      opponent: "Arsenal",
      home: true,
      logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
    },
  ],
  stats: {
    goals: 72,
    conceded: 22,
    cleanSheets: 15,
    yellowCards: 38,
    redCards: 1,
  }
},
 {
    id: "tottenham",
    name: "Tottenham",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
    position: 5,
    players: [
      { id: 1, name: "Heung-Min Son", position: "Forward", age: 31 },
      { id: 2, name: "James Maddison", position: "Midfielder", age: 27 },
      { id: 3, name: "Cristian Romero", position: "Defender", age: 25 },
    ],
    fixtures: [],
    stats: {
      goals: 61,
      conceded: 36,
      cleanSheets: 9,
      yellowCards: 50,
      redCards: 2,
    },
  },

  {
    id: "liverpool",
    name: "Liverpool",
    logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
    position: 2,
    players: [
      { id: 1, name: "Mohamed Salah", position: "Forward", age: 32 },
      { id: 2, name: "Trent Alexander-Arnold", position: "Defender", age: 26 },
      { id: 3, name: "Alisson Becker", position: "Goalkeeper", age: 32 },
    ],
    fixtures: [],
    stats: {
      goals: 65,
      conceded: 29,
      cleanSheets: 11,
      yellowCards: 41,
      redCards: 1,
    },
  },

  {
    id: "man-united",
    name: "Man United",
    logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
    position: 6,
    players: [
      { id: 1, name: "Bruno Fernandes", position: "Midfielder", age: 29 },
      { id: 2, name: "Marcus Rashford", position: "Forward", age: 27 },
      { id: 3, name: "Casemiro", position: "Midfielder", age: 32 },
    ],
    fixtures: [],
    stats: {
      goals: 52,
      conceded: 35,
      cleanSheets: 10,
      yellowCards: 48,
      redCards: 4,
    },
  },
  
{
  id: "aston-villa",
  name: "Aston Villa",
  logo: "https://upload.wikimedia.org/wikipedia/en/6/2/Aston_Villa_logo.svg",
  position: 7,
  players: [
    { id: 1, name: "Aston Villa Player 1", position: "Forward", age: 23 },
    { id: 2, name: "Aston Villa Player 2", position: "Midfielder", age: 32 },
    { id: 3, name: "Aston Villa Player 3", position: "Defender", age: 28 }
  ],
  fixtures: [],
  stats: {
    goals: 60,
    conceded: 53,
    cleanSheets: 5,
    yellowCards: 37,
    redCards: 5
  }
},
{
  id: "newcastle",
  name: "Newcastle",
  logo: "https://upload.wikimedia.org/wikipedia/en/9/2/Newcastle_logo.svg",
  position: 8,
  players: [
    { id: 1, name: "Newcastle Player 1", position: "Forward", age: 24 },
    { id: 2, name: "Newcastle Player 2", position: "Midfielder", age: 29 },
    { id: 3, name: "Newcastle Player 3", position: "Defender", age: 22 }
  ],
  fixtures: [],
  stats: {
    goals: 54,
    conceded: 55,
    cleanSheets: 3,
    yellowCards: 33,
    redCards: 3
  }
},
{
  id: "brighton",
  name: "Brighton",
  logo: "https://upload.wikimedia.org/wikipedia/en/4/3/Brighton_logo.svg",
  position: 9,
  players: [
    { id: 1, name: "Brighton Player 1", position: "Forward", age: 25 },
    { id: 2, name: "Brighton Player 2", position: "Midfielder", age: 31 },
    { id: 3, name: "Brighton Player 3", position: "Defender", age: 27 }
  ],
  fixtures: [],
  stats: {
    goals: 64,
    conceded: 42,
    cleanSheets: 6,
    yellowCards: 38,
    redCards: 2
  }
},

{
  id: "west-ham",
  name: "West Ham",
  logo: "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg",
  position: 11,
  players: [
    { id: 1, name: "Jarrod Bowen", position: "Forward", age: 27 },
    { id: 2, name: "Declan Rice", position: "Midfielder", age: 25 },
    { id: 3, name: "Kurt Zouma", position: "Defender", age: 29 }
  ],
  fixtures: [],
  stats: {
    goals: 48,
    conceded: 47,
    cleanSheets: 7,
    yellowCards: 44,
    redCards: 2
  }
},
{
  id: "wolves",
  name: "Wolves",
  logo: "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg",
  position: 12,
  players: [
    { id: 1, name: "Pedro Neto", position: "Forward", age: 24 },
    { id: 2, name: "Matheus Nunes", position: "Midfielder", age: 26 },
    { id: 3, name: "Max Kilman", position: "Defender", age: 28 }
  ],
  fixtures: [],
  stats: {
    goals: 45,
    conceded: 50,
    cleanSheets: 6,
    yellowCards: 46,
    redCards: 3
  }
},
{
  id: "crystal-palace",
  name: "Crystal Palace",
  logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Crystal_Palace_FC_logo.svg",
  position: 13,
  players: [
    { id: 1, name: "Eberechi Eze", position: "Midfielder", age: 25 },
    { id: 2, name: "Michael Olise", position: "Forward", age: 23 },
    { id: 3, name: "Joachim Andersen", position: "Defender", age: 27 }
  ],
  fixtures: [],
  stats: {
    goals: 39,
    conceded: 49,
    cleanSheets: 5,
    yellowCards: 40,
    redCards: 2
  }
},

{
  id: "fulham",
  name: "Fulham",
  logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg",
  position: 14,
  players: [
    { id: 1, name: "João Palhinha", position: "Midfielder", age: 29 },
    { id: 2, name: "Willian", position: "Winger", age: 35 },
    { id: 3, name: "Bernd Leno", position: "Goalkeeper", age: 32 }
  ],
  fixtures: [],
  stats: {
    goals: 42,
    conceded: 48,
    cleanSheets: 6,
    yellowCards: 39,
    redCards: 2
  }
},
{
  id: "brentford",
  name: "Brentford",
  logo: "https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg",
  position: 15,
  players: [
    { id: 1, name: "Ivan Toney", position: "Forward", age: 28 },
    { id: 2, name: "Bryan Mbeumo", position: "Winger", age: 25 },
    { id: 3, name: "Ben Mee", position: "Defender", age: 34 }
  ],
  fixtures: [],
  stats: {
    goals: 41,
    conceded: 51,
    cleanSheets: 5,
    yellowCards: 43,
    redCards: 1
  }
},
{
  id: "everton",
  name: "Everton",
  logo: "https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg",
  position: 16,
  players: [
    { id: 1, name: "Dominic Calvert-Lewin", position: "Forward", age: 28 },
    { id: 2, name: "Abdoulaye Doucouré", position: "Midfielder", age: 31 },
    { id: 3, name: "Jordan Pickford", position: "Goalkeeper", age: 31 }
  ],
  fixtures: [],
  stats: {
    goals: 38,
    conceded: 46,
    cleanSheets: 7,
    yellowCards: 42,
    redCards: 2
  }
},

{
  id: "bournemouth",
  name: "Bournemouth",
  logo: "https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_crest.svg",
  position: 17,
  players: [
    { id: 1, name: "Dominic Solanke", position: "Forward", age: 26 },
    { id: 2, name: "Philip Billing", position: "Midfielder", age: 28 },
    { id: 3, name: "Lloyd Kelly", position: "Defender", age: 25 }
  ],
  fixtures: [],
  stats: {
    goals: 40,
    conceded: 58,
    cleanSheets: 4,
    yellowCards: 44,
    redCards: 1
  }
},
{
  id: "nottingham-forest",
  name: "Nottingham Forest",
  logo: "https://upload.wikimedia.org/wikipedia/en/1/19/Nottingham_Forest_FC_logo.svg",
  position: 18,
  players: [
    { id: 1, name: "Morgan Gibbs-White", position: "Midfielder", age: 24 },
    { id: 2, name: "Taiwo Awoniyi", position: "Forward", age: 26 },
    { id: 3, name: "Joe Worrall", position: "Defender", age: 27 }
  ],
  fixtures: [],
  stats: {
    goals: 36,
    conceded: 60,
    cleanSheets: 3,
    yellowCards: 46,
    redCards: 3
  }
},
{
  id: "luton-town",
  name: "Luton Town",
  logo: "https://upload.wikimedia.org/wikipedia/en/e/e1/Luton_Town_logo.svg",
  position: 19,
  players: [
    { id: 1, name: "Carlton Morris", position: "Forward", age: 27 },
    { id: 2, name: "Marvelous Nakamba", position: "Midfielder", age: 30 },
    { id: 3, name: "Tom Lockyer", position: "Defender", age: 30 }
  ],
  fixtures: [],
  stats: {
    goals: 34,
    conceded: 65,
    cleanSheets: 2,
    yellowCards: 49,
    redCards: 4
  }
},
{
  id: "sheffield-united",
  name: "Sheffield United",
  logo: "https://upload.wikimedia.org/wikipedia/en/3/3e/Sheffield_United_FC_logo.svg",
  position: 20,
  players: [
    { id: 1, name: "Oliver McBurnie", position: "Forward", age: 28 },
    { id: 2, name: "Gustavo Hamer", position: "Midfielder", age: 27 },
    { id: 3, name: "John Egan", position: "Defender", age: 31 }
  ],
  fixtures: [],
  stats: {
    goals: 28,
    conceded: 70,
    cleanSheets: 1,
    yellowCards: 50,
    redCards: 5
  }
},


];

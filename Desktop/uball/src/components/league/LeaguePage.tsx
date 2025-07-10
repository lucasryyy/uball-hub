import { useParams } from "react-router-dom";
import { useState } from "react";
import LeagueHeader from "./LeagueHeader";
import LeagueTable from "./LeagueTable";
import LeagueStatsTabs from "./LeagueStatsTabs";


export default function LeaguePage() {
  const { id } = useParams();
  const [season, setSeason] = useState("2024/25");
  const [following, setFollowing] = useState(false);

  // Mock league info
  const league = {
    name: "Premier League",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
    seasons: ["2024/25", "2023/24", "2022/23"]
  };

const teams = [
  {
    id: 1, name: "Man City", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
    played: 26, wins: 20, draws: 3, losses: 3, goalDiff: 45, points: 63, form: ["W", "W", "W", "D", "W"]
  },
  {
    id: 2, name: "Liverpool", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
    played: 26, wins: 19, draws: 4, losses: 3, goalDiff: 39, points: 61, form: ["W", "W", "D", "W", "L"]
  },
  {
    id: 3, name: "Arsenal", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
    played: 26, wins: 18, draws: 5, losses: 3, goalDiff: 34, points: 59, form: ["L", "W", "W", "W", "W"]
  },
  {
    id: 4, name: "Aston Villa", logo: "https://upload.wikimedia.org/wikipedia/en/9/9f/Aston_Villa_logo.svg",
    played: 26, wins: 16, draws: 4, losses: 6, goalDiff: 21, points: 52, form: ["W", "L", "W", "D", "W"]
  },
  {
    id: 5, name: "Tottenham", logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
    played: 26, wins: 15, draws: 5, losses: 6, goalDiff: 18, points: 50, form: ["W", "W", "L", "D", "W"]
  },
  {
    id: 6, name: "Man United", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
    played: 26, wins: 14, draws: 4, losses: 8, goalDiff: 9, points: 46, form: ["L", "W", "W", "W", "L"]
  },
  {
    id: 7, name: "Newcastle", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
    played: 26, wins: 13, draws: 5, losses: 8, goalDiff: 15, points: 44, form: ["D", "W", "L", "W", "D"]
  },
  {
    id: 8, name: "Brighton", logo: "https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg",
    played: 26, wins: 12, draws: 7, losses: 7, goalDiff: 10, points: 43, form: ["W", "D", "L", "W", "W"]
  },
  {
    id: 9, name: "West Ham", logo: "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg",
    played: 26, wins: 11, draws: 6, losses: 9, goalDiff: -3, points: 39, form: ["L", "W", "W", "D", "L"]
  },
  {
    id: 10, name: "Chelsea", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
    played: 26, wins: 10, draws: 7, losses: 9, goalDiff: 5, points: 37, form: ["W", "L", "W", "D", "L"]
  },
  {
    id: 11, name: "Wolves", logo: "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg",
    played: 26, wins: 10, draws: 6, losses: 10, goalDiff: -1, points: 36, form: ["D", "W", "L", "W", "L"]
  },
  {
    id: 12, name: "Crystal Palace", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Crystal_Palace_FC_logo.svg",
    played: 26, wins: 9, draws: 6, losses: 11, goalDiff: -8, points: 33, form: ["W", "L", "L", "D", "W"]
  },
  {
    id: 13, name: "Fulham", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_(shield).svg",
    played: 26, wins: 9, draws: 5, losses: 12, goalDiff: -4, points: 32, form: ["L", "W", "W", "L", "D"]
  },
  {
    id: 14, name: "Brentford", logo: "https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg",
    played: 26, wins: 8, draws: 6, losses: 12, goalDiff: -6, points: 30, form: ["D", "L", "W", "D", "W"]
  },
  {
    id: 15, name: "Everton", logo: "https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg",
    played: 26, wins: 8, draws: 5, losses: 13, goalDiff: -10, points: 29, form: ["L", "W", "D", "L", "W"]
  },
  {
    id: 16, name: "Bournemouth", logo: "https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_crest.svg",
    played: 26, wins: 7, draws: 7, losses: 12, goalDiff: -11, points: 28, form: ["L", "D", "W", "L", "L"]
  },
  {
    id: 17, name: "Nottingham Forest", logo: "https://upload.wikimedia.org/wikipedia/en/1/19/Nottingham_Forest_FC_logo.svg",
    played: 26, wins: 6, draws: 6, losses: 14, goalDiff: -15, points: 24, form: ["D", "L", "L", "W", "L"]
  },
  {
    id: 18, name: "Luton Town", logo: "https://upload.wikimedia.org/wikipedia/en/e/e1/Luton_Town_logo.svg",
    played: 26, wins: 5, draws: 6, losses: 15, goalDiff: -20, points: 21, form: ["L", "L", "D", "W", "L"]
  },
  {
    id: 19, name: "Burnley", logo: "https://upload.wikimedia.org/wikipedia/en/0/02/Burnley_FC_Logo.svg",
    played: 26, wins: 4, draws: 5, losses: 17, goalDiff: -25, points: 17, form: ["D", "L", "L", "L", "W"]
  },
  {
    id: 20, name: "Sheffield United", logo: "https://upload.wikimedia.org/wikipedia/en/3/3e/Sheffield_United_FC_logo.svg",
    played: 26, wins: 3, draws: 4, losses: 19, goalDiff: -32, points: 13, form: ["L", "L", "D", "L", "L"]
  }
];


const stats = {
  goals: [
    {
      id: 1,
      name: "Erling Haaland",
      team: "Man City",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
      value: 23
    },
    {
      id: 2,
      name: "Mohamed Salah",
      team: "Liverpool",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
      value: 19
    },
    {
      id: 3,
      name: "Ollie Watkins",
      team: "Aston Villa",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/9/9f/Aston_Villa_logo.svg",
      value: 17
    },
    {
      id: 4,
      name: "Heung-Min Son",
      team: "Tottenham",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
      value: 16
    },
    {
      id: 5,
      name: "Bukayo Saka",
      team: "Arsenal",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
      value: 14
    }
  ],
  assists: [
    {
      id: 6,
      name: "Kevin De Bruyne",
      team: "Man City",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
      value: 12
    },
    {
      id: 7,
      name: "Trent Alexander-Arnold",
      team: "Liverpool",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
      value: 10
    },
    {
      id: 8,
      name: "James Maddison",
      team: "Tottenham",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
      value: 9
    },
    {
      id: 9,
      name: "Martin Ødegaard",
      team: "Arsenal",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
      value: 8
    },
    {
      id: 10,
      name: "Bruno Fernandes",
      team: "Man United",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
      value: 7
    }
  ],
  cleanSheets: [
    {
      id: 11,
      name: "David Raya",
      team: "Arsenal",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
      value: 13
    },
    {
      id: 12,
      name: "Alisson Becker",
      team: "Liverpool",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
      value: 11
    },
    {
      id: 13,
      name: "Ederson",
      team: "Man City",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
      value: 10
    },
    {
      id: 14,
      name: "Emiliano Martínez",
      team: "Aston Villa",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/9/9f/Aston_Villa_logo.svg",
      value: 9
    },
    {
      id: 15,
      name: "Guglielmo Vicario",
      team: "Tottenham",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
      value: 8
    }
  ],
  cards: [
    {
      id: 16,
      name: "Bruno Guimarães",
      team: "Newcastle",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
      value: 9 // total cards
    },
    {
      id: 17,
      name: "João Palhinha",
      team: "Fulham",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_(shield).svg",
      value: 8
    },
    {
      id: 18,
      name: "Casemiro",
      team: "Man United",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
      value: 7
    },
    {
      id: 19,
      name: "Douglas Luiz",
      team: "Aston Villa",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/9/9f/Aston_Villa_logo.svg",
      value: 6
    },
    {
      id: 20,
      name: "Conor Gallagher",
      team: "Chelsea",
      teamLogo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
      value: 6
    }
  ]
};


  return (
  <div className="bg-[#0e0e0e] min-h-screen text-white px-4 py-6 max-w-6xl mx-auto">
    <LeagueHeader
      name={league.name}
      logoUrl={league.logoUrl}
      seasons={league.seasons}
      selectedSeason={season}
      onChangeSeason={setSeason}
      isFollowing={following}
      toggleFollow={() => setFollowing(!following)}
    />

    <LeagueTable teams={teams} />
    <LeagueStatsTabs stats={stats} />
  </div>
);

}

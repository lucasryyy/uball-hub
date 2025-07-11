import { useParams } from "react-router-dom";
import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import LeagueHeader from "./LeagueHeader";
import LeagueTable from "./LeagueTable";
import LeagueFixtures from "./LeagueFixtures";
import LeagueStatsTabs from "./LeagueStatsTabs";
import { leagues } from "../../data/league";

export default function LeaguePage() {
  const { id } = useParams();
  const [season, setSeason] = useState("2024/25");
  const [following, setFollowing] = useState(false);
  const league = leagues.find(l => l.id === id);
  if (!league) {
    return <div className="text-white text-center mt-10">League not found</div>;
}



const teams = league.teams.map(team => ({
  id: team.id,
  name: team.name,
  logo: team.logo,
  played: 26, // optionally calculate dynamically later
  wins: 18,
  draws: 5,
  losses: 3,
  goalDiff: team.stats.goals - team.stats.conceded,
  points: 59, // placeholder or calculated
  form: ["W", "D", "W", "L", "W"]
}));

const fixtures = league.teams.flatMap(team => team.fixtures || []);

const stats = {
  goals: league.teams.map((team, i) => ({
    id: i,
    name: team.name + " Player", // placeholder
    team: team.name,
    teamLogo: team.logo,
    value: team.stats.goals,
  })),
  assists: league.teams.map((team, i) => ({
    id: i,
    name: team.name + " Player",
    team: team.name,
    teamLogo: team.logo,
    value: Math.floor(team.stats.goals / 2), // fake data
  })),
  cleanSheets: league.teams.map((team, i) => ({
    id: i,
    name: team.name + " Player",
    team: team.name,
    teamLogo: team.logo,
    value: team.stats.cleanSheets,
  })),
  cards: league.teams.map((team, i) => ({
    id: i,
    name: team.name + " Player",
    team: team.name,
    teamLogo: team.logo,
    value: team.stats.yellowCards + team.stats.redCards,
  })),
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

      <Tabs.Root defaultValue="table" className="mt-6">
        <Tabs.List className="flex gap-4 border-b border-[#2c2c2e] mb-4">
          <Tabs.Trigger value="table" className="px-4 py-2 text-sm font-medium text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-500">Tabel</Tabs.Trigger>
          <Tabs.Trigger value="stats" className="px-4 py-2 text-sm font-medium text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-500">Statistik</Tabs.Trigger>
          <Tabs.Trigger value="fixtures" className="px-4 py-2 text-sm font-medium text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-500">Kampe</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="table">
          <LeagueTable teams={teams} />
        </Tabs.Content>

        <Tabs.Content value="stats">
          <LeagueStatsTabs stats={stats} />
        </Tabs.Content>

        <Tabs.Content value="fixtures">
          <LeagueFixtures fixtures={fixtures} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

import { useParams } from "react-router-dom";
import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import TeamSquad from "./TeamSquad";
import TeamFixtures from "./TeamFixtures";
import TeamStats from "./TeamStats";
import { teams } from "../../data/teams";

export default function TeamPage() {
  const { id } = useParams();
  const [following, setFollowing] = useState(false);

  const team = teams.find((t) => t.id === id);

  if (!team) {
    return <div className="text-center text-white mt-10">Team not found</div>;
  }

  return (
    <div className="bg-[#0e0e0e] min-h-screen text-white px-4 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img src={team.logo} alt={team.name} className="w-10 h-10" />
          <h1 className="text-2xl font-semibold">{team.name}</h1>
          <span className="text-sm text-gray-400">#{team.position} in league</span>
        </div>
        <button
          onClick={() => setFollowing(!following)}
          className={`text-sm px-3 py-1 rounded border ${
            following ? "bg-green-600 border-green-500" : "border-gray-500"
          }`}
        >
          {following ? "✓ Following" : "Follow"}
        </button>
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="squad">
        <Tabs.List className="flex gap-4 border-b border-[#2c2c2e] mb-4">
          <Tabs.Trigger
            value="squad"
            className="px-4 py-2 text-sm font-medium text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-500"
          >
            Squad
          </Tabs.Trigger>
          <Tabs.Trigger
            value="fixtures"
            className="px-4 py-2 text-sm font-medium text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-500"
          >
            Matches
          </Tabs.Trigger>
          <Tabs.Trigger
            value="stats"
            className="px-4 py-2 text-sm font-medium text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-500"
          >
            Stats
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="squad">
          <TeamSquad players={team.players} />
        </Tabs.Content>

        <Tabs.Content value="fixtures">
          <TeamFixtures fixtures={team.fixtures} />
        </Tabs.Content>

        <Tabs.Content value="stats">
          <TeamStats stats={team.stats} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

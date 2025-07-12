import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import TeamHeader from "./TeamHeader";
import TeamFixtures from "./TeamFixtures";
import TeamResults from "./TeamResults";
import TeamSquad from "./TeamSquad";
import TeamStats from "./TeamStats";
import type { Player, Fixture, Stat, TeamDetail } from "./teamTypes";

export default function TeamPage() {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) fetchTeamDetail();
  }, [id]);

  async function fetchTeamDetail() {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/teams/${id}`);
      const data: TeamDetail = await res.json();
      setTeam(data);
    } catch (err) {
      console.error("Failed to load team detail", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !team) {
    return <div>Loading team details...</div>;
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <TeamHeader
        name={team.name}
        logo={team.logo}
        league={team.league}
        position={team.position}
        points={team.points}
        nextFixture={team.nextFixture}
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex space-x-4 mb-6">
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="fixtures">Fixtures</Tabs.Trigger>
            <Tabs.Trigger value="results">Results</Tabs.Trigger>
            <Tabs.Trigger value="squad">Squad</Tabs.Trigger>
            <Tabs.Trigger value="stats">Stats</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="overview">
            {/* Could show summary or highlight banner */}
            <p className="text-gray-400">Overview coming soon.</p>
          </Tabs.Content>

          <Tabs.Content value="fixtures">
            <TeamFixtures fixtures={team.fixtures} />
          </Tabs.Content>

          <Tabs.Content value="results">
            <TeamResults fixtures={team.recentResults} />
          </Tabs.Content>

          <Tabs.Content value="squad">
            <TeamSquad players={team.squad} />
          </Tabs.Content>

          <Tabs.Content value="stats">
            <TeamStats stats={team.stats} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}

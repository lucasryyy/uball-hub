import React, { useState } from "react";

type StatPlayer = {
  id: number;
  name: string;
  team: string;
  teamLogo: string;
  value: number;
};

type StatType = "goals" | "assists" | "cleanSheets" | "cards";

type Props = {
  stats: {
    goals: StatPlayer[];
    assists: StatPlayer[];
    cleanSheets: StatPlayer[];
    cards: StatPlayer[];
  };
};

const tabLabels: Record<StatType, string> = {
  goals: "Top Scorers",
  assists: "Top Assists",
  cleanSheets: "Clean Sheets",
  cards: "Most Cards"
};

export default function LeagueStatsTabs({ stats }: Props) {
  const [activeTab, setActiveTab] = useState<StatType>("goals");

  const data = stats[activeTab];

  // Create array of StatType keys
  const statTypes: StatType[] = ["goals", "assists", "cleanSheets", "cards"];

  return (
    <div className="bg-[#1a1a1a] rounded-xl mt-10 shadow-md">
      {/* Tabs */}
      <div className="flex border-b border-[#2c2c2e]">
        {statTypes.map((statType) => (
          <button
            key={statType}
            onClick={() => setActiveTab(statType)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === statType
                ? "text-white border-b-2 border-green-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tabLabels[statType]}
          </button>
        ))}
      </div>

      {/* List */}
      <ul className="divide-y divide-[#2c2c2e]">
        {data.map((player, idx) => (
          <li key={player.id} className="flex items-center gap-4 px-4 py-3">
            <span className="w-6 text-center text-sm text-gray-400">{idx + 1}.</span>
            <img src={player.teamLogo} alt={player.team} className="w-5 h-5 rounded-full" />
            <span className="flex-1 truncate text-sm">{player.name}</span>
            <span className="text-xs text-gray-400">{player.team}</span>
            <span className="ml-auto font-semibold">{player.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
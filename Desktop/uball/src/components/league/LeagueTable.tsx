import { useState } from "react";

type Team = {
  id: number;
  name: string;
  logo: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDiff: number;
  points: number;
  form: ("W" | "D" | "L")[];
};

type Props = {
  teams: Team[];
};

const getFormColor = (result: "W" | "D" | "L") => {
  switch (result) {
    case "W": return "bg-green-500";
    case "D": return "bg-yellow-400";
    case "L": return "bg-red-500";
  }
};

export default function LeagueTable({ teams }: Props) {
  const [sortKey, setSortKey] = useState<keyof Team>("points");
  const [sortDesc, setSortDesc] = useState(true);

  const sortedTeams = [...teams].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortDesc ? valB - valA : valA - valB;
    }
    return 0;
  });

  const handleSort = (key: keyof Team) => {
    if (key === sortKey) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-md overflow-x-auto">
      <table className="w-full text-sm text-left text-white">
        <thead className="bg-[#2a2a2a] text-xs uppercase text-gray-400">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Team</th>
            <th className="px-2 py-3 cursor-pointer" onClick={() => handleSort("played")}>MP</th>
            <th className="px-2 py-3 cursor-pointer" onClick={() => handleSort("wins")}>W</th>
            <th className="px-2 py-3 cursor-pointer" onClick={() => handleSort("draws")}>D</th>
            <th className="px-2 py-3 cursor-pointer" onClick={() => handleSort("losses")}>L</th>
            <th className="px-2 py-3 cursor-pointer" onClick={() => handleSort("goalDiff")}>GD</th>
            <th className="px-2 py-3 cursor-pointer" onClick={() => handleSort("points")}>PTS</th>
            <th className="px-4 py-3">Form</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team, idx) => (
            <tr key={team.id} className="border-t border-[#2c2c2e]">
              <td className="px-4 py-2 font-semibold">{idx + 1}</td>
              <td className="px-4 py-2 flex items-center gap-2">
                <img src={team.logo} alt={team.name} className="w-5 h-5 rounded-full" />
                <span className="truncate">{team.name}</span>
              </td>
              <td className="px-2 py-2">{team.played}</td>
              <td className="px-2 py-2">{team.wins}</td>
              <td className="px-2 py-2">{team.draws}</td>
              <td className="px-2 py-2">{team.losses}</td>
              <td className="px-2 py-2">{team.goalDiff}</td>
              <td className="px-2 py-2 font-bold">{team.points}</td>
              <td className="px-4 py-2 flex gap-1">
                {team.form.map((result, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full ${getFormColor(result)}`}
                    title={result === "W" ? "Win" : result === "D" ? "Draw" : "Loss"}
                  />
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

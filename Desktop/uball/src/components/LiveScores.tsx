import { groupedMockScores } from "../data/mockScores";
import { useNavigate } from "react-router-dom";

const getStatusBadge = (status: string) => {
  const badgeClass =
    status === "FT"
      ? "bg-gray-700"
      : status === "AFB"
      ? "bg-gray-600"
      : !isNaN(Number(status))
      ? "bg-green-600"
      : "bg-red-600";

  return (
    <span
      className={`text-[11px] text-white px-2 py-0.5 rounded-full font-medium ${badgeClass}`}
    >
      {status}
    </span>
  );
};

export default function LiveScores() {
    const navigate = useNavigate();
  return (
    <div className="bg-[#0e0e0e] min-h-screen text-white flex flex-col items-center">


      {/* Content */}
      <main className="flex-1 w-full flex justify-center px-4 py-6">
        <div className="w-full max-w-lg space-y-6">
          {groupedMockScores.map((group) => (
            <div
              key={group.tournament}
              className="bg-[#1c1c1e] rounded-2xl px-4 pt-4 pb-2 shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-3">
                <span>🏆</span>
                <span>{group.tournament}</span>
              </div>

              {/* Matches */}
              <div className="space-y-2 divide-y divide-[#2c2c2e]">
{group.matches.map((match) => (
<div
  onClick={() => navigate(`/match/${match.id}`)}
  className="cursor-pointer grid grid-cols-[36px_1fr_60px_1fr] items-center py-2 px-3 gap-2 rounded-md hover:bg-[#2a2a2a] transition"
>
    {/* Status */}
    <div className="flex justify-start">
      {getStatusBadge(match.status)}
    </div>

    {/* Home team */}
    <div className="flex items-center justify-end gap-2 truncate">
      <span className="text-sm font-medium truncate">{match.homeTeam}</span>
      <img
        src={match.homeLogo}
        className="w-5 h-5 rounded-full object-cover"
        alt={match.homeTeam}
      />
    </div>

    {/* Score */}
    <div className="text-sm font-bold text-center">
      {match.homeScore} - {match.awayScore}
    </div>

    {/* Away team */}
    <div className="flex items-center justify-start gap-2 truncate">
      <img
        src={match.awayLogo}
        className="w-5 h-5 rounded-full object-cover"
        alt={match.awayTeam}
      />
      <span className="text-sm font-medium truncate">{match.awayTeam}</span>
    </div>
  </div>
))}


              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

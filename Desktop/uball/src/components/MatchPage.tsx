import { useParams, useNavigate } from "react-router-dom";
import { groupedMockScores } from "../data/mockScores";

export default function MatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const matchId = Number(id);

  const match = groupedMockScores
    .flatMap((group) => group.matches)
    .find((m) => m.id === matchId);

  if (!match) {
    return (
      <div className="text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Kamp ikke fundet</h1>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-gray-700 rounded text-white"
        >
          Tilbage
        </button>
      </div>
    );
  }

  return (
    <div className="text-white px-6 py-8 max-w-xl mx-auto space-y-4">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-gray-400 hover:text-white mb-4"
      >
        ← Tilbage
      </button>

<div className="text-center space-y-2">
  <div className="flex justify-center items-center gap-8 text-lg font-bold">
    <div className="flex flex-col items-center gap-1">
      <img src={match.homeLogo} className="w-6 h-6 rounded-full" />
      <span>{match.homeTeam}</span>
    </div>

    <div className="text-2xl font-bold">
      {match.homeScore} - {match.awayScore}
    </div>

    <div className="flex flex-col items-center gap-1">
      <img src={match.awayLogo} className="w-6 h-6 rounded-full" />
      <span>{match.awayTeam}</span>
    </div>
  </div>

  <div className="text-sm text-gray-400">{match.status}</div>
</div>

{/* Målscorere */}
{match.goals && match.goals.length > 0 && (
  <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-2">
    <h2 className="text-md font-semibold mb-2 text-white/90">Målscorere</h2>
    <ul className="text-sm text-white/80 space-y-1">
      {match.goals.map((goal, idx) => (
        <li
          key={idx}
          className={`flex justify-between ${
            goal.team === "home" ? "text-left" : "text-right"
          }`}
        >
          {goal.team === "home" && (
            <>
              <span>⚽ {goal.player}</span>
              <span className="text-gray-400">{goal.minute}'</span>
            </>
          )}
          {goal.team === "away" && (
            <>
              <span className="text-gray-400">{goal.minute}'</span>
              <span>⚽ {goal.player}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  </div>
)}

{/* Begivenheder */}
{match.events && match.events.length > 0 && (
  <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-4 max-w-md mx-auto">
    <h2 className="text-md font-semibold text-white/90">Begivenheder</h2>
    <ul className="space-y-3">
      {match.events.map((ev, idx) => (
        <li key={idx} className="grid grid-cols-[1fr_60px_1fr] items-center text-sm text-white/90">
          {/* Venstre side (away team) */}
          <div className={`${ev.team === "away" ? "text-right" : ""}`}>
            {ev.team === "away" && (
              <div className="space-y-0.5">
                <div className="font-medium flex items-center justify-end gap-2">
                  <div>
                    {ev.player}
                    {ev.score && ` (${ev.score})`}
                  </div>
                  <div>
                    {ev.type === "goal" && <span>⚽</span>}
                    {ev.type === "own goal" && <span className="text-red-500">🅾️</span>}
                    {ev.type === "yellow" && <span className="text-yellow-400">🟨</span>}
                    {ev.type === "red" && <span className="text-red-500">🟥</span>}
                    {ev.type === "sub" && <span className="text-green-400">🔄</span>}
                  </div>
                </div>
                {ev.assist && (
                  <div className="text-xs text-gray-400">oplæg af {ev.assist}</div>
                )}
                {ev.replaced && (
                  <div className="text-xs">
                    <span className="text-red-400">{ev.replaced}</span>
                  </div>
                )}
                {ev.type === "own goal" && (
                  <div className="text-xs text-red-400">Selvmål</div>
                )}
              </div>
            )}
          </div>
          
          {/* Centrum (kun tid) */}
          <div className="text-center">
            <div className="text-gray-400 text-xs">{ev.minute}'</div>
          </div>
          
          {/* Højre side (home team) */}
          <div className={`${ev.team === "home" ? "text-left" : ""}`}>
            {ev.team === "home" && (
              <div className="space-y-0.5">
                <div className="font-medium flex items-center gap-2">
                  <div>
                    {ev.type === "goal" && <span>⚽</span>}
                    {ev.type === "own goal" && <span className="text-red-500">🅾️</span>}
                    {ev.type === "yellow" && <span className="text-yellow-400">🟨</span>}
                    {ev.type === "red" && <span className="text-red-500">🟥</span>}
                    {ev.type === "sub" && <span className="text-green-400">🔄</span>}
                  </div>
                  <div>
                    {ev.player}
                    {ev.score && ` (${ev.score})`}
                  </div>
                </div>
                {ev.assist && (
                  <div className="text-xs text-gray-400">oplæg af {ev.assist}</div>
                )}
                {ev.replaced && (
                  <div className="text-xs">
                    <span className="text-red-400">{ev.replaced}</span>
                  </div>
                )}
                {ev.type === "own goal" && (
                  <div className="text-xs text-red-400">Selvmål</div>
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  </div>
)}
      <div className="bg-[#1c1c1e] p-4 rounded-xl shadow-sm">
        <p className="text-gray-300">Kampdetaljer og statistik kommer her 🔍</p>
      </div>
    </div>
  );
}

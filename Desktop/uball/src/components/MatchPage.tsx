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


      <div className="bg-[#1c1c1e] p-4 rounded-xl shadow-sm">
        <p className="text-gray-300">Kampdetaljer og statistik kommer her 🔍</p>
      </div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { groupedMockScores, type Match } from "../data/mockScores";
import { mockMatchDetails } from "../data/mockMatchDetails";
import MatchEvents from "./MatchEvents";
import PlayerRatings from "./PlayerRatings";

export default function MatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const matchId = Number(id);

  const matches: Match[] = groupedMockScores.flatMap((group) => group.matches);
  const match = matches.find((m) => m.id === matchId);

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

  const details = mockMatchDetails[matchId];

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


      {details ? (
        <div className="bg-[#1c1c1e] p-4 rounded-xl shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Match Events</h2>
            <MatchEvents events={details.events} />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Player Ratings</h2>
            <PlayerRatings home={details.homePlayers} away={details.awayPlayers} />
          </div>
        </div>
      ) : (
        <div className="bg-[#1c1c1e] p-4 rounded-xl text-center rounded-xl">
          <p className="text-sm text-gray-400">Ingen spillerbedømmelser tilgængelige</p>
        </div>
      )}
    </div>
  );
}

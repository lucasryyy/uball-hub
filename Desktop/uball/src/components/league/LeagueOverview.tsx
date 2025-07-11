import { Link } from "react-router-dom";
import { leagues } from "../../data/league";

export default function LeagueOverview() {
  return (
    <div className="max-w-4xl mx-auto text-white px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Leagues</h1>
      <div className="grid grid-cols-2 gap-4">
        {leagues.map((league) => (
          <Link
            key={league.id}
            to={`/league/${league.id}`}
            className="flex items-center gap-4 bg-[#1c1c1e] p-4 rounded-lg shadow hover:bg-[#2a2a2a] transition"
          >
            <img src={league.logoUrl} className="w-10 h-10 rounded-md" alt={league.name} />
            <span className="text-lg font-medium truncate">{league.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

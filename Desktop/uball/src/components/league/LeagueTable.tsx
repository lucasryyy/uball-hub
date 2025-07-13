// LeagueTable.tsx - Updated version with team links

import { Link, useParams } from "react-router-dom";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

type Team = {
  id: string;
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

export default function LeagueTable({ teams }: { teams: Team[] }) {
  const { id: leagueId } = useParams();
  
  return (
    <div className="bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2c2c2e]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">P</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">W</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">D</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">L</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">GD</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Pts</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2c2c2e]">
            {teams.map((team, index) => {
              const position = index + 1;
              const isChampions = position <= 4;
              const isEuropa = position === 5;
              const isConference = position === 6;
              const isRelegation = position >= teams.length - 2;
              
              // Generate team ID from name
              const teamId = team.name.toLowerCase().replace(/\s+/g, '-');
              
              return (
                <tr 
                  key={team.id} 
                  className="hover:bg-[#333333] transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        isChampions ? 'text-blue-400' : 
                        isEuropa ? 'text-orange-400' : 
                        isConference ? 'text-green-400' :
                        isRelegation ? 'text-red-400' : 
                        'text-gray-300'
                      }`}>
                        {position}
                      </span>
                      {position < 10 && (
                        position === 1 ? <TrendingUp className="w-3 h-3 text-green-500" /> :
                        position === teams.length ? <TrendingDown className="w-3 h-3 text-red-500" /> :
                        <Minus className="w-3 h-3 text-gray-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Link 
                      to={`/league/${leagueId}/team/${teamId}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src={team.logo} 
                        alt={team.name} 
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/50?text=${team.name.substring(0, 3)}`;
                        }}
                      />
                      <span className="text-sm font-medium text-white hover:text-green-500 transition-colors">
                        {team.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-300">{team.played}</td>
                  <td className="px-4 py-4 text-center text-sm text-gray-300">{team.wins}</td>
                  <td className="px-4 py-4 text-center text-sm text-gray-300">{team.draws}</td>
                  <td className="px-4 py-4 text-center text-sm text-gray-300">{team.losses}</td>
                  <td className="px-4 py-4 text-center text-sm font-medium">
                    <span className={team.goalDiff > 0 ? 'text-green-400' : team.goalDiff < 0 ? 'text-red-400' : 'text-gray-300'}>
                      {team.goalDiff > 0 ? '+' : ''}{team.goalDiff}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-bold text-white">{team.points}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1 justify-center">
                      {team.form.slice(-5).map((result, i) => (
                        <span
                          key={i}
                          className={`w-6 h-6 rounded text-xs font-medium flex items-center justify-center ${
                            result === "W" ? "bg-green-500 text-white" : 
                            result === "D" ? "bg-yellow-400 text-black" : 
                            "bg-red-500 text-white"
                          }`}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="px-4 py-3 bg-[#1a1a1a] border-t border-[#2c2c2e] flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <span className="text-gray-400">Champions League</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          <span className="text-gray-400">Europa League</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-gray-400">Conference League</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <span className="text-gray-400">Relegation</span>
        </div>
      </div>
    </div>
  );
}
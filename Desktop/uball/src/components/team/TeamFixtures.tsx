// src/components/team/TeamFixtures.tsx
import type { Fixture } from './teamTypes';

interface TeamFixturesProps { fixtures: Fixture[]; }

export default function TeamFixtures({ fixtures }: TeamFixturesProps) {
  if (fixtures.length === 0) return <p className="text-gray-400">No upcoming fixtures.</p>;
  return (
    <ul className="space-y-4">
      {fixtures.map(f => (
        <li key={f.id} className="p-4 bg-[#1f1f1f] rounded-lg flex justify-between">
          <div>
            <p className="text-white font-medium">{f.homeTeam} vs {f.awayTeam}</p>
            <p className="text-gray-500 text-sm">{f.date} • {f.time}</p>
          </div>
          <div className="flex items-center gap-2">
            <img src={f.homeLogo} alt={f.homeTeam} className="w-6 h-6" />
            <span className="text-gray-400">-</span>
            <img src={f.awayLogo} alt={f.awayTeam} className="w-6 h-6" />
          </div>
        </li>
      ))}
    </ul>
  );
}
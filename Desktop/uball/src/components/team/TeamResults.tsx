// src/components/team/TeamResults.tsx
import type { Fixture } from './teamTypes';

interface TeamResultsProps { fixtures: Fixture[]; }

function resultBadge(home: string, away: string, homeScore?: number, awayScore?: number) {
  if (homeScore === undefined || awayScore === undefined) return '';
  if (homeScore > awayScore) return home;
  if (awayScore > homeScore) return away;
  return 'Draw';
}

export default function TeamResults({ fixtures }: TeamResultsProps) {
  if (fixtures.length === 0) return <p className="text-gray-400">No recent results.</p>;
  return (
    <ul className="space-y-4">
      {fixtures.map(f => (
        <li key={f.id} className="p-4 bg-[#1f1f1f] rounded-lg flex justify-between">
          <div>
            <p className="text-white font-medium">{f.homeTeam} {f.homeScore} - {f.awayScore} {f.awayTeam}</p>
            <p className="text-gray-500 text-sm">{f.date}</p>
          </div>
          <span className="text-sm text-blue-400">{resultBadge(f.homeTeam, f.awayTeam, f.homeScore, f.awayScore)}</span>
        </li>
      ))}
    </ul>
  );
}
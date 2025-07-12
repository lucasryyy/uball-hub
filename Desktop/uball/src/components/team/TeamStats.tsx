// src/components/team/TeamStats.tsx
import type { Stat } from './teamTypes';

interface TeamStatsProps { stats: Stat[]; }

export default function TeamStats({ stats }: TeamStatsProps) {
  if (stats.length === 0) return <p className="text-gray-400">Stats unavailable.</p>;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {stats.map(s => (
        <div key={s.key} className="bg-[#1f1f1f] p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm uppercase">{s.key.replace(/([A-Z])/g, ' $1')}</p>
          <p className="text-white font-bold text-2xl">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

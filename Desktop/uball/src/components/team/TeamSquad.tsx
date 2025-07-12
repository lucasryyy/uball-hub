// src/components/team/TeamSquad.tsx
import type { Player } from './teamTypes';

interface TeamSquadProps { players: Player[]; }

export default function TeamSquad({ players }: TeamSquadProps) {
  if (players.length === 0) return <p className="text-gray-400">Squad data unavailable.</p>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {players.map(p => (
        <div key={p.id} className="bg-[#1f1f1f] p-4 rounded-lg text-center">
          <img src={p.photo} alt={p.name} className="w-20 h-20 mx-auto rounded-full mb-2" />
          <p className="text-white font-medium">{p.name}</p>
          <p className="text-gray-400 text-sm">{p.position}</p>
        </div>
      ))}
    </div>
  );
}
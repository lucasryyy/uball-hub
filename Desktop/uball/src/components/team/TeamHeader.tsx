// src/components/team/TeamHeader.tsx
import type { Fixture } from './teamTypes';
import { Clock } from 'lucide-react';

interface TeamHeaderProps {
  name: string;
  logo: string;
  league: string;
  position: number;
  points: number;
  nextFixture?: Fixture;
}

export default function TeamHeader({ name, logo, league, position, points, nextFixture }: TeamHeaderProps) {
  return (
    <div className="bg-[#2a2a2a] p-6 flex items-center justify-between border-b border-[#333]">
      <div className="flex items-center gap-4">
        <img src={logo} alt={name} className="w-16 h-16 rounded-full" />
        <div>
          <h1 className="text-3xl font-bold text-white">{name}</h1>
          <p className="text-gray-400">{league} • Position {position} • {points} pts</p>
        </div>
      </div>
      {nextFixture && (
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-400" />
          <span className="text-green-300 text-sm">
            Next: {nextFixture.homeTeam} vs {nextFixture.awayTeam} @ {nextFixture.date} {nextFixture.time}
          </span>
        </div>
      )}
    </div>
  );
}
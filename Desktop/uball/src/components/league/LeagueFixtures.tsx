import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Fixture = {
  id: number;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
};

type Props = {
  fixtures: Fixture[];
};

export default function LeagueFixtures({ fixtures }: Props) {
  const teams = useMemo(() => {
    const all = fixtures.flatMap((f) => [f.homeTeam, f.awayTeam]);
    return Array.from(new Set(all)).sort();
  }, [fixtures]);

  const [selectedTeam, setSelectedTeam] = useState<string>("All");

  const filteredFixtures = selectedTeam === "All"
    ? fixtures
    : fixtures.filter(
        (f) => f.homeTeam === selectedTeam || f.awayTeam === selectedTeam
      );

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Upcoming Fixtures</h2>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="bg-[#1a1a1a] text-white text-sm px-2 py-1 rounded border border-[#333]"
        >
          <option value="All">All Teams</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>

      <AnimatePresence>
        {filteredFixtures.map((fixture) => (
          <motion.div
            key={fixture.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1a1a1a] rounded-lg px-4 py-3 mb-3 flex items-center shadow"
          >
            <div className="text-sm text-gray-400 w-24">
              {fixture.date} <br />
              <span className="text-white font-medium">{fixture.time}</span>
            </div>

            <div className="flex-1 flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <img src={fixture.homeLogo} className="w-5 h-5" />
                <span>{fixture.homeTeam}</span>
              </div>
              <span className="text-gray-400">vs</span>
              <div className="flex items-center gap-2">
                <img src={fixture.awayLogo} className="w-5 h-5" />
                <span>{fixture.awayTeam}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

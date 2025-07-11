type Stats = {
  goals: number;
  conceded: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
};

export default function TeamStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <StatBox label="Goals" value={stats.goals} />
      <StatBox label="Conceded" value={stats.conceded} />
      <StatBox label="Clean Sheets" value={stats.cleanSheets} />
      <StatBox label="Yellow Cards" value={stats.yellowCards} />
      <StatBox label="Red Cards" value={stats.redCards} />
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg px-4 py-3 shadow text-center">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}

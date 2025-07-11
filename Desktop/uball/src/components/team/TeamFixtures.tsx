type Fixture = {
  id: number;
  date: string;
  time: string;
  opponent: string;
  home: boolean;
  logo: string;
};

export default function TeamFixtures({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <ul className="space-y-3">
      {fixtures.map((f) => (
        <li
          key={f.id}
          className="flex justify-between items-center bg-[#1a1a1a] px-4 py-2 rounded shadow"
        >
          <div className="text-sm text-gray-400">
            {f.date} <br />
            <span className="text-white font-medium">{f.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={f.logo} className="w-5 h-5" />
            <span>
              {f.home ? "vs" : "@"} {f.opponent}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

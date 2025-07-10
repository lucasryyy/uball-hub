type Props = {
  name: string;
  logoUrl?: string;
  seasons: string[];
  selectedSeason: string;
  onChangeSeason: (season: string) => void;
  isFollowing: boolean;
  toggleFollow: () => void;
};

export default function LeagueHeader({
  name,
  logoUrl,
  seasons,
  selectedSeason,
  onChangeSeason,
  isFollowing,
  toggleFollow,
}: Props) {
  return (
    <div className="bg-gradient-to-br from-[#1c1c1e] to-[#121212] rounded-2xl p-4 shadow-md border border-[#2c2c2e] flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {logoUrl && <img src={logoUrl} className="w-10 h-10 rounded-md" alt={name} />}
        <div>
          <h1 className="text-xl font-bold text-white">{name}</h1>
          <p className="text-sm text-gray-400">{selectedSeason}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={selectedSeason}
          onChange={(e) => onChangeSeason(e.target.value)}
          className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm"
        >
          {seasons.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <button
          onClick={toggleFollow}
          className={`text-2xl ${isFollowing ? "text-yellow-400" : "text-gray-500 hover:text-yellow-300"}`}
          title="Følg liga"
        >
          {isFollowing ? "⭐" : "☆"}
        </button>
      </div>
    </div>
  );
}

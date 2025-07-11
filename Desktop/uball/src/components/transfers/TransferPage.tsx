import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Calendar, Search, Filter, ArrowRight, Timer, Trophy, Globe } from "lucide-react";

const TOP_LEAGUES = ["Premier League", "LaLiga", "Serie A", "Bundesliga", "Ligue 1"];

type Transfer = {
  id: number;
  player: string;
  age: number;
  nationality: string;
  position: string;
  fromClub: string;
  toClub: string;
  fee: string;
  transferType: string;
  playerImg: string;
  date: string;
};

export default function TransferPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTop5, setFilterTop5] = useState(false);
  const [tab, setTab] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedTransferType, setSelectedTransferType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

    useEffect(() => {
    fetch("http://localhost:3001/api/transfers")
        .then((res) => res.json())
        .then((data) => {
        setTransfers(data);
        setLoading(false);
        setTimeout(() => setAnimateCards(true), 100);
        })
        .catch((err) => {
        console.error("Failed to fetch transfers:", err);
        setLoading(false);
        });
    }, []);
    
  const filteredTransfers = transfers.filter((t) => {
    const matchesSearch = t.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.fromClub.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.toClub.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLeague = !filterTop5 || TOP_LEAGUES.includes(t.fromClub) || TOP_LEAGUES.includes(t.toClub);
    const matchesPosition = selectedPosition === "all" || t.position.toLowerCase().includes(selectedPosition.toLowerCase());
    const matchesTransferType = selectedTransferType === "all" || t.transferType === selectedTransferType;
    
    return matchesSearch && matchesLeague && matchesPosition && matchesTransferType;
  });

  const sortedTransfers = [...filteredTransfers].sort((a, b) => {
    if (tab === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    const aFee = parseTransferFee(a.fee);
    const bFee = parseTransferFee(b.fee);
    return bFee - aFee;
  });

  function parseTransferFee(fee: string): number {
    if (fee.includes("Loan") || fee.includes("Free")) return 0;
    const match = fee.match(/\d+[\.,]?\d*/);
    if (!match) return 0;
    return parseFloat(match[0].replace(",", ".")) * (fee.includes("m") ? 1_000_000 : 1);
  }

  const formatTransferFee = (fee: string) => {
    if (fee.includes("Free")) return { text: "Free Transfer", color: "text-green-500" };
    if (fee.includes("Loan")) return { text: "Loan Deal", color: "text-yellow-400" };
    return { text: `${fee}`, color: "text-yellow-400" };
  };

  const getTransferTypeIcon = (type: string) => {
    return type === "loan" ? <Timer className="w-4 h-4" /> : <Trophy className="w-4 h-4" />;
  };

  const positions = [...new Set(transfers.map(t => t.position))];

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <div className="bg-[#2a2a2a] border-b border-[#2c2c2e]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Transfer Hub</h1>
                <p className="text-gray-400">Latest football transfers and market movements</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-green-500">€{(sortedTransfers.reduce((sum, t) => sum + parseTransferFee(t.fee), 0) / 1_000_000).toFixed(0)}M</p>
                <p className="text-sm text-gray-400">Total Volume</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search players, clubs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl text-white hover:bg-[#333333] transition-all"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Expandable Filters */}
          <div className={`overflow-hidden transition-all duration-500 ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full p-2 bg-[#1a1a1a] border border-[#2c2c2e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Positions</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Transfer Type</label>
                  <select
                    value={selectedTransferType}
                    onChange={(e) => setSelectedTransferType(e.target.value)}
                    className="w-full p-2 bg-[#1a1a1a] border border-[#2c2c2e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Types</option>
                    <option value="permanent">Permanent</option>
                    <option value="loan">Loan</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={filterTop5}
                      onChange={(e) => setFilterTop5(e.target.checked)}
                      className="w-4 h-4 rounded border-[#2c2c2e] bg-[#1a1a1a] text-green-500 focus:ring-green-500"
                    />
                    Top 5 Leagues Only
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-1 p-1 bg-[#2a2a2a] rounded-xl border border-[#2c2c2e] w-fit">
            <button
              onClick={() => setTab("recent")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                tab === "recent" 
                  ? "bg-green-500 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-[#333333]"
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Most Recent
            </button>
            <button
              onClick={() => setTab("valuable")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                tab === "valuable" 
                  ? "bg-green-500 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-[#333333]"
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Most Valuable
            </button>
          </div>
        </div>

        {/* Transfer Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-green-500 animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" style={{ animationDelay: '0.15s' }}></div>
            </div>
            <span className="ml-4 text-gray-400">Loading transfers...</span>
          </div>
        ) : (
          <div className="grid gap-6">
            {(tab === "recent" ? [...sortedTransfers].reverse() : sortedTransfers).map((transfer, index) => {
              const feeData = formatTransferFee(transfer.fee);
              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6 hover:scale-[1.02] transition-all duration-500 hover:shadow-lg hover:border-green-500/50 ${
                    animateCards ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative flex items-center gap-6">
                    {/* Player Image */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-[#2c2c2e] group-hover:ring-green-500 transition-all">
                        <img
                          src={transfer.playerImg}
                          alt={transfer.player}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        {getTransferTypeIcon(transfer.transferType)}
                      </div>
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white truncate">{transfer.player}</h3>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                          {transfer.age} years
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {transfer.nationality}
                        </div>
                        <div className="px-2 py-1 bg-[#1a1a1a] border border-[#2c2c2e] rounded text-xs">
                          {transfer.position}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {/* Market Value removed */}
                      </div>
                    </div>

                    {/* Transfer Details */}
                    <div className="flex items-center gap-6">
                      <div className="text-center flex items-center justify-center h-full">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">From</div>
                          <div className="font-medium text-red-500">{transfer.fromClub}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-center flex items-center justify-center h-full">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">To</div>
                          <div className="font-medium text-green-500">{transfer.toClub}</div>
                        </div>
                      </div>
                    </div>

                    {/* Fee and Contract */}
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${feeData.color} mb-1`}>
                        {feeData.text}
                      </div>
                      <div className="text-sm text-gray-400">
                        {/* Contract Length removed */}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(transfer.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {sortedTransfers.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-4 bg-[#2a2a2a] rounded-full flex items-center justify-center border border-[#2c2c2e]">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No transfers found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
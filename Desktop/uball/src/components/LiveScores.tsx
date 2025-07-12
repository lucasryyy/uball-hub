import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Clock, Calendar, Filter, Search, TrendingUp, Zap, Star, ChevronRight, Activity, Users, Target, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeLogo: string;
  awayLogo: string;
  status: string;
  competition: string;
  matchTime: string;
  date: string;
};

type GroupedMatches = {
  tournament: string;
  matches: Match[];
};

const getStatusBadge = (status: string) => {
  const isLive = !isNaN(Number(status));
  const badgeClass = status === "FT"
    ? "bg-gray-700"
    : status === "AFB"
    ? "bg-gray-600"
    : isLive
    ? "bg-green-600 animate-pulse"
    : "bg-red-600";

  return (
    <span className={`text-[11px] text-white px-2 py-0.5 rounded-full font-medium ${badgeClass}`}>
      {status}
    </span>
  );
};

const getMatchIntensity = (homeScore: number, awayScore: number) => {
  const totalGoals = homeScore + awayScore;
  if (totalGoals >= 5) return { color: "text-red-500", label: "High Scoring" };
  if (totalGoals >= 3) return { color: "text-yellow-500", label: "Exciting" };
  return { color: "text-gray-500", label: "Tight Match" };
};

export default function LiveScores() {
  const navigate = useNavigate();
  const [groupedMatches, setGroupedMatches] = useState<GroupedMatches[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteMatches, setFavoriteMatches] = useState<number[]>([]);
  const [animateCards, setAnimateCards] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchLiveScores();
    setTimeout(() => setAnimateCards(true), 100);

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLiveScores(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchLiveScores = async (silent = false) => {
    if (!silent) setLoading(true);
    setIsRefreshing(true);

    try {
      const response = await fetch("http://localhost:3001/api/livescores");
      const data = await response.json();
      setGroupedMatches(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to fetch live scores:", error);
      // Use mock data as fallback
      setGroupedMatches(getMockData());
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const getMockData = (): GroupedMatches[] => {
    return [
      {
        tournament: "Premier League",
        matches: [
          {
            id: 1,
            homeTeam: "Arsenal",
            awayTeam: "Chelsea",
            homeScore: 2,
            awayScore: 1,
            homeLogo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
            awayLogo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
            status: "73",
            competition: "Premier League",
            matchTime: new Date().toISOString(),
            date: new Date().toISOString()
          }
        ]
      }
    ];
  };

  // Calculate statistics
  const allMatches = groupedMatches.flatMap(group => group.matches);
  const liveMatches = allMatches.filter(m => !isNaN(Number(m.status)));
  const finishedMatches = allMatches.filter(m => m.status === "FT");
  const totalGoals = allMatches.reduce((sum, m) => sum + m.homeScore + m.awayScore, 0);

  const filteredGroups = groupedMatches.map(group => ({
    ...group,
    matches: group.matches.filter(match => {
      const matchesSearch = searchTerm === "" || 
        match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.tournament.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        selectedFilter === "all" ||
        (selectedFilter === "live" && !isNaN(Number(match.status))) ||
        (selectedFilter === "finished" && match.status === "FT") ||
        (selectedFilter === "favorites" && favoriteMatches.includes(match.id));
      
      return matchesSearch && matchesFilter;
    })
  })).filter(group => group.matches.length > 0);

  const toggleFavorite = (matchId: number) => {
    setFavoriteMatches(prev => 
      prev.includes(matchId) 
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId]
    );
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white">
      {/* Header */}
      <div className="bg-[#2a2a2a] border-b border-[#2c2c2e]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Live Scores</h1>
                <p className="text-gray-400">Real-time match updates</p>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-2xl font-bold text-green-500">{liveMatches.length}</p>
                </div>
                <p className="text-sm text-gray-400">Live Now</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">{allMatches.length}</p>
                <p className="text-sm text-gray-400">Total Matches</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-500">{totalGoals}</p>
                <p className="text-sm text-gray-400">Goals Today</p>
              </div>
              <button
                onClick={() => fetchLiveScores()}
                className={`p-2 rounded-full bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-all ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
                title="Refresh scores"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-4 hover:scale-105 transition-all duration-500 ${
              animateCards ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0ms' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Goals/Match</p>
                <p className="text-2xl font-bold text-white">
                  {allMatches.length > 0 ? (totalGoals / allMatches.length).toFixed(1) : "0"}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div 
            className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-4 hover:scale-105 transition-all duration-500 ${
              animateCards ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '100ms' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Competitions</p>
                <p className="text-2xl font-bold text-white">{groupedMatches.length}</p>
              </div>
              <Trophy className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div 
            className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-4 hover:scale-105 transition-all duration-500 ${
              animateCards ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white">{finishedMatches.length}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div 
            className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-4 hover:scale-105 transition-all duration-500 ${
              animateCards ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '300ms' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Top Match</p>
                <p className="text-sm font-bold text-white">5+ Goals</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search teams or competitions..."
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

          {/* Filter Pills */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2"
              >
                {["all", "live", "finished", "favorites"].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedFilter === filter
                        ? "bg-green-500 text-white"
                        : "bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#333333]"
                    }`}
                  >
                    {filter === "all" && "All Matches"}
                    {filter === "live" && "🔴 Live Only"}
                    {filter === "finished" && "Finished"}
                    {filter === "favorites" && "⭐ Favorites"}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-green-500 animate-spin"></div>
            </div>
            <span className="ml-4 text-gray-400">Loading live scores...</span>
          </div>
        ) : (
          /* Match Groups */
          <div className="space-y-6">
            {filteredGroups.map((group, groupIndex) => (
              <motion.div
                key={group.tournament}
                className={`bg-[#2a2a2a] rounded-2xl border border-[#2c2c2e] overflow-hidden hover:border-green-500/50 transition-all duration-500 ${
                  animateCards ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${(groupIndex + 4) * 100}ms` }}
              >
                {/* Tournament Header */}
                <div className="bg-gradient-to-r from-[#333333] to-[#2a2a2a] px-6 py-4 border-b border-[#2c2c2e]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <h2 className="text-lg font-bold text-white">{group.tournament}</h2>
                      <span className="text-xs text-gray-400 bg-[#1a1a1a] px-2 py-1 rounded-full">
                        {group.matches.length} matches
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Matches */}
                <div className="divide-y divide-[#2c2c2e]">
                  {group.matches.map((match, matchIndex) => {
                    const intensity = getMatchIntensity(match.homeScore, match.awayScore);
                    const isFavorite = favoriteMatches.includes(match.id);
                    const isLive = !isNaN(Number(match.status));

                    return (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: matchIndex * 0.05 }}
                        className="relative group"
                      >
                        <div
                          onClick={() => navigate(`/match/${match.id}`)}
                          className="cursor-pointer px-6 py-4 hover:bg-[#333333] transition-all"
                        >
                          <div className="flex items-center justify-between">
                            {/* Match Status and Time */}
                            <div className="flex items-center gap-4 w-24">
                              {getStatusBadge(match.status)}
                              {isLive && (
                                <TrendingUp className={`w-4 h-4 ${intensity.color}`} />
                              )}
                            </div>

                            {/* Teams and Score */}
                            <div className="flex-1 flex items-center justify-center gap-8">
                              {/* Home Team */}
                              <div className="flex items-center gap-3 flex-1 justify-end">
                                <span className="text-sm font-medium text-white truncate">
                                  {match.homeTeam}
                                </span>
                                <img
                                  src={match.homeLogo}
                                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#2c2c2e]"
                                  alt={match.homeTeam}
                                  onError={(e) => {
                                    e.currentTarget.src = `https://via.placeholder.com/50?text=${match.homeTeam.substring(0, 3)}`;
                                  }}
                                />
                              </div>

                              {/* Score */}
                              <div className="flex items-center gap-4 px-6 py-2 bg-[#1a1a1a] rounded-xl">
                                <span className={`text-2xl font-bold ${match.homeScore > match.awayScore ? 'text-green-500' : 'text-white'}`}>
                                  {match.homeScore}
                                </span>
                                <span className="text-gray-500">-</span>
                                <span className={`text-2xl font-bold ${match.awayScore > match.homeScore ? 'text-green-500' : 'text-white'}`}>
                                  {match.awayScore}
                                </span>
                              </div>

                              {/* Away Team */}
                              <div className="flex items-center gap-3 flex-1">
                                <img
                                  src={match.awayLogo}
                                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#2c2c2e]"
                                  alt={match.awayTeam}
                                  onError={(e) => {
                                    e.currentTarget.src = `https://via.placeholder.com/50?text=${match.awayTeam.substring(0, 3)}`;
                                  }}
                                />
                                <span className="text-sm font-medium text-white truncate">
                                  {match.awayTeam}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(match.id);
                                }}
                                className={`p-2 rounded-full transition-all ${
                                  isFavorite 
                                    ? 'text-yellow-400 hover:text-yellow-300' 
                                    : 'text-gray-500 hover:text-yellow-400'
                                }`}
                              >
                                <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>

                          {/* Match Intensity Indicator */}
                          {isLive && (
                            <div className="mt-2 text-xs text-gray-400 flex items-center gap-2">
                              <span className={`${intensity.color} font-medium`}>{intensity.label}</span>
                              <span>•</span>
                              <span>{match.homeScore + match.awayScore} goals</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredGroups.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-4 bg-[#2a2a2a] rounded-full flex items-center justify-center border border-[#2c2c2e]">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No matches found</h3>
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
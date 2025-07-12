import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Filter, Trophy, TrendingUp, Star, Calendar, Users, Globe } from "lucide-react";

const LEAGUE_TIERS: Record<string, string[]> = {
  "Top 5": ["premier-league", "la-liga", "serie-a", "bundesliga", "ligue-1"],
  "European": ["eredivisie", "primeira-liga", "belgian-pro-league"],
  "International": ["champions-league", "europa-league", "world-cup"]
};

const getLeagueName = (leagueId: string): string => {
  const names: Record<string, string> = {
    "premier-league": "Premier League",
    "la-liga": "La Liga",
    "serie-a": "Serie A",
    "bundesliga": "Bundesliga",
    "ligue-1": "Ligue 1"
  };
  return names[leagueId] || leagueId;
};

const getLeagueCountry = (leagueId: string): string => {
  const countries: Record<string, string> = {
    "premier-league": "England",
    "la-liga": "Spain",
    "serie-a": "Italy",
    "bundesliga": "Germany",
    "ligue-1": "France"
  };
  return countries[leagueId] || "Unknown";
};

const getLeagueLogo = (leagueId: string): string => {
  const logos: Record<string, string> = {
    "premier-league": "https://via.placeholder.com/50?text=PL",
    "la-liga": "https://via.placeholder.com/50?text=LL",
    "serie-a": "https://via.placeholder.com/50?text=SA",
    "bundesliga": "https://via.placeholder.com/50?text=BL",
    "ligue-1": "https://via.placeholder.com/50?text=L1"
  };
  return logos[leagueId] || "https://via.placeholder.com/50?text=??";
};

export default function LeagueOverview() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [followedLeagues, setFollowedLeagues] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => setAnimateCards(true), 100);
  }, []);

  useEffect(() => {
    async function fetchLeagues() {
      try {
        const res = await fetch("http://localhost:3001/api/leagues");
        const data = await res.json();
        
        // Transform the data from object to array of league objects
        const leagueArray = Object.entries(data).map(([leagueId, teams]) => ({
          id: leagueId,
          name: getLeagueName(leagueId),
          country: getLeagueCountry(leagueId),
          logoUrl: getLeagueLogo(leagueId),
          teams: teams,
          seasons: ["2023-24"] // Default current season
        }));
        
        setLeagues(leagueArray);
      } catch (err) {
        console.error("Failed to fetch leagues", err);
        setLeagues([]);
      }
    }
    fetchLeagues();
  }, []);

  const filteredLeagues = leagues.filter((league) => {
    const matchesSearch = league.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === "all" || 
      (selectedTier === "Top 5" && LEAGUE_TIERS["Top 5"].includes(league.id)) ||
      (selectedTier === "European" && LEAGUE_TIERS["European"].includes(league.id)) ||
      (selectedTier === "International" && LEAGUE_TIERS["International"].includes(league.id));
    const matchesCountry = selectedCountry === "all" || league.country === selectedCountry;
    
    return matchesSearch && matchesTier && matchesCountry;
  });

  const countries = [...new Set(leagues.map(l => l.country))].filter(Boolean);
  const totalTeams = leagues.reduce((sum, league) => sum + (league.teams?.length || 0), 0);

  const toggleFollow = (leagueId: string) => {
    setFollowedLeagues(prev => 
      prev.includes(leagueId) 
        ? prev.filter(id => id !== leagueId)
        : [...prev, leagueId]
    );
  };

  const getLeagueStats = (league: any) => {
    const teams = league.teams || [];
    const totalGoals = teams.reduce((sum: number, team: any) => sum + (team.goalsFor || 0), 0);
    const totalMatches = teams.reduce((sum: number, team: any) => sum + (team.played || 0), 0);
    
    return {
      teams: teams.length,
      totalGoals,
      avgGoalsPerMatch: totalMatches > 0 ? (totalGoals / totalMatches).toFixed(1) : "0.0"
    };
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <div className="bg-[#2a2a2a] border-b border-[#2c2c2e]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Football Leagues</h1>
                <p className="text-gray-400">Discover leagues from around the world</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-2xl font-bold text-green-500">{leagues.length}</p>
                <p className="text-sm text-gray-400">Total Leagues</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-500">{totalTeams}</p>
                <p className="text-sm text-gray-400">Total Teams</p>
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
                placeholder="Search leagues..."
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">League Tier</label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full p-2 bg-[#1a1a1a] border border-[#2c2c2e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Tiers</option>
                    <option value="Top 5">Top 5 Leagues</option>
                    <option value="European">European Leagues</option>
                    <option value="International">International</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full p-2 bg-[#1a1a1a] border border-[#2c2c2e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* League Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeagues.map((league, index) => {
            const stats = getLeagueStats(league);
            const isFollowed = followedLeagues.includes(league.id);
            
            return (
              <div
                key={league.id}
                className={`group relative overflow-hidden bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl hover:scale-[1.02] transition-all duration-500 hover:shadow-lg hover:border-green-500/50 ${
                  animateCards ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-[#2c2c2e] group-hover:ring-green-500 transition-all">
                        <img 
                          src={league.logoUrl} 
                          alt={league.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-green-500 transition-colors">
                          {league.name}
                        </h3>
                        {league.country && (
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Globe className="w-3 h-3" />
                            {league.country}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFollow(league.id);
                      }}
                      className={`p-2 rounded-full transition-all ${
                        isFollowed 
                          ? 'text-yellow-400 hover:text-yellow-300' 
                          : 'text-gray-500 hover:text-yellow-400'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${isFollowed ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-full mx-auto mb-1">
                        <Users className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="text-lg font-bold text-white">{stats.teams}</div>
                      <div className="text-xs text-gray-400">Teams</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full mx-auto mb-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="text-lg font-bold text-white">{stats.totalGoals}</div>
                      <div className="text-xs text-gray-400">Goals</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-full mx-auto mb-1">
                        <Calendar className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="text-lg font-bold text-white">{stats.avgGoalsPerMatch}</div>
                      <div className="text-xs text-gray-400">Avg/Match</div>
                    </div>
                  </div>

                  {/* Seasons */}
                  {league.seasons && league.seasons.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-400 mb-2">Current Season:</div>
                      <div className="px-3 py-1 bg-[#1a1a1a] border border-[#2c2c2e] rounded-full text-sm text-white w-fit">
                        {league.seasons[0]}
                      </div>
                    </div>
                  )}

                  {/* View League Button */}
                  <Link
                    to={`/league/${league.id}`}
                    className="block w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white text-center rounded-xl font-medium transition-all group-hover:scale-105"
                  >
                    View League
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLeagues.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-4 bg-[#2a2a2a] rounded-full flex items-center justify-center border border-[#2c2c2e]">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No leagues found</h3>
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
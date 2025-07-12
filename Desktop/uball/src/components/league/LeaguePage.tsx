import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import LeagueHeader from "./LeagueHeader";
import LeagueTable from "./LeagueTable";
import LeagueFixtures from "./LeagueFixtures";
import LeagueStatsTabs from "./LeagueStatsTabs";
import { Trophy, TrendingUp, Calendar, Users, Target, Award, Activity, Clock, Filter, Search, RefreshCw } from "lucide-react";

type TeamData = {
  position: number;
  teamName: string;
  teamLogo: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: string;
};

type TransformedTeam = {
  id: string;
  name: string;
  logo: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDiff: number;
  points: number;
  form: ("W" | "D" | "L")[];
};

type LeagueInfo = {
  id: string;
  name: string;
  logoUrl: string;
  country?: string;
  seasons: string[];
};

const leagueInfo: Record<string, LeagueInfo> = {
  "premier-league": {
    id: "premier-league",
    name: "Premier League",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
    country: "England",
    seasons: ["2024/25", "2023/24", "2022/23"]
  },
  "la-liga": {
    id: "la-liga", 
    name: "La Liga",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_logo_2023.svg",
    country: "Spain",
    seasons: ["2024/25", "2023/24", "2022/23"]
  },
  "serie-a": {
    id: "serie-a",
    name: "Serie A",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/e1/Serie_A_logo_%282019%29.svg",
    country: "Italy",
    seasons: ["2024/25", "2023/24", "2022/23"]
  },
  "bundesliga": {
    id: "bundesliga",
    name: "Bundesliga",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg",
    country: "Germany",
    seasons: ["2024/25", "2023/24", "2022/23"]
  },
  "ligue-1": {
    id: "ligue-1",
    name: "Ligue 1",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/b/ba/Ligue_1_Uber_Eats.svg",
    country: "France",
    seasons: ["2024/25", "2023/24", "2022/23"]
  }
};

export default function LeaguePage() {
  const { id } = useParams();
  const [season, setSeason] = useState("2024/25");
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [animateCards, setAnimateCards] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRound, setSelectedRound] = useState("all");
  const [teams, setTeams] = useState<TransformedTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const league = id ? leagueInfo[id] : null;

  useEffect(() => {
    if (id) {
      fetchLeagueData();
      fetchFixtures();
    }
    setTimeout(() => setAnimateCards(true), 100);
  }, [id]);

  const fetchLeagueData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/league/${id}`);
      const data = await response.json();
      
      // Transform data to match component expectations
      const transformedTeams = data.map((team: TeamData) => ({
        id: team.teamName.toLowerCase().replace(/\s+/g, '-'),
        name: team.teamName,
        logo: team.teamLogo,
        played: team.played,
        wins: team.wins,
        draws: team.draws,
        losses: team.losses,
        goalDiff: team.goalDiff,
        points: team.points,
        form: team.form.split(',').map(f => f.trim()) as ("W" | "D" | "L")[]
      }));
      
      setTeams(transformedTeams);
    } catch (error) {
      console.error("Failed to fetch league data:", error);
      // Optionally show an error message or empty state here
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFixtures = async () => {
    try {
      // TODO: Implement fixtures endpoint on the server
      // const response = await fetch(`http://localhost:3001/api/fixtures/${id}`);
      // const data = await response.json();
      // setFixtures(data);
      
      // For now, set empty fixtures array
      setFixtures([]);
    } catch (error) {
      console.error("Failed to fetch fixtures:", error);
      setFixtures([]);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchLeagueData(), fetchFixtures()]);
    setIsRefreshing(false);
  };

  if (!league) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-[#2a2a2a] rounded-full flex items-center justify-center border border-[#2c2c2e]">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">League not found</h3>
          <p className="text-gray-500">The requested league could not be found</p>
        </div>
      </div>
    );
  }

  // Calculate league statistics
  const leagueStats = {
    totalGoals: teams.reduce((sum, team) => sum + (team.wins * 3 + team.draws * 2), 0),
    totalMatches: teams.length * (teams[0]?.played || 0),
    avgGoalsPerMatch: teams.length > 0 ? ((teams.reduce((sum, team) => sum + (team.wins * 3 + team.draws * 2), 0)) / (teams.length * (teams[0]?.played || 1))).toFixed(1) : "0",
    totalCards: teams.reduce((sum, team) => sum + (team.wins + team.losses) * 2, 0), // Mock calculation
    cleanSheets: Math.floor(teams.length * 5), // Mock calculation
    topScorer: teams[0] || null
  };

  // Generate stats for the stats tab
  const stats = {
    goals: teams.slice(0, 10).map((team, i) => ({
      id: i,
      name: team.name + " Player",
      team: team.name,
      teamLogo: team.logo,
      value: Math.floor(Math.random() * 20) + 10,
    })),
    assists: teams.slice(0, 10).map((team, i) => ({
      id: i,
      name: team.name + " Player",
      team: team.name,
      teamLogo: team.logo,
      value: Math.floor(Math.random() * 15) + 5,
    })),
    cleanSheets: teams.slice(0, 10).map((team, i) => ({
      id: i,
      name: team.name + " Keeper",
      team: team.name,
      teamLogo: team.logo,
      value: Math.floor(Math.random() * 10) + 1,
    })),
    cards: teams.slice(0, 10).map((team, i) => ({
      id: i,
      name: team.name + " Player",
      team: team.name,
      teamLogo: team.logo,
      value: Math.floor(Math.random() * 8) + 1,
    })),
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Enhanced Header */}
      <div className="bg-[#2a2a2a] border-b border-[#2c2c2e]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <LeagueHeader
              name={league.name}
              logoUrl={league.logoUrl}
              seasons={league.seasons}
              selectedSeason={season}
              onChangeSeason={setSeason}
              isFollowing={following}
              toggleFollow={() => setFollowing(!following)}
            />
            <button
              onClick={refreshData}
              className={`p-2 rounded-full bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-all ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Tabs */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Tabs.List className="flex gap-1 p-1 bg-[#2a2a2a] rounded-xl border border-[#2c2c2e] w-fit">
            <Tabs.Trigger 
              value="overview" 
              className="px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400 hover:text-white hover:bg-[#333333]"
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Overview
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="table" 
              className="px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400 hover:text-white hover:bg-[#333333]"
            >
              <Trophy className="w-4 h-4 inline mr-2" />
              Table
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="stats" 
              className="px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400 hover:text-white hover:bg-[#333333]"
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Statistics
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="fixtures" 
              className="px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400 hover:text-white hover:bg-[#333333]"
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Fixtures
            </Tabs.Trigger>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Content value="overview" className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-green-500 animate-spin"></div>
                </div>
                <span className="ml-4 text-gray-400">Loading league data...</span>
              </div>
            ) : (
              <>
                {/* League Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6 hover:scale-105 transition-all duration-500 ${
                    animateCards ? 'animate-fade-in-up' : 'opacity-0'
                  }`} style={{ animationDelay: '0ms' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{leagueStats.totalGoals}</div>
                        <div className="text-sm text-gray-400">Total Goals</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {leagueStats.avgGoalsPerMatch} per match average
                    </div>
                  </div>

                  <div className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6 hover:scale-105 transition-all duration-500 ${
                    animateCards ? 'animate-fade-in-up' : 'opacity-0'
                  }`} style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{teams.length}</div>
                        <div className="text-sm text-gray-400">Teams</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {leagueStats.totalMatches} matches total
                    </div>
                  </div>

                  <div className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6 hover:scale-105 transition-all duration-500 ${
                    animateCards ? 'animate-fade-in-up' : 'opacity-0'
                  }`} style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-purple-500" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{leagueStats.cleanSheets}</div>
                        <div className="text-sm text-gray-400">Clean Sheets</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Defensive records
                    </div>
                  </div>

                  <div className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6 hover:scale-105 transition-all duration-500 ${
                    animateCards ? 'animate-fade-in-up' : 'opacity-0'
                  }`} style={{ animationDelay: '300ms' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{leagueStats.totalCards}</div>
                        <div className="text-sm text-gray-400">Total Cards</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Disciplinary actions
                    </div>
                  </div>
                </div>

                {/* Top Performers Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Team */}
                  <div className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6 ${
                    animateCards ? 'animate-fade-in-up' : 'opacity-0'
                  }`} style={{ animationDelay: '400ms' }}>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-500" />
                      League Leaders
                    </h3>
                    {teams[0] && (
                      <div className="flex items-center gap-4">
                        <img 
                          src={teams[0].logo} 
                          alt={teams[0].name}
                          className="w-12 h-12 rounded-xl"
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/50?text=${teams[0].name.substring(0, 3)}`;
                          }}
                        />
                        <div>
                          <div className="text-xl font-bold text-white">{teams[0].name}</div>
                          <div className="text-sm text-gray-400">{teams[0].points} points</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Best Goal Difference */}
                  <div className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6 ${
                    animateCards ? 'animate-fade-in-up' : 'opacity-0'
                  }`} style={{ animationDelay: '500ms' }}>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-500" />
                      Best Goal Difference
                    </h3>
                    {teams.length > 0 && (
                      <div className="flex items-center gap-4">
                        <img 
                          src={teams.reduce((prev, current) => 
                            prev.goalDiff > current.goalDiff ? prev : current
                          ).logo} 
                          alt="Best GD"
                          className="w-12 h-12 rounded-xl"
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/50?text=Team`;
                          }}
                        />
                        <div>
                          <div className="text-xl font-bold text-white">
                            {teams.reduce((prev, current) => 
                              prev.goalDiff > current.goalDiff ? prev : current
                            ).name}
                          </div>
                          <div className="text-sm text-gray-400">
                            +{teams.reduce((prev, current) => 
                              prev.goalDiff > current.goalDiff ? prev : current
                            ).goalDiff} goal difference
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Form */}
                <div className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6 ${
                  animateCards ? 'animate-fade-in-up' : 'opacity-0'
                }`} style={{ animationDelay: '600ms' }}>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    League Form Guide
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.slice(0, 6).map((team, index) => (
                      <div key={team.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                        <div className="text-sm font-medium text-gray-400">#{index + 1}</div>
                        <img 
                          src={team.logo} 
                          alt={team.name} 
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/50?text=${team.name.substring(0, 3)}`;
                          }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{team.name}</div>
                          <div className="text-xs text-gray-400">{team.points} pts</div>
                        </div>
                        <div className="flex gap-1">
                          {team.form.slice(-3).map((result, i) => (
                            <span
                              key={i}
                              className={`w-6 h-6 rounded text-xs font-medium flex items-center justify-center ${
                                result === "W" ? "bg-green-500 text-white" : 
                                result === "D" ? "bg-yellow-400 text-black" : 
                                "bg-red-500 text-white"
                              }`}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Tabs.Content>

          {/* Table Tab */}
          <Tabs.Content value="table">
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl text-white hover:bg-[#333333] transition-all">
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-green-500 animate-spin"></div>
                  </div>
                  <span className="ml-4 text-gray-400">Loading table...</span>
                </div>
              ) : (
                <LeagueTable teams={teams.filter(team => 
                  team.name.toLowerCase().includes(searchTerm.toLowerCase())
                )} />
              )}
            </div>
          </Tabs.Content>

          {/* Stats Tab */}
          <Tabs.Content value="stats">
            <LeagueStatsTabs stats={stats} />
          </Tabs.Content>

          {/* Fixtures Tab */}
          <Tabs.Content value="fixtures">
            <div className="space-y-4">
              {/* Round Filter */}
              <div className="flex items-center gap-4">
                <select
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(e.target.value)}
                  className="px-4 py-2 bg-[#2a2a2a] border border-[#2c2c2e] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Rounds</option>
                  <option value="current">Current Round</option>
                  <option value="next">Next Round</option>
                  <option value="previous">Previous Round</option>
                </select>
              </div>

              <LeagueFixtures fixtures={fixtures} />
            </div>
          </Tabs.Content>
        </Tabs.Root>
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
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { 
  Trophy, Calendar, Users, Activity, TrendingUp, Shield, Home, Plane, 
  ChevronRight, Star, Info, BarChart3, Clock, MapPin, User,
  ArrowUp, ArrowDown, Minus, AlertCircle, Filter, Search
} from "lucide-react";

// Types
type TeamData = {
  id: string;
  name: string;
  logo: string;
  stadium: string;
  capacity: number;
  manager: string;
  founded: number;
  league: string;
  leagueId: string;
  position: number;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  form: string;
};

type Player = {
  id: string;
  name: string;
  number: number;
  position: string;
  age: number;
  nationality: string;
  photo: string;
  marketValue: string;
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
};

type Fixture = {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeScore?: number;
  awayScore?: number;
  competition: string;
  venue: string;
  isHome: boolean;
  status?: string;
};

type TeamStats = {
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
  possession: number;
  passAccuracy: number;
  shotsPerGame: number;
  tacklesPerGame: number;
  yellowCards: number;
  redCards: number;
};

export default function TeamPage() {
  const { teamId, leagueId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [team, setTeam] = useState<TeamData | null>(null);
  const [squad, setSquad] = useState<Player[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (teamId && leagueId) {
      fetchTeamData();
    }
  }, [teamId, leagueId]);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      // Fetch team details from your API
      const response = await fetch(`http://localhost:3001/api/team/${teamId}?league=${leagueId}`);
      if (response.ok) {
        const data = await response.json();
        setTeam(data.team);
        setSquad(data.squad || []);
        setFixtures(data.fixtures || []);
        setStats(data.stats || null);
      } else {
        // Use mock data if API fails
        setMockData();
      }
    } catch (error) {
      console.error("Failed to fetch team data:", error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    // Mock team data
    const mockTeam: TeamData = {
      id: teamId || "chelsea",
      name: "Chelsea",
      logo: "https://resources.premierleague.com/premierleague/badges/t8.svg",
      stadium: "Stamford Bridge",
      capacity: 40341,
      manager: "Mauricio Pochettino",
      founded: 1905,
      league: "Premier League",
      leagueId: leagueId || "premier-league",
      position: 7,
      points: 0,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      form: "WDLWW"
    };

    // Mock squad
    const positions = ['GK', 'DEF', 'MID', 'FWD'];
    const mockSquad: Player[] = Array.from({ length: 25 }, (_, i) => ({
      id: `player-${i}`,
      name: `Player ${i + 1}`,
      number: i + 1,
      position: i < 3 ? 'GK' : i < 10 ? 'DEF' : i < 18 ? 'MID' : 'FWD',
      age: Math.floor(Math.random() * 15) + 18,
      nationality: ['England', 'Brazil', 'France', 'Spain'][Math.floor(Math.random() * 4)],
      photo: `https://via.placeholder.com/150?text=P${i + 1}`,
      marketValue: `€${Math.floor(Math.random() * 50 + 5)}M`,
      appearances: Math.floor(Math.random() * 30),
      goals: Math.floor(Math.random() * 15),
      assists: Math.floor(Math.random() * 10),
      yellowCards: Math.floor(Math.random() * 5),
      redCards: Math.floor(Math.random() * 2)
    }));

    // Mock fixtures
    const teams = ['Arsenal', 'Liverpool', 'Man City', 'Man United', 'Tottenham'];
    const mockFixtures: Fixture[] = Array.from({ length: 10 }, (_, i) => {
      const isHome = Math.random() > 0.5;
      const date = new Date();
      date.setDate(date.getDate() + i * 7);
      
      return {
        id: `fixture-${i}`,
        date: date.toISOString().split('T')[0],
        time: "15:00",
        homeTeam: isHome ? "Chelsea" : teams[i % teams.length],
        awayTeam: isHome ? teams[i % teams.length] : "Chelsea",
        homeLogo: isHome ? mockTeam.logo : `https://via.placeholder.com/50?text=${teams[i % teams.length].substring(0, 3)}`,
        awayLogo: isHome ? `https://via.placeholder.com/50?text=${teams[i % teams.length].substring(0, 3)}` : mockTeam.logo,
        competition: "Premier League",
        venue: isHome ? "Stamford Bridge" : "Away Stadium",
        isHome,
        status: i < 3 ? "FT" : undefined,
        homeScore: i < 3 ? Math.floor(Math.random() * 4) : undefined,
        awayScore: i < 3 ? Math.floor(Math.random() * 4) : undefined
      };
    });

    // Mock stats
    const mockStats: TeamStats = {
      goalsScored: 45,
      goalsConceded: 38,
      cleanSheets: 12,
      possession: 58,
      passAccuracy: 85,
      shotsPerGame: 14.2,
      tacklesPerGame: 18.5,
      yellowCards: 42,
      redCards: 2
    };

    setTeam(mockTeam);
    setSquad(mockSquad);
    setFixtures(mockFixtures);
    setStats(mockStats);
  };

  const filteredSquad = squad.filter(player => {
    const matchesPosition = selectedPosition === "all" || player.position === selectedPosition;
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPosition && matchesSearch;
  });

  const upcomingFixtures = fixtures.filter(f => !f.status);
  const recentResults = fixtures.filter(f => f.status === "FT").slice(0, 5);

  if (loading || !team) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-green-500 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <div className="bg-[#2a2a2a] border-b border-[#2c2c2e]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={team.logo} 
                alt={team.name} 
                className="w-20 h-20 rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/80?text=${team.name.substring(0, 3)}`;
                }}
              />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{team.name}</h1>
                <div className="flex items-center gap-4 text-gray-400">
                  <span>{team.league}</span>
                  <span>•</span>
                  <span>Founded {team.founded}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setFollowing(!following)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                following 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-[#333] text-white hover:bg-[#444]'
              }`}
            >
              <Star className={`w-5 h-5 ${following ? 'fill-current' : ''}`} />
              {following ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Tabs.List className="flex gap-1 p-1 bg-[#2a2a2a] rounded-xl border border-[#2c2c2e] w-fit">
            <Tabs.Trigger 
              value="overview" 
              className="px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400 hover:text-white hover:bg-[#333]"
            >
              Overview
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="matches" 
              className="px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400 hover:text-white hover:bg-[#333]"
            >
              Matches
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="squad" 
              className="px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400 hover:text-white hover:bg-[#333]"
            >
              Squad
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="stats" 
              className="px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400 hover:text-white hover:bg-[#333]"
            >
              Stats
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="info" 
              className="px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-400 hover:text-white hover:bg-[#333]"
            >
              Info
            </Tabs.Trigger>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Content value="overview" className="space-y-6">
            {/* Recent Form */}
            <div className="bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Form</h3>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {team.form.split('').map((result, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                        result === 'W' ? 'bg-green-500' : 
                        result === 'D' ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-400">Win</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-400">Draw</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-400">Loss</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Match */}
            {upcomingFixtures.length > 0 && (
              <div className="bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Next Match</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={upcomingFixtures[0].homeLogo} 
                      alt={upcomingFixtures[0].homeTeam}
                      className="w-12 h-12 rounded-lg"
                    />
                    <div>
                      <p className="text-white font-medium">{upcomingFixtures[0].homeTeam}</p>
                      <p className="text-gray-400 text-sm">Home</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">{upcomingFixtures[0].date}</p>
                    <p className="text-2xl font-bold text-white">{upcomingFixtures[0].time}</p>
                    <p className="text-gray-400 text-sm">{upcomingFixtures[0].competition}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white font-medium">{upcomingFixtures[0].awayTeam}</p>
                      <p className="text-gray-400 text-sm">Away</p>
                    </div>
                    <img 
                      src={upcomingFixtures[0].awayLogo} 
                      alt={upcomingFixtures[0].awayTeam}
                      className="w-12 h-12 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* League Position */}
            <div className="bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">League Position</h3>
                <Link 
                  to={`/league/${team.leagueId}`}
                  className="text-green-500 hover:text-green-400 text-sm flex items-center gap-1"
                >
                  View Full Table
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1a1a1a] rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-white">{team.position}</p>
                  <p className="text-gray-400 text-sm">Position</p>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-white">{team.points}</p>
                  <p className="text-gray-400 text-sm">Points</p>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-white">{team.played}</p>
                  <p className="text-gray-400 text-sm">Played</p>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-white">
                    {team.goalsFor - team.goalsAgainst > 0 ? '+' : ''}{team.goalsFor - team.goalsAgainst}
                  </p>
                  <p className="text-gray-400 text-sm">Goal Diff</p>
                </div>
              </div>
            </div>

            {/* Recent Results */}
            {recentResults.length > 0 && (
              <div className="bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Results</h3>
                <div className="space-y-3">
                  {recentResults.map(fixture => {
                    const isHome = fixture.homeTeam === team.name;
                    const teamScore = isHome ? fixture.homeScore : fixture.awayScore;
                    const oppScore = isHome ? fixture.awayScore : fixture.homeScore;
                    const result = teamScore! > oppScore! ? 'W' : teamScore! < oppScore! ? 'L' : 'D';
                    
                    return (
                      <div key={fixture.id} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-white ${
                            result === 'W' ? 'bg-green-500' : 
                            result === 'D' ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}>
                            {result}
                          </div>
                          <div>
                            <p className="text-white">
                              {fixture.homeTeam} {fixture.homeScore} - {fixture.awayScore} {fixture.awayTeam}
                            </p>
                            <p className="text-gray-400 text-sm">{fixture.competition}</p>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">{fixture.date}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Tabs.Content>

          {/* Matches Tab */}
          <Tabs.Content value="matches" className="space-y-6">
            <div className="bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">All Fixtures & Results</h3>
              <div className="space-y-3">
                {fixtures.map(fixture => {
                  const isHome = fixture.homeTeam === team.name;
                  
                  return (
                    <div key={fixture.id} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#333] transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          {isHome ? <Home className="w-4 h-4 text-green-500" /> : <Plane className="w-4 h-4 text-blue-500" />}
                          <span className="text-gray-400 text-sm">{isHome ? 'H' : 'A'}</span>
                        </div>
                        <img 
                          src={isHome ? fixture.awayLogo : fixture.homeLogo} 
                          alt="opponent"
                          className="w-8 h-8 rounded"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {isHome ? fixture.awayTeam : `${fixture.homeTeam} (A)`}
                          </p>
                          <p className="text-gray-400 text-sm">{fixture.competition}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {fixture.status === 'FT' ? (
                          <p className="text-xl font-bold text-white">
                            {fixture.homeScore} - {fixture.awayScore}
                          </p>
                        ) : (
                          <>
                            <p className="text-white">{fixture.time}</p>
                            <p className="text-gray-400 text-sm">{fixture.date}</p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Tabs.Content>

          {/* Squad Tab */}
          <Tabs.Content value="squad" className="space-y-6">
            <div className="bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Positions</option>
                  <option value="GK">Goalkeepers</option>
                  <option value="DEF">Defenders</option>
                  <option value="MID">Midfielders</option>
                  <option value="FWD">Forwards</option>
                </select>
              </div>

              {/* Players Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSquad.map(player => (
                  <div key={player.id} className="bg-[#1a1a1a] rounded-lg p-4 hover:bg-[#333] transition-colors">
                    <div className="flex items-center gap-4">
                      <img 
                        src={player.photo} 
                        alt={player.name}
                        className="w-16 h-16 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/64?text=${player.number}`;
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-400">#{player.number}</span>
                          <div>
                            <p className="text-white font-medium">{player.name}</p>
                            <p className="text-gray-400 text-sm">{player.position} • {player.nationality}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-white">{player.appearances}</p>
                        <p className="text-xs text-gray-400">Apps</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-white">{player.goals}</p>
                        <p className="text-xs text-gray-400">Goals</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-white">{player.assists}</p>
                        <p className="text-xs text-gray-400">Assists</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tabs.Content>

          {/* Stats Tab */}
          <Tabs.Content value="stats" className="space-y-6">
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Attack
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Goals Scored</span>
                      <span className="text-xl font-bold text-white">{stats.goalsScored}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Shots per Game</span>
                      <span className="text-xl font-bold text-white">{stats.shotsPerGame}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Possession %</span>
                      <span className="text-xl font-bold text-white">{stats.possession}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Pass Accuracy %</span>
                      <span className="text-xl font-bold text-white">{stats.passAccuracy}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Defense
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Goals Conceded</span>
                      <span className="text-xl font-bold text-white">{stats.goalsConceded}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Clean Sheets</span>
                      <span className="text-xl font-bold text-white">{stats.cleanSheets}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Tackles per Game</span>
                      <span className="text-xl font-bold text-white">{stats.tacklesPerGame}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Yellow Cards</span>
                      <span className="text-xl font-bold text-yellow-500">{stats.yellowCards}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Tabs.Content>

          {/* Info Tab */}
          <Tabs.Content value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Club Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Founded</span>
                    <span className="text-white font-medium">{team.founded}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Manager</span>
                    <span className="text-white font-medium">{team.manager}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Stadium</span>
                    <span className="text-white font-medium">{team.stadium}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Capacity</span>
                    <span className="text-white font-medium">{team.capacity.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Trophies
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">League Titles</span>
                    <span className="text-white font-medium">6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">FA Cups</span>
                    <span className="text-white font-medium">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Champions League</span>
                    <span className="text-white font-medium">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Europa League</span>
                    <span className="text-white font-medium">2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stadium Image */}
            <div className="bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" />
                {team.stadium}
              </h3>
              <div className="aspect-video bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Stadium image</p>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
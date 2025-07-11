import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import LeagueHeader from "./LeagueHeader";
import LeagueTable from "./LeagueTable";
import LeagueFixtures from "./LeagueFixtures";
import LeagueStatsTabs from "./LeagueStatsTabs";
import { leagues } from "../../data/league";
import { Trophy, TrendingUp, Calendar, Users, Target, Award, Activity, Clock, Star, ChevronRight, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function LeaguePage() {
  const { id } = useParams();
  const [season, setSeason] = useState("2024/25");
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [animateCards, setAnimateCards] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRound, setSelectedRound] = useState("all");

  const league = leagues.find(l => l.id === id);

  useEffect(() => {
    setTimeout(() => setAnimateCards(true), 100);
  }, []);

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

  const teams = league.teams.map(team => ({
    id: team.id,
    name: team.name,
    logo: team.logo,
    played: 26,
    wins: 18,
    draws: 5,
    losses: 3,
    goalDiff: team.stats.goals - team.stats.conceded,
    points: 59,
    form: ["W", "D", "W", "L", "W"]
  }));

  const fixtures = league.teams.flatMap(team => team.fixtures || []);

  const stats = {
    goals: league.teams.map((team, i) => ({
      id: i,
      name: team.name + " Player",
      team: team.name,
      teamLogo: team.logo,
      value: team.stats.goals,
    })),
    assists: league.teams.map((team, i) => ({
      id: i,
      name: team.name + " Player",
      team: team.name,
      teamLogo: team.logo,
      value: Math.floor(team.stats.goals / 2),
    })),
    cleanSheets: league.teams.map((team, i) => ({
      id: i,
      name: team.name + " Player",
      team: team.name,
      teamLogo: team.logo,
      value: team.stats.cleanSheets,
    })),
    cards: league.teams.map((team, i) => ({
      id: i,
      name: team.name + " Player",
      team: team.name,
      teamLogo: team.logo,
      value: team.stats.yellowCards + team.stats.redCards,
    })),
  };

  // Calculate league statistics
  const leagueStats = {
    totalGoals: league.teams.reduce((sum, team) => sum + team.stats.goals, 0),
    totalMatches: teams.length * 2,
    avgGoalsPerMatch: ((league.teams.reduce((sum, team) => sum + team.stats.goals, 0)) / (teams.length * 2)).toFixed(1),
    totalCards: league.teams.reduce((sum, team) => sum + team.stats.yellowCards + team.stats.redCards, 0),
    cleanSheets: league.teams.reduce((sum, team) => sum + team.stats.cleanSheets, 0),
    topScorer: league.teams.reduce((prev, current) => 
      prev.stats.goals > current.stats.goals ? prev : current
    )
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Enhanced Header */}
      <div className="bg-[#2a2a2a] border-b border-[#2c2c2e]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <LeagueHeader
            name={league.name}
            logoUrl={league.logoUrl}
            seasons={league.seasons}
            selectedSeason={season}
            onChangeSeason={setSeason}
            isFollowing={following}
            toggleFollow={() => setFollowing(!following)}
          />
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
              {/* Top Scoring Team */}
              <div className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6 ${
                animateCards ? 'animate-fade-in-up' : 'opacity-0'
              }`} style={{ animationDelay: '400ms' }}>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Top Scoring Team
                </h3>
                <div className="flex items-center gap-4">
                  <img 
                    src={leagueStats.topScorer.logo} 
                    alt={leagueStats.topScorer.name}
                    className="w-12 h-12 rounded-xl"
                  />
                  <div>
                    <div className="text-xl font-bold text-white">{leagueStats.topScorer.name}</div>
                    <div className="text-sm text-gray-400">{leagueStats.topScorer.stats.goals} goals scored</div>
                  </div>
                </div>
              </div>

              {/* Best Defense */}
              <div className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6 ${
                animateCards ? 'animate-fade-in-up' : 'opacity-0'
              }`} style={{ animationDelay: '500ms' }}>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  Best Defense
                </h3>
                <div className="flex items-center gap-4">
                  <img 
                    src={league.teams.reduce((prev, current) => 
                      prev.stats.conceded < current.stats.conceded ? prev : current
                    ).logo} 
                    alt="Best Defense"
                    className="w-12 h-12 rounded-xl"
                  />
                  <div>
                    <div className="text-xl font-bold text-white">
                      {league.teams.reduce((prev, current) => 
                        prev.stats.conceded < current.stats.conceded ? prev : current
                      ).name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {league.teams.reduce((prev, current) => 
                        prev.stats.conceded < current.stats.conceded ? prev : current
                      ).stats.conceded} goals conceded
                    </div>
                  </div>
                </div>
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
                    <img src={team.logo} alt={team.name} className="w-8 h-8 rounded-full" />
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

            {/* Top Players Preview */}
            <div className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6 ${
              animateCards ? 'animate-fade-in-up' : 'opacity-0'
            }`} style={{ animationDelay: '700ms' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Top Players
                </h3>
                <button
                  onClick={() => setActiveTab("stats")}
                  className="text-sm text-green-500 hover:text-green-400 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Top Scorer */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-2">Top Scorer</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">Player Name</div>
                      <div className="text-xs text-gray-400">15 goals</div>
                    </div>
                  </div>
                </div>

                {/* Top Assists */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-2">Top Assists</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">Player Name</div>
                      <div className="text-xs text-gray-400">12 assists</div>
                    </div>
                  </div>
                </div>

                {/* Most Clean Sheets */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-2">Clean Sheets</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">Goalkeeper Name</div>
                      <div className="text-xs text-gray-400">8 clean sheets</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Matches */}
            <div className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-6 ${
              animateCards ? 'animate-fade-in-up' : 'opacity-0'
            }`} style={{ animationDelay: '800ms' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  Recent Matches
                </h3>
                <button
                  onClick={() => setActiveTab("fixtures")}
                  className="text-sm text-green-500 hover:text-green-400 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {fixtures.slice(0, 3).map((fixture, index) => (
                  <div key={fixture.id} className="bg-[#1a1a1a] rounded-lg p-4 flex items-center justify-between hover:bg-[#252525] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-400 w-20">
                        {fixture.date}
                        <div className="text-xs">{fixture.time}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={fixture.logo} className="w-6 h-6" alt="" />
                        <span className="text-sm font-medium text-white">{fixture.opponent}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {fixture.home ? "Home" : "Away"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

              <LeagueTable teams={teams.filter(team => 
                team.name.toLowerCase().includes(searchTerm.toLowerCase())
              )} />
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
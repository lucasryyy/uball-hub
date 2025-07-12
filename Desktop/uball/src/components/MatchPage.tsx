import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, TrendingUp, Eye, EyeOff, Activity, Users, Target, Award, Clock, Calendar, ChevronLeft, Share2, Bell, BellOff, MessageCircle, BarChart3, Shield, Zap } from "lucide-react";
import PlayerRatings from "./PlayerRatings";
import MatchTimeline from "./MatchTimeline";
import MatchStatistics from "./MatchStatistics";

export default function MatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const matchId = Number(id);
  const [activeTab, setActiveTab] = useState("overview");
  const [hideScore, setHideScore] = useState(false);
  const [userRatings, setUserRatings] = useState<{[key: string]: number}>({});
  const [fanPoll, setFanPoll] = useState<number | null>(null);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [animateCards, setAnimateCards] = useState(false);
  const [following, setFollowing] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const matches: Match[] = groupedMockScores.flatMap((group) => group.matches);
  const match = matches.find((m) => m.id === matchId);

  useEffect(() => {
    setTimeout(() => setAnimateCards(true), 100);
  }, []);

  if (!match) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-[#2a2a2a] rounded-full flex items-center justify-center border border-[#2c2c2e]">
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Match not found</h3>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-all"
          >
            Back to Live Scores
          </button>
        </div>
      </div>
    );
  }

  const details = mockMatchDetails[matchId];
  const isLive = !isNaN(Number(match.status));

  // Mock fan poll data
  const currentPoll = {
    question: "Who's playing better in this half?",
    options: [match.homeTeam, match.awayTeam, "Equal"],
    votes: [156, 234, 89],
    userVoted: fanPoll
  };

  // Calculate match statistics
  const matchStats = details?.statistics ? {
    totalShots: details.statistics.shots.home + details.statistics.shots.away,
    totalFouls: details.statistics.fouls.home + details.statistics.fouls.away,
    totalCards: details.statistics.yellowCards.home + details.statistics.yellowCards.away + 
                 details.statistics.redCards.home + details.statistics.redCards.away,
    dominantTeam: details.statistics.possession.home > details.statistics.possession.away ? 'home' : 'away'
  } : null;

  // Simulate live events
  useEffect(() => {
    if (details?.events) {
      const recentEvents = details.events.slice(-3).reverse();
      setLiveEvents(recentEvents);
    }
  }, [details]);

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "statistics", label: "Statistics", icon: BarChart3 },
    { id: "lineup", label: "Lineups", icon: Users },
    { id: "events", label: "Events", icon: Zap },
    { id: "ratings", label: "Ratings", icon: Star },
    { id: "fans", label: "Fan Zone", icon: MessageCircle },
  ];

  const StatBar = ({ label, homeValue, awayValue, max, showPercentage = false }: {
    label: string;
    homeValue: number;
    awayValue: number;
    max: number;
    showPercentage?: boolean;
  }) => {
    const homePercentage = (homeValue / max) * 100;
    const awayPercentage = (awayValue / max) * 100;

    return (
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white font-medium">
            {showPercentage ? `${homeValue}%` : homeValue}
          </span>
          <span className="text-gray-400 font-medium">{label}</span>
          <span className="text-white font-medium">
            {showPercentage ? `${awayValue}%` : awayValue}
          </span>
        </div>
        <div className="flex h-4 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500"
            style={{ width: `${homePercentage}%` }}
          />
          <div className="w-1 bg-[#0a0a0a]" />
          <div 
            className="bg-gradient-to-l from-red-600 to-red-500 transition-all duration-500 ml-auto"
            style={{ width: `${awayPercentage}%` }}
          />
        </div>
      </div>
    );
  };

  const FanPoll = ({ poll }: { poll: typeof currentPoll }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/30"
    >
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-purple-400" />
        <h3 className="text-white font-semibold">Fan Poll</h3>
      </div>
      <p className="text-gray-300 mb-4">{poll.question}</p>
      
      <div className="space-y-3">
        {poll.options.map((option, i) => {
          const votes = poll.votes[i];
          const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
          const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : "0";
          
          return (
            <button
              key={i}
              onClick={() => setFanPoll(i)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                fanPoll === i 
                  ? 'bg-green-600/20 border-2 border-green-500' 
                  : 'bg-[#1a1a1a] hover:bg-[#252525] border-2 border-transparent'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white font-medium">{option}</span>
                <span className="text-green-400 font-bold">{percentage}%</span>
              </div>
              <div className="w-full bg-[#0a0a0a] rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="text-xs text-gray-400 mt-4 text-center">
        {poll.votes.reduce((a, b) => a + b, 0)} votes cast
      </div>
    </motion.div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Match Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-4 ${
            animateCards ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '0ms' }}
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-400">Total Shots</span>
          </div>
          <div className="text-2xl font-bold text-white">{matchStats?.totalShots || 0}</div>
        </motion.div>

        <motion.div 
          className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-4 ${
            animateCards ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-400">Match Tempo</span>
          </div>
          <div className="text-2xl font-bold text-white">High</div>
        </motion.div>

        <motion.div 
          className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-4 ${
            animateCards ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-gray-400">Total Cards</span>
          </div>
          <div className="text-2xl font-bold text-white">{matchStats?.totalCards || 0}</div>
        </motion.div>

        <motion.div 
          className={`bg-[#2a2a2a] border border-[#2c2c2e] rounded-xl p-4 ${
            animateCards ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '300ms' }}
        >
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-400">MVP</span>
          </div>
          <div className="text-lg font-bold text-white truncate">L. Messi</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Stats */}
        <div className="lg:col-span-2">
          <motion.div 
            className={`bg-[#2a2a2a] rounded-xl p-6 border border-[#2c2c2e] ${
              animateCards ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '400ms' }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              Match Statistics
            </h3>
            {details?.statistics && (
              <>
                <StatBar 
                  label="Possession" 
                  homeValue={details.statistics.possession.home} 
                  awayValue={details.statistics.possession.away} 
                  max={100}
                  showPercentage={true}
                />
                <StatBar 
                  label="Total Shots" 
                  homeValue={details.statistics.shots.home} 
                  awayValue={details.statistics.shots.away} 
                  max={Math.max(details.statistics.shots.home, details.statistics.shots.away) * 2}
                />
                <StatBar 
                  label="Shots on Target" 
                  homeValue={details.statistics.shotsOnTarget.home} 
                  awayValue={details.statistics.shotsOnTarget.away} 
                  max={Math.max(details.statistics.shotsOnTarget.home, details.statistics.shotsOnTarget.away) * 2}
                />
                <StatBar 
                  label="Corners" 
                  homeValue={details.statistics.corners.home} 
                  awayValue={details.statistics.corners.away} 
                  max={Math.max(details.statistics.corners.home, details.statistics.corners.away) * 2}
                />
                <StatBar 
                  label="Pass Accuracy" 
                  homeValue={details.statistics.passAccuracy.home} 
                  awayValue={details.statistics.passAccuracy.away} 
                  max={100}
                  showPercentage={true}
                />
              </>
            )}
          </motion.div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-4">
          <motion.div 
            className={`${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: '500ms' }}
          >
            <FanPoll poll={currentPoll} />
          </motion.div>
          
          {/* Recent Events */}
          <motion.div 
            className={`bg-[#2a2a2a] rounded-xl p-6 border border-[#2c2c2e] ${
              animateCards ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '600ms' }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Latest Events
            </h3>
            <div className="space-y-3">
              {liveEvents.map((event, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg"
                >
                  <span className="text-gray-400 font-mono text-sm w-10">{event.minute}'</span>
                  <span className="text-xl">
                    {event.type === 'goal' && '⚽'}
                    {event.type === 'yellow' && '🟨'}
                    {event.type === 'red' && '🟥'}
                    {event.type === 'sub' && '🔄'}
                  </span>
                  <div className="flex-1">
                    <div className="text-white font-medium">{event.player}</div>
                    {event.assist && (
                      <div className="text-xs text-gray-400">Assist: {event.assist}</div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {event.team === 'home' ? match.homeTeam : match.awayTeam}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <MatchTimeline events={details?.events || []} />
      
      {/* Detailed Events List */}
      <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#2c2c2e]">
        <h3 className="text-lg font-semibold mb-4 text-white">Match Events</h3>
        <div className="space-y-3">
          {details?.events.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#252525] transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">
                  {event.type === 'goal' && '⚽'}
                  {event.type === 'yellow' && '🟨'}
                  {event.type === 'red' && '🟥'}
                  {event.type === 'sub' && '🔄'}
                </div>
                <div className="text-xs text-gray-400">{event.minute}'</div>
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">
                  {event.player}
                  {event.type === 'goal' && event.score && ` (${event.score})`}
                </div>
                {event.assist && (
                  <div className="text-sm text-gray-400">Assist: {event.assist}</div>
                )}
                {event.replaced && (
                  <div className="text-sm text-gray-400">Replaced: {event.replaced}</div>
                )}
              </div>
              <div className="text-right">
                <img 
                  src={event.team === 'home' ? match.homeLogo : match.awayLogo}
                  className="w-8 h-8 rounded-full"
                  alt=""
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderLineup = () => {
    if (!details?.homePlayers || !details?.awayPlayers) {
      return (
        <div className="bg-[#2a2a2a] rounded-xl p-8 text-center border border-[#2c2c2e]">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Lineup information not available</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Home Team */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#2a2a2a] rounded-xl p-6 border border-[#2c2c2e]"
        >
          <div className="flex items-center gap-3 mb-6">
            <img src={match.homeLogo} className="w-10 h-10 rounded-full" alt={match.homeTeam} />
            <div>
              <h3 className="font-bold text-white text-lg">{match.homeTeam}</h3>
              <p className="text-sm text-gray-400">4-3-3</p>
            </div>
          </div>
          <div className="space-y-2">
            {details.homePlayers.map((player, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#252525] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                  {player.number}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{player.name}</div>
                  <div className="text-xs text-gray-400">{player.position}</div>
                </div>
                <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                  player.rating >= 7 ? 'bg-green-600/20 text-green-400' : 
                  player.rating >= 6 ? 'bg-yellow-600/20 text-yellow-400' : 
                  'bg-red-600/20 text-red-400'
                }`}>
                  {player.rating.toFixed(1)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Away Team */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#2a2a2a] rounded-xl p-6 border border-[#2c2c2e]"
        >
          <div className="flex items-center gap-3 mb-6">
            <img src={match.awayLogo} className="w-10 h-10 rounded-full" alt={match.awayTeam} />
            <div>
              <h3 className="font-bold text-white text-lg">{match.awayTeam}</h3>
              <p className="text-sm text-gray-400">4-4-2</p>
            </div>
          </div>
          <div className="space-y-2">
            {details.awayPlayers.map((player, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#252525] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold">
                  {player.number}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{player.name}</div>
                  <div className="text-xs text-gray-400">{player.position}</div>
                </div>
                <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                  player.rating >= 7 ? 'bg-green-600/20 text-green-400' : 
                  player.rating >= 6 ? 'bg-yellow-600/20 text-yellow-400' : 
                  'bg-red-600/20 text-red-400'
                }`}>
                  {player.rating.toFixed(1)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderStatistics = () => {
    if (!details?.statistics) {
      return (
        <div className="bg-[#2a2a2a] rounded-xl p-8 text-center border border-[#2c2c2e]">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Statistics not available</p>
        </div>
      );
    }

    return (
      <MatchStatistics
        statistics={details.statistics}
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        homeLogo={match.homeLogo}
        awayLogo={match.awayLogo}
      />
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "timeline":
        return renderTimeline();
      case "lineup":
        return renderLineup();
      case "statistics":
        return renderStatistics();
      case "events":
        return renderTimeline();
      case "ratings":
        return (
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#2c2c2e]">
            <h3 className="text-lg font-semibold mb-4 text-white">Player Ratings</h3>
            <PlayerRatings home={details?.homePlayers || []} away={details?.awayPlayers || []} />
          </div>
        );
      case "fans":
        return <FanPoll poll={currentPoll} />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white">
      {/* Enhanced Header */}
      <div className="bg-[#2a2a2a] border-b border-[#2c2c2e]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Live Scores
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNotifications(!notifications)}
                className={`p-2 rounded-full transition-colors ${
                  notifications ? 'text-green-500 bg-green-500/20' : 'text-gray-400 hover:text-white'
                }`}
              >
                {notifications ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setFollowing(!following)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  following 
                    ? 'bg-green-500 text-white' 
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                }`}
              >
                {following ? '✓ Following' : 'Follow'}
              </button>
              <button className="p-2 rounded-full text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Match Header */}
          <div className="bg-gradient-to-r from-[#333333] to-[#2a2a2a] rounded-xl p-6 border border-[#2c2c2e]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {isLive && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-bold">LIVE</span>
                    <span className="text-gray-400">{match.status}'</span>
                  </div>
                )}
                {!isLive && (
                  <span className="text-gray-400 font-medium">
                    {match.status === "FT" ? "Full Time" : match.status}
                  </span>
                )}
              </div>
              <button
                onClick={() => setHideScore(!hideScore)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full text-sm hover:bg-[#252525] transition-colors"
              >
                {hideScore ? <Eye size={16} /> : <EyeOff size={16} />}
                {hideScore ? 'Show Score' : 'Hide Score'}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <img src={match.homeLogo} className="w-16 h-16 rounded-full ring-4 ring-[#1a1a1a]" alt={match.homeTeam} />
                <div>
                  <h2 className="text-2xl font-bold">{match.homeTeam}</h2>
                  <p className="text-sm text-gray-400">Home</p>
                </div>
              </div>
              
              <div className="text-center px-8">
                <div className="text-5xl font-bold mb-2">
                  {hideScore ? (
                    <span className="text-gray-500">? - ?</span>
                  ) : (
                    <>
                      <span className={match.homeScore > match.awayScore ? 'text-green-500' : 'text-white'}>
                        {match.homeScore}
                      </span>
                      <span className="text-gray-500 mx-3">-</span>
                      <span className={match.awayScore > match.homeScore ? 'text-green-500' : 'text-white'}>
                        {match.awayScore}
                      </span>
                    </>
                  )}
                </div>
                {!hideScore && details?.events && (
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="text-right">
                      {details.events
                        .filter(e => e.type === 'goal' && e.team === 'home')
                        .map((e, i) => (
                          <div key={i} className="text-gray-400">
                            {e.player} {e.minute}'
                          </div>
                        ))
                      }
                    </div>
                    <div className="text-gray-500">⚽</div>
                    <div className="text-left">
                      {details.events
                        .filter(e => e.type === 'goal' && e.team === 'away')
                        .map((e, i) => (
                          <div key={i} className="text-gray-400">
                            {e.minute}' {e.player}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 flex-1 justify-end">
                <div className="text-right">
                  <h2 className="text-2xl font-bold">{match.awayTeam}</h2>
                  <p className="text-sm text-gray-400">Away</p>
                </div>
                <img src={match.awayLogo} className="w-16 h-16 rounded-full ring-4 ring-[#1a1a1a]" alt={match.awayTeam} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="bg-[#2a2a2a] rounded-xl p-1 mb-6 border border-[#2c2c2e]">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-green-500 text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#333333]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
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
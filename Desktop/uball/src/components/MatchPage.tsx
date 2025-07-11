import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, TrendingUp, Eye, EyeOff } from "lucide-react";
import { groupedMockScores, type Match } from "../data/mockScores";
import { mockMatchDetails } from "../data/mockMatchDetails";
import PlayerRatings from "./PlayerRatings";
import MatchTimeline from "./MatchTimeline";
import MatchStatistics from "./MatchStatistics";

export default function MatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const matchId = Number(id);
  const [activeTab, setActiveTab] = useState("facts");
  const [hideScore, setHideScore] = useState(false);
  const [userRatings, setUserRatings] = useState<{[key: string]: number}>({});
  const [fanPoll, setFanPoll] = useState<number | null>(null);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);

  const matches: Match[] = groupedMockScores.flatMap((group) => group.matches);
  const match = matches.find((m) => m.id === matchId);

  if (!match) {
    return (
      <div className="text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Kamp ikke fundet</h1>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-gray-700 rounded text-white"
        >
          Tilbage
        </button>
      </div>
    );
  }

  const details = mockMatchDetails[matchId];

  // Mock fan poll data
  const currentPoll = {
    question: "Hvem spillede bedst i første halvleg?",
    options: [match.homeTeam, match.awayTeam, "Lige gode"],
    votes: [156, 234, 89],
    userVoted: fanPoll
  };

  // Simulate live events
  useEffect(() => {
    if (details?.events) {
      const recentEvents = details.events.slice(-3).reverse();
      setLiveEvents(recentEvents);
    }
  }, [details]);

  const tabs = [
    { id: "facts", label: "Fakta" },
    { id: "overview", label: "Live Oversigt" },
    { id: "comments", label: "Kommentarer" },
    { id: "lineup", label: "Startopstilling" },
    { id: "stats", label: "Stilling" },
    { id: "statistics", label: "Statistik" },
    { id: "ratings", label: "Spillerkarakterer" },
    { id: "fans", label: "Fans" },
    { id: "invitations", label: "Indbydelser" }
  ];

  const StatBar = ({ label, homeValue, awayValue, max }: {
    label: string;
    homeValue: number;
    awayValue: number;
    max: number;
  }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-white font-medium">{homeValue}</span>
        <span className="text-gray-400 font-medium">{label}</span>
        <span className="text-white font-medium">{awayValue}</span>
      </div>
      <div className="flex h-3 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="bg-blue-500 transition-all duration-500"
          style={{ width: `${(homeValue / max) * 50}%` }}
        />
        <div 
          className="bg-red-500 transition-all duration-500 ml-auto"
          style={{ width: `${(awayValue / max) * 50}%` }}
        />
      </div>
    </div>
  );

  const FanPoll = ({ poll }: { poll: typeof currentPoll }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/30"
    >
      <h3 className="text-white font-semibold mb-3">🗳️ Fan Afstemning</h3>
      <p className="text-gray-300 mb-3">{poll.question}</p>
      
      <div className="space-y-2">
        {poll.options.map((option, i) => {
          const votes = poll.votes[i];
          const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
          const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : "0";
          
          return (
            <button
              key={i}
              onClick={() => setFanPoll(i)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                fanPoll === i 
                  ? 'bg-green-600 border border-green-400' 
                  : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-white font-medium">{option}</span>
                <span className="text-green-400 font-bold">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="text-xs text-gray-400 mt-3">
        {poll.votes.reduce((a, b) => a + b, 0)} stemmer
      </div>
    </motion.div>
  );

  const PlayerCard = ({ player }: { player: any }) => {
    const playerRating = userRatings[player.name] || 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2c2c2e] hover:border-green-500 transition-all"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-white">{player.name}</h4>
            <p className="text-sm text-gray-400">{player.position}</p>
          </div>
          <div className="text-right">
            <div className="text-green-400 font-bold text-sm">
              Karakter: {player.rating.toFixed(1)}
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-xs text-gray-400 mb-1">Din vurdering:</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star 
                key={star}
                size={18}
                className={`cursor-pointer transition-colors ${
                  star <= playerRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                }`}
                onClick={() => setUserRatings(prev => ({ ...prev, [player.name]: star }))}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderLiveOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2c2c2e]">
            <h3 className="text-lg font-semibold mb-4 text-white">Live Statistik</h3>
            {details?.statistics && (
              <>
                <StatBar 
                  label="Boldbesiddelse" 
                  homeValue={details.statistics.possession.home} 
                  awayValue={details.statistics.possession.away} 
                  max={100} 
                />
                <StatBar 
                  label="Skud i alt" 
                  homeValue={details.statistics.shots.home} 
                  awayValue={details.statistics.shots.away} 
                  max={20} 
                />
                <StatBar 
                  label="Skud på mål" 
                  homeValue={details.statistics.shotsOnTarget.home} 
                  awayValue={details.statistics.shotsOnTarget.away} 
                  max={10} 
                />
                <StatBar 
                  label="Hjørnespark" 
                  homeValue={details.statistics.corners.home} 
                  awayValue={details.statistics.corners.away} 
                  max={12} 
                />
              </>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <FanPoll poll={currentPoll} />
          
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2c2c2e]">
            <h3 className="text-lg font-semibold mb-3 text-white">Seneste Begivenheder</h3>
            <div className="space-y-3">
              {liveEvents.map((event, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 text-sm bg-gray-800 rounded-lg p-2"
                >
                  <span className="text-gray-400 font-mono">{event.minute}'</span>
                  <span className="text-white">
                    {event.type === 'goal' && '⚽'}
                    {event.type === 'yellow' && '🟨'}
                    {event.type === 'red' && '🟥'}
                    {event.type === 'sub' && '🔄'}
                  </span>
                  <span className="text-gray-300">{event.player}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFanSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2c2c2e]">
        <h3 className="text-lg font-semibold mb-4 text-white">Fan Reaktioner</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-bold">
              {match.homeTeam.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-sm text-gray-400">@fodboldFan23</div>
              <div className="text-white">Fantastisk kamp! 🔥</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
              {match.awayTeam.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-sm text-gray-400">@sportsFan</div>
              <div className="text-white">Spændende kamp indtil videre</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2c2c2e]">
        <h3 className="text-lg font-semibold mb-4 text-white">Vurder Spillere</h3>
        <div className="space-y-4">
          {details?.homePlayers?.slice(0, 3).map(player => (
            <PlayerCard key={player.name} player={player} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderMatchEvents = () => {
    if (!details?.events) return null;

    return (
      <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-4">
        <h2 className="text-lg font-semibold text-white/90 text-center">Begivenheder</h2>
        <ul className="space-y-3">
          {details.events.map((ev, idx) => (
            <motion.li 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="grid grid-cols-[1fr_60px_1fr] items-center text-sm text-white/90 bg-gray-800 rounded-lg p-3"
            >
              {/* Venstre side (away team) */}
              <div className={`${ev.team === "away" ? "text-right" : ""}`}>
                {ev.team === "away" && (
                  <div className="space-y-0.5">
                    <div className="font-medium flex items-center justify-end gap-2">
                      <div>
                        {ev.player}
                        {ev.type === "goal" && ev.score && ` (${ev.score})`}
                      </div>
                      <div>
                        {ev.type === "goal" && <span>⚽</span>}
                        {ev.type === "yellow" && <span className="text-yellow-400">🟨</span>}
                        {ev.type === "red" && <span className="text-red-500">🟥</span>}
                        {ev.type === "sub" && <span className="text-green-400">🔄</span>}
                      </div>
                    </div>
                    {ev.assist && (
                      <div className="text-xs text-gray-400">oplæg af {ev.assist}</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Centrum (kun tid) */}
              <div className="text-center">
                <div className="text-gray-400 text-xs font-mono">{ev.minute}'</div>
              </div>
              
              {/* Højre side (home team) */}
              <div className={`${ev.team === "home" ? "text-left" : ""}`}>
                {ev.team === "home" && (
                  <div className="space-y-0.5">
                    <div className="font-medium flex items-center gap-2">
                      <div>
                        {ev.type === "goal" && <span>⚽</span>}
                        {ev.type === "yellow" && <span className="text-yellow-400">🟨</span>}
                        {ev.type === "red" && <span className="text-red-500">🟥</span>}
                        {ev.type === "sub" && <span className="text-green-400">🔄</span>}
                      </div>
                      <div>
                        {ev.player}
                        {ev.type === "goal" && ev.score && ` (${ev.score})`}
                      </div>
                    </div>
                    {ev.assist && (
                      <div className="text-xs text-gray-400">oplæg af {ev.assist}</div>
                    )}
                  </div>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    );
  };

  const renderLineup = () => {
    if (!details?.homePlayers || !details?.awayPlayers) {
      return (
        <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
          <p className="text-sm text-gray-400">Startopstilling ikke tilgængelig</p>
        </div>
      );
    }

    return (
      <div className="bg-[#1a1a1a] rounded-xl p-4">
        <div className="grid grid-cols-2 gap-8">
          {/* Home team */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={match.homeLogo} className="w-6 h-6 rounded-full" alt={match.homeTeam} />
              <h3 className="font-semibold text-white">{match.homeTeam}</h3>
            </div>
            <div className="space-y-2">
              {details.homePlayers.map((player, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-2 text-sm bg-gray-800 rounded-lg p-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                    {player.number}
                  </div>
                  <span className="text-white">{player.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{player.position}</span>
                  <span className={`ml-auto text-xs px-2 py-1 rounded ${
                    player.rating >= 7 ? 'bg-green-600' : player.rating >= 6 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}>
                    {player.rating.toFixed(1)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Away team */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={match.awayLogo} className="w-6 h-6 rounded-full" alt={match.awayTeam} />
              <h3 className="font-semibold text-white">{match.awayTeam}</h3>
            </div>
            <div className="space-y-2">
              {details.awayPlayers.map((player, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-2 text-sm bg-gray-800 rounded-lg p-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                    {player.number}
                  </div>
                  <span className="text-white">{player.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{player.position}</span>
                  <span className={`ml-auto text-xs px-2 py-1 rounded ${
                    player.rating >= 7 ? 'bg-green-600' : player.rating >= 6 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}>
                    {player.rating.toFixed(1)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStatistics = () => {
    if (!details?.statistics) {
      return (
        <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
          <p className="text-sm text-gray-400">Statistik ikke tilgængelig</p>
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
      case "facts":
        return (
          <div className="space-y-6">
            <MatchTimeline events={details.events} />
            {renderMatchEvents()}
          </div>
        );
      case "overview":
        return renderLiveOverview();
      case "lineup":
        return renderLineup();
      case "statistics":
        return renderStatistics();
      case "fans":
        return renderFanSection();
      case "comments":
        return (
          <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
            <p className="text-sm text-gray-400">Kommentarer ikke tilgængelige</p>
          </div>
        );
      case "stats":
        return (
          <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
            <p className="text-sm text-gray-400">Stillingsoversigt ikke tilgængelig</p>
          </div>
        );
      case "ratings":
        return (
          <div className="bg-[#1a1a1a] rounded-xl p-4">
           <PlayerRatings home={details.homePlayers} away={details.awayPlayers} />
          </div>
        );
      case "invitations":
        return (
          <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
            <p className="text-sm text-gray-400">Indbydelser ikke tilgængelige</p>
          </div>
        );
      default:
        return renderMatchEvents();
    }
  };

  return (
    <div className="bg-[#0e0e0e] min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-400 hover:text-white mb-4"
        >
          ← Tilbage
        </button>

        {/* Enhanced Match Header */}
        <div className="bg-gradient-to-r from-[#1c1c1e] to-[#121212] rounded-xl p-6 mb-6 border border-[#2c2c2e]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-bold">
                  {match.status === "FT" ? "Færdigspillet" : "LIVE"}
                </span>
                {match.status !== "FT" && (
                  <span className="text-gray-400">73'</span>
                )}
              </div>
              <button
                onClick={() => setHideScore(!hideScore)}
                className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors"
              >
                {hideScore ? <Eye size={16} /> : <EyeOff size={16} />}
                {hideScore ? 'Vis Score' : 'Skjul Score'}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={match.homeLogo} className="w-12 h-12 rounded-full" alt={match.homeTeam} />
              <div>
                <h2 className="text-xl font-bold">{match.homeTeam}</h2>
                <p className="text-sm text-gray-400">3-4-1-2</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {hideScore ? "? - ?" : `${match.homeScore} - ${match.awayScore}`}
              </div>
              <div className="text-sm text-gray-400">
                {match.status === "FT" ? "Færdigspillet" : match.status}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <h2 className="text-xl font-bold">{match.awayTeam}</h2>
                <p className="text-sm text-gray-400">4-4-2</p>
              </div>
              <img src={match.awayLogo} className="w-12 h-12 rounded-full" alt={match.awayTeam} />
            </div>
          </div>
          
          {/* Goal scorers */}
          {!hideScore && (
            <div className="mt-4 grid grid-cols-2 gap-8">
              <div className="text-left">
                <p className="text-sm text-green-400">Gil 80'</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-400">Messi 27', 38'</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-[#1a1a1a] rounded-xl p-1 mb-6">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content with Animation */}
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
    </div>
  );
}
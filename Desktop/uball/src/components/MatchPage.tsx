// src/components/MatchPage.tsx - Updated with Statistics
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
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

  const tabs = [
    { id: "facts", label: "Fakta" },
    { id: "comments", label: "Kommentarer" },
    { id: "lineup", label: "Startopstilling" },
    { id: "stats", label: "Stilling" },
    { id: "statistics", label: "Statistik" },
    { id: "ratings", label: "Spillerkarakterer" },
    { id: "invitations", label: "Indbydelser" }
  ];

  const renderMatchEvents = () => {
    if (!details?.events) return null;

    return (
      <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-4">
        <h2 className="text-lg font-semibold text-white/90 text-center">Begivenheder</h2>
        <ul className="space-y-3">
          {details.events.map((ev, idx) => (
            <li key={idx} className="grid grid-cols-[1fr_60px_1fr] items-center text-sm text-white/90">
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
                    {ev.replaced && (
                      <div className="text-xs">
                        <span className="text-red-400">{ev.replaced}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Centrum (kun tid) */}
              <div className="text-center">
                <div className="text-gray-400 text-xs">{ev.minute}'</div>
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
                    {ev.replaced && (
                      <div className="text-xs">
                        <span className="text-red-400">{ev.replaced}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
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
                <div key={idx} className="flex items-center gap-2 text-sm">
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
                </div>
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
                <div key={idx} className="flex items-center gap-2 text-sm">
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
                </div>
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
      case "lineup":
        return renderLineup();
      case "statistics":
        return renderStatistics();
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
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-400 hover:text-white mb-4"
        >
          ← Tilbage
        </button>

        {/* Match Header */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={match.homeLogo} className="w-12 h-12 rounded-full" alt={match.homeTeam} />
              <div>
                <h2 className="text-xl font-bold">{match.homeTeam}</h2>
                <p className="text-sm text-gray-400">3-4-1-2</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {match.homeScore} - {match.awayScore}
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
          <div className="mt-4 grid grid-cols-2 gap-8">
            <div className="text-left">
              <p className="text-sm text-green-400">Gil 80'</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-400">Messi 27', 38'</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#1a1a1a] rounded-xl p-1 mb-6">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
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

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
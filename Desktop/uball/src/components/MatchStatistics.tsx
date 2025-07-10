// src/components/MatchStatistics.tsx
import type { MatchStatistics } from '../data/mockMatchDetails';

type Props = {
  statistics: MatchStatistics;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
};

type StatItem = {
  key: keyof MatchStatistics;
  label: string;
  isPercentage?: boolean;
  showBar?: boolean;
};

const statisticsConfig: StatItem[] = [
  { key: 'possession', label: 'Boldbesiddelse', isPercentage: true, showBar: true },
  { key: 'shots', label: 'Skud i alt' },
  { key: 'shotsOnTarget', label: 'Skud på mål' },
  { key: 'corners', label: 'Hjørnespark' },
  { key: 'fouls', label: 'Frispark' },
  { key: 'yellowCards', label: 'Gule kort' },
  { key: 'redCards', label: 'Røde kort' },
  { key: 'offsides', label: 'Offside' },
  { key: 'passAccuracy', label: 'Pasningspræcision', isPercentage: true, showBar: true },
  { key: 'aerialDuels', label: 'Luftdueller' },
  { key: 'tackles', label: 'Tacklinger' },
  { key: 'interceptions', label: 'Afleveringer' },
  { key: 'clearances', label: 'Afværgninger' },
  { key: 'crosses', label: 'Indlæg' },
  { key: 'saves', label: 'Redninger' }
];

export default function MatchStatistics({ statistics, homeTeam, awayTeam, homeLogo, awayLogo }: Props) {
  const renderStatBar = (homeValue: number, awayValue: number, isPercentage: boolean) => {
    const total = homeValue + awayValue;
    const homePercentage = isPercentage ? homeValue : (homeValue / total) * 100;
    const awayPercentage = isPercentage ? awayValue : (awayValue / total) * 100;

    return (
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${homePercentage}%` }}
          />
        </div>
        <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-red-500 transition-all duration-300 ml-auto"
            style={{ width: `${awayPercentage}%` }}
          />
        </div>
      </div>
    );
  };

  const renderStatRow = (config: StatItem) => {
    const homeValue = statistics[config.key].home;
    const awayValue = statistics[config.key].away;
    const formatValue = (value: number) => 
      config.isPercentage ? `${value}%` : value.toString();

    return (
      <div key={config.key} className="space-y-2">
        {/* Values and Label */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white w-12 text-right">
            {formatValue(homeValue)}
          </span>
          <span className="text-sm text-gray-300 font-medium px-4 text-center flex-1">
            {config.label}
          </span>
          <span className="text-sm font-medium text-white w-12 text-left">
            {formatValue(awayValue)}
          </span>
        </div>

        {/* Progress Bar */}
        {config.showBar && (
          <div className="px-2">
            {renderStatBar(homeValue, awayValue, config.isPercentage || false)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src={homeLogo} className="w-8 h-8 rounded-full" alt={homeTeam} />
          <span className="text-white font-semibold">{homeTeam}</span>
        </div>
        <h2 className="text-lg font-bold text-white">Statistik</h2>
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold">{awayTeam}</span>
          <img src={awayLogo} className="w-8 h-8 rounded-full" alt={awayTeam} />
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="space-y-4">
        {statisticsConfig.map(renderStatRow)}
      </div>

      {/* Key Stats Summary */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {statistics.possession.home}%
            </div>
            <div className="text-xs text-gray-400">Boldbesiddelse</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {statistics.possession.away}%
            </div>
            <div className="text-xs text-gray-400">Boldbesiddelse</div>
          </div>
        </div>
      </div>
    </div>
  );
}
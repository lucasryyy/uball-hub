import { useMemo } from "react";
import { motion } from "framer-motion";

export type MatchEvent = {
  minute: number;
  team: "home" | "away";
  player: string;
  type: "goal" | "yellow" | "red" | "sub";
  assist?: string;
  replaced?: string;
  score?: string;
};

type Props = {
  events: MatchEvent[];
};

const getIcon = (type: string) => {
  switch (type) {
    case "goal":
      return "⚽";
    case "yellow":
      return "🟨";
    case "red":
      return "🟥";
    case "sub":
      return "🔄";
    default:
      return "";
  }
};

export default function MatchTimeline({ events }: Props) {
  const normalizedEvents = useMemo(() => {
    return events.map((ev) => ({
      ...ev,
      normMinute:
        typeof ev.minute === "string"
          ? parseInt(ev.minute.replace("+", ""))
          : ev.minute,
    }));
  }, [events]);

  const maxMinute = Math.max(90, ...normalizedEvents.map((ev) => ev.normMinute));
  const timelineMarkers = Array.from({ length: Math.ceil(maxMinute / 15) + 1 }, (_, i) => i * 15);

  const groupedEvents = useMemo(() => {
    const map = new Map<number, { home: MatchEvent[]; away: MatchEvent[] }>();
    normalizedEvents.forEach((ev) => {
      const minute = ev.normMinute;
      if (!map.has(minute)) {
        map.set(minute, { home: [], away: [] });
      }
      map.get(minute)![ev.team].push(ev);
    });
    return map;
  }, [normalizedEvents]);

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-6 overflow-x-auto">
      <h2 className="text-lg font-semibold text-white/90 text-center">Tidslinje</h2>

      <div className="relative min-w-[600px] h-32">
        {/* Timeline Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-600 rounded-full" />

        {/* Time Labels */}
        <div className="absolute top-[calc(50%+10px)] w-full flex justify-between text-xs text-gray-400">
          {timelineMarkers.map((min) => (
            <span key={min} style={{ transform: "translateX(-50%)" }}>
              {min}'
            </span>
          ))}
        </div>

        {/* Event Markers */}
        {Array.from(groupedEvents.entries()).map(([minute, { home, away }]) => {
          const left = `${(minute / maxMinute) * 100}%`;

          return (
            <div
              key={minute}
              className="absolute top-0 h-full translate-x-[-50%] flex flex-col justify-between items-center"
              style={{ left }}
            >
              {/* Home team (top) - closer to center */}
              <div className="flex flex-col items-center gap-1 mb-auto mt-2">
                {home.map((ev, i) => (
                  <motion.div
                    key={i}
                    title={`${ev.player}${ev.assist ? ` (assist: ${ev.assist})` : ""}`}
                    className="text-white text-xs"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    {getIcon(ev.type)}
                  </motion.div>
                ))}
              </div>

              {/* Center marker (shorter now) */}
              <div className="w-1 h-3 bg-gray-500 rounded-sm" />

              {/* Away team (bottom) - closer to center */}
              <div className="flex flex-col items-center gap-1 mt-auto mb-2">
                {away.map((ev, i) => (
                  <motion.div
                    key={i}
                    title={`${ev.player}${ev.assist ? ` (assist: ${ev.assist})` : ""}`}
                    className="text-white text-xs"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    {getIcon(ev.type)}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

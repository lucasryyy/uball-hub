import type { MatchEvent } from '../data/mockMatchDetails'

type Props = { events: MatchEvent[] }

const eventLabel = (event: MatchEvent) => {
  switch (event.type) {
    case 'goal':
      return event.assist ? `${event.player} (assist: ${event.assist})` : `${event.player}`
    case 'yellow':
      return `${event.player} \u{1F7E1}`
    case 'red':
      return `${event.player} \u{1F534}`
    case 'sub':
      return `${event.player} \u{21BA}`
    default:
      return event.player
  }
}

export default function MatchEvents({ events }: Props) {
  return (
    <div className="space-y-2">
      {events.map((ev, i) => (
        <div
          key={i}
          className="flex justify-between text-sm text-gray-200 bg-[#2a2a2a] px-3 py-1 rounded"
        >
          <span>{ev.team === 'home' ? eventLabel(ev) : ''}</span>
          <span className="font-mono text-gray-400">{ev.minute}'</span>
          <span className="text-right">{ev.team === 'away' ? eventLabel(ev) : ''}</span>
        </div>
      ))}
    </div>
  )
}

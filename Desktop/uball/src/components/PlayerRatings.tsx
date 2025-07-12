export type PlayerRating = {
  name: string
  rating: number
  position: string
  number: number
}

type Props = {
  home: PlayerRating[]
  away: PlayerRating[]
}

const ratingColor = (rating: number) => {
  if (rating >= 8) return 'text-green-400'
  if (rating >= 7) return 'text-green-200'
  if (rating >= 6) return 'text-yellow-300'
  return 'text-red-400'
}

export default function PlayerRatings({ home, away }: Props) {
  const max = Math.max(home.length, away.length)

  return (
    <table className="w-full text-sm">
      <tbody>
        {Array.from({ length: max }).map((_, idx) => (
          <tr key={idx} className="border-b border-[#2c2c2e] last:border-none">
            <td className="pr-2 text-left">
              {home[idx] && (
                <span className={ratingColor(home[idx].rating)}>
                  {home[idx].name} ({home[idx].rating.toFixed(1)})
                </span>
              )}
            </td>
            <td className="text-right pl-2">
              {away[idx] && (
                <span className={ratingColor(away[idx].rating)}>
                  {away[idx].name} ({away[idx].rating.toFixed(1)})
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

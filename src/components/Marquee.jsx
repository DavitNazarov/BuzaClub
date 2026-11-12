import { useContent } from '../i18n/LanguageContext'

/**
 * Slow, endless ribbon of the club's disciplines. Purely decorative —
 * the same words are already in the page as real content, so it is hidden
 * from assistive tech. Pauses on hover; stands still for reduced-motion.
 */
export default function Marquee() {
  const { content } = useContent()
  const names = content.disciplines.items.map((d) => d.name)
  // two laps per group so a single group is always wider than the screen
  const lap = [...names, ...names]

  const group = (key) => (
    <ul className="marquee-group" key={key}>
      {lap.map((name, i) => (
        <li key={`${name}-${i}`}>{name}</li>
      ))}
    </ul>
  )

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {group('a')}
        {group('b')}
      </div>
    </div>
  )
}

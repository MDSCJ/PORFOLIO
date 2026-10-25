import Section from './Section'
import { skills } from '../../data/portfolio'
import { skillIcons } from '../../data/skillIcons'

// Rows with at least this many pills scroll as a marquee; shorter rows stay static.
const MARQUEE_MIN_ITEMS = 7

// Very dark brand colours (GitHub, Express, Django…) vanish on the dark background, so lift them toward white.
function readable(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance < 0.25 ? `color-mix(in srgb, ${hex} 35%, #e2e8f0)` : hex
}

function SkillIcon({ icon }) {
  return (
    <svg viewBox={icon.viewBox} aria-hidden className="h-4 w-4 shrink-0">
      {icon.paths.map((d) =>
        icon.stroke ? (
          <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path key={d} d={d} fill="currentColor" fillRule="evenodd" />
        ),
      )}
    </svg>
  )
}

function Pill({ children }) {
  const icon = skillIcons[children]
  const brand = icon ? readable(icon.color) : 'var(--color-neon-cyan)'

  return (
    <span
      style={{ '--brand': brand }}
      className="mr-2 inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-[color-mix(in_srgb,var(--brand)_30%,transparent)] bg-[color-mix(in_srgb,var(--brand)_7%,transparent)] px-3.5 py-1.5 text-sm text-slate-200 transition hover:border-[var(--brand)] hover:text-white hover:shadow-[0_0_16px_-4px_var(--brand)]"
    >
      {icon && (
        <span className="text-[var(--brand)]">
          <SkillIcon icon={icon} />
        </span>
      )}
      {children}
    </span>
  )
}

function SkillRow({ group, items, reverse }) {
  const scrolling = items.length >= MARQUEE_MIN_ITEMS

  return (
    <div className="glass flex min-w-0 flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center">
      <p className="shrink-0 text-xs uppercase tracking-[0.25em] text-neon-purple md:w-44">{group}</p>
      {scrolling ? (
        <div className="marquee min-w-0 flex-1">
          {/* Two identical copies so translateX(-50%) loops seamlessly. */}
          <div
            className="marquee-track"
            style={{ '--duration': `${items.length * 3}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
          >
            {items.map((s) => (
              <Pill key={s}>{s}</Pill>
            ))}
            <span aria-hidden className="marquee-dup contents">
              {items.map((s) => (
                <Pill key={s}>{s}</Pill>
              ))}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-wrap gap-y-2">
          {items.map((s) => (
            <Pill key={s}>{s}</Pill>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Skills() {
  return (
    <Section id="skills">
      <div className="ml-auto grid max-w-4xl grid-cols-1 gap-4">
        <h2 className="font-display mb-2 text-3xl font-bold uppercase tracking-widest md:text-4xl">Tech Arsenal</h2>
        {skills.map((s, i) => (
          <SkillRow key={s.group} group={s.group} items={s.items} reverse={i % 2 === 1} />
        ))}
      </div>
    </Section>
  )
}

import { useEffect, useState } from 'react'
import Section from './Section'
import { contact, profile } from '../../data/portfolio'

const WORD_FILLS = ['#f0fbff', 'var(--color-neon-cyan)']

// Wait for the display font so the glitch doesn't play on the fallback font (capped so it never blocks).
function useFontsReady(timeoutMs = 1500) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const done = () => setReady(true)
    const timer = setTimeout(done, timeoutMs)
    document.fonts?.ready.then(done)
    return () => clearTimeout(timer)
  }, [timeoutMs])
  return ready
}

export default function Hero() {
  const fontsReady = useFontsReady()

  return (
    <Section id="home" reveal={false} layout="items-end pb-16 pt-[45svh] md:items-center md:pb-24 md:pt-24">
      <div className="max-w-4xl">
        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-neon-cyan">{profile.role}</p>
        <h1
          aria-label={profile.name}
          className={`font-display text-4xl font-bold uppercase leading-[0.95] sm:text-5xl lg:text-7xl ${fontsReady ? '' : 'opacity-0'}`}
        >
          {/* Plays once on mount: stroke outline + glitch slices, then settles into solid fill. */}
          {fontsReady &&
            profile.name.split(' ').map((word, i) => (
              <span
                key={word}
                aria-hidden
                data-text={word}
                className="glitch-name"
                style={{ '--fill': WORD_FILLS[i % WORD_FILLS.length], '--delay': `${i * 0.18}s` }}
              >
                {word}
              </span>
            ))}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-slate-400 md:text-xl">{profile.tagline}</p>
        <div className="mt-8 flex gap-3">
          {[
            ['GitHub', contact.github],
            ['LinkedIn', contact.linkedin],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="glass glow-hover rounded-full px-5 py-2 text-sm text-slate-200 hover:text-neon-cyan"
            >
              {label} ↗
            </a>
          ))}
        </div>
        <p className="mt-12 text-xs uppercase tracking-[0.3em] text-slate-500">Scroll to explore ↓</p>
      </div>
    </Section>
  )
}

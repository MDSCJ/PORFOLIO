import Section from './Section'
import { profile } from '../../data/portfolio'

export default function About() {
  return (
    <Section id="about">
      <div className="grid max-w-2xl gap-5">
        <h2 className="font-display text-3xl font-bold uppercase tracking-widest md:text-4xl">About</h2>
        <div className="glass rounded-2xl p-6 md:p-8">
          {profile.bio.map((p) => (
            <p key={p} className="mb-3 leading-relaxed text-slate-200 last:mb-0">
              {p}
            </p>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {profile.focus.map((f) => (
            <div key={f} className="glass glow-hover rounded-xl p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-neon-cyan">Domain</p>
              <p className="mt-2 text-sm text-slate-200">{f}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

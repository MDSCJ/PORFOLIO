import Section from './Section'
import { achievements, education, publications } from '../../data/portfolio'

export default function Research() {
  return (
    <Section id="research">
      <div className="ml-auto grid max-w-3xl gap-5">
        <h2 className="font-display text-3xl font-bold uppercase tracking-widest md:text-4xl">Research & Milestones</h2>
        {publications.map((p) => (
          <a
            key={p.title}
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="glass glow-hover block rounded-2xl p-5"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-neon-cyan">{p.venue}</p>
            <p className="mt-2 leading-snug text-slate-100">{p.title}</p>
          </a>
        ))}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="glass rounded-2xl p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neon-purple">Awards & Involvement</p>
            <ul className="grid gap-2 text-sm text-slate-300">
              {achievements.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="text-neon-cyan">▹</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neon-purple">Education</p>
            <ul className="grid gap-3 text-sm">
              {education.map((e) => (
                <li key={e.title}>
                  <p className="text-slate-200">{e.title}</p>
                  <p className="text-xs text-slate-500">{e.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  )
}

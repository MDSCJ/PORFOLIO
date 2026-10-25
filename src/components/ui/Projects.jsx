import Section from './Section'
import { projects } from '../../data/portfolio'

function ProjectCard({ project, index }) {
  const Wrapper = project.link ? 'a' : 'article'
  const linkProps = project.link ? { href: project.link, target: '_blank', rel: 'noreferrer' } : {}

  return (
    <Wrapper {...linkProps} className="glass glow-hover group relative flex flex-col overflow-hidden rounded-2xl p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-neon-cyan/15 via-transparent to-neon-purple/15 opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="flex items-baseline justify-between">
        <span className="font-display text-xs text-white/30">{String(index + 1).padStart(2, '0')}</span>
        <span className="text-xs text-slate-500">{project.year}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold transition group-hover:text-neon-cyan">
        {project.title}
        {project.link && <span className="ml-1 text-sm text-slate-500 group-hover:text-neon-cyan">↗</span>}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{project.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <span key={t} className="rounded-full border border-neon-purple/30 px-2.5 py-0.5 text-[11px] text-neon-purple">
            {t}
          </span>
        ))}
      </div>
    </Wrapper>
  )
}

export default function Projects() {
  return (
    <Section id="work">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display mb-8 text-3xl font-bold uppercase tracking-widest md:text-4xl">Work</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </Section>
  )
}

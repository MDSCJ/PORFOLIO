import { contact, profile, sections } from '../../data/portfolio'

const socials = [
  ['GitHub', contact.github],
  ['LinkedIn', contact.linkedin],
  ['Telegram', contact.telegram],
  ['Email', `mailto:${contact.email}`],
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative px-5 pb-8 sm:px-8 md:px-16">
      <div className="glass mx-auto grid max-w-6xl gap-8 rounded-2xl p-6 md:grid-cols-[1.4fr_1fr_1fr] md:p-8">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-neon-cyan">{profile.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">{profile.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neon-purple">Navigate</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-300 transition hover:text-neon-cyan"
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neon-purple">Connect</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {socials.map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="text-slate-300 transition hover:text-neon-cyan"
                >
                  {label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between md:col-span-3">
          <p>
            © {year} {profile.fullName}. All rights reserved.
          </p>
          <p>Built with React, Three.js & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}

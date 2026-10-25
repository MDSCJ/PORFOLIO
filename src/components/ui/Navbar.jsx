import { useState } from 'react'
import { sections } from '../../data/portfolio'

const linkClass =
  'rounded-full px-4 py-1.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white hover:shadow-[0_0_16px_-4px_var(--color-neon-cyan)]'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const goTo = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      {/* Desktop: floating pill */}
      <nav className="glass hidden items-center gap-1 rounded-full px-2 py-2 md:flex">
        <span className="font-display px-3 text-xs font-bold tracking-[0.3em] text-neon-cyan">CJ</span>
        {sections.map((s) => (
          <button key={s.id} onClick={() => goTo(s.id)} className={linkClass}>
            {s.label}
          </button>
        ))}
      </nav>

      {/* Mobile: compact bar with a dropdown */}
      <nav className={`glass w-full rounded-2xl transition-colors md:hidden ${open ? '!bg-[#0a0c14]/95' : ''}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => goTo('home')} className="font-display text-xs font-bold tracking-[0.3em] text-neon-cyan">
            CJ
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="relative h-8 w-8 rounded-lg text-slate-200"
          >
            <span className={`absolute left-1.5 right-1.5 h-0.5 rounded bg-current transition ${open ? 'top-1/2 rotate-45' : 'top-2.5'}`} />
            <span className={`absolute left-1.5 right-1.5 top-1/2 h-0.5 rounded bg-current transition ${open ? 'opacity-0' : ''}`} />
            <span className={`absolute left-1.5 right-1.5 h-0.5 rounded bg-current transition ${open ? 'top-1/2 -rotate-45' : 'bottom-2.5'}`} />
          </button>
        </div>
        {open && (
          <div className="grid gap-1 border-t border-white/10 p-2">
            {sections.map((s) => (
              <button key={s.id} onClick={() => goTo(s.id)} className={`${linkClass} py-2.5 text-left`}>
                {s.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}

import Section from './Section'
import { contact } from '../../data/portfolio'

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-neon-cyan/70 focus:shadow-[0_0_20px_-6px_var(--color-neon-cyan)]'

export default function Contact() {
  // No backend yet: open the visitor's mail client with the message prefilled.
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const subject = encodeURIComponent(`Portfolio inquiry from ${data.get('name')}`)
    const body = encodeURIComponent(`${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`)
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
  }

  return (
    <Section id="contact" className="justify-end">
      <div className="ml-auto max-w-md">
        <form onSubmit={handleSubmit} className="glass grid gap-4 rounded-2xl p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold uppercase tracking-widest">Contact</h2>
          <input name="name" required placeholder="Name" className={inputClass} />
          <input name="email" type="email" required placeholder="Email" className={inputClass} />
          <textarea name="message" required rows={4} placeholder="Message" className={inputClass} />
          <button
            type="submit"
            className="rounded-lg border border-neon-cyan/50 bg-neon-cyan/10 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-neon-cyan transition hover:bg-neon-cyan/20 hover:shadow-[0_0_28px_-6px_var(--color-neon-cyan)]"
          >
            Transmit
          </button>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-2 text-xs text-slate-400">
            <a href={`mailto:${contact.email}`} className="hover:text-neon-cyan">{contact.email}</a>
            <span className="flex gap-4">
              <a href={contact.github} target="_blank" rel="noreferrer" className="hover:text-neon-cyan">GitHub ↗</a>
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-neon-cyan">LinkedIn ↗</a>
              <a href={contact.telegram} target="_blank" rel="noreferrer" className="hover:text-neon-cyan">Telegram ↗</a>
            </span>
          </div>
        </form>
      </div>
    </Section>
  )
}

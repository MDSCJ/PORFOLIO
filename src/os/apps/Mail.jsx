import { useState } from 'react'
import { contact, profile } from '../../data/portfolio'
import { Avatar, G } from '../icons'
import { useViewport } from '../store'
import { Button } from './ui'

const WELCOME = {
  id: 'welcome',
  from: profile.name,
  address: contact.email,
  subject: 'Thanks for stopping by! 👋',
  preview: "Hi there — thanks for visiting my portfolio. Here's how to reach me…",
  date: new Date(),
  body: [
    'Hi there,',
    "Thanks for visiting my portfolio! I'm a Computer Science & Engineering undergraduate at the University of Moratuwa, working across computer vision, backend engineering and hardware logic.",
    "If you'd like to collaborate, talk about an opportunity, or just say hello, hit New mail — it'll open your email app with everything filled in.",
    'You can also find me here:',
  ],
  links: [
    ['GitHub', contact.github],
    ['LinkedIn', contact.linkedin],
    ['Telegram', contact.telegram],
  ],
}

const field = 'w-full border-b border-line bg-transparent px-1 py-2 text-sm outline-none placeholder:text-fg-2 focus:border-accent'

function Compose({ onSent, onDiscard }) {
  const [form, setForm] = useState({ from: '', subject: '', body: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const send = (e) => {
    e.preventDefault()
    const body = `${form.body}\n\n— ${form.from}`
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`
    onSent({ ...form, id: Date.now(), date: new Date() })
  }

  return (
    <form onSubmit={send} className="flex h-full flex-col gap-1 p-5">
      <div className="mb-2 flex items-center gap-2">
        <Button primary type="submit" className="flex items-center gap-2">
          <G.Send size={14} /> Send
        </Button>
        <Button type="button" onClick={onDiscard} className="flex items-center gap-2">
          <G.Trash size={14} /> Discard
        </Button>
      </div>
      <p className="border-b border-line px-1 py-2 text-sm">
        <span className="text-fg-2">To: </span>
        {profile.name} &lt;{contact.email}&gt;
      </p>
      <input required type="email" value={form.from} onChange={set('from')} placeholder="Your email" className={field} />
      <input required value={form.subject} onChange={set('subject')} placeholder="Add a subject" className={field} />
      <textarea required value={form.body} onChange={set('body')} placeholder="Write your message…" className={`${field} os-scroll mt-2 flex-1 resize-none border-b-0`} />
      <p className="text-xs text-fg-2">Sending opens your default email app with this message.</p>
    </form>
  )
}

export default function Mail() {
  const { mobile } = useViewport()
  const [folder, setFolder] = useState('inbox')
  const [sent, setSent] = useState([])
  const [openId, setOpenId] = useState(mobile ? null : 'welcome')
  const [composing, setComposing] = useState(false)

  const list = folder === 'inbox' ? [WELCOME] : sent
  const message = list.find((m) => m.id === openId)
  const showList = !mobile || (!message && !composing)
  const showPane = !mobile || message || composing

  return (
    <div className="absolute inset-0 flex bg-solid/80 text-sm">
      {!mobile && (
        <nav className="w-52 shrink-0 border-r border-line p-3">
          <Button primary onClick={() => setComposing(true)} className="mb-4 flex w-full items-center justify-center gap-2">
            <G.Edit size={14} /> New mail
          </Button>
          {[
            ['inbox', 'Inbox', <G.Inbox key="i" size={16} />, 1],
            ['sent', 'Sent items', <G.Send key="s" size={16} />, sent.length],
          ].map(([id, label, icon, count]) => (
            <button
              key={id}
              onClick={() => {
                setFolder(id)
                setOpenId(id === 'inbox' ? 'welcome' : sent[0]?.id)
                setComposing(false)
              }}
              className={`relative mb-0.5 flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-hover ${folder === id ? 'bg-active' : ''}`}
            >
              {folder === id && <span className="absolute left-0 h-4 w-[3px] rounded-full bg-accent" />}
              {icon}
              <span className="flex-1 text-left">{label}</span>
              {count > 0 && <span className="text-xs text-fg-2">{count}</span>}
            </button>
          ))}
        </nav>
      )}

      {showList && (
        <div className={`os-scroll shrink-0 overflow-y-auto border-r border-line ${mobile ? 'flex-1' : 'w-80'}`}>
          <div className="flex items-center justify-between px-4 py-3">
            <p className="font-semibold">{folder === 'inbox' ? 'Inbox' : 'Sent items'}</p>
            {mobile && (
              <Button primary onClick={() => setComposing(true)} className="flex items-center gap-2 !px-3 !py-1">
                <G.Edit size={13} /> New
              </Button>
            )}
          </div>
          {list.length === 0 && <p className="px-4 py-8 text-center text-fg-2">Nothing here yet.</p>}
          {list.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setOpenId(m.id)
                setComposing(false)
              }}
              className={`relative flex w-full gap-3 border-b border-line px-4 py-3 text-left hover:bg-hover ${openId === m.id && !composing ? 'bg-active' : ''}`}
            >
              {m.id === 'welcome' && <span className="absolute left-0 top-3 h-10 w-[3px] bg-accent" />}
              <Avatar size={34} />
              <span className="min-w-0 flex-1">
                <span className="flex justify-between gap-2">
                  <span className="truncate font-semibold">{m.from ?? `To: ${profile.name}`}</span>
                  <span className="shrink-0 text-xs text-fg-2">{m.date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                </span>
                <span className="block truncate text-accent">{m.subject}</span>
                <span className="block truncate text-xs text-fg-2">{m.preview ?? m.body}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {showPane && (
        <div className="os-scroll min-w-0 flex-1 overflow-y-auto">
          {mobile && (message || composing) && (
            <button
              onClick={() => {
                setOpenId(null)
                setComposing(false)
              }}
              className="flex items-center gap-2 px-4 pt-3 text-fg-2"
            >
              <G.ArrowLeft size={14} /> Back
            </button>
          )}
          {composing ? (
            <Compose
              onDiscard={() => setComposing(false)}
              onSent={(m) => {
                setSent((s) => [m, ...s])
                setComposing(false)
                setFolder('sent')
                setOpenId(m.id)
              }}
            />
          ) : message ? (
            <article className="p-6">
              <h2 className="mb-4 font-display text-xl font-semibold">{message.subject}</h2>
              <div className="mb-6 flex items-center gap-3">
                <Avatar size={40} />
                <div>
                  <p className="font-semibold">{message.id === 'welcome' ? message.from : `You (${message.from})`}</p>
                  <p className="text-xs text-fg-2">{message.address ?? `To: ${contact.email}`}</p>
                </div>
              </div>
              <div className="grid max-w-xl gap-3 leading-relaxed">
                {(Array.isArray(message.body) ? message.body : [message.body]).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {message.links && (
                  <ul className="grid gap-1">
                    {message.links.map(([label, url]) => (
                      <li key={label}>
                        <a href={url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                          {label} — {url.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                {message.id === 'welcome' && (
                  <p className="mt-2">
                    Cheers,
                    <br />
                    {profile.name}
                  </p>
                )}
              </div>
              {message.id === 'welcome' && (
                <Button primary onClick={() => setComposing(true)} className="mt-6 flex items-center gap-2">
                  <G.Send size={14} /> Reply
                </Button>
              )}
            </article>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-fg-2">
              <G.Inbox size={28} />
              <p>Select an item to read</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

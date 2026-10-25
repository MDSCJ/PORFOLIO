import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { contact, profile } from '../../data/portfolio'
import { useBattery } from '../../os/components/Taskbar'
import { Avatar, G } from '../../os/icons'
import { ACCENTS, useSettings } from '../../os/store'
import { useAndroidBack } from '../back'

/* ---------------------------------------------------------------- Controls */

function M3Switch({ on, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onChange(!on)
      }}
      className={`relative h-8 w-[52px] shrink-0 rounded-full border-2 transition-colors ${on ? 'border-accent bg-accent' : 'border-fg-2/60 bg-surface'}`}
    >
      <span
        className={`absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full transition-all ${
          on ? 'left-[22px] h-6 w-6 bg-accent-fg text-accent' : 'left-1.5 h-4 w-4 bg-fg-2'
        }`}
      >
        {on && (
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
        )}
      </span>
    </button>
  )
}

function Row({ title, summary, icon, onClick, children }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag onClick={onClick} className={`flex w-full items-center gap-4 px-6 py-4 text-left ${onClick ? 'active:bg-hover' : ''}`}>
      {icon && <span className="text-fg-2">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-base">{title}</span>
        {summary && <span className="block text-sm text-fg-2">{summary}</span>}
      </span>
      {children}
    </Tag>
  )
}

function SwitchRow({ title, summary, on, onChange }) {
  return (
    <Row title={title} summary={summary} onClick={() => onChange(!on)}>
      <M3Switch label={title} on={on} onChange={onChange} />
    </Row>
  )
}

function Group({ title, children }) {
  return (
    <section className="mb-2">
      {title && <p className="px-6 pb-1 pt-4 text-sm font-medium text-accent">{title}</p>}
      {children}
    </section>
  )
}

function RangeRow({ title, icon, value, onChange, min = 0 }) {
  return (
    <div className="px-6 py-4">
      <p className="mb-3 text-base">{title}</p>
      <label className="flex items-center gap-4 text-fg-2">
        {icon}
        <input
          type="range"
          min={min}
          max="100"
          value={value}
          aria-label={title}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1.5 flex-1 accent-[var(--accent)]"
        />
      </label>
    </div>
  )
}

/* ------------------------------------------------------------------- Pages */

const CATEGORIES = [
  { id: 'network', title: 'Network & internet', summary: 'Wi-Fi, airplane mode', icon: G.Wifi, tint: '#4285f4' },
  { id: 'devices', title: 'Connected devices', summary: 'Bluetooth', icon: G.Bluetooth, tint: '#34a853' },
  { id: 'display', title: 'Display', summary: 'Dark theme, brightness, Night Light', icon: G.Sun, tint: '#f9ab00' },
  { id: 'style', title: 'Wallpaper & style', summary: 'Colours, themed icons', icon: G.Brush, tint: '#e8710a' },
  { id: 'sound', title: 'Sound & vibration', summary: 'Volume', icon: G.Volume, tint: '#a142f4' },
  { id: 'battery', title: 'Battery', summary: null, icon: G.Battery, tint: '#1e8e3e' },
  { id: 'about', title: 'About phone', summary: `${profile.name}'s Phone`, icon: G.Info, tint: '#5f6368' },
]

function Home({ go, battery }) {
  const [q, setQ] = useState('')
  const items = CATEGORIES.filter((c) => `${c.title} ${c.summary ?? ''}`.toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <>
      <h1 className="px-6 pb-6 pt-10 font-display text-4xl">Settings</h1>
      <label className="mx-4 mb-4 flex h-14 items-center gap-3 rounded-full bg-surface px-5">
        <G.Search size={18} className="text-fg-2" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Settings" className="flex-1 bg-transparent text-base outline-none placeholder:text-fg-2" />
      </label>
      {!q && (
        <button onClick={() => go('account')} className="mx-4 mb-3 flex w-[calc(100%-2rem)] items-center gap-4 rounded-[28px] bg-surface p-4 text-left active:bg-hover">
          <Avatar size={52} />
          <span className="min-w-0">
            <span className="block truncate text-lg">{profile.fullName}</span>
            <span className="block truncate text-sm text-fg-2">{contact.email}</span>
          </span>
        </button>
      )}
      <div className="mx-4 overflow-hidden rounded-[28px] bg-surface">
        {items.map((c) => (
          <button key={c.id} onClick={() => go(c.id)} className="flex w-full items-center gap-4 px-4 py-4 text-left active:bg-hover">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white" style={{ background: c.tint }}>
              <c.icon size={18} level={battery.level} />
            </span>
            <span className="min-w-0">
              <span className="block text-base">{c.title}</span>
              <span className="block truncate text-sm text-fg-2">{c.id === 'battery' ? `${Math.round(battery.level * 100)}%${battery.charging ? ' · Charging' : ''}` : c.summary}</span>
            </span>
          </button>
        ))}
        {!items.length && <p className="px-6 py-8 text-center text-fg-2">No results for “{q}”</p>}
      </div>
    </>
  )
}

function Page({ id, s, update, battery, onDeveloper }) {
  const [taps, setTaps] = useState(0)
  switch (id) {
    case 'network':
      return (
        <Group>
          <SwitchRow title="Wi-Fi" summary={s.wifi && !s.airplane ? 'Connected to CJ-Portfolio' : 'Off'} on={s.wifi && !s.airplane} onChange={(v) => update({ wifi: v, airplane: false })} />
          <SwitchRow title="Airplane mode" on={s.airplane} onChange={(v) => update({ airplane: v })} />
          <Row title="Mobile network" summary="Portfolio LTE · 5G" />
        </Group>
      )
    case 'devices':
      return (
        <Group>
          <SwitchRow title="Use Bluetooth" summary={s.bluetooth && !s.airplane ? `Visible as "${profile.name}'s Phone"` : 'Off'} on={s.bluetooth && !s.airplane} onChange={(v) => update({ bluetooth: v, airplane: false })} />
          <Row title="Previously connected devices" summary="CHAMATH-PC" />
        </Group>
      )
    case 'display':
      return (
        <>
          <Group title="Appearance">
            <SwitchRow title="Dark theme" on={s.theme === 'dark'} onChange={(v) => update({ theme: v ? 'dark' : 'light' })} />
          </Group>
          <Group title="Brightness">
            <RangeRow title="Brightness level" icon={<G.Sun size={18} />} min={20} value={s.brightness} onChange={(v) => update({ brightness: v })} />
          </Group>
          <Group title="Colour">
            <SwitchRow title="Night Light" summary="Tints your screen amber" on={s.nightLight} onChange={(v) => update({ nightLight: v })} />
          </Group>
        </>
      )
    case 'style':
      return (
        <Group title="Colour palette">
          <div className="grid grid-cols-4 gap-4 px-6 py-3">
            {ACCENTS.map((a) => (
              <button
                key={a}
                aria-label={`Colour ${a}`}
                onClick={() => update({ accent: a })}
                className={`flex aspect-square items-center justify-center rounded-full transition ${s.accent === a ? 'ring-4 ring-fg/70' : ''}`}
                style={{ background: `conic-gradient(${a} 0 50%, color-mix(in srgb, ${a} 45%, white) 50% 75%, color-mix(in srgb, ${a} 55%, black) 75%)` }}
              >
                {s.accent === a && <span className="h-3 w-3 rounded-full bg-white" />}
              </button>
            ))}
          </div>
          <SwitchRow title="Dark theme" on={s.theme === 'dark'} onChange={(v) => update({ theme: v ? 'dark' : 'light' })} />
        </Group>
      )
    case 'sound':
      return (
        <Group>
          <RangeRow title="Media volume" icon={<G.Volume size={18} level={s.volume} />} value={s.volume} onChange={(v) => update({ volume: v })} />
        </Group>
      )
    case 'battery':
      return (
        <>
          <div className="mx-4 mb-2 rounded-[28px] bg-surface p-6">
            <p className="font-display text-5xl">{Math.round(battery.level * 100)}%</p>
            <p className="mt-1 text-sm text-fg-2">{battery.charging ? 'Charging' : battery.known ? 'On battery' : 'Battery info unavailable in this browser'}</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-accent" style={{ width: `${battery.level * 100}%` }} />
            </div>
          </div>
          <Group>
            <SwitchRow title="Battery Saver" summary="Turns on Dark theme and limits background activity" on={s.batterySaver} onChange={(v) => update(v ? { batterySaver: true, theme: 'dark' } : { batterySaver: false })} />
          </Group>
        </>
      )
    case 'account':
      return (
        <>
          <div className="flex flex-col items-center gap-2 px-6 pb-6 pt-2 text-center">
            <Avatar size={96} />
            <p className="mt-2 text-2xl">{profile.fullName}</p>
            <p className="text-sm text-fg-2">{profile.role}</p>
          </div>
          <Group title="Linked accounts">
            {[
              ['Email', contact.email, `mailto:${contact.email}`],
              ['GitHub', contact.github.replace(/^https:\/\//, ''), contact.github],
              ['LinkedIn', contact.linkedin.replace(/^https:\/\/(www\.)?/, ''), contact.linkedin],
              ['Telegram', contact.telegram.replace(/^https:\/\//, ''), contact.telegram],
            ].map(([title, summary, href]) => (
              <Row key={title} title={title} summary={summary} onClick={() => window.open(href, '_blank', 'noopener')}>
                <G.External size={16} className="text-fg-2" />
              </Row>
            ))}
          </Group>
        </>
      )
    case 'about':
      return (
        <>
          <div className="flex flex-col items-center gap-2 px-6 pb-4 pt-2 text-center">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-surface">
              <G.Monitor size={40} />
            </span>
            <p className="mt-2 text-2xl">{profile.name}'s Phone</p>
          </div>
          <Group title="Device details">
            <Row title="Device name" summary={`${profile.name}'s Phone`} />
            <Row title="Owner" summary={profile.fullName} />
            <Row title="Model" summary="Portfolio 1 (React · Vite · Three.js)" />
          </Group>
          <Group title="Software">
            <Row title="Android version" summary="15 — Portfolio build" />
            <Row title="Focus" summary={profile.focus.join(', ')} />
            <Row
              title="Build number"
              summary="CJ-25.10.portfolio"
              onClick={() => {
                const n = taps + 1
                setTaps(n)
                if (n === 7) onDeveloper('You are now a developer! 🎉')
                else if (n > 3 && n < 7) onDeveloper(`You are now ${7 - n} steps away from being a developer.`)
              }}
            />
          </Group>
        </>
      )
    default:
      return null
  }
}

const TITLES = { ...Object.fromEntries(CATEGORIES.map((c) => [c.id, c.title])), account: 'Account' }

// Material 3 style Settings for the Android shell; shares the same settings store as Windows.
export default function AndroidSettings() {
  const { settings: s, update } = useSettings()
  const battery = useBattery()
  const [stack, setStack] = useState(['home'])
  const [snack, setSnack] = useState(null)
  const page = stack[stack.length - 1]

  const back = useCallback(() => {
    if (stack.length === 1) return false
    setStack((st) => st.slice(0, -1))
    return true
  }, [stack.length])
  useAndroidBack(back)

  useEffect(() => {
    if (!snack) return
    const t = setTimeout(() => setSnack(null), 2200)
    return () => clearTimeout(t)
  }, [snack])

  return (
    <div className="absolute inset-0 bg-solid text-fg">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={page}
          initial={{ x: page === 'home' ? -40 : 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.2, 0.9, 0.3, 1] }}
          className="os-scroll absolute inset-0 overflow-y-auto pb-8"
        >
          {page === 'home' ? (
            <Home go={(id) => setStack((st) => [...st, id])} battery={battery} />
          ) : (
            <>
              <header className="flex items-center gap-2 px-2 pt-2">
                <button aria-label="Navigate up" onClick={back} className="rounded-full p-3 active:bg-hover">
                  <G.ArrowLeft size={18} />
                </button>
              </header>
              <h1 className="px-6 pb-4 pt-6 font-display text-4xl">{TITLES[page]}</h1>
              <Page id={page} s={s} update={update} battery={battery} onDeveloper={setSnack} />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {snack && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="absolute inset-x-4 bottom-4 rounded-xl bg-[#313033] px-4 py-3 text-sm text-[#f4eff4] shadow-lg"
          >
            {snack}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

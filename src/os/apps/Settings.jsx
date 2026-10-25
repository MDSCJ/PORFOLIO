import { useState } from 'react'
import { contact, profile } from '../../data/portfolio'
import Wallpaper from '../components/Wallpaper'
import { Avatar, G } from '../icons'
import { ACCENTS, usePlatform, useSettings, useViewport, WALLPAPERS } from '../store'
import { Slider } from '../components/Flyouts'
import { Card, Switch } from './ui'

const PAGES = [
  { id: 'system', label: 'System', icon: <G.Monitor size={16} /> },
  { id: 'personalization', label: 'Personalization', icon: <G.Brush size={16} /> },
  { id: 'accounts', label: 'Accounts', icon: <G.User size={16} /> },
  { id: 'about', label: 'About', icon: <G.Info size={16} /> },
]

function Heading({ children }) {
  return <h1 className="mb-6 font-display text-[28px] font-semibold">{children}</h1>
}
function Section({ title, children }) {
  return (
    <section className="mb-6 grid gap-1">
      {title && <p className="mb-1.5 text-sm font-semibold">{title}</p>}
      {children}
    </section>
  )
}

function SystemPage() {
  const { settings: s, update } = useSettings()
  return (
    <>
      <Heading>System</Heading>
      <Section title="Display">
        <Card icon={<G.Sun size={18} />} title="Brightness" sub="Adjust the brightness of the built-in display">
          <div className="w-40">
            <Slider label="Brightness" value={s.brightness} onChange={(v) => update({ brightness: Math.max(20, v) })} />
          </div>
        </Card>
        <Card icon={<G.Moon size={18} />} title="Night light" sub="Use warmer colours to help block blue light">
          <span className="text-sm text-fg-2">{s.nightLight ? 'On' : 'Off'}</span>
          <Switch label="Night light" on={s.nightLight} onChange={(v) => update({ nightLight: v })} />
        </Card>
      </Section>
      <Section title="Sound">
        <Card icon={<G.Volume size={18} level={s.volume} />} title="Volume">
          <div className="w-40">
            <Slider label="Volume" value={s.volume} onChange={(v) => update({ volume: v })} />
          </div>
        </Card>
      </Section>
      <Section title="Power & battery">
        <Card icon={<G.Leaf size={18} />} title="Energy saver" sub="Extend battery life by limiting some notifications and background activity">
          <Switch label="Energy saver" on={s.batterySaver} onChange={(v) => update({ batterySaver: v })} />
        </Card>
      </Section>
      <Section title="Network">
        <Card icon={<G.Wifi size={18} off={!s.wifi} />} title="Wi-Fi" sub={s.wifi && !s.airplane ? 'Connected, secured · CJ-Portfolio' : 'Disconnected'}>
          <Switch label="Wi-Fi" on={s.wifi && !s.airplane} onChange={(v) => update({ wifi: v, airplane: false })} />
        </Card>
        <Card icon={<G.Bluetooth size={18} />} title="Bluetooth" sub={s.bluetooth && !s.airplane ? 'Discoverable as "CHAMATH-PC"' : 'Off'}>
          <Switch label="Bluetooth" on={s.bluetooth && !s.airplane} onChange={(v) => update({ bluetooth: v, airplane: false })} />
        </Card>
      </Section>
    </>
  )
}

function PersonalizationPage() {
  const { settings: s, update } = useSettings()
  return (
    <>
      <Heading>Personalization</Heading>
      <div className="mb-6 overflow-hidden rounded-lg border border-line">
        <div className="relative aspect-[16/7]">
          <Wallpaper name={s.wallpaper} theme={s.theme} />
          <div className="absolute inset-x-[30%] bottom-0 h-3 rounded-t bg-taskbar acrylic" />
        </div>
      </div>
      <Section title="Choose your mode">
        <div className="grid grid-cols-2 gap-3">
          {['light', 'dark'].map((t) => (
            <button
              key={t}
              onClick={() => update({ theme: t })}
              className={`overflow-hidden rounded-lg border-2 text-left transition ${s.theme === t ? 'border-accent' : 'border-line hover:border-fg-2'}`}
            >
              <div className="relative aspect-[16/9]">
                <Wallpaper name={s.wallpaper} theme={t} />
                <div className={`absolute bottom-2 left-1/2 h-1/3 w-1/2 -translate-x-1/2 rounded ${t === 'dark' ? 'bg-[#202020]/90' : 'bg-[#f3f3f3]/90'}`} />
              </div>
              <p className="px-3 py-2 text-sm capitalize">{t}</p>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Background">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {WALLPAPERS.map((w) => (
            <button
              key={w}
              aria-label={`${w} wallpaper`}
              onClick={() => update({ wallpaper: w })}
              className={`relative aspect-[16/10] overflow-hidden rounded-lg border-2 transition ${s.wallpaper === w ? 'border-accent' : 'border-transparent hover:border-fg-2'}`}
            >
              <Wallpaper name={w} theme={s.theme} />
              <span className="absolute bottom-1.5 left-2 text-xs capitalize text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.8)]">{w}</span>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Accent color">
        <div className="flex flex-wrap gap-2 rounded-md border border-line bg-surface p-4">
          {ACCENTS.map((a) => (
            <button
              key={a}
              aria-label={`Accent ${a}`}
              onClick={() => update({ accent: a })}
              style={{ background: a }}
              className={`h-10 w-10 rounded-md transition hover:scale-105 ${s.accent === a ? 'ring-2 ring-fg ring-offset-2 ring-offset-transparent' : ''}`}
            />
          ))}
        </div>
      </Section>
    </>
  )
}

function AccountsPage() {
  return (
    <>
      <Heading>Accounts</Heading>
      <div className="mb-6 flex items-center gap-5 rounded-lg border border-line bg-surface p-5">
        <Avatar size={88} />
        <div>
          <p className="text-xl font-semibold">{profile.fullName}</p>
          <p className="text-sm text-fg-2">{profile.role}</p>
          <p className="text-sm text-fg-2">{contact.email}</p>
          <p className="mt-1 text-xs text-accent">Administrator</p>
        </div>
      </div>
      <Section title="Linked accounts">
        {[
          ['GitHub', contact.github],
          ['LinkedIn', contact.linkedin],
          ['Telegram', contact.telegram],
        ].map(([label, url]) => (
          <a key={label} href={url} target="_blank" rel="noreferrer" className="block">
            <Card icon={<G.External size={16} />} title={label} sub={url.replace(/^https?:\/\/(www\.)?/, '')} className="hover:bg-hover">
              <G.ChevronRight size={14} className="text-fg-2" />
            </Card>
          </a>
        ))}
      </Section>
    </>
  )
}

function AboutPage() {
  const android = usePlatform() === 'android'
  const specs = [
    ['Device name', android ? "Chamath's Phone" : 'CHAMATH-PC'],
    ['Owner', profile.fullName],
    ['Processor', 'Curiosity-driven, overclocked by late-night hackathons'],
    ['Focus', profile.focus.join(', ')],
    ['System type', 'React 19 · Vite · Three.js · Tailwind CSS'],
  ]
  const windows = [
    ['Edition', android ? 'Android 15 — Portfolio build' : 'Windows 11 Portfolio Edition'],
    ['Version', android ? 'CJ-25.10' : '25H2'],
    ['Installed on', new Date().toLocaleDateString()],
  ]
  return (
    <>
      <Heading>About</Heading>
      <div className="mb-6 flex items-center gap-4 rounded-lg border border-line bg-surface p-5">
        <div className="flex h-14 w-20 items-center justify-center rounded-md bg-gradient-to-br from-[#0b5cd5] to-[#22d3ee]">
          <G.Monitor size={28} className="text-white" />
        </div>
        <div>
          <p className="text-lg font-semibold">{android ? "Chamath's Phone" : 'CHAMATH-PC'}</p>
          <p className="text-sm text-fg-2">{android ? 'Portfolio handset' : 'Portfolio workstation'}</p>
        </div>
      </div>
      {[
        ['Device specifications', specs],
        [android ? 'Software information' : 'Windows specifications', windows],
      ].map(([title, rows]) => (
        <Section key={title} title={title}>
          <div className="rounded-md border border-line bg-surface px-5 py-3">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[150px_1fr] gap-4 py-1.5 text-sm">
                <span className="text-fg-2">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </>
  )
}

const PAGE_COMPONENTS = { system: SystemPage, personalization: PersonalizationPage, accounts: AccountsPage, about: AboutPage }

export default function Settings({ win }) {
  const { mobile } = useViewport()
  const [page, setPage] = useState(win.props.page ?? 'personalization')
  const [lastProp, setLastProp] = useState(win.props.page)
  // Re-opening Settings on a specific page (e.g. from the desktop menu) switches to it.
  if (win.props.page !== lastProp) {
    setLastProp(win.props.page)
    if (win.props.page) setPage(win.props.page)
  }
  const Page = PAGE_COMPONENTS[page]

  return (
    <div className="absolute inset-0 flex bg-solid/80">
      <nav className={`os-scroll shrink-0 overflow-y-auto p-3 ${mobile ? 'w-16' : 'w-64'}`}>
        {!mobile && (
          <div className="mb-4 flex items-center gap-3 px-2 py-2">
            <Avatar size={56} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{profile.name}</p>
              <p className="truncate text-xs text-fg-2">Local account</p>
            </div>
          </div>
        )}
        {PAGES.map((p) => (
          <button
            key={p.id}
            aria-label={p.label}
            onClick={() => setPage(p.id)}
            className={`relative mb-0.5 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-hover ${page === p.id ? 'bg-active' : ''}`}
          >
            {page === p.id && <span className="absolute left-0 h-4 w-[3px] rounded-full bg-accent" />}
            {p.icon}
            {!mobile && p.label}
          </button>
        ))}
      </nav>
      <main className="os-scroll min-w-0 flex-1 overflow-y-auto px-5 py-6 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <Page />
        </div>
      </main>
    </div>
  )
}

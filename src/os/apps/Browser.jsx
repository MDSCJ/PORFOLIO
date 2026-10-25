import { useEffect, useState } from 'react'
import { contact, projects, publications } from '../../data/portfolio'
import { BrowserIcon, G, PortfolioIcon } from '../icons'
import { usePlatform, useWindows } from '../store'
import GitHubPage from '../web/GitHubPage'
import LinkedInPage from '../web/LinkedInPage'
import { PORTFOLIO_URL } from './Portfolio'
import { apps } from './registry'
import { IconButton } from './ui'

const portfolioHref = () => new URL(PORTFOLIO_URL, window.location.href).href
const bare = (url) => url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '').toLowerCase()

// Built-in pages. GitHub and LinkedIn block framing, so they're rendered natively (see web/).
const PAGES = {
  newtab: { address: '', title: 'New tab', icon: () => <BrowserIcon size={14} /> },
  portfolio: { address: () => portfolioHref(), real: () => portfolioHref(), title: 'Chamath Jayasinghe — Portfolio', icon: () => <PortfolioIcon size={14} /> },
  github: { address: contact.github, real: () => contact.github, title: 'Chamath Jayasinghe · GitHub', icon: () => <apps.github.Icon size={14} />, Component: GitHubPage },
  linkedin: { address: contact.linkedin, real: () => contact.linkedin, title: 'Chamath Jayasinghe | LinkedIn', icon: () => <apps.linkedin.Icon size={14} />, Component: LinkedInPage },
}
const value = (v) => (typeof v === 'function' ? v() : v)

const QUICK_LINKS = [
  { label: 'Portfolio', page: 'portfolio', icon: <PortfolioIcon size={36} /> },
  { label: 'GitHub', page: 'github', app: 'github' },
  { label: 'LinkedIn', page: 'linkedin', app: 'linkedin' },
  { label: 'Seraffins', url: projects.find((p) => p.title === 'Team Seraffins')?.link },
  { label: 'Sharks International', url: publications[0]?.link },
].filter((l) => l.page || l.url)

const openExternal = (url) => window.open(url, '_blank', 'noopener')

// Address-bar input → { page } for built-in pages, or { external } for everything else.
function route(input) {
  const v = input.trim()
  if (!v) return null
  const b = bare(v)
  if (b === 'edge://newtab') return { page: 'newtab' }
  if (v === 'portfolio' || v.startsWith(portfolioHref())) return { page: 'portfolio' }
  if (b === bare(contact.github) || b === 'github.com') return { page: 'github' }
  if (b === bare(contact.linkedin) || b === 'linkedin.com') return { page: 'linkedin' }
  if (/^https?:\/\//i.test(v)) return { external: v }
  if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(v)) return { external: `https://${v}` }
  return { external: `https://www.bing.com/search?q=${encodeURIComponent(v)}` }
}

function NewTabPage({ navigate }) {
  const [q, setQ] = useState('')
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="os-scroll absolute inset-0 overflow-y-auto bg-gradient-to-br from-[#0b2a4a] via-[#0a1830] to-[#1a1033] text-white">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 pt-[12vh]">
        <p className="mb-6 text-3xl font-semibold">{greeting}</p>
        <form
          className="flex h-12 w-full items-center gap-3 rounded-full bg-white px-5 text-[#1b1b1b] shadow-xl"
          onSubmit={(e) => {
            e.preventDefault()
            const t = route(q)
            if (t) navigate(t)
          }}
        >
          <G.Search size={16} className="text-[#5c5c5c]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the web"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#7a7a7a]"
          />
        </form>
        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {QUICK_LINKS.map((l) => {
            const Icon = l.app && apps[l.app].Icon
            return (
              <button
                key={l.label}
                onClick={() => navigate(l.page ? { page: l.page } : { external: l.url })}
                className="flex flex-col items-center gap-2 rounded-lg p-3 transition hover:bg-white/10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-lg font-bold text-[#0a1830]">
                  {l.icon ?? (Icon ? <Icon size={34} /> : l.label[0])}
                </span>
                <span className="text-xs">{l.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function Browser({ win }) {
  const wm = useWindows()
  const platform = usePlatform()
  const [nav, setNav] = useState(() => ({ stack: [win.props.page ?? 'newtab'], index: 0 }))
  const [address, setAddress] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const pageId = nav.stack[nav.index]
  const page = PAGES[pageId]

  const navigate = (target) => {
    if (target.external) return openExternal(target.external)
    setNav((n) => (n.stack[n.index] === target.page ? n : { stack: [...n.stack.slice(0, n.index + 1), target.page], index: n.index + 1 }))
  }
  const step = (d) => setNav((n) => ({ ...n, index: Math.min(Math.max(0, n.index + d), n.stack.length - 1) }))

  // Re-opening the (single-instance) browser with a page — e.g. from the GitHub app — navigates to it.
  useEffect(() => {
    if (win.props.nav && win.props.page) navigate({ page: win.props.page })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.props.nav])

  useEffect(() => {
    setAddress(value(page.address))
    wm.setProps(win.id, { title: `${page.title} - ${platform === 'android' ? 'Browser' : 'Edge'}` })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

  const PageComponent = page.Component

  return (
    <div className="absolute inset-0 flex flex-col bg-solid">
      {platform !== 'android' && (
        <div className="flex items-end gap-1 bg-black/5 px-2 pt-1.5 dark:bg-black/25">
          <div className="flex h-8 w-60 items-center gap-2 rounded-t-lg bg-solid px-3 text-xs">
            {page.icon()}
            <span className="flex-1 truncate">{page.title}</span>
            <button aria-label="Close tab" onClick={() => wm.close(win.id)} className="rounded p-0.5 hover:bg-hover">
              <G.Close size={11} />
            </button>
          </div>
          <IconButton label="New tab" className="mb-0.5 h-7 w-7" onClick={() => navigate({ page: 'newtab' })}>
            <G.Plus size={13} />
          </IconButton>
        </div>
      )}

      <div className="flex items-center gap-1 border-b border-line px-2 py-1.5">
        <IconButton label="Back" disabled={nav.index === 0} onClick={() => step(-1)}>
          <G.ArrowLeft size={14} />
        </IconButton>
        {platform !== 'android' && (
          <IconButton label="Forward" disabled={nav.index === nav.stack.length - 1} onClick={() => step(1)}>
            <G.ArrowRight size={14} />
          </IconButton>
        )}
        <IconButton label="Refresh" onClick={() => setReloadKey((k) => k + 1)}>
          <G.Refresh size={14} />
        </IconButton>
        <form
          className="mx-1 flex h-8 min-w-0 flex-1 items-center gap-2 rounded-full bg-input px-4 text-sm focus-within:ring-2 focus-within:ring-accent"
          onSubmit={(e) => {
            e.preventDefault()
            const t = route(address)
            if (t) navigate(t)
          }}
        >
          {pageId !== 'newtab' && <G.Lock size={12} className="text-fg-2" />}
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="Search or enter web address"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-2"
          />
        </form>
        {platform === 'android' && (
          <IconButton label="Start page" onClick={() => navigate({ page: 'newtab' })}>
            <G.Home size={14} />
          </IconButton>
        )}
        {page.real && (
          <IconButton label="Open in new browser tab" onClick={() => openExternal(page.real())}>
            <G.External size={14} />
          </IconButton>
        )}
      </div>

      <div className="relative min-h-0 flex-1">
        {pageId === 'newtab' ? (
          <NewTabPage key={reloadKey} navigate={navigate} />
        ) : pageId === 'portfolio' ? (
          <iframe key={reloadKey} src={PORTFOLIO_URL} title={page.title} className="absolute inset-0 h-full w-full border-0 bg-[#05060a]" />
        ) : (
          <PageComponent key={reloadKey} />
        )}
      </div>
    </div>
  )
}

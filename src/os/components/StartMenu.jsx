import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../../data/portfolio'
import { apps, startApps } from '../apps/registry'
import { allFiles, displayPath } from '../fs'
import { Avatar, G, LinkFileIcon, TextFileIcon } from '../icons'
import { launch } from '../launch'
import { useShell, useWindows } from '../store'

const RECOMMENDED = ['About Me.txt', 'Skills.txt', 'Shark Species Identification.txt', 'Snip Me.txt', 'Education.txt', 'Awards & Involvement.txt']

function FileIcon({ item, size = 28 }) {
  return item.type === 'link' ? <LinkFileIcon size={size} /> : <TextFileIcon size={size} />
}

function AppTile({ app, onOpen }) {
  return (
    <button onClick={onOpen} className="flex flex-col items-center gap-1.5 rounded-md px-1 py-3 transition hover:bg-hover active:scale-95">
      <app.Icon size={32} />
      <span className="w-full truncate text-center text-xs">{app.title}</span>
    </button>
  )
}

export default function StartMenu({ focusSearch }) {
  const wm = useWindows()
  const shell = useShell()
  const [query, setQuery] = useState('')
  const [view, setView] = useState('pinned') // 'pinned' | 'all'
  const [powerOpen, setPowerOpen] = useState(false)
  const inputRef = useRef(null)
  const files = useMemo(() => allFiles(), [])

  useEffect(() => {
    if (focusSearch) inputRef.current?.focus()
  }, [focusSearch])

  const run = (target) => {
    shell.closeFlyout()
    launch(wm, target)
  }

  const q = query.trim().toLowerCase()
  const results = q
    ? [
        ...Object.values(apps)
          .filter((a) => a.title.toLowerCase().includes(q))
          .map((a) => ({ key: a.id, label: a.title, sub: 'App', icon: <a.Icon size={28} />, go: () => run(a.id) })),
        ...files
          .filter((f) => f.name.toLowerCase().includes(q) || f.content?.toLowerCase().includes(q))
          .slice(0, 8)
          .map((f) => ({ key: f.path.join('/') + f.name, label: f.name, sub: displayPath(f.path), icon: <FileIcon item={f} />, go: () => run(f) })),
        {
          key: 'web',
          label: `Search the web for "${query.trim()}"`,
          sub: 'Opens in a new tab',
          icon: <G.Search size={20} />,
          go: () => {
            shell.closeFlyout()
            window.open(`https://www.bing.com/search?q=${encodeURIComponent(query.trim())}`, '_blank', 'noopener')
          },
        },
      ]
    : []

  const recommended = RECOMMENDED.map((n) => files.find((f) => f.name === n)).filter(Boolean)
  const allSorted = [...Object.values(apps)].sort((a, b) => a.title.localeCompare(b.title))

  const power = (action) => {
    shell.closeFlyout()
    if (action === 'lock') shell.setPower('lock')
    if (action === 'restart' || action === 'off') {
      wm.closeAll()
      sessionStorage.removeItem('cj-os-session')
      shell.setPower(action === 'restart' ? 'boot' : 'off')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40, transition: { duration: 0.12 } }}
      transition={{ duration: 0.22, ease: [0.1, 0.9, 0.2, 1] }}
      onPointerDown={(e) => {
        e.stopPropagation()
        if (!e.target.closest('[data-power]')) setPowerOpen(false)
      }}
      className="absolute bottom-[56px] left-1/2 z-[8500] flex max-h-[min(720px,calc(100dvh-72px))] w-[min(640px,calc(100vw-16px))] -translate-x-1/2 flex-col overflow-hidden rounded-lg border border-line bg-flyout acrylic os-shadow"
    >
      <div className="px-6 pb-2 pt-6 sm:px-8">
        <label className="flex h-9 items-center gap-3 rounded-full border border-line bg-input px-4 focus-within:border-b-2 focus-within:border-b-accent">
          <G.Search size={14} className="text-fg-2" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && results[0]?.go()}
            placeholder="Search for apps, settings, and documents"
            className="w-full bg-transparent text-sm outline-none placeholder:text-fg-2"
          />
        </label>
      </div>

      <div className="os-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-4 sm:px-8">
        {q ? (
          <div className="pt-3">
            <p className="mb-2 text-sm font-semibold">Best matches</p>
            {results.map((r) => (
              <button key={r.key} onClick={r.go} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-hover">
                <span className="flex w-8 justify-center">{r.icon}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm">{r.label}</span>
                  <span className="block truncate text-xs text-fg-2">{r.sub}</span>
                </span>
              </button>
            ))}
          </div>
        ) : view === 'all' ? (
          <div className="pt-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">All apps</p>
              <button onClick={() => setView('pinned')} className="flex items-center gap-1 rounded bg-surface px-2.5 py-1 text-xs hover:bg-hover">
                <G.ChevronLeft size={12} /> Back
              </button>
            </div>
            {allSorted.map((a, i) => (
              <div key={a.id}>
                {a.title[0] !== allSorted[i - 1]?.title[0] && <p className="px-3 pb-1 pt-3 text-xs font-semibold text-fg-2">{a.title[0]}</p>}
                <button onClick={() => run(a.id)} className="flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-sm hover:bg-hover">
                  <a.Icon size={24} />
                  {a.title}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-1 mt-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Pinned</p>
              <button onClick={() => setView('all')} className="flex items-center gap-1 rounded bg-surface px-2.5 py-1 text-xs hover:bg-hover">
                All apps <G.ChevronRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6">
              {startApps.map((a) => (
                <AppTile key={a.id} app={a} onOpen={() => run(a.id)} />
              ))}
            </div>

            <p className="mb-2 mt-5 text-sm font-semibold">Recommended</p>
            <div className="grid gap-1 sm:grid-cols-2">
              {recommended.map((f) => (
                <button key={f.name} onClick={() => run(f)} className="flex items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-hover">
                  <FileIcon item={f} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{f.name}</span>
                    <span className="block truncate text-xs text-fg-2">{displayPath(f.path)}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="relative flex items-center justify-between border-t border-line bg-black/5 px-6 py-3 dark:bg-black/15 sm:px-12">
        <button onClick={() => run('settings')} className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-hover">
          <Avatar size={32} />
          <span className="text-sm">{profile.name}</span>
        </button>
        <div data-power className="relative">
          <button aria-label="Power" onClick={() => setPowerOpen((o) => !o)} className="rounded-md p-2.5 hover:bg-hover">
            <G.Power size={16} />
          </button>
          {powerOpen && (
            <div className="absolute bottom-12 right-0 w-44 rounded-lg border border-line bg-flyout p-1 text-sm acrylic os-shadow">
              {[
                ['lock', 'Lock', <G.Lock key="l" />],
                ['off', 'Shut down', <G.Power key="p" />],
                ['restart', 'Restart', <G.Restart key="r" />],
              ].map(([id, label, icon]) => (
                <button key={id} onClick={() => power(id)} className="flex w-full items-center gap-3 rounded px-3 py-2 hover:bg-hover">
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

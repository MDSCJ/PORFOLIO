import { useState } from 'react'
import { apps } from './registry'
import { displayPath, HOME_PATH, QUICK_ACCESS, resolve } from '../fs'
import { DriveIcon, FolderIcon, G, LinkFileIcon, TextFileIcon, ThisPcIcon } from '../icons'
import { launch } from '../launch'
import { useViewport, useWindows } from '../store'
import { IconButton } from './ui'

function NodeIcon({ node, size }) {
  if (node.type === 'folder') return node.name.includes('(C:)') ? <DriveIcon size={size} /> : <FolderIcon size={size} />
  if (node.type === 'link') return <LinkFileIcon size={size} />
  if (node.icon === 'pc') return <ThisPcIcon size={size} />
  if (node.type === 'app') {
    const Icon = apps[node.appId].Icon
    return <Icon size={size} />
  }
  return <TextFileIcon size={size} />
}

const typeLabel = (n) =>
  n.type === 'folder' ? 'File folder' : n.type === 'link' ? 'Internet Shortcut' : n.type === 'app' ? 'Shortcut' : 'Text Document'

const sizeLabel = (n) => (n.type === 'file' ? `${Math.max(1, Math.ceil(new Blob([n.content]).size / 1024))} KB` : n.type === 'link' ? '1 KB' : '')

export default function Explorer({ win }) {
  const wm = useWindows()
  const { mobile } = useViewport()
  const [history, setHistory] = useState(() => ({ stack: [win.props.path ?? HOME_PATH], index: 0 }))
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState('tiles')
  const [filter, setFilter] = useState('')
  const [sidebar, setSidebar] = useState(!mobile)

  const path = history.stack[history.index]
  const node = resolve(path) ?? resolve(HOME_PATH)
  const isRoot = path.length === 1
  const items = (node.children ?? []).filter((c) => c.name.toLowerCase().includes(filter.trim().toLowerCase()))

  const go = (next) => {
    setSelected(null)
    setFilter('')
    setHistory((h) => ({ stack: [...h.stack.slice(0, h.index + 1), next], index: h.index + 1 }))
    wm.setProps(win.id, { title: next.length === 1 ? 'This PC' : next[next.length - 1] })
  }
  const step = (d) => {
    setSelected(null)
    setHistory((h) => {
      const index = Math.min(Math.max(0, h.index + d), h.stack.length - 1)
      const p = h.stack[index]
      wm.setProps(win.id, { title: p.length === 1 ? 'This PC' : p[p.length - 1] })
      return { ...h, index }
    })
  }
  const open = (item) => (item.type === 'folder' ? go([...path, item.name]) : launch(wm, item))

  return (
    <div className="absolute inset-0 flex flex-col bg-solid/60 text-sm">
      {/* Navigation + address bar */}
      <div className="flex items-center gap-1 border-b border-line px-2 py-1.5">
        <IconButton label="Back" disabled={history.index === 0} onClick={() => step(-1)}>
          <G.ArrowLeft size={14} />
        </IconButton>
        <IconButton label="Forward" disabled={history.index === history.stack.length - 1} onClick={() => step(1)}>
          <G.ArrowRight size={14} />
        </IconButton>
        <IconButton label="Up" disabled={isRoot} onClick={() => go(path.slice(0, -1))}>
          <G.ArrowUp size={14} />
        </IconButton>
        {mobile && (
          <IconButton label="Toggle navigation pane" onClick={() => setSidebar((s) => !s)}>
            <G.List size={14} />
          </IconButton>
        )}
        <div className="mx-1 flex h-8 min-w-0 flex-1 items-center gap-0.5 overflow-hidden rounded-md border border-line bg-input px-2">
          <ThisPcIcon size={16} />
          {path.map((part, i) => (
            <span key={i} className="flex shrink-0 items-center">
              <G.ChevronRight size={10} className="mx-0.5 text-fg-2" />
              <button onClick={() => go(path.slice(0, i + 1))} className="rounded px-1 py-0.5 hover:bg-hover">
                {part}
              </button>
            </span>
          ))}
        </div>
        <label className="hidden h-8 w-56 items-center gap-2 rounded-md border border-line bg-input px-3 sm:flex">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={`Search ${isRoot ? 'This PC' : path[path.length - 1]}`}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-2"
          />
          <G.Search size={13} className="text-fg-2" />
        </label>
      </div>

      {/* Command bar */}
      <div className="flex items-center gap-1 border-b border-line px-3 py-1">
        <button
          disabled={!selected}
          onClick={() => selected && open(selected)}
          className="flex items-center gap-2 rounded px-2.5 py-1.5 hover:bg-hover disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <G.ArrowRight size={14} /> Open
        </button>
        <div className="mx-1 h-5 w-px bg-line" />
        <button onClick={() => setView('tiles')} className={`rounded px-2.5 py-1.5 hover:bg-hover ${view === 'tiles' ? 'bg-active' : ''}`} aria-label="Large icons">
          <G.Grid size={14} />
        </button>
        <button onClick={() => setView('details')} className={`rounded px-2.5 py-1.5 hover:bg-hover ${view === 'details' ? 'bg-active' : ''}`} aria-label="Details">
          <G.List size={14} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {sidebar && (
          <nav className="os-scroll w-48 shrink-0 overflow-y-auto border-r border-line p-2">
            {QUICK_ACCESS.map((q) => {
              const active = q.path.join('/') === path.join('/')
              return (
                <button
                  key={q.label}
                  onClick={() => go(q.path)}
                  className={`relative flex w-full items-center gap-2.5 rounded px-3 py-1.5 text-left hover:bg-hover ${active ? 'bg-active' : ''}`}
                >
                  {active && <span className="absolute left-0 h-4 w-[3px] rounded-full bg-accent" />}
                  {q.label === 'This PC' ? <ThisPcIcon size={16} /> : q.label === 'Home' ? <G.Home size={16} /> : q.label === 'Desktop' ? <G.Desktop size={16} className="text-accent" /> : <FolderIcon size={16} />}
                  {q.label}
                </button>
              )
            })}
          </nav>
        )}

        <div className="os-scroll min-w-0 flex-1 overflow-auto p-3" onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}>
          {isRoot ? (
            <div>
              <p className="mb-3 text-xs font-semibold text-fg-2">Devices and drives</p>
              {items.map((d) => (
                <button
                  key={d.name}
                  onClick={() => setSelected(d)}
                  onDoubleClick={() => open(d)}
                  className={`flex w-72 items-center gap-3 rounded-md p-3 text-left hover:bg-hover ${selected === d ? 'bg-active' : ''}`}
                >
                  <DriveIcon size={44} />
                  <span className="flex-1">
                    <span className="block">{d.name}</span>
                    <span className="my-1.5 block h-1.5 overflow-hidden rounded-full bg-line">
                      <span className="block h-full w-[42%] rounded-full bg-accent" />
                    </span>
                    <span className="block text-xs text-fg-2">276 GB free of 476 GB</span>
                  </span>
                </button>
              ))}
            </div>
          ) : view === 'tiles' ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-1">
              {items.map((item) => (
                <button
                  key={item.name}
                  onClick={() => (mobile ? open(item) : setSelected(item))}
                  onDoubleClick={() => open(item)}
                  className={`flex flex-col items-center gap-1.5 rounded-md p-2 text-center hover:bg-hover ${selected === item ? 'bg-active ring-1 ring-accent/50' : ''}`}
                >
                  <NodeIcon node={item} size={48} />
                  <span className="line-clamp-2 w-full break-words text-xs">{item.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <table className="w-full table-fixed text-left">
              <thead className="text-xs text-fg-2">
                <tr>
                  <th className="w-1/2 px-3 py-1.5 font-normal">Name</th>
                  <th className="px-3 py-1.5 font-normal">Type</th>
                  <th className="w-24 px-3 py-1.5 text-right font-normal">Size</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.name}
                    onClick={() => (mobile ? open(item) : setSelected(item))}
                    onDoubleClick={() => open(item)}
                    className={`cursor-default hover:bg-hover ${selected === item ? 'bg-active' : ''}`}
                  >
                    <td className="truncate rounded-l px-3 py-1.5">
                      <span className="flex items-center gap-2.5">
                        <NodeIcon node={item} size={18} />
                        <span className="truncate">{item.name}</span>
                      </span>
                    </td>
                    <td className="truncate px-3 py-1.5 text-fg-2">{typeLabel(item)}</td>
                    <td className="rounded-r px-3 py-1.5 text-right text-fg-2">{sizeLabel(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!items.length && <p className="mt-10 text-center text-fg-2">This folder is empty.</p>}
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-line px-4 py-1 text-xs text-fg-2">
        <span>
          {items.length} item{items.length === 1 ? '' : 's'}
        </span>
        {selected && <span>1 item selected</span>}
        <span className="ml-auto truncate">{displayPath(path)}</span>
      </div>
    </div>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { apps } from '../apps/registry'
import { desktopItems } from '../fs'
import { G, TextFileIcon, ThisPcIcon } from '../icons'
import { launch } from '../launch'
import { useSettings, useShell, useViewport, useWindows } from '../store'
import ContextMenu from './ContextMenu'
import Wallpaper from './Wallpaper'

const CELL_W = 84
const CELL_H = 92
const PAD = 8

function itemIcon(item, size) {
  if (item.icon === 'pc') return <ThisPcIcon size={size} />
  if (item.type === 'app') {
    const Icon = apps[item.appId].Icon
    return <Icon size={size} />
  }
  return <TextFileIcon size={size} />
}

export default function Desktop() {
  const wm = useWindows()
  const shell = useShell()
  const { settings } = useSettings()
  const { workHeight, mobile } = useViewport()
  const [selected, setSelected] = useState(() => new Set())
  const [band, setBand] = useState(null)
  const [menu, setMenu] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const surfaceRef = useRef(null)

  // Column-major grid, like Windows: fill down, then across.
  const rows = Math.max(1, Math.floor((workHeight - PAD * 2) / CELL_H))
  const cells = desktopItems.map((item, i) => ({
    item,
    x: PAD + Math.floor(i / rows) * CELL_W,
    y: PAD + (i % rows) * CELL_H,
  }))

  const open = useCallback((item) => launch(wm, item, ['This PC', 'Local Disk (C:)', 'Users', 'Chamath', 'Desktop']), [wm])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target !== document.body) return
      if (e.key === 'Enter') cells.filter((c) => selected.has(c.item.name)).forEach((c) => open(c.item))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const startBand = (e) => {
    if (e.button !== 0 || e.target !== surfaceRef.current) return
    shell.closeFlyout()
    setSelected(new Set())
    const x0 = e.clientX
    const y0 = e.clientY
    const move = (ev) => {
      const r = { x: Math.min(x0, ev.clientX), y: Math.min(y0, ev.clientY), w: Math.abs(ev.clientX - x0), h: Math.abs(ev.clientY - y0) }
      setBand(r)
      setSelected(
        new Set(
          cells
            .filter((c) => c.x < r.x + r.w && c.x + CELL_W - 8 > r.x && c.y < r.y + r.h && c.y + CELL_H - 8 > r.y)
            .map((c) => c.item.name),
        ),
      )
    }
    const up = () => {
      setBand(null)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const desktopMenu = (e) => {
    e.preventDefault()
    if (e.target !== surfaceRef.current) return
    setMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: 'Refresh', icon: <G.Refresh />, onClick: () => setRefreshKey((k) => k + 1) },
        { divider: true },
        { label: 'New text document', icon: <G.Document />, onClick: () => wm.open('notepad', { title: 'Untitled - Notepad', fileName: 'Untitled.txt', content: '' }) },
        { divider: true },
        { label: 'Display settings', icon: <G.Monitor />, onClick: () => wm.open('settings', { page: 'system' }) },
        { label: 'Personalize', icon: <G.Brush />, onClick: () => wm.open('settings', { page: 'personalization' }) },
        { divider: true },
        { label: 'Open in Terminal', icon: <G.ChevronRight />, onClick: () => wm.open('terminal') },
      ],
    })
  }

  const iconMenu = (e, item) => {
    e.preventDefault()
    e.stopPropagation()
    setSelected(new Set([item.name]))
    setMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: 'Open', icon: <G.ArrowRight />, onClick: () => open(item) },
        ...(item.type === 'app' && apps[item.appId].component
          ? [{ divider: true }, { label: 'Pin to taskbar', icon: <G.Grid />, disabled: true }]
          : []),
      ],
    })
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Wallpaper name={settings.wallpaper} theme={settings.theme} />

      <div
        ref={surfaceRef}
        onPointerDown={startBand}
        onContextMenu={desktopMenu}
        className="absolute inset-x-0 top-0"
        style={{ height: workHeight }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div key={refreshKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            {cells.map(({ item, x, y }) => {
              const isSelected = selected.has(item.name)
              return (
                <button
                  key={item.name}
                  style={{ left: x, top: y, width: CELL_W - 8 }}
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    if (e.button !== 0) return
                    const toggle = e.ctrlKey || e.metaKey
                    setSelected((s) => {
                      if (!toggle) return new Set([item.name])
                      const next = new Set(s)
                      if (!next.delete(item.name)) next.add(item.name)
                      return next
                    })
                  }}
                  onClick={() => mobile && open(item)}
                  onDoubleClick={() => !mobile && open(item)}
                  onContextMenu={(e) => iconMenu(e, item)}
                  className={`absolute flex flex-col items-center gap-1 rounded px-1 pb-1.5 pt-2 text-center outline-none ${
                    isSelected ? 'bg-white/20 ring-1 ring-white/30' : 'hover:bg-white/10'
                  }`}
                >
                  <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">{itemIcon(item, 44)}</span>
                  <span className={`text-xs leading-tight text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.9)] ${isSelected ? '' : 'line-clamp-2'}`}>
                    {item.name}
                  </span>
                </button>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {band && (
          <div
            className="pointer-events-none absolute border border-accent bg-accent/25"
            style={{ left: band.x, top: band.y, width: band.w, height: band.h }}
          />
        )}
      </div>

      {menu && <ContextMenu {...menu} onClose={() => setMenu(null)} />}
    </div>
  )
}

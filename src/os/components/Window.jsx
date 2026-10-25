import { Component, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { apps } from '../apps/registry'
import { G } from '../icons'
import { useViewport, useWindows } from '../store'

const MIN_SIZE = [360, 240]
const SNAP_EDGE = 4
const RESIZE_DIRS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
const RESIZE_CLASS = {
  n: 'top-0 inset-x-2 h-1.5 cursor-ns-resize',
  s: 'bottom-0 inset-x-2 h-1.5 cursor-ns-resize',
  e: 'right-0 inset-y-2 w-1.5 cursor-ew-resize',
  w: 'left-0 inset-y-2 w-1.5 cursor-ew-resize',
  ne: 'right-0 top-0 h-3 w-3 cursor-nesw-resize',
  sw: 'left-0 bottom-0 h-3 w-3 cursor-nesw-resize',
  nw: 'left-0 top-0 h-3 w-3 cursor-nwse-resize',
  se: 'right-0 bottom-0 h-3 w-3 cursor-nwse-resize',
}

function layoutRect(state, rect, width, height) {
  if (state === 'max') return { x: 0, y: 0, w: width, h: height }
  if (state === 'left') return { x: 0, y: 0, w: Math.round(width / 2), h: height }
  if (state === 'right') return { x: Math.round(width / 2), y: 0, w: width - Math.round(width / 2), h: height }
  return rect
}

// Runs a pointer drag on window, toggling the global "interacting" mode so iframes don't steal events.
function trackPointer(e, cursor, onMove, onEnd) {
  const startX = e.clientX
  const startY = e.clientY
  let active = false
  const move = (ev) => {
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY
    if (!active) {
      if (Math.hypot(dx, dy) < 3) return
      active = true
      document.body.classList.add('os-interacting')
      document.body.style.setProperty('--os-cursor', cursor)
    }
    onMove(ev, dx, dy)
  }
  const up = (ev) => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    document.body.classList.remove('os-interacting')
    if (active) onEnd?.(ev)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}

// Keeps a crashing app from taking the whole desktop down with it.
class AppBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-solid p-6 text-center text-sm">
        <p className="text-base font-semibold">{this.props.title} isn't responding</p>
        <p className="text-fg-2">Something went wrong inside this app. Close it and try again.</p>
        <button onClick={this.props.onClose} className="mt-2 rounded-md bg-accent px-4 py-1.5 text-accent-fg hover:brightness-110">
          Close the program
        </button>
      </div>
    )
  }
}

function TitleButton({ label, onClick, danger, children }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      onDoubleClick={(e) => e.stopPropagation()}
      className={`flex h-full w-[46px] items-center justify-center text-fg transition-colors ${
        danger ? 'hover:bg-[#c42b1c] hover:text-white active:bg-[#c42b1c]/80' : 'hover:bg-hover active:bg-active'
      }`}
    >
      {children}
    </button>
  )
}

export default function Window({ win }) {
  const wm = useWindows()
  const { width, workHeight, mobile } = useViewport()
  const app = apps[win.appId]
  const focused = wm.focusedId === win.id
  const [interacting, setInteracting] = useState(false)
  const [snap, setSnap] = useState(null)
  const frameRef = useRef(null)

  const state = mobile ? 'max' : win.state
  const rect = layoutRect(state, win.rect, width, workHeight)
  const tiled = state !== 'normal'
  const [minW, minH] = app.minSize ?? MIN_SIZE

  const toggleMax = () => wm.setState(win.id, state === 'normal' ? 'max' : 'normal')

  const startDrag = (e) => {
    if (mobile || e.button !== 0 || e.target.closest('button')) return
    let base = rect
    let pending = snap
    trackPointer(
      e,
      'default',
      (ev, dx, dy) => {
        if (!interacting) setInteracting(true)
        // Dragging a maximised/snapped window pops it back to its floating size under the cursor.
        if (state !== 'normal' && base === rect) {
          const restore = win.restoreRect ?? win.rect
          const ratio = (e.clientX - rect.x) / rect.w
          base = { ...restore, x: Math.round(e.clientX - restore.w * ratio), y: Math.max(0, e.clientY - 16) }
          wm.setState(win.id, 'normal', base)
        }
        wm.setRect(win.id, {
          ...base,
          x: Math.round(base.x + dx),
          y: Math.round(Math.min(Math.max(0, base.y + dy), workHeight - 40)),
        })
        pending = ev.clientY <= SNAP_EDGE ? 'max' : ev.clientX <= SNAP_EDGE ? 'left' : ev.clientX >= width - SNAP_EDGE ? 'right' : null
        setSnap(pending)
      },
      () => {
        setInteracting(false)
        setSnap(null)
        if (pending) wm.setState(win.id, pending)
      },
    )
  }

  const startResize = (dir) => (e) => {
    if (e.button !== 0) return
    e.stopPropagation()
    wm.focus(win.id)
    const base = rect
    if (state !== 'normal') wm.setState(win.id, 'normal', base)
    trackPointer(
      e,
      getComputedStyle(e.currentTarget).cursor,
      (_, dx, dy) => {
        if (!interacting) setInteracting(true)
        let { x, y, w, h } = base
        if (dir.includes('e')) w = Math.max(minW, base.w + dx)
        if (dir.includes('s')) h = Math.max(minH, base.h + dy)
        if (dir.includes('w')) {
          w = Math.max(minW, base.w - dx)
          x = base.x + base.w - w
        }
        if (dir.includes('n')) {
          h = Math.max(minH, base.h - dy)
          y = Math.max(0, base.y + base.h - h)
          h = base.y + base.h - y
        }
        wm.setRect(win.id, { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) })
      },
      () => setInteracting(false),
    )
  }

  const AppComponent = app.component

  return (
    <>
      <motion.div
        ref={frameRef}
        role="dialog"
        aria-label={win.title}
        onPointerDownCapture={() => wm.focus(win.id)}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={win.minimized ? { opacity: 0, scale: 0.85, y: 80 } : { opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.12 } }}
        transition={{ duration: 0.2, ease: [0.1, 0.9, 0.2, 1] }}
        style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex: win.z }}
        className={`absolute flex flex-col overflow-hidden border border-line bg-window acrylic os-shadow ${
          tiled ? '' : 'rounded-lg'
        } ${interacting ? '' : 'transition-[left,top,width,height] duration-200 ease-out'} ${
          win.minimized ? 'pointer-events-none' : ''
        }`}
      >
        {/* Title bar */}
        <div
          onPointerDown={startDrag}
          onDoubleClick={() => !mobile && toggleMax()}
          className={`flex h-8 shrink-0 items-center ${focused ? '' : 'opacity-70'}`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
            <app.Icon size={16} />
            <span className="truncate text-xs">{win.title}</span>
          </div>
          <div className="flex h-full">
            <TitleButton label="Minimize" onClick={() => wm.minimize(win.id)}>
              <G.Minimize size={14} />
            </TitleButton>
            {!mobile && (
              <TitleButton label={state === 'normal' ? 'Maximize' : 'Restore'} onClick={toggleMax}>
                {state === 'normal' ? <G.Maximize size={14} /> : <G.Restore size={14} />}
              </TitleButton>
            )}
            <TitleButton label="Close" danger onClick={() => wm.close(win.id)}>
              <G.Close size={14} />
            </TitleButton>
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          <AppBoundary title={app.title} onClose={() => wm.close(win.id)}>
            <AppComponent win={win} focused={focused} />
          </AppBoundary>
          {/* iframes swallow clicks, so an unfocused iframe window needs one click to come forward. */}
          {app.hasIframe && !focused && <div className="absolute inset-0" />}
        </div>

        {!mobile &&
          !tiled &&
          RESIZE_DIRS.map((d) => <div key={d} onPointerDown={startResize(d)} className={`absolute z-10 ${RESIZE_CLASS[d]}`} />)}
      </motion.div>

      {createPortal(
        <AnimatePresence>
          {snap && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ ...(() => { const r = layoutRect(snap, rect, width, workHeight); return { left: r.x + 8, top: r.y + 8, width: r.w - 16, height: r.h - 16 } })(), zIndex: win.z - 1 }}
              className="pointer-events-none fixed rounded-lg border border-white/30 bg-white/15 backdrop-blur-xl"
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

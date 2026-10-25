import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data/portfolio'
import { apps } from '../os/apps/registry'
import { useBattery, useClock } from '../os/components/Taskbar'
import { Slider } from '../os/components/Flyouts'
import { G, PortfolioIcon } from '../os/icons'
import { launch } from '../os/launch'
import { DisplayFilters } from '../os/OS'
import { PlatformContext, useSettings, useWindows, WindowProvider } from '../os/store'
import { ANDROID_APPS, androidLabel, DOCK, HOME_GRID } from './apps'
import androidWallpaper from './assets/wallpapers/android.jpg'

// Android has its own portrait wallpaper (the Windows ones are landscape).
function PhoneWallpaper() {
  return <img src={androidWallpaper} alt="" aria-hidden draggable={false} className="absolute inset-0 h-full w-full object-cover" />
}

const SESSION_KEY = 'cj-android-session'
const STATUS_H = 28
const NAV_H = 48

/* --------------------------------------------------------------- Pieces */

export function AppIcon({ appId, size = 56, label, onOpen, light }) {
  const app = apps[appId]
  return (
    <button onClick={onOpen} className="flex flex-col items-center gap-1.5 active:scale-90 transition">
      <span
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-full bg-white/95 shadow-md shadow-black/20 dark:bg-[#2a2d33]"
      >
        <app.Icon size={Math.round(size * 0.62)} />
      </span>
      {label !== false && (
        <span className={`max-w-[72px] truncate text-xs ${light ? 'text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.7)]' : ''}`}>
          {label ?? androidLabel(appId)}
        </span>
      )}
    </button>
  )
}

function StatusBar({ overApp, onPull }) {
  const { settings } = useSettings()
  const now = useClock(15_000)
  const battery = useBattery()
  return (
    <button
      aria-label="Open notifications"
      onClick={onPull}
      style={{ height: STATUS_H }}
      className={`absolute inset-x-0 top-0 z-40 flex items-center justify-between px-5 text-[13px] font-medium ${
        overApp ? 'bg-solid text-fg' : 'text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]'
      }`}
    >
      <span>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
      <span className="flex items-center gap-1.5">
        {settings.airplane ? <G.Plane size={14} /> : <G.Wifi size={14} off={!settings.wifi} />}
        <G.Battery size={16} level={battery.level} charging={battery.charging} />
        <span className="text-xs">{Math.round(battery.level * 100)}%</span>
      </span>
    </button>
  )
}

function NavBar({ onBack, onHome, onRecents, overApp }) {
  const btn = 'flex h-full flex-1 items-center justify-center active:bg-hover'
  return (
    <nav
      style={{ height: NAV_H }}
      className={`absolute inset-x-0 bottom-0 z-[55] flex items-center ${overApp ? 'bg-solid text-fg' : 'text-white'}`}
    >
      <button aria-label="Back" onClick={onBack} className={btn}>
        <svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M11 2.5v11L3.5 8z" />
        </svg>
      </button>
      <button aria-label="Home" onClick={onHome} className={btn}>
        <span className="h-[18px] w-[18px] rounded-full border-[1.6px] border-current" />
      </button>
      <button aria-label="Recent apps" onClick={onRecents} className={btn}>
        <span className="h-[15px] w-[15px] rounded-[3px] border-[1.6px] border-current" />
      </button>
    </nav>
  )
}

function Tile({ icon, label, sub, on, onClick }) {
  return (
    <button
      aria-pressed={on}
      onClick={onClick}
      className={`flex h-16 items-center gap-3 rounded-[22px] px-4 text-left transition ${on ? 'bg-accent text-accent-fg' : 'bg-surface hover:bg-hover'}`}
    >
      {icon}
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{label}</span>
        <span className="block truncate text-xs opacity-75">{sub ?? (on ? 'On' : 'Off')}</span>
      </span>
    </button>
  )
}

function Shade({ onClose, notifications, onNotification, onClear }) {
  const { settings: s, update } = useSettings()
  const now = useClock(15_000)
  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.6, bottom: 0 }}
      onDragEnd={(_, i) => (i.offset.y < -60 || i.velocity.y < -400) && onClose()}
      style={{ maxHeight: `calc(100% - ${NAV_H}px)` }}
      className="absolute inset-x-0 top-0 z-[51] overflow-y-auto rounded-b-[28px] bg-flyout px-4 pb-6 pt-4 text-fg acrylic os-shadow"
    >
      <div className="mb-4 flex items-end justify-between px-2">
        <p className="font-display text-4xl">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
        <p className="pb-1 text-sm text-fg-2">{now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Tile icon={<G.Wifi size={18} off={!s.wifi} />} label="Internet" sub={s.wifi && !s.airplane ? 'CJ-Portfolio' : 'Off'} on={s.wifi && !s.airplane} onClick={() => update({ wifi: !s.wifi, airplane: false })} />
        <Tile icon={<G.Bluetooth size={18} />} label="Bluetooth" on={s.bluetooth && !s.airplane} onClick={() => update({ bluetooth: !s.bluetooth, airplane: false })} />
        <Tile icon={<G.Moon size={18} />} label="Dark theme" on={s.theme === 'dark'} onClick={() => update({ theme: s.theme === 'dark' ? 'light' : 'dark' })} />
        <Tile icon={<G.Sun size={18} />} label="Night Light" on={s.nightLight} onClick={() => update({ nightLight: !s.nightLight })} />
        <Tile icon={<G.Plane size={18} />} label="Airplane mode" on={s.airplane} onClick={() => update({ airplane: !s.airplane })} />
        <Tile icon={<G.Leaf size={18} />} label="Battery Saver" on={s.batterySaver} onClick={() => update({ batterySaver: !s.batterySaver })} />
      </div>
      <div className="mt-4 rounded-full bg-surface px-4 py-3">
        <Slider label="Brightness" icon={<G.Sun size={16} />} value={s.brightness} onChange={(v) => update({ brightness: Math.max(20, v) })} />
      </div>

      <div className="mt-5 grid gap-2">
        {notifications.map((n) => (
          <button key={n.id} onClick={() => onNotification(n)} className="flex gap-3 rounded-[22px] bg-surface p-4 text-left hover:bg-hover">
            <span className="mt-0.5">{n.icon}</span>
            <span className="min-w-0">
              <span className="block text-xs text-fg-2">{n.app} · now</span>
              <span className="block text-sm font-semibold">{n.title}</span>
              <span className="block text-sm text-fg-2">{n.body}</span>
            </span>
          </button>
        ))}
        {notifications.length > 0 ? (
          <button onClick={onClear} className="ml-auto rounded-full bg-surface px-4 py-1.5 text-sm hover:bg-hover">
            Clear all
          </button>
        ) : (
          <p className="py-4 text-center text-sm text-fg-2">No notifications</p>
        )}
      </div>
      <div className="mx-auto mt-4 h-1 w-10 rounded-full bg-fg-2/50" />
    </motion.div>
  )
}

function Drawer({ onOpen, onClose, focusSearch }) {
  const [q, setQ] = useState('')
  const list = [...ANDROID_APPS].sort((a, b) => a.label.localeCompare(b.label)).filter((a) => a.label.toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 32, stiffness: 300 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.6 }}
      onDragEnd={(_, i) => (i.offset.y > 80 || i.velocity.y > 500) && onClose()}
      style={{ top: STATUS_H, bottom: NAV_H }}
      className="absolute inset-x-0 z-30 flex flex-col rounded-t-[28px] bg-flyout px-4 pt-3 text-fg acrylic"
    >
      <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-fg-2/50" />
      <label className="mb-6 flex h-12 items-center gap-3 rounded-full bg-surface px-5">
        <G.Search size={16} className="text-fg-2" />
        <input
          autoFocus={focusSearch}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && list[0] && onOpen(list[0].id)}
          placeholder="Search apps"
          className="flex-1 bg-transparent text-base outline-none placeholder:text-fg-2"
        />
      </label>
      <div className="os-scroll grid flex-1 grid-cols-4 content-start gap-y-6 overflow-y-auto pb-6">
        {list.map((a) => (
          <AppIcon key={a.id} appId={a.id} label={a.label} size={54} onOpen={() => onOpen(a.id)} />
        ))}
      </div>
    </motion.div>
  )
}

function Recents({ windows, onOpen, onClose, onClear, onDismiss }) {
  const sorted = [...windows].sort((a, b) => b.z - a.z)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ top: STATUS_H, bottom: NAV_H }}
      className="absolute inset-x-0 z-30 flex flex-col bg-black/55 backdrop-blur-md"
      onClick={onDismiss}
    >
      {sorted.length === 0 ? (
        <p className="m-auto text-sm text-white/80">No recent items</p>
      ) : (
        <>
          <div className="os-scroll flex flex-1 snap-x snap-mandatory items-center gap-4 overflow-x-auto px-[12%]">
            {sorted.map((w) => (
              <motion.div
                key={w.id}
                layout
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(_, i) => i.offset.y < -120 && onClose(w.id)}
                onClick={(e) => {
                  e.stopPropagation()
                  onOpen(w.id)
                }}
                className="flex h-[68%] w-[76%] shrink-0 snap-center flex-col overflow-hidden rounded-[24px] bg-solid shadow-2xl"
              >
                <div className="flex items-center gap-2 px-4 py-3">
                  <AppIcon appId={w.appId} size={28} label={false} />
                  <span className="flex-1 truncate text-sm font-medium">{androidLabel(w.appId)}</span>
                  <button
                    aria-label={`Close ${androidLabel(w.appId)}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onClose(w.id)
                    }}
                    className="rounded-full p-1.5 hover:bg-hover"
                  >
                    <G.Close size={14} />
                  </button>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-3 border-t border-line bg-surface text-fg-2">
                  {(() => {
                    const Icon = apps[w.appId].Icon
                    return <Icon size={64} />
                  })()}
                  <span className="max-w-[80%] truncate text-xs">{w.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="mx-auto mb-6 rounded-full bg-white/15 px-5 py-2 text-sm text-white backdrop-blur hover:bg-white/25"
          >
            Clear all
          </button>
        </>
      )}
    </motion.div>
  )
}

/* -------------------------------------------------------- Power screens */

function Boot({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])
  const dots = ['#4285f4', '#ea4335', '#fbbc05', '#34a853']
  return (
    <motion.div exit={{ opacity: 0 }} className="absolute inset-0 z-[70] flex flex-col items-center justify-center gap-10 bg-black">
      <div className="flex gap-3">
        {dots.map((c, i) => (
          <motion.span
            key={c}
            className="h-4 w-4 rounded-full"
            style={{ background: c }}
            animate={{ y: [0, -18, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-2xl font-light tracking-[0.2em] text-white">
        android
      </motion.p>
    </motion.div>
  )
}

function Lock({ onUnlock }) {
  const now = useClock()
  const [hh, mm] = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(':')
  return (
    <motion.div
      exit={{ y: '-100%', opacity: 0.6 }}
      transition={{ duration: 0.35, ease: 'easeIn' }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.8, bottom: 0 }}
      onDragEnd={(_, i) => (i.offset.y < -80 || i.velocity.y < -400) && onUnlock()}
      onClick={onUnlock}
      className="absolute inset-0 z-[60] overflow-hidden text-white"
    >
      <PhoneWallpaper />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative flex h-full flex-col items-center px-8 pt-[14vh] [text-shadow:0_2px_10px_rgb(0_0_0/0.35)]">
        <p className="text-sm font-medium">{now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        <p className="mt-6 font-display text-[7.5rem] font-light leading-[0.85]">{hh}</p>
        <p className="font-display text-[7.5rem] font-light leading-[0.85]">{mm}</p>
        <div className="mt-auto mb-16 flex flex-col items-center gap-3">
          <G.Lock size={22} />
          <p className="text-sm">Swipe up to unlock</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------------------------------------------------------------- Shell */

function AppScreen({ win }) {
  const app = apps[win.appId]
  const AppComponent = app.component
  const subtitle = win.appId === 'notepad' ? win.props.fileName : null
  return (
    <motion.div
      key={win.id}
      initial={{ opacity: 0, scale: 0.88, borderRadius: 32 }}
      animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25, ease: [0.2, 0.9, 0.3, 1] }}
      style={{ top: STATUS_H, bottom: NAV_H }}
      className="absolute inset-x-0 z-20 flex flex-col overflow-hidden bg-solid text-fg"
    >
      <header className="flex h-14 shrink-0 items-center gap-3 px-4">
        <app.Icon size={22} />
        <div className="min-w-0">
          <p className="truncate text-lg leading-tight">{androidLabel(win.appId)}</p>
          {subtitle && <p className="truncate text-xs text-fg-2">{subtitle}</p>}
        </div>
      </header>
      <div className="relative min-h-0 flex-1">
        <AppComponent win={win} focused />
      </div>
    </motion.div>
  )
}

function Launcher() {
  const wm = useWindows()
  const now = useClock(30_000)
  const [phase, setPhase] = useState(() => (sessionStorage.getItem(SESSION_KEY) ? 'home' : 'boot'))
  const [overlay, setOverlay] = useState(null) // 'shade' | 'drawer' | 'search' | 'recents'
  const [notifications, setNotifications] = useState(() => [
    {
      id: 'welcome',
      app: 'Portfolio',
      icon: <PortfolioIcon size={20} />,
      title: "Welcome to Chamath's phone 👋",
      body: 'Tap to open the full 3D portfolio.',
      appId: 'portfolio',
    },
  ])
  const [headsUp, setHeadsUp] = useState(null)
  const swipe = useRef(null)

  useEffect(() => {
    if (phase !== 'home') return
    sessionStorage.setItem(SESSION_KEY, '1')
    const show = setTimeout(() => setHeadsUp(notifications[0] ?? null), 900)
    const hide = setTimeout(() => setHeadsUp(null), 7000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const active = useMemo(
    () => wm.windows.filter((w) => !w.minimized).reduce((top, w) => (!top || w.z > top.z ? w : top), null),
    [wm.windows],
  )

  const open = (appId) => {
    setOverlay(null)
    launch(wm, appId)
  }
  const home = () => {
    setOverlay(null)
    wm.minimizeAll()
  }
  const back = () => {
    if (overlay) return setOverlay(null)
    if (active) wm.close(active.id)
  }

  // Swipe up on the home screen opens the drawer; swipe down from the top opens the shade.
  const onPointerDown = (e) => {
    swipe.current = { y: e.clientY, top: e.clientY < 80 }
  }
  const onPointerUp = (e) => {
    const s = swipe.current
    swipe.current = null
    if (!s || active || overlay) return
    const dy = e.clientY - s.y
    if (dy < -60) setOverlay('drawer')
    else if (dy > 60 && s.top) setOverlay('shade')
  }

  const homeItems = HOME_GRID.map((id) => ANDROID_APPS.find((a) => a.id === id))

  return (
    <div className="absolute inset-0 select-none overflow-hidden bg-black text-fg" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <PhoneWallpaper />

      {/* Home screen */}
      <div style={{ top: STATUS_H, bottom: NAV_H }} className="absolute inset-x-0 flex flex-col px-5 pb-4 pt-6">
        <div className="text-white [text-shadow:0_1px_6px_rgb(0_0_0/0.5)]">
          <p className="text-2xl font-medium">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <p className="mt-1 text-sm opacity-90">{profile.name} · {profile.focus[0]}</p>
        </div>
        <div className="mt-auto grid grid-cols-4 gap-y-6">
          {homeItems.map((a) => (
            <AppIcon key={a.id} appId={a.id} label={a.label} light onOpen={() => open(a.id)} />
          ))}
        </div>
        <button
          onClick={() => setOverlay('search')}
          className="mt-8 flex h-12 items-center gap-3 rounded-full bg-white/85 px-5 text-left text-sm text-[#444] shadow-lg backdrop-blur dark:bg-[#2a2d33]/90 dark:text-[#ccc]"
        >
          <G.Search size={16} /> Search apps
        </button>
        <div className="mt-5 grid grid-cols-4">
          {DOCK.map((id) => (
            <AppIcon key={id} appId={id} label={false} onOpen={() => open(id)} />
          ))}
        </div>
      </div>

      <AnimatePresence>{active && <AppScreen key={active.id} win={active} />}</AnimatePresence>

      <AnimatePresence>
        {(overlay === 'drawer' || overlay === 'search') && <Drawer key="drawer" focusSearch={overlay === 'search'} onOpen={open} onClose={() => setOverlay(null)} />}
        {overlay === 'recents' && (
          <Recents
            key="recents"
            windows={wm.windows}
            onOpen={(id) => {
              setOverlay(null)
              wm.focus(id)
            }}
            onClose={wm.close}
            onClear={() => {
              wm.closeAll()
              setOverlay(null)
            }}
            onDismiss={() => setOverlay(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overlay === 'shade' && (
          <>
            <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOverlay(null)} className="absolute inset-0 z-50 bg-black/40" />
            <Shade
              key="shade"
              notifications={notifications}
              onClose={() => setOverlay(null)}
              onClear={() => setNotifications([])}
              onNotification={(n) => {
                setNotifications((list) => list.filter((x) => x.id !== n.id))
                open(n.appId)
              }}
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {headsUp && !overlay && (
          <motion.button
            key="headsup"
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -120, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={() => {
              setHeadsUp(null)
              setNotifications((list) => list.filter((x) => x.id !== headsUp.id))
              open(headsUp.appId)
            }}
            className="absolute inset-x-3 top-9 z-50 flex gap-3 rounded-[22px] bg-flyout p-4 text-left text-fg acrylic os-shadow"
          >
            <span className="mt-0.5">{headsUp.icon}</span>
            <span className="min-w-0">
              <span className="block text-xs text-fg-2">{headsUp.app} · now</span>
              <span className="block text-sm font-semibold">{headsUp.title}</span>
              <span className="block text-sm text-fg-2">{headsUp.body}</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <StatusBar overApp={!!active && !overlay} onPull={() => setOverlay((o) => (o === 'shade' ? null : 'shade'))} />
      <NavBar
        overApp={!!active || overlay === 'drawer' || overlay === 'search'}
        onBack={back}
        onHome={home}
        onRecents={() => setOverlay((o) => (o === 'recents' ? null : 'recents'))}
      />

      <AnimatePresence>
        {phase === 'boot' && <Boot key="boot" onDone={() => setPhase('lock')} />}
        {phase === 'lock' && <Lock key="lock" onUnlock={() => setPhase('home')} />}
      </AnimatePresence>
    </div>
  )
}

export default function AndroidOS() {
  return (
    <PlatformContext.Provider value="android">
      <WindowProvider>
        <div className="relative h-full w-full overflow-hidden">
          <Launcher />
          <DisplayFilters />
        </div>
      </WindowProvider>
    </PlatformContext.Provider>
  )
}

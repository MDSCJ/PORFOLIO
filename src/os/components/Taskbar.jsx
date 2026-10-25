import { useEffect, useState } from 'react'
import { apps, taskbarApps } from '../apps/registry'
import { G, WindowsLogo } from '../icons'
import { useSettings, useShell, useViewport, useWindows } from '../store'

export function useClock(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}

export function useBattery() {
  const [battery, setBattery] = useState({ level: 1, charging: true, known: false })
  useEffect(() => {
    let b
    const sync = () => setBattery({ level: b.level, charging: b.charging, known: true })
    navigator.getBattery?.().then((res) => {
      b = res
      sync()
      b.addEventListener('levelchange', sync)
      b.addEventListener('chargingchange', sync)
    })
    return () => {
      b?.removeEventListener('levelchange', sync)
      b?.removeEventListener('chargingchange', sync)
    }
  }, [])
  return battery
}

function TaskButton({ label, active, running, focused, onClick, children, className = '' }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`group relative flex h-10 w-10 items-center justify-center rounded transition active:scale-90 ${
        active || focused ? 'bg-hover' : 'hover:bg-hover'
      } ${className}`}
    >
      {children}
      {running && (
        <span
          className={`absolute bottom-0.5 h-[3px] rounded-full transition-all ${
            focused ? 'w-4 bg-accent' : 'w-1.5 bg-fg-2 group-hover:w-2.5'
          }`}
        />
      )}
    </button>
  )
}

export default function Taskbar() {
  const wm = useWindows()
  const shell = useShell()
  const { settings } = useSettings()
  const { mobile } = useViewport()
  const now = useClock()
  const battery = useBattery()

  // Pinned apps first, then any running app that isn't pinned.
  const running = new Set(wm.windows.map((w) => w.appId))
  const pinned = mobile ? taskbarApps.filter((a) => ['explorer', 'browser', 'portfolio', 'terminal'].includes(a.id)) : taskbarApps
  const extra = [...running].filter((id) => !pinned.some((a) => a.id === id)).map((id) => apps[id])
  const items = [...pinned, ...extra]

  const clickApp = (appId) => {
    shell.closeFlyout()
    const wins = wm.windows.filter((w) => w.appId === appId)
    if (!wins.length) return wm.open(appId)
    const top = wins.reduce((a, b) => (a.z > b.z ? a : b))
    if (wm.focusedId === top.id && !top.minimized) wm.minimize(top.id)
    else wm.focus(top.id)
  }

  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const date = now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })
  const wifiOn = settings.wifi && !settings.airplane

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-[8000] flex h-12 items-center border-t border-line bg-taskbar px-2 acrylic"
      onContextMenu={(e) => e.preventDefault()}
      // Taskbar buttons toggle flyouts themselves; don't let the shell's click-away close them first.
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <TaskButton label="Start" active={shell.flyout === 'start'} onClick={() => shell.toggleFlyout('start')}>
          <WindowsLogo size={22} />
        </TaskButton>
        {!mobile && (
          <TaskButton label="Search" active={shell.flyout === 'search'} onClick={() => shell.toggleFlyout('search')}>
            <G.Search size={18} />
          </TaskButton>
        )}
        {items.map((app) => {
          const wins = wm.windows.filter((w) => w.appId === app.id)
          return (
            <TaskButton
              key={app.id}
              label={app.title}
              running={wins.length > 0}
              focused={wins.some((w) => w.id === wm.focusedId && !w.minimized)}
              onClick={() => clickApp(app.id)}
            >
              <app.Icon size={26} />
            </TaskButton>
          )
        })}
      </div>

      <div className="flex flex-1 items-center justify-end gap-0.5">
        <button
          aria-label="Quick settings"
          onClick={() => shell.toggleFlyout('quick')}
          className={`flex h-10 items-center gap-2.5 rounded px-2.5 transition ${shell.flyout === 'quick' ? 'bg-hover' : 'hover:bg-hover'}`}
        >
          {settings.airplane ? <G.Plane size={15} /> : <G.Wifi size={15} off={!wifiOn} />}
          <G.Volume size={15} level={settings.volume} />
          <G.Battery size={17} level={battery.level} charging={battery.charging} />
        </button>
        <button
          aria-label="Clock and notifications"
          onClick={() => shell.toggleFlyout('calendar')}
          className={`flex h-10 flex-col items-end justify-center rounded px-2.5 text-right text-xs leading-tight transition ${
            shell.flyout === 'calendar' ? 'bg-hover' : 'hover:bg-hover'
          }`}
        >
          <span>{time}</span>
          {!mobile && <span>{date}</span>}
        </button>
        {!mobile && (
          <button
            aria-label="Show desktop"
            title="Show desktop"
            onClick={() => {
              shell.closeFlyout()
              wm.minimizeAll()
            }}
            className="ml-1 h-10 w-2 border-l border-line hover:bg-hover"
          />
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { G } from '../icons'
import { useSettings, useShell, useWindows } from '../store'
import { useBattery, useClock } from './Taskbar'

const panel = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 30, transition: { duration: 0.12 } },
  transition: { duration: 0.22, ease: [0.1, 0.9, 0.2, 1] },
}

const card = 'rounded-lg border border-line bg-flyout acrylic os-shadow'

function Toggle({ icon, label, sub, on, onClick }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        aria-pressed={on}
        aria-label={label}
        onClick={onClick}
        className={`flex h-12 w-full items-center justify-center rounded-md border transition ${
          on ? 'border-transparent bg-accent text-accent-fg hover:brightness-110' : 'border-line bg-surface hover:bg-hover'
        }`}
      >
        {icon}
      </button>
      <span className="text-center text-xs leading-tight">
        {label}
        {sub && <span className="block text-[11px] text-fg-2">{sub}</span>}
      </span>
    </div>
  )
}

export function Slider({ value, onChange, label, icon }) {
  return (
    <label className="flex items-center gap-3">
      <span className="text-fg-2">{icon}</span>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer accent-[var(--accent)]"
      />
    </label>
  )
}

export function QuickSettings() {
  const { settings: s, update } = useSettings()
  const wm = useWindows()
  const shell = useShell()
  const battery = useBattery()
  const wifiOn = s.wifi && !s.airplane

  return (
    <motion.div
      {...panel}
      onPointerDown={(e) => e.stopPropagation()}
      className={`absolute bottom-[56px] right-2 z-[8500] w-[min(360px,calc(100vw-16px))] overflow-hidden ${card}`}
    >
      <div className="grid grid-cols-3 gap-x-3 gap-y-4 p-5">
        <Toggle icon={<G.Wifi size={16} off={!wifiOn} />} label="Wi-Fi" sub={wifiOn ? 'CJ-Portfolio' : 'Off'} on={wifiOn} onClick={() => update({ wifi: !s.wifi, airplane: false })} />
        <Toggle icon={<G.Bluetooth size={16} />} label="Bluetooth" on={s.bluetooth && !s.airplane} onClick={() => update({ bluetooth: !s.bluetooth, airplane: false })} />
        <Toggle icon={<G.Plane size={16} />} label="Airplane mode" on={s.airplane} onClick={() => update({ airplane: !s.airplane })} />
        <Toggle icon={<G.Leaf size={16} />} label="Energy saver" on={s.batterySaver} onClick={() => update({ batterySaver: !s.batterySaver })} />
        <Toggle icon={<G.Sun size={16} />} label="Night light" on={s.nightLight} onClick={() => update({ nightLight: !s.nightLight })} />
        <Toggle
          icon={s.theme === 'dark' ? <G.Moon size={16} /> : <G.Sun size={16} />}
          label="Dark mode"
          on={s.theme === 'dark'}
          onClick={() => update({ theme: s.theme === 'dark' ? 'light' : 'dark' })}
        />
      </div>
      <div className="grid gap-5 px-6 pb-6">
        <Slider label="Brightness" icon={<G.Sun size={16} />} value={s.brightness} onChange={(v) => update({ brightness: Math.max(20, v) })} />
        <Slider label="Volume" icon={<G.Volume size={16} level={s.volume} />} value={s.volume} onChange={(v) => update({ volume: v })} />
      </div>
      <div className="flex items-center justify-between border-t border-line bg-black/5 px-5 py-3 text-xs dark:bg-black/15">
        <span className="flex items-center gap-2">
          <G.Battery size={18} level={battery.level} charging={battery.charging} />
          {Math.round(battery.level * 100)}%{battery.charging ? ' · Charging' : ''}
        </span>
        <button
          aria-label="All settings"
          onClick={() => {
            shell.closeFlyout()
            wm.open('settings')
          }}
          className="rounded p-1.5 hover:bg-hover"
        >
          <G.Gear size={16} />
        </button>
      </div>
    </motion.div>
  )
}

export function CalendarFlyout() {
  const now = useClock(30_000)
  const [cursor, setCursor] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1))
  const shell = useShell()

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const startDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = i - startDay + 1
    if (d < 1) return { d: prevDays + d, muted: true }
    if (d > daysInMonth) return { d: d - daysInMonth, muted: true }
    return { d, today: d === now.getDate() && month === now.getMonth() && year === now.getFullYear() }
  })

  return (
    <motion.div {...panel} onPointerDown={(e) => e.stopPropagation()} className="absolute bottom-[56px] right-2 z-[8500] grid w-[min(360px,calc(100vw-16px))] gap-2">
      <div className={`${card} p-4`}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Notifications</p>
          {shell.toasts.length > 0 && <span className="text-xs text-fg-2">{shell.toasts.length} new</span>}
        </div>
        <div className="flex flex-col items-center gap-2 py-6 text-fg-2">
          <G.Bell size={22} />
          <p className="text-sm">No new notifications</p>
        </div>
      </div>
      <div className={card}>
        <p className="border-b border-line px-4 py-3 text-sm font-semibold">
          {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">{cursor.toLocaleDateString([], { month: 'long', year: 'numeric' })}</p>
            <div className="flex">
              <button aria-label="Previous month" onClick={() => setCursor(new Date(year, month - 1, 1))} className="rounded p-2 hover:bg-hover">
                <G.ChevronUp size={14} />
              </button>
              <button aria-label="Next month" onClick={() => setCursor(new Date(year, month + 1, 1))} className="rounded p-2 hover:bg-hover">
                <G.ChevronDown size={14} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} className="py-1 font-semibold">
                {d}
              </span>
            ))}
            {cells.map((c, i) => (
              <span
                key={i}
                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${
                  c.today ? 'bg-accent font-semibold text-accent-fg' : c.muted ? 'text-fg-2/50' : 'hover:bg-hover'
                }`}
              >
                {c.d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Toasts() {
  const shell = useShell()
  // Flyouts occupy the same corner; Windows tucks toasts away while one is open.
  if (shell.flyout) return null
  return (
    <div className="pointer-events-none absolute bottom-[60px] right-3 z-[8600] grid w-[min(364px,calc(100vw-24px))] gap-2">
      {shell.toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.1, 0.9, 0.2, 1] }}
          className={`pointer-events-auto p-4 ${card}`}
        >
          <div className="mb-2 flex items-center justify-between text-xs text-fg-2">
            <span className="flex items-center gap-2">
              {t.icon}
              {t.app}
            </span>
            <button aria-label="Dismiss" onClick={() => shell.dismissToast(t.id)} className="rounded p-1 hover:bg-hover">
              <G.Close size={12} />
            </button>
          </div>
          <p className="text-sm font-semibold">{t.title}</p>
          <p className="mt-0.5 text-sm text-fg-2">{t.body}</p>
          {t.action && (
            <button
              onClick={() => {
                shell.dismissToast(t.id)
                t.action.onClick()
              }}
              className="mt-3 w-full rounded-md bg-accent py-1.5 text-sm text-accent-fg hover:brightness-110"
            >
              {t.action.label}
            </button>
          )}
        </motion.div>
      ))}
    </div>
  )
}

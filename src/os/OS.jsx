import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import Desktop from './components/Desktop'
import Window from './components/Window'
import Taskbar from './components/Taskbar'
import StartMenu from './components/StartMenu'
import { CalendarFlyout, QuickSettings, Toasts } from './components/Flyouts'
import { BootScreen, LockScreen, OffScreen } from './components/PowerScreens'
import { PortfolioIcon } from './icons'
import { ShellProvider, useSettings, useShell, useWindows, WindowProvider } from './store'

// Brightness dims and Night light warms the whole screen, like the real settings.
export function DisplayFilters() {
  const { settings } = useSettings()
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-[9900] bg-black transition-opacity"
        style={{ opacity: (1 - settings.brightness / 100) * 0.7 }}
      />
      <div
        className={`pointer-events-none absolute inset-0 z-[9900] bg-[#ff8a1f] mix-blend-multiply transition-opacity duration-700 ${
          settings.nightLight ? 'opacity-25' : 'opacity-0'
        }`}
      />
    </>
  )
}

function Shell() {
  const wm = useWindows()
  const shell = useShell()
  const latest = useRef({ shell, wm })
  latest.current = { shell, wm }

  // One welcome notification per sign-in, pointing at the Portfolio app.
  useEffect(() => {
    if (shell.power !== 'desktop') return
    const t = setTimeout(() => {
      const { shell, wm } = latest.current
      shell.toast({
        app: 'Portfolio',
        icon: <PortfolioIcon size={16} />,
        title: "Welcome to Chamath's PC 👋",
        body: 'Open the Portfolio app to explore the full 3D site, or poke around the other apps.',
        action: { label: 'Open Portfolio', onClick: () => wm.open('portfolio') },
        duration: 12000,
      })
    }, 900)
    return () => clearTimeout(t)
  }, [shell.power])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') shell.closeFlyout()
      // Win key equivalents that browsers let through.
      if (e.key === 'Meta' && !e.repeat) shell.toggleFlyout('start')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shell])

  return (
    <div className="relative h-full w-full overflow-hidden bg-black" onPointerDown={() => shell.flyout && shell.closeFlyout()}>
      {/* The desktop only exists once signed in, so it can't flash through the boot/lock screens as they fade in. */}
      {shell.power === 'desktop' && (
        <>
          <Desktop />

          <AnimatePresence>
            {wm.windows.map((w) => (
              <Window key={w.id} win={w} />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {(shell.flyout === 'start' || shell.flyout === 'search') && <StartMenu key="start" focusSearch={shell.flyout === 'search'} />}
            {shell.flyout === 'quick' && <QuickSettings key="quick" />}
            {shell.flyout === 'calendar' && <CalendarFlyout key="calendar" />}
          </AnimatePresence>

          <Toasts />
          <Taskbar />
        </>
      )}

      <AnimatePresence>
        {shell.power === 'boot' && <BootScreen key="boot" />}
        {shell.power === 'lock' && <LockScreen key="lock" />}
        {shell.power === 'off' && <OffScreen key="off" />}
      </AnimatePresence>

      <DisplayFilters />
    </div>
  )
}

// Settings are provided by Root so they survive switching between Windows and Android.
export default function WindowsOS() {
  return (
    <ShellProvider>
      <WindowProvider>
        <Shell />
      </WindowProvider>
    </ShellProvider>
  )
}

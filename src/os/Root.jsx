import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AndroidOS from '../android/AndroidOS'
import { G } from './icons'
import WindowsOS from './OS'
import { SettingsProvider } from './store'

const SWITCH_MS = 3200
const SESSION_KEYS = { windows: 'cj-os-session', android: 'cj-android-session' }

// Phones get Android; desktops get Windows. A coarse pointer with a short side keeps landscape phones on Android.
function detectPlatform() {
  const { innerWidth: w, innerHeight: h } = window
  const coarse = window.matchMedia('(pointer: coarse)').matches
  return w < 768 || (coarse && Math.min(w, h) < 600) ? 'android' : 'windows'
}

function DeviceGlyph({ kind, active }) {
  return kind === 'android' ? (
    <span className={`flex h-16 w-10 items-end justify-center rounded-lg border-2 pb-1 transition-colors duration-500 ${active ? 'border-[#3ddc84] text-[#3ddc84]' : 'border-white/30 text-white/30'}`}>
      <span className="h-1 w-3 rounded-full bg-current" />
    </span>
  ) : (
    <span className={`transition-colors duration-500 ${active ? 'text-[#4cc2ff]' : 'text-white/30'}`}>
      <G.Monitor size={64} strokeWidth={1.1} />
    </span>
  )
}

// Full-screen "OS change detected → rebooting" sequence shown when the window crosses the breakpoint.
function SwitchOverlay({ from, to }) {
  const [step, setStep] = useState(0)
  const size = `${window.innerWidth}×${window.innerHeight}`
  const name = to === 'android' ? 'Android' : 'Windows'
  const lines = [
    `Display change detected (${size})`,
    `${to === 'android' ? 'Mobile' : 'Desktop'} form factor recognised`,
    `Saving ${from === 'android' ? 'Android' : 'Windows'} session…`,
    `Rebooting into ${name}…`,
  ]

  useEffect(() => {
    const timers = lines.map((_, i) => setTimeout(() => setStep(i + 1), 350 + i * 650))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#05070c] px-6 text-white"
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-6">
          <DeviceGlyph kind={from} active={step < 3} />
          <div className="relative h-px w-16 overflow-hidden bg-white/15">
            <motion.span
              className="absolute inset-y-0 w-6 bg-white"
              animate={{ x: [-24, 64] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <DeviceGlyph kind={to} active={step >= 3} />
        </div>
        <p className="text-center text-xl font-semibold">OS change detected</p>
        <p className="mb-6 mt-1 text-center text-sm text-white/60">Switching to {name}</p>

        <div className="grid gap-1.5 font-mono text-xs">
          {lines.map((l, i) => (
            <motion.p
              key={l}
              initial={{ opacity: 0, x: -6 }}
              animate={step > i ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
              className="flex items-center gap-2 text-white/80"
            >
              <span className={i === lines.length - 1 ? 'text-[#4cc2ff]' : 'text-[#3ddc84]'}>{i === lines.length - 1 ? '›' : '✓'}</span>
              {l}
            </motion.p>
          ))}
        </div>

        <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={`h-full rounded-full ${to === 'android' ? 'bg-[#3ddc84]' : 'bg-[#4cc2ff]'}`}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: SWITCH_MS / 1000 - 0.2, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function Root() {
  const [platform, setPlatform] = useState(detectPlatform)
  const [switching, setSwitching] = useState(null) // target platform while the overlay runs
  const state = useRef({ platform, switching })
  state.current = { platform, switching }

  // Debounced so dragging a window edge doesn't trigger a switch on every pixel.
  useEffect(() => {
    let t
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        const target = detectPlatform()
        if (target !== state.current.platform && !state.current.switching) setSwitching(target)
      }, 450)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    if (!switching) return
    const t = setTimeout(() => {
      // A real reboot: the target OS plays its boot animation again.
      sessionStorage.removeItem(SESSION_KEYS[switching])
      setPlatform(switching)
      setSwitching(null)
      // If the window was resized back meanwhile, run the switch again.
      setTimeout(() => {
        const target = detectPlatform()
        if (target !== switching) setSwitching(target)
      }, 100)
    }, SWITCH_MS)
    return () => clearTimeout(t)
  }, [switching])

  return (
    <SettingsProvider>
      {platform === 'android' ? <AndroidOS key="android" /> : <WindowsOS key="windows" />}
      <AnimatePresence>{switching && <SwitchOverlay key={switching} from={platform} to={switching} />}</AnimatePresence>
    </SettingsProvider>
  )
}

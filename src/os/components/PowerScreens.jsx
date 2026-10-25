import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../../data/portfolio'
import { Avatar, G, WindowsLogo } from '../icons'
import { useSettings, useShell } from '../store'
import { useBattery, useClock } from './Taskbar'
import Wallpaper from './Wallpaper'

const BOOT_MS = 2600

// Five dots orbiting with a stagger, like the Windows boot spinner.
function BootSpinner() {
  return (
    <div className="relative h-10 w-10">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="absolute inset-0"
          style={{ animation: `os-boot-dot 2.2s cubic-bezier(0.5, 0.1, 0.4, 0.9) ${i * 0.12}s infinite` }}
        >
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white" />
        </span>
      ))}
    </div>
  )
}

export function BootScreen() {
  const { setPower } = useShell()
  useEffect(() => {
    const t = setTimeout(() => setPower('lock'), BOOT_MS)
    return () => clearTimeout(t)
  }, [setPower])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[9500] flex flex-col items-center justify-center gap-24 bg-black"
    >
      <WindowsLogo size={96} />
      <BootSpinner />
    </motion.div>
  )
}

export function LockScreen() {
  const shell = useShell()
  const { settings } = useSettings()
  const now = useClock()
  const battery = useBattery()
  const [stage, setStage] = useState('lock') // 'lock' → 'signin'

  useEffect(() => {
    if (stage !== 'lock') return
    const next = () => setStage('signin')
    window.addEventListener('keydown', next)
    return () => window.removeEventListener('keydown', next)
  }, [stage])

  const signIn = () => shell.setPower('desktop')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="absolute inset-0 z-[9400] overflow-hidden text-white"
      onClick={() => stage === 'lock' && setStage('signin')}
    >
      <motion.div className="absolute inset-0" animate={{ scale: stage === 'signin' ? 1.08 : 1, filter: stage === 'signin' ? 'blur(24px)' : 'blur(0px)' }} transition={{ duration: 0.5 }}>
        <Wallpaper name={settings.wallpaper} theme={settings.theme} />
      </motion.div>
      <div className={`absolute inset-0 transition-colors duration-500 ${stage === 'signin' ? 'bg-black/35' : 'bg-black/10'}`} />

      <AnimatePresence mode="wait">
        {stage === 'lock' ? (
          <motion.div
            key="lock"
            exit={{ y: -120, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeIn' }}
            className="absolute inset-x-0 top-[12vh] flex flex-col items-center text-center [text-shadow:0_2px_12px_rgb(0_0_0/0.35)]"
          >
            <p className="font-display text-[clamp(4.5rem,12vw,8.5rem)] font-semibold leading-none">
              {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/i, '')}
            </p>
            <p className="mt-3 text-xl font-medium sm:text-2xl">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </motion.div>
        ) : (
          <motion.div
            key="signin"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6"
          >
            <Avatar size={176} className="drop-shadow-2xl" />
            <p className="text-3xl font-semibold">{profile.name}</p>
            <button
              autoFocus
              onClick={signIn}
              className="mt-2 rounded-md bg-white/15 px-10 py-2 text-sm backdrop-blur-md transition hover:bg-white/25 active:bg-white/10"
            >
              Sign in
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 right-8 flex items-center gap-4">
        <G.Wifi size={18} off={!settings.wifi || settings.airplane} />
        <G.Battery size={20} level={battery.level} charging={battery.charging} />
      </div>
      {stage === 'lock' && <p className="absolute inset-x-0 bottom-8 text-center text-sm text-white/70">Click or press any key to unlock</p>}
    </motion.div>
  )
}

export function OffScreen() {
  const shell = useShell()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 z-[9600] flex flex-col items-center justify-center gap-5 bg-black text-white/60"
    >
      <button
        aria-label="Power on"
        onClick={() => shell.setPower('boot')}
        className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 transition hover:border-white/50 hover:text-white"
      >
        <G.Power size={26} />
      </button>
      <p className="text-sm">Press to power on</p>
    </motion.div>
  )
}

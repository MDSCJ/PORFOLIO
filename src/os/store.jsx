import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { apps } from './apps/registry'

export const TASKBAR_HEIGHT = 48
export const MOBILE_BREAKPOINT = 768

/* ------------------------------------------------------------------ Settings */

export const ACCENTS = ['#4cc2ff', '#0078d4', '#8764b8', '#c239b3', '#e74856', '#ff8c00', '#00b294', '#22d3ee']
export const WALLPAPERS = ['windows', 'bloom', 'glow', 'sunrise']

const DEFAULT_SETTINGS = {
  theme: 'dark',
  accent: ACCENTS[0],
  wallpaper: 'windows',
  brightness: 100,
  volume: 60,
  nightLight: false,
  wifi: true,
  bluetooth: true,
  airplane: false,
  batterySaver: false,
}
const SETTINGS_KEY = 'cj-os-settings'

function readableOn(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? '#00131f' : '#ffffff'
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    const root = document.documentElement
    root.dataset.theme = settings.theme
    root.style.setProperty('--accent', settings.accent)
    root.style.setProperty('--accent-fg', readableOn(settings.accent))
  }, [settings])

  const update = useCallback((patch) => setSettings((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) })), [])
  const value = useMemo(() => ({ settings, update }), [settings, update])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = () => useContext(SettingsContext)

/* ------------------------------------------------------------ Viewport hook */

export function useViewport() {
  const get = () => ({ width: window.innerWidth, height: window.innerHeight })
  const [size, setSize] = useState(get)
  useEffect(() => {
    const onResize = () => setSize(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return { ...size, mobile: size.width < MOBILE_BREAKPOINT, workHeight: size.height - TASKBAR_HEIGHT }
}

/* ----------------------------------------------------------- Window manager */

let windowSeq = 0

function initialRect(app, count) {
  const vw = window.innerWidth
  const vh = window.innerHeight - TASKBAR_HEIGHT
  const w = Math.min(app.size?.[0] ?? 900, vw - 40)
  const h = Math.min(app.size?.[1] ?? 600, vh - 40)
  const offset = (count % 6) * 28
  return {
    x: Math.max(8, Math.round((vw - w) / 2) + offset - 70),
    y: Math.max(8, Math.round((vh - h) / 2) + offset - 50),
    w,
    h,
  }
}

function topmost(windows, exceptId) {
  return windows
    .filter((w) => !w.minimized && w.id !== exceptId)
    .reduce((top, w) => (!top || w.z > top.z ? w : top), null)?.id ?? null
}

function reducer(state, action) {
  const { windows } = state
  const patch = (id, fn) => windows.map((w) => (w.id === id ? { ...w, ...fn(w) } : w))

  switch (action.type) {
    case 'open': {
      const app = apps[action.appId]
      const existing = app.singleInstance && windows.find((w) => w.appId === action.appId)
      if (existing) {
        return {
          ...state,
          z: state.z + 1,
          focusedId: existing.id,
          windows: patch(existing.id, () => ({ minimized: false, z: state.z + 1, props: action.props ?? existing.props })),
        }
      }
      const id = `w${++windowSeq}`
      const win = {
        id,
        appId: action.appId,
        title: action.props?.title ?? app.title,
        props: action.props ?? {},
        rect: initialRect(app, windows.length),
        restoreRect: null,
        state: app.startMaximized ? 'max' : 'normal', // 'normal' | 'max' | 'left' | 'right'
        minimized: false,
        z: state.z + 1,
      }
      return { ...state, z: state.z + 1, focusedId: id, windows: [...windows, win] }
    }
    case 'close': {
      const rest = windows.filter((w) => w.id !== action.id)
      return { ...state, windows: rest, focusedId: state.focusedId === action.id ? topmost(rest) : state.focusedId }
    }
    case 'focus':
      if (state.focusedId === action.id) return state
      return { ...state, z: state.z + 1, focusedId: action.id, windows: patch(action.id, () => ({ z: state.z + 1, minimized: false })) }
    case 'minimize':
      return {
        ...state,
        focusedId: state.focusedId === action.id ? topmost(windows, action.id) : state.focusedId,
        windows: patch(action.id, () => ({ minimized: true })),
      }
    case 'minimizeAll':
      return { ...state, focusedId: null, windows: windows.map((w) => ({ ...w, minimized: true })) }
    case 'setState':
      // Snapping/maximising remembers the free-floating rect so it can be restored later.
      return {
        ...state,
        windows: patch(action.id, (w) => ({
          state: action.state,
          restoreRect: action.state === 'normal' ? null : w.state === 'normal' ? w.rect : w.restoreRect,
          rect: action.state === 'normal' ? (action.rect ?? w.restoreRect ?? w.rect) : w.rect,
        })),
      }
    case 'rect':
      return { ...state, windows: patch(action.id, () => ({ rect: action.rect })) }
    case 'props':
      return {
        ...state,
        windows: patch(action.id, (w) => ({ props: { ...w.props, ...action.props }, title: action.props.title ?? w.title })),
      }
    case 'closeAll':
      return { ...state, windows: [], focusedId: null }
    default:
      return state
  }
}

const WindowContext = createContext(null)

export function WindowProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { windows: [], focusedId: null, z: 10 })

  const api = useMemo(
    () => ({
      open: (appId, props) => dispatch({ type: 'open', appId, props }),
      close: (id) => dispatch({ type: 'close', id }),
      focus: (id) => dispatch({ type: 'focus', id }),
      minimize: (id) => dispatch({ type: 'minimize', id }),
      minimizeAll: () => dispatch({ type: 'minimizeAll' }),
      setState: (id, s, rect) => dispatch({ type: 'setState', id, state: s, rect }),
      setRect: (id, rect) => dispatch({ type: 'rect', id, rect }),
      setProps: (id, props) => dispatch({ type: 'props', id, props }),
      closeAll: () => dispatch({ type: 'closeAll' }),
    }),
    [],
  )

  const value = useMemo(() => ({ ...state, ...api }), [state, api])
  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
}

export const useWindows = () => useContext(WindowContext)

/* ------------------------------------------------- Shell UI (flyouts, toasts) */

const ShellContext = createContext(null)

// Which flyout is open ('start' | 'quick' | 'calendar' | null) plus transient toasts and the power state.
export function ShellProvider({ children }) {
  const [flyout, setFlyout] = useState(null)
  const [toasts, setToasts] = useState([])
  const [power, setPower] = useState(() => (sessionStorage.getItem('cj-os-session') ? 'desktop' : 'boot'))

  useEffect(() => {
    if (power === 'desktop') sessionStorage.setItem('cj-os-session', '1')
  }, [power])

  const value = useMemo(
    () => ({
      flyout,
      toggleFlyout: (name) => setFlyout((f) => (f === name ? null : name)),
      closeFlyout: () => setFlyout(null),
      openFlyout: setFlyout,
      toasts,
      toast: (t) => {
        const id = Math.random().toString(36).slice(2)
        setToasts((list) => [...list, { id, ...t }])
        setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), t.duration ?? 7000)
      },
      dismissToast: (id) => setToasts((list) => list.filter((x) => x.id !== id)),
      power,
      setPower,
    }),
    [flyout, toasts, power],
  )
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
}

export const useShell = () => useContext(ShellContext)

/* --------------------------------------------------------------- Platform */

// 'windows' | 'android' — lets shared apps drop desktop-only chrome (tab strips etc.) on the phone shell.
export const PlatformContext = createContext('windows')
export const usePlatform = () => useContext(PlatformContext)

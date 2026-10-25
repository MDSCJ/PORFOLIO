import { skillIcons } from '../../data/skillIcons'
import {
  BrowserIcon,
  CalculatorIcon,
  ExplorerIcon,
  MailIcon,
  NotepadIcon,
  PortfolioIcon,
  RecycleBinIcon,
  SettingsIcon,
  TerminalIcon,
} from '../icons'
import Portfolio from './Portfolio'
import Explorer from './Explorer'
import Browser from './Browser'
import Notepad from './Notepad'
import Terminal from './Terminal'
import Calculator from './Calculator'
import Settings from './Settings'
import Mail from './Mail'
import RecycleBin from './RecycleBin'

function GitHubIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden className="shrink-0">
      <circle cx="24" cy="24" r="21" fill="#1f2328" />
      <g transform="translate(10 10) scale(1.1667)">
        <path d={skillIcons.GitHub.paths[0]} fill="#fff" />
      </g>
    </svg>
  )
}

function LinkedInIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden className="shrink-0">
      <rect x="4" y="4" width="40" height="40" rx="8" fill="#0a66c2" />
      <circle cx="15.5" cy="15.5" r="3" fill="#fff" />
      <rect x="12.8" y="20.5" width="5.4" height="15" rx="1" fill="#fff" />
      <path d="M22 20.5h5v2.3c.9-1.6 2.8-2.7 5.1-2.7 4 0 5.4 2.5 5.4 6.6v8.8h-5.3v-7.8c0-1.9-.5-3.2-2.3-3.2-1.9 0-2.6 1.4-2.6 3.3v7.7H22z" fill="#fff" />
    </svg>
  )
}

/*
  App definitions.
  - singleInstance: re-opening focuses the existing window.
  - hasIframe: content can't report clicks to the shell, so an overlay captures the focusing click.
  - opens: no window of its own; opens another app with props (e.g. a page in the browser).
  - taskbar / start: pinned positions (order matters).
*/
export const apps = {
  portfolio: {
    id: 'portfolio',
    title: 'Portfolio',
    Icon: PortfolioIcon,
    component: Portfolio,
    size: [1180, 760],
    startMaximized: true,
    singleInstance: true,
    hasIframe: true,
    taskbar: true,
    start: true,
  },
  explorer: { id: 'explorer', title: 'File Explorer', Icon: ExplorerIcon, component: Explorer, size: [920, 580], taskbar: true, start: true },
  browser: {
    id: 'browser',
    title: 'Edge',
    Icon: BrowserIcon,
    component: Browser,
    size: [1100, 720],
    singleInstance: true,
    hasIframe: true,
    taskbar: true,
    start: true,
  },
  terminal: { id: 'terminal', title: 'Terminal', Icon: TerminalIcon, component: Terminal, size: [780, 480], taskbar: true, start: true },
  notepad: { id: 'notepad', title: 'Notepad', Icon: NotepadIcon, component: Notepad, size: [720, 520], taskbar: true, start: true },
  mail: { id: 'mail', title: 'Mail', Icon: MailIcon, component: Mail, size: [980, 620], singleInstance: true, taskbar: true, start: true },
  calculator: {
    id: 'calculator',
    title: 'Calculator',
    Icon: CalculatorIcon,
    component: Calculator,
    size: [340, 540],
    minSize: [320, 480],
    singleInstance: true,
    start: true,
  },
  settings: { id: 'settings', title: 'Settings', Icon: SettingsIcon, component: Settings, size: [1000, 660], singleInstance: true, taskbar: true, start: true },
  recycle: { id: 'recycle', title: 'Recycle Bin', Icon: RecycleBinIcon, component: RecycleBin, size: [760, 460], singleInstance: true, start: true },
  github: { id: 'github', title: 'GitHub', Icon: GitHubIcon, opens: ['browser', { page: 'github' }], start: true },
  linkedin: { id: 'linkedin', title: 'LinkedIn', Icon: LinkedInIcon, opens: ['browser', { page: 'linkedin' }], start: true },
}

export const taskbarApps = Object.values(apps).filter((a) => a.taskbar)
export const startApps = Object.values(apps).filter((a) => a.start)

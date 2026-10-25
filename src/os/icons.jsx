// Original Fluent-style icons for the Windows 11 shell. All drawn on a 48×48 grid.
import { useId } from 'react'

function Svg({ size = 32, children, className = '' }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden className={`shrink-0 ${className}`}>
      {children}
    </svg>
  )
}

export function WindowsLogo({ size = 24, className = '' }) {
  const id = useId()
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden className={`shrink-0 ${className}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#28afea" />
          <stop offset="1" stopColor="#0b5cd5" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="19" height="19" rx="1.5" fill={`url(#${id})`} />
      <rect x="25" y="4" width="19" height="19" rx="1.5" fill={`url(#${id})`} />
      <rect x="4" y="25" width="19" height="19" rx="1.5" fill={`url(#${id})`} />
      <rect x="25" y="25" width="19" height="19" rx="1.5" fill={`url(#${id})`} />
    </svg>
  )
}

export function FolderIcon({ size }) {
  const id = useId()
  return (
    <Svg size={size}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd86b" />
          <stop offset="1" stopColor="#f4b400" />
        </linearGradient>
      </defs>
      <path d="M4 11a3 3 0 0 1 3-3h11l4 4h19a3 3 0 0 1 3 3v3H4z" fill="#e0a100" />
      <rect x="4" y="15" width="40" height="26" rx="3" fill={`url(#${id})`} />
    </Svg>
  )
}

export function ExplorerIcon({ size }) {
  const id = useId()
  return (
    <Svg size={size}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd86b" />
          <stop offset="1" stopColor="#f4b400" />
        </linearGradient>
      </defs>
      <path d="M4 11a3 3 0 0 1 3-3h11l4 4h19a3 3 0 0 1 3 3v3H4z" fill="#e0a100" />
      <rect x="4" y="15" width="40" height="26" rx="3" fill={`url(#${id})`} />
      <rect x="4" y="30" width="40" height="5" fill="#1f8ff0" />
    </Svg>
  )
}

export function BrowserIcon({ size }) {
  const id = useId()
  return (
    <Svg size={size}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#35c1f1" />
          <stop offset="0.55" stopColor="#1b7fe0" />
          <stop offset="1" stopColor="#3ccf8e" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="19" fill={`url(#${id})`} />
      <path
        d="M10 27c2-9 10-13 17-11 6 2 8 7 6 10-1.5 2.4-5 3-8 2 3 3 9 3 13 0"
        fill="none"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.92"
      />
    </Svg>
  )
}

export function TerminalIcon({ size }) {
  return (
    <Svg size={size}>
      <rect x="4" y="7" width="40" height="34" rx="5" fill="#2b2b2b" />
      <rect x="4" y="7" width="40" height="8" rx="5" fill="#3d3d3d" />
      <rect x="4" y="11" width="40" height="4" fill="#3d3d3d" />
      <path d="M12 22l6 5-6 5" fill="none" stroke="#e6e6e6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 33h11" stroke="#4cc2ff" strokeWidth="2.6" strokeLinecap="round" />
    </Svg>
  )
}

export function NotepadIcon({ size }) {
  const id = useId()
  return (
    <Svg size={size}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fb6ff" />
          <stop offset="1" stopColor="#2a7fe0" />
        </linearGradient>
      </defs>
      <rect x="8" y="6" width="32" height="38" rx="4" fill={`url(#${id})`} />
      <rect x="12" y="12" width="24" height="28" rx="2" fill="#fff" />
      <path d="M16 19h16M16 25h16M16 31h10" stroke="#8ab8e8" strokeWidth="2" strokeLinecap="round" />
      {[15, 21, 27, 33].map((x) => (
        <rect key={x} x={x - 1.2} y="3" width="2.4" height="7" rx="1.2" fill="#1d5fb5" />
      ))}
    </Svg>
  )
}

export function CalculatorIcon({ size }) {
  return (
    <Svg size={size}>
      <rect x="9" y="4" width="30" height="40" rx="5" fill="#3b3b3b" />
      <rect x="13" y="9" width="22" height="8" rx="2" fill="#9fd6ff" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={13 + c * 8} y={21 + r * 7.5} width="6" height="5.5" rx="1.5" fill={c === 2 && r === 2 ? '#4cc2ff' : '#6b6b6b'} />
        )),
      )}
    </Svg>
  )
}

export function SettingsIcon({ size }) {
  const id = useId()
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45)
  return (
    <Svg size={size}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9aa4b1" />
          <stop offset="1" stopColor="#5d6672" />
        </linearGradient>
      </defs>
      <g fill={`url(#${id})`}>
        {teeth.map((a) => (
          <rect key={a} x="20.5" y="4" width="7" height="10" rx="2" transform={`rotate(${a} 24 24)`} />
        ))}
        <circle cx="24" cy="24" r="14" />
      </g>
      <circle cx="24" cy="24" r="6" fill="#2b2f36" />
    </Svg>
  )
}

export function MailIcon({ size }) {
  const id = useId()
  return (
    <Svg size={size}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3ea6ff" />
          <stop offset="1" stopColor="#0a64c8" />
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="40" height="28" rx="4" fill={`url(#${id})`} />
      <path d="M6 13l18 13 18-13" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />
    </Svg>
  )
}

export function RecycleBinIcon({ size }) {
  return (
    <Svg size={size}>
      <path d="M11 14h26l-2.5 27a3 3 0 0 1-3 2.7h-15a3 3 0 0 1-3-2.7z" fill="#cfe4f7" opacity="0.85" />
      <path d="M11 14h26l-2.5 27a3 3 0 0 1-3 2.7h-15a3 3 0 0 1-3-2.7z" fill="none" stroke="#7aa7d6" strokeWidth="1.5" />
      <rect x="8" y="9" width="32" height="6" rx="2" fill="#a9c9ea" />
      <path d="M19 22v15M24 22v15M29 22v15" stroke="#7aa7d6" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}

export function PortfolioIcon({ size }) {
  const id = useId()
  return (
    <Svg size={size}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="10" fill="#05060a" />
      <rect x="4.75" y="4.75" width="38.5" height="38.5" rx="9.25" fill="none" stroke={`url(#${id})`} strokeWidth="1.5" />
      <text x="24" y="30.5" textAnchor="middle" fontSize="17" fontWeight="800" fontFamily="Arial, sans-serif" fill={`url(#${id})`} letterSpacing="1">
        CJ
      </text>
    </Svg>
  )
}

export function ThisPcIcon({ size }) {
  return (
    <Svg size={size}>
      <rect x="4" y="8" width="40" height="26" rx="3" fill="#2f86e8" />
      <rect x="7" y="11" width="34" height="20" rx="1.5" fill="#9fd3ff" />
      <path d="M18 40h12M24 34v6" stroke="#6b7a8c" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  )
}

export function DriveIcon({ size }) {
  return (
    <Svg size={size}>
      <rect x="4" y="18" width="40" height="18" rx="3" fill="#c3cad3" />
      <rect x="4" y="30" width="40" height="6" rx="2" fill="#8f99a6" />
      <circle cx="38" cy="33" r="1.5" fill="#3ddc84" />
      <g transform="translate(9 20) scale(0.22)">
        <rect x="4" y="4" width="19" height="19" fill="#0b78d7" />
        <rect x="25" y="4" width="19" height="19" fill="#0b78d7" />
        <rect x="4" y="25" width="19" height="19" fill="#0b78d7" />
        <rect x="25" y="25" width="19" height="19" fill="#0b78d7" />
      </g>
    </Svg>
  )
}

export function TextFileIcon({ size }) {
  return (
    <Svg size={size}>
      <path d="M11 4h18l10 10v28a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fff" stroke="#c4c4c4" />
      <path d="M29 4v8a2 2 0 0 0 2 2h8" fill="#e6e6e6" stroke="#c4c4c4" />
      <path d="M15 22h18M15 27h18M15 32h12" stroke="#9a9a9a" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}

export function LinkFileIcon({ size }) {
  return (
    <Svg size={size}>
      <circle cx="24" cy="24" r="17" fill="#1f8ff0" />
      <path d="M7 24h34M24 7c-6 5-6 29 0 34M24 7c6 5 6 29 0 34" fill="none" stroke="#bfe2ff" strokeWidth="1.8" />
      <rect x="27" y="27" width="16" height="16" rx="3" fill="#fff" />
      <path d="M31 39l8-8M33 31h6v6" fill="none" stroke="#1f8ff0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function PdfIcon({ size }) {
  return (
    <Svg size={size}>
      <path d="M11 4h18l10 10v28a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fff" stroke="#c4c4c4" />
      <rect x="6" y="24" width="24" height="12" rx="2" fill="#d93025" />
      <text x="18" y="33" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif" fill="#fff">
        PDF
      </text>
    </Svg>
  )
}

export function Avatar({ size = 40, className = '' }) {
  const id = useId()
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden className={`shrink-0 ${className}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill={`url(#${id})`} />
      <text x="24" y="30.5" textAnchor="middle" fontSize="17" fontWeight="700" fontFamily="Arial, sans-serif" fill="#fff">
        CJ
      </text>
    </svg>
  )
}

/* ---- Small line glyphs (taskbar tray, title bars, toolbars). 16×16 grid, currentColor. ---- */

function Glyph({ size = 16, children, className = '', strokeWidth = 1.3 }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {children}
    </svg>
  )
}

export const G = {
  Search: (p) => (
    <Glyph {...p}>
      <circle cx="9.5" cy="6.5" r="4.5" />
      <path d="M6.3 9.7 2 14" />
    </Glyph>
  ),
  Wifi: ({ off, ...p }) => (
    <Glyph {...p}>
      <path d="M1.5 6a9.5 9.5 0 0 1 13 0" opacity={off ? 0.35 : 1} />
      <path d="M3.8 8.5a6.2 6.2 0 0 1 8.4 0" opacity={off ? 0.35 : 1} />
      <path d="M6 11a3 3 0 0 1 4 0" opacity={off ? 0.35 : 1} />
      <circle cx="8" cy="13" r="0.6" fill="currentColor" />
      {off && <path d="M2 2l12 12" />}
    </Glyph>
  ),
  Volume: ({ level = 60, ...p }) => (
    <Glyph {...p}>
      <path d="M2 6h2.5L8 3v10L4.5 10H2z" />
      {level > 0 && <path d="M10.5 6a2.8 2.8 0 0 1 0 4" />}
      {level > 50 && <path d="M12.5 4a5.6 5.6 0 0 1 0 8" />}
      {level === 0 && <path d="M11 6l3 4M14 6l-3 4" />}
    </Glyph>
  ),
  Battery: ({ level = 1, charging, ...p }) => (
    <Glyph {...p}>
      <rect x="1.5" y="4.5" width="11.5" height="7" rx="1.5" />
      <path d="M14.5 7v2" />
      <rect x="3" y="6" width={Math.max(0.5, 8.5 * level)} height="4" rx="0.6" fill="currentColor" stroke="none" />
      {charging && <path d="M8 5.2 6.3 8h2.4L7 10.8" stroke="var(--os-taskbar)" strokeWidth="1.1" />}
    </Glyph>
  ),
  Bluetooth: (p) => (
    <Glyph {...p}>
      <path d="M4.5 5l7 6L8 14V2l3.5 3-7 6" />
    </Glyph>
  ),
  Plane: (p) => (
    <Glyph {...p}>
      <path d="M8 1.5c.8 0 1 .9 1 1.6V6l5 3v1.5L9 9v3l1.8 1.3V14.5L8 13.8l-2.8.7v-1.2L7 12V9l-5 1.5V9l5-3V3.1c0-.7.2-1.6 1-1.6z" />
    </Glyph>
  ),
  Leaf: (p) => (
    <Glyph {...p}>
      <path d="M3 13c0-6 4-10 10-10 0 6-4 10-10 10z" />
      <path d="M3 13l6-6" />
    </Glyph>
  ),
  Moon: (p) => (
    <Glyph {...p}>
      <path d="M13 10A6 6 0 0 1 6 3a6 6 0 1 0 7 7z" />
    </Glyph>
  ),
  Sun: (p) => (
    <Glyph {...p}>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1 1M12 12l1 1M3 13l1-1M12 4l1-1" />
    </Glyph>
  ),
  Accessibility: (p) => (
    <Glyph {...p}>
      <circle cx="8" cy="2.8" r="1.3" />
      <path d="M3 5.5l5 1 5-1M8 6.5V10M8 10l-2.5 4.5M8 10l2.5 4.5" />
    </Glyph>
  ),
  Power: (p) => (
    <Glyph {...p}>
      <path d="M8 1.5V8" />
      <path d="M4.5 3.8a5.5 5.5 0 1 0 7 0" />
    </Glyph>
  ),
  Lock: (p) => (
    <Glyph {...p}>
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" />
    </Glyph>
  ),
  Restart: (p) => (
    <Glyph {...p}>
      <path d="M13.5 8A5.5 5.5 0 1 1 11.6 3.8" />
      <path d="M12 1v3.2H8.8" />
    </Glyph>
  ),
  Gear: (p) => (
    <Glyph {...p}>
      <circle cx="8" cy="8" r="2.2" />
      <path d="M8 1.5v1.8M8 12.7v1.8M14.5 8h-1.8M3.3 8H1.5M12.6 3.4l-1.3 1.3M4.7 11.3l-1.3 1.3M12.6 12.6l-1.3-1.3M4.7 4.7 3.4 3.4" />
    </Glyph>
  ),
  ChevronRight: (p) => (
    <Glyph {...p}>
      <path d="M6 3l5 5-5 5" />
    </Glyph>
  ),
  ChevronLeft: (p) => (
    <Glyph {...p}>
      <path d="M10 3 5 8l5 5" />
    </Glyph>
  ),
  ChevronUp: (p) => (
    <Glyph {...p}>
      <path d="M3 10l5-5 5 5" />
    </Glyph>
  ),
  ChevronDown: (p) => (
    <Glyph {...p}>
      <path d="M3 6l5 5 5-5" />
    </Glyph>
  ),
  ArrowLeft: (p) => (
    <Glyph {...p}>
      <path d="M14 8H2M7 3 2 8l5 5" />
    </Glyph>
  ),
  ArrowRight: (p) => (
    <Glyph {...p}>
      <path d="M2 8h12M9 3l5 5-5 5" />
    </Glyph>
  ),
  ArrowUp: (p) => (
    <Glyph {...p}>
      <path d="M8 14V2M3 7l5-5 5 5" />
    </Glyph>
  ),
  Refresh: (p) => (
    <Glyph {...p}>
      <path d="M13.5 8A5.5 5.5 0 1 1 11.6 3.8" />
      <path d="M12 1v3.2H8.8" />
    </Glyph>
  ),
  Minimize: (p) => (
    <Glyph {...p} strokeWidth={1}>
      <path d="M3 8h10" />
    </Glyph>
  ),
  Maximize: (p) => (
    <Glyph {...p} strokeWidth={1}>
      <rect x="3.5" y="3.5" width="9" height="9" rx="1.2" />
    </Glyph>
  ),
  Restore: (p) => (
    <Glyph {...p} strokeWidth={1}>
      <rect x="3.5" y="5.5" width="7" height="7" rx="1.2" />
      <path d="M5.5 5.5V4.7c0-.7.5-1.2 1.2-1.2h4.6c.7 0 1.2.5 1.2 1.2v4.6c0 .7-.5 1.2-1.2 1.2h-.8" />
    </Glyph>
  ),
  Close: (p) => (
    <Glyph {...p} strokeWidth={1}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </Glyph>
  ),
  Plus: (p) => (
    <Glyph {...p}>
      <path d="M8 3v10M3 8h10" />
    </Glyph>
  ),
  External: (p) => (
    <Glyph {...p}>
      <path d="M9 2.5h4.5V7M13.5 2.5 7 9M12 10v2.5A1.5 1.5 0 0 1 10.5 14h-7A1.5 1.5 0 0 1 2 12.5v-7A1.5 1.5 0 0 1 3.5 4H6" />
    </Glyph>
  ),
  Home: (p) => (
    <Glyph {...p}>
      <path d="M2 7.5 8 2.5l6 5M3.5 6.5V13.5h3.2V10h2.6v3.5h3.2V6.5" />
    </Glyph>
  ),
  Grid: (p) => (
    <Glyph {...p}>
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </Glyph>
  ),
  List: (p) => (
    <Glyph {...p}>
      <path d="M2 4h12M2 8h12M2 12h12" />
    </Glyph>
  ),
  Send: (p) => (
    <Glyph {...p}>
      <path d="M2 8 14 2l-3 12-3-5z" />
      <path d="M8 9l6-7" />
    </Glyph>
  ),
  Inbox: (p) => (
    <Glyph {...p}>
      <path d="M2 9l2-6h8l2 6v4H2z" />
      <path d="M2 9h3.5l1 1.5h3L10.5 9H14" />
    </Glyph>
  ),
  Trash: (p) => (
    <Glyph {...p}>
      <path d="M2.5 4h11M6 4V2.5h4V4M4 4l.7 9.5h6.6L12 4" />
    </Glyph>
  ),
  User: (p) => (
    <Glyph {...p}>
      <circle cx="8" cy="5" r="3" />
      <path d="M2.5 14.5c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" />
    </Glyph>
  ),
  Monitor: (p) => (
    <Glyph {...p}>
      <rect x="1.5" y="2.5" width="13" height="8.5" rx="1.2" />
      <path d="M5.5 14h5M8 11v3" />
    </Glyph>
  ),
  Brush: (p) => (
    <Glyph {...p}>
      <path d="M13.5 2.5 7 9l-1-1 6.5-6.5zM6 8.5c-2 0-3 1.3-3 3 0 .8-.5 1.5-1.5 2 3 .5 5.5-.5 5.5-3.5z" />
    </Glyph>
  ),
  Info: (p) => (
    <Glyph {...p}>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7v4.5M8 4.6v.1" />
    </Glyph>
  ),
  Document: (p) => (
    <Glyph {...p}>
      <path d="M4 1.5h5.5L13 5v9.5H4z" />
      <path d="M9.5 1.5V5H13" />
    </Glyph>
  ),
  Desktop: (p) => (
    <Glyph {...p}>
      <rect x="1.5" y="2.5" width="13" height="9" rx="1.2" />
      <path d="M1.5 9.5h13" />
    </Glyph>
  ),
  Download: (p) => (
    <Glyph {...p}>
      <path d="M8 2v8.5M4.5 7 8 10.5 11.5 7M2.5 13.5h11" />
    </Glyph>
  ),
  Bell: (p) => (
    <Glyph {...p}>
      <path d="M4 11V7a4 4 0 0 1 8 0v4l1.2 1.5H2.8zM6.5 14a1.6 1.6 0 0 0 3 0" />
    </Glyph>
  ),
  Edit: (p) => (
    <Glyph {...p}>
      <path d="M10.5 2.5l3 3L6 13H3v-3z" />
    </Glyph>
  ),
  More: (p) => (
    <Glyph {...p}>
      <circle cx="3.5" cy="8" r="0.7" fill="currentColor" />
      <circle cx="8" cy="8" r="0.7" fill="currentColor" />
      <circle cx="12.5" cy="8" r="0.7" fill="currentColor" />
    </Glyph>
  ),
}

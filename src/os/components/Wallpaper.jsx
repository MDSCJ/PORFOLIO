import { useId } from 'react'
import windowsBloom from '../assets/wallpapers/windows-bloom.png'
import windowsBloomLight from '../assets/wallpapers/windows-bloom-light.png'

// Photo wallpapers (files in assets/wallpapers), one per theme. Everything else below is drawn as SVG.
const IMAGES = { windows: { dark: windowsBloom, light: windowsBloomLight } }

// Original "bloom" wallpapers: rotated petals with soft gradients. Palettes per wallpaper × theme.
const PALETTES = {
  bloom: {
    dark: { bg: ['#020a1c', '#0a1f45'], petals: ['#0b5cd5', '#2aa7ff', '#7dd3fc'], glow: '#1d6fe0' },
    light: { bg: ['#cfe3f7', '#eaf3fc'], petals: ['#1166e0', '#3fa4ff', '#a7d8ff'], glow: '#8cc4ff' },
  },
  glow: {
    dark: { bg: ['#05060a', '#140b2e'], petals: ['#6d28d9', '#a855f7', '#22d3ee'], glow: '#7c3aed' },
    light: { bg: ['#ece6fb', '#f6f2ff'], petals: ['#7c3aed', '#c084fc', '#67e8f9'], glow: '#c4b5fd' },
  },
  sunrise: {
    dark: { bg: ['#140805', '#2c1208'], petals: ['#c2410c', '#fb923c', '#fde68a'], glow: '#ea580c' },
    light: { bg: ['#fde8d7', '#fff6ee'], petals: ['#ea580c', '#fdba74', '#fef3c7'], glow: '#fdba74' },
  },
}

const PETAL = 'M0 0C70-150 260-200 430-120 330-30 170 40 0 0Z'

export default function Wallpaper({ name = 'windows', theme = 'dark', className = '' }) {
  const id = useId().replace(/:/g, '')
  if (IMAGES[name]) {
    return <img src={IMAGES[name][theme] ?? IMAGES[name].dark} alt="" aria-hidden draggable={false} className={`absolute inset-0 h-full w-full object-cover ${className}`} />
  }
  const p = (PALETTES[name] ?? PALETTES.bloom)[theme] ?? PALETTES.bloom.dark
  const petals = Array.from({ length: 9 }, (_, i) => i)

  return (
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={`absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.bg[0]} />
          <stop offset="1" stopColor={p.bg[1]} />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx="0.5" cy="0.58" r="0.5">
          <stop offset="0" stopColor={p.glow} stopOpacity="0.55" />
          <stop offset="1" stopColor={p.glow} stopOpacity="0" />
        </radialGradient>
        {p.petals.map((c, i) => (
          <linearGradient key={c} id={`${id}p${i}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={p.petals[(i + 2) % 3]} stopOpacity="0.95" />
            <stop offset="0.6" stopColor={c} stopOpacity="0.85" />
            <stop offset="1" stopColor={c} stopOpacity="0.15" />
          </linearGradient>
        ))}
        <filter id={`${id}soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id={`${id}blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="60" />
        </filter>
      </defs>

      <rect width="1920" height="1080" fill={`url(#${id}bg)`} />
      <ellipse cx="960" cy="640" rx="760" ry="440" fill={`url(#${id}glow)`} />

      <g transform="translate(960 610)">
        <g filter={`url(#${id}blur)`} opacity="0.55">
          <circle r="260" fill={p.petals[1]} />
        </g>
        <g filter={`url(#${id}soft)`}>
          {petals.map((i) => (
            <path
              key={i}
              d={PETAL}
              fill={`url(#${id}p${i % 3})`}
              transform={`rotate(${-90 + (i - 4) * 26}) scale(${1 - Math.abs(i - 4) * 0.06})`}
              opacity={0.92 - Math.abs(i - 4) * 0.06}
            />
          ))}
        </g>
      </g>
    </svg>
  )
}

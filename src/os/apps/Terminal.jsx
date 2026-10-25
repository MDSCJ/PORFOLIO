import { useEffect, useRef, useState } from 'react'
import { achievements, contact, education, profile, projects, publications, skills } from '../../data/portfolio'
import { apps } from './registry'
import { displayPath, HOME_PATH, resolve } from '../fs'
import { G, TerminalIcon } from '../icons'
import { launch } from '../launch'
import { usePlatform, useSettings, useWindows } from '../store'

const C = {
  accent: 'text-[#4cc2ff]',
  green: 'text-[#16c60c]',
  yellow: 'text-[#f9f1a5]',
  dim: 'text-[#8a8a8a]',
  red: 'text-[#e74856]',
}

const banner = (platform) => [
  [platform === 'android' ? 'Terminal — Android shell' : 'Windows PowerShell', ''],
  ['Copyright (C) Chamath Jayasinghe. All rights reserved.', ''],
  ['', ''],
  ["Type 'help' to see what this terminal can do.", C.dim],
  ['', ''],
]

// A function, not a constant: `apps` is still undefined while this module first evaluates (registry ↔ app cycle).
const help = () => [
  ['about', 'Who I am'],
  ['skills', 'Tech arsenal'],
  ['projects', 'Things I have built'],
  ['research', 'Publications'],
  ['awards', 'Awards & certifications'],
  ['education', 'Education'],
  ['contact', 'How to reach me'],
  ['open <app|url>', `Launch an app (${Object.keys(apps).join(', ')})`],
  ['ls / cd / cat', 'Browse the file system'],
  ['theme <dark|light>', 'Switch the Windows theme'],
  ['neofetch', 'System information'],
  ['clear', 'Clear the screen'],
  ['exit', 'Close the terminal'],
]

const line = (text, cls = '') => ({ text, cls })

export default function Terminal({ win }) {
  const wm = useWindows()
  const { update } = useSettings()
  const platform = usePlatform()
  const [lines, setLines] = useState(() => banner(platform).map(([t, c]) => line(t, c)))
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState(HOME_PATH)
  const [history, setHistory] = useState([])
  const [hIndex, setHIndex] = useState(-1)
  const inputRef = useRef(null)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  const prompt = platform === 'android' ? `~/${cwd.slice(3).join('/').toLowerCase() || 'storage'} $` : `PS ${displayPath(cwd)}>`

  const resolvePath = (arg) => {
    if (!arg || arg === '~') return HOME_PATH
    const parts = arg.replace(/\//g, '\\').split('\\').filter(Boolean)
    let p = /^c:$/i.test(parts[0] ?? '') ? ['This PC', 'Local Disk (C:)'] : [...cwd]
    for (const part of /^c:$/i.test(parts[0] ?? '') ? parts.slice(1) : parts) {
      if (part === '..') p = p.length > 1 ? p.slice(0, -1) : p
      else if (part !== '.') p = [...p, part]
    }
    const node = resolve(p)
    // Normalise casing from the actual node names.
    return node ? p.map((seg, i) => (i === 0 ? seg : resolve(p.slice(0, i))?.children?.find((c) => c.name.toLowerCase() === seg.toLowerCase())?.name ?? seg)) : null
  }

  const run = (raw) => {
    const [cmd = '', ...args] = raw.trim().split(/\s+/)
    const arg = raw.trim().slice(cmd.length).trim()
    const out = []
    const print = (t, c) => out.push(line(t, c))

    switch (cmd.toLowerCase()) {
      case '':
        break
      case 'help':
        help().forEach(([c, d]) => print(`  ${c.padEnd(20)} ${d}`))
        break
      case 'about':
      case 'whoami':
        print(profile.fullName, C.accent)
        print(profile.role, C.dim)
        print('')
        profile.bio.forEach((p) => print(p))
        break
      case 'skills':
        skills.forEach((g) => {
          print(g.group, C.yellow)
          print(`  ${g.items.join(' · ')}`)
        })
        break
      case 'projects':
        projects.forEach((p) => {
          print(`${p.title}  (${p.year})`, C.accent)
          print(`  ${p.summary}`)
          if (p.link) print(`  ${p.link}`, C.dim)
        })
        break
      case 'research':
        publications.forEach((p) => {
          print(p.title, C.accent)
          print(`  ${p.venue}`, C.dim)
        })
        break
      case 'awards':
        achievements.forEach((a) => print(`• ${a}`))
        break
      case 'education':
        education.forEach((e) => {
          print(e.title, C.accent)
          print(`  ${e.detail}`, C.dim)
        })
        break
      case 'contact':
        print(`Email     ${contact.email}`)
        print(`GitHub    ${contact.github}`)
        print(`LinkedIn  ${contact.linkedin}`)
        print(`Telegram  ${contact.telegram}`)
        break
      case 'open':
      case 'start': {
        const target = args[0]?.toLowerCase()
        if (!target) print('Usage: open <app|url>', C.red)
        else if (apps[target]) {
          launch(wm, target)
          print(`Opening ${apps[target].title}...`, C.green)
        } else if (/^(https?:\/\/|[\w-]+\.[\w.]+)/.test(target)) {
          window.open(target.startsWith('http') ? target : `https://${target}`, '_blank', 'noopener')
          print(`Opening ${target} in a new tab...`, C.green)
        } else print(`open: '${args[0]}' is not a known app.`, C.red)
        break
      }
      case 'ls':
      case 'dir': {
        const p = resolvePath(arg || '.')
        const node = p && resolve(p)
        if (!node?.children) print(`Get-ChildItem: Cannot find path '${arg}'.`, C.red)
        else {
          print('')
          print(`    Directory: ${displayPath(p)}`, C.dim)
          print('')
          node.children.forEach((c) => print(`${c.type === 'folder' ? 'd----' : '-a---'}   ${c.name}`, c.type === 'folder' ? C.accent : ''))
        }
        break
      }
      case 'cd': {
        const p = resolvePath(arg)
        const node = p && resolve(p)
        if (node?.type === 'folder' || p?.length === 1) setCwd(p)
        else print(`Set-Location: Cannot find path '${arg}' because it does not exist.`, C.red)
        break
      }
      case 'cat':
      case 'type': {
        const p = resolvePath(arg)
        const node = p && resolve(p)
        if (node?.type === 'file') node.content.split('\n').forEach((l) => print(l))
        else if (node?.type === 'link') print(node.url)
        else print(`Get-Content: Cannot find path '${arg}'.`, C.red)
        break
      }
      case 'pwd':
        print(displayPath(cwd))
        break
      case 'echo':
        print(arg)
        break
      case 'date':
        print(new Date().toString())
        break
      case 'theme':
        if (['dark', 'light'].includes(args[0])) {
          update({ theme: args[0] })
          print(`Theme set to ${args[0]}.`, C.green)
        } else print('Usage: theme <dark|light>', C.red)
        break
      case 'neofetch':
      case 'systeminfo':
        ;[
          ['User', platform === 'android' ? 'chamath@phone' : 'chamath@CHAMATH-PC'],
          ['OS', platform === 'android' ? 'Android 15 (Portfolio build)' : 'Windows 11 Portfolio Edition'],
          ['Shell', platform === 'android' ? 'sh (React edition)' : 'PowerShell (React edition)'],
          ['Uni', 'University of Moratuwa — CSE'],
          ['Focus', profile.focus.join(', ')],
          ['Stack', 'React · Vite · Three.js · Tailwind CSS'],
        ].forEach(([k, v]) => print(`${k.padEnd(7)} ${v}`, k === 'User' ? C.accent : ''))
        break
      case 'sudo':
        print("sudo: this is Windows. Try 'Run as administrator' — just kidding, access granted to curiosity only.", C.yellow)
        break
      case 'clear':
      case 'cls':
        setLines([])
        return
      case 'exit':
        wm.close(win.id)
        return
      default:
        print(`${cmd}: The term '${cmd}' is not recognized. Type 'help' for available commands.`, C.red)
    }
    setLines((l) => [...l, line(`${prompt} ${raw}`), ...out, ...(out.length ? [line('')] : [])])
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(input)
      if (input.trim()) setHistory((h) => [input, ...h])
      setHIndex(-1)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const i = Math.min(hIndex + 1, history.length - 1)
      if (history[i] !== undefined) {
        setHIndex(i)
        setInput(history[i])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const i = hIndex - 1
      setHIndex(Math.max(-1, i))
      setInput(i < 0 ? '' : history[i])
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0c0c0c] text-[#cccccc]">
      {platform !== 'android' && (
      <div className="flex items-end gap-1 bg-[#1f1f1f] px-2 pt-1.5">
        <div className="flex h-8 w-56 items-center gap-2 rounded-t-md bg-[#0c0c0c] px-3 text-xs">
          <TerminalIcon size={14} />
          <span className="flex-1 truncate">Windows PowerShell</span>
          <button aria-label="Close tab" onClick={() => wm.close(win.id)} className="rounded p-0.5 hover:bg-white/10">
            <G.Close size={11} />
          </button>
        </div>
      </div>
      )}
      <div className="os-scroll min-h-0 flex-1 overflow-y-auto px-3 py-2 font-mono text-[13px] leading-5" onClick={() => inputRef.current?.focus()}>
        {lines.map((l, i) => (
          <div key={i} className={`whitespace-pre-wrap break-words ${l.cls}`}>
            {l.text || ' '}
          </div>
        ))}
        <div className="flex">
          <span className="shrink-0 whitespace-pre">{prompt} </span>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label="Terminal input"
            className="min-w-0 flex-1 bg-transparent text-[#cccccc] caret-[#cccccc] outline-none"
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  )
}

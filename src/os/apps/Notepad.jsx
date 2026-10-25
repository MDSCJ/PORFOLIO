import { useEffect, useRef, useState } from 'react'
import { useWindows } from '../store'

function Menu({ label, items, open, setOpen }) {
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(open ? null : label)}
        onPointerEnter={() => open === null || setOpen(label)}
        className={`rounded px-3 py-1 text-sm hover:bg-hover ${open === label ? 'bg-hover' : ''}`}
      >
        {label}
      </button>
      {open === label && (
        <div className="absolute left-0 top-full z-20 mt-1 min-w-52 rounded-lg border border-line bg-flyout p-1 text-sm acrylic os-shadow">
          {items.map((it, i) =>
            it.divider ? (
              <div key={i} className="my-1 h-px bg-line" />
            ) : (
              <button
                key={it.label}
                onClick={() => {
                  setOpen(null)
                  it.onClick()
                }}
                className="flex w-full items-center justify-between gap-6 rounded px-3 py-1.5 text-left hover:bg-hover"
              >
                <span>
                  {it.checked !== undefined && <span className="mr-2 inline-block w-3">{it.checked ? '✓' : ''}</span>}
                  {it.label}
                </span>
                {it.shortcut && <span className="text-xs text-fg-2">{it.shortcut}</span>}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}

export default function Notepad({ win }) {
  const wm = useWindows()
  const fileName = win.props.fileName ?? 'Untitled.txt'
  const [text, setText] = useState(win.props.content ?? '')
  const [dirty, setDirty] = useState(false)
  const [wrap, setWrap] = useState(true)
  const [statusBar, setStatusBar] = useState(true)
  const [zoom, setZoom] = useState(100)
  const [cursor, setCursor] = useState({ ln: 1, col: 1 })
  const [menu, setMenu] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    wm.setProps(win.id, { title: `${dirty ? '*' : ''}${fileName} - Notepad` })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, fileName])

  const updateCursor = () => {
    const el = ref.current
    const before = el.value.slice(0, el.selectionStart).split('\n')
    setCursor({ ln: before.length, col: before[before.length - 1].length + 1 })
  }

  const save = () => {
    const url = URL.createObjectURL(new Blob([text.replace(/\n/g, '\r\n')], { type: 'text/plain' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: fileName })
    a.click()
    URL.revokeObjectURL(url)
    setDirty(false)
  }

  const insert = (s) => {
    const el = ref.current
    const { selectionStart: a, selectionEnd: b } = el
    setText((t) => t.slice(0, a) + s + t.slice(b))
    setDirty(true)
    requestAnimationFrame(() => {
      el.focus()
      el.selectionStart = el.selectionEnd = a + s.length
    })
  }

  const menus = {
    File: [
      { label: 'New window', shortcut: 'Ctrl+Shift+N', onClick: () => wm.open('notepad', { fileName: 'Untitled.txt', content: '' }) },
      { label: 'Save', shortcut: 'Ctrl+S', onClick: save },
      { divider: true },
      { label: 'Close window', onClick: () => wm.close(win.id) },
    ],
    Edit: [
      { label: 'Select all', shortcut: 'Ctrl+A', onClick: () => ref.current.select() },
      { label: 'Time/Date', shortcut: 'F5', onClick: () => insert(new Date().toLocaleString()) },
    ],
    View: [
      { label: 'Zoom in', shortcut: 'Ctrl+Plus', onClick: () => setZoom((z) => Math.min(500, z + 10)) },
      { label: 'Zoom out', shortcut: 'Ctrl+Minus', onClick: () => setZoom((z) => Math.max(10, z - 10)) },
      { label: 'Restore default zoom', shortcut: 'Ctrl+0', onClick: () => setZoom(100) },
      { divider: true },
      { label: 'Status bar', checked: statusBar, onClick: () => setStatusBar((s) => !s) },
      { label: 'Word wrap', checked: wrap, onClick: () => setWrap((w) => !w) },
    ],
  }

  const onKeyDown = (e) => {
    const mod = e.ctrlKey || e.metaKey
    if (mod && e.key.toLowerCase() === 's') {
      e.preventDefault()
      save()
    } else if (mod && (e.key === '=' || e.key === '+')) {
      e.preventDefault()
      setZoom((z) => Math.min(500, z + 10))
    } else if (mod && e.key === '-') {
      e.preventDefault()
      setZoom((z) => Math.max(10, z - 10))
    } else if (mod && e.key === '0') {
      e.preventDefault()
      setZoom(100)
    } else if (e.key === 'F5') {
      e.preventDefault()
      insert(new Date().toLocaleString())
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-solid" onPointerDown={(e) => !e.target.closest('.relative') && setMenu(null)}>
      <div className="flex items-center gap-0.5 border-b border-line px-1.5 py-1">
        {Object.entries(menus).map(([label, items]) => (
          <Menu key={label} label={label} items={items} open={menu} setOpen={setMenu} />
        ))}
      </div>
      <textarea
        ref={ref}
        value={text}
        spellCheck={false}
        onChange={(e) => {
          setText(e.target.value)
          setDirty(true)
          updateCursor()
        }}
        onKeyDown={onKeyDown}
        onKeyUp={updateCursor}
        onClick={updateCursor}
        wrap={wrap ? 'soft' : 'off'}
        style={{ fontSize: `${(15 * zoom) / 100}px` }}
        className={`os-scroll min-h-0 flex-1 resize-none bg-transparent px-4 py-3 font-mono leading-relaxed text-fg outline-none ${
          wrap ? '' : 'whitespace-pre'
        }`}
      />
      {statusBar && (
        <div className="flex items-center border-t border-line text-xs text-fg-2 [&>span]:border-l [&>span]:border-line [&>span]:px-4 [&>span]:py-1">
          <span className="!border-l-0">
            Ln {cursor.ln}, Col {cursor.col}
          </span>
          <span>{text.length} characters</span>
          <span className="ml-auto">{zoom}%</span>
          <span className="hidden sm:inline">Windows (CRLF)</span>
          <span>UTF-8</span>
        </div>
      )}
    </div>
  )
}

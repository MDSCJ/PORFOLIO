import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Windows 11 style context menu. `items`: { label, icon, onClick, shortcut, disabled } or { divider: true }.
export default function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ left: x, top: y })

  useLayoutEffect(() => {
    const { width, height } = ref.current.getBoundingClientRect()
    setPos({
      left: Math.min(x, window.innerWidth - width - 8),
      top: Math.min(y, window.innerHeight - height - 56),
    })
  }, [x, y])

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && onClose()
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('pointerdown', close, true)
    window.addEventListener('keydown', esc)
    window.addEventListener('blur', onClose)
    return () => {
      window.removeEventListener('pointerdown', close, true)
      window.removeEventListener('keydown', esc)
      window.removeEventListener('blur', onClose)
    }
  }, [onClose])

  return (
    <motion.div
      ref={ref}
      role="menu"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      style={pos}
      className="fixed z-[9000] min-w-56 rounded-lg border border-line bg-flyout p-1 text-sm acrylic os-shadow"
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} className="mx-1 my-1 h-px bg-line" />
        ) : (
          <button
            key={item.label}
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
              onClose()
              item.onClick?.()
            }}
            className="flex w-full items-center gap-3 rounded px-3 py-1.5 text-left hover:bg-hover disabled:opacity-40"
          >
            <span className="flex w-4 justify-center text-fg-2">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.shortcut && <span className="text-xs text-fg-2">{item.shortcut}</span>}
          </button>
        ),
      )}
    </motion.div>
  )
}

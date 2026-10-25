import { useEffect, useRef } from 'react'

// Faint grid revealed only in a soft circle around the cursor. It sits beneath the sections,
// so glass cards blur it out and content stays readable.
export default function CursorGrid() {
  const ref = useRef()

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const el = ref.current
    let x = -1000
    let y = -1000
    let raf

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
    }
    const onLeave = () => {
      x = y = -1000
    }
    // The layer scrolls with the content, so re-project the cursor every frame.
    const tick = () => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${x - r.left}px`)
      el.style.setProperty('--my', `${y - r.top}px`)
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} aria-hidden className="cursor-grid pointer-events-none absolute inset-0" />
}

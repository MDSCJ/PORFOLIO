import { sections } from '../data/portfolio'

// Continuous scroll position measured in sections: 0 = Home centred, 1 = About centred, …
// Written on scroll/resize and read every frame by the 3D rig, so no React re-renders are involved.
export const sectionProgress = { t: 0 }

function measure() {
  const mid = window.scrollY + window.innerHeight / 2
  const centers = sections.map(({ id }) => {
    const el = document.getElementById(id)
    return el ? el.offsetTop + el.offsetHeight / 2 : 0
  })
  const last = centers.length - 1
  // Hero's centre can never reach mid-screen from above, and the last section may never be centred at the bottom.
  if (mid <= centers[0]) return 0
  const docBottom = document.documentElement.scrollHeight - window.innerHeight
  if (mid >= centers[last] || window.scrollY >= docBottom - 1) return last
  const i = centers.findIndex((c, k) => mid >= c && mid < centers[k + 1])
  return i + (mid - centers[i]) / (centers[i + 1] - centers[i])
}

export function trackSectionProgress() {
  const update = () => {
    sectionProgress.t = measure()
  }
  const resizeObserver = new ResizeObserver(update)
  resizeObserver.observe(document.body)
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  update()
  return () => {
    resizeObserver.disconnect()
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  }
}

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import { sectionProgress, trackSectionProgress } from '../../lib/sectionProgress'

// One keyframe per section (same order as data/portfolio.js `sections`).
const DESKTOP_KEYFRAMES = [
  { position: [1.8, -0.4, 0], rotationY: -0.35, scale: 1.0 }, // Hero: right of the headline
  { position: [2.4, -0.3, -0.5], rotationY: -0.9, scale: 0.9 }, // About: slides further right
  { position: [-3.0, -0.6, -1.2], rotationY: 0.5, scale: 0.8 }, // Skills: swings left of the pill rows
  { position: [0, 1.6, -3.5], rotationY: Math.PI * 1.1, scale: 0.6 }, // Work: recedes behind the grid
  { position: [-2.4, -0.2, -0.5], rotationY: Math.PI * 2 - 0.9, scale: 0.9 }, // Research: crosses to the left
  { position: [-2.2, -0.7, 1.0], rotationY: Math.PI * 2 + 0.6, scale: 1.15 }, // Contact: zooms in, left of the form
]

// Narrow screens have no side gutter, so the model stays centred and far back as a backdrop
// (fogged and blurred behind the glass) instead of competing with the text.
const MOBILE_KEYFRAMES = [
  { position: [0, 1.25, -1], rotationY: -0.2, scale: 0.75 }, // Hero: above the headline
  { position: [0.9, 0.2, -4], rotationY: -0.9, scale: 0.7 },
  { position: [-0.9, -0.2, -4], rotationY: 0.5, scale: 0.7 },
  { position: [0, 0.8, -5], rotationY: Math.PI * 1.1, scale: 0.6 },
  { position: [0.9, 0, -4], rotationY: Math.PI * 2 - 0.9, scale: 0.7 },
  { position: [0, 1.6, -2.5], rotationY: Math.PI * 2 + 0.3, scale: 0.8 },
]

const MOBILE_BREAKPOINT = 768
// On phones the scene dims to this opacity once past the hero, so text over it stays easy to read.
const MOBILE_BACKDROP_OPACITY = 0.35
const DAMPING = 4
const MOUSE_YAW = 0.45
const MOUSE_PITCH = 0.2

// Drives the model's transform from the page scroll position, with mouse parallax layered on top.
export default function ScrollRig({ children }) {
  const scrollGroup = useRef()
  const mouseGroup = useRef()

  useEffect(trackSectionProgress, [])

  useFrame((state, delta) => {
    const mobile = state.size.width < MOBILE_BREAKPOINT
    const keyframes = mobile ? MOBILE_KEYFRAMES : DESKTOP_KEYFRAMES
    const t = MathUtils.clamp(sectionProgress.t, 0, keyframes.length - 1)
    const i = Math.min(Math.floor(t), keyframes.length - 2)
    const f = MathUtils.smootherstep(t - i, 0, 1)
    const a = keyframes[i]
    const b = keyframes[i + 1]

    const g = scrollGroup.current
    for (let k = 0; k < 3; k++) {
      const target = MathUtils.lerp(a.position[k], b.position[k], f)
      g.position.setComponent(k, MathUtils.damp(g.position.getComponent(k), target, DAMPING, delta))
    }
    g.rotation.y = MathUtils.damp(g.rotation.y, MathUtils.lerp(a.rotationY, b.rotationY, f), DAMPING, delta)
    g.scale.setScalar(MathUtils.damp(g.scale.x, MathUtils.lerp(a.scale, b.scale, f), DAMPING, delta))

    const canvas = state.gl.domElement
    const targetOpacity = mobile ? MathUtils.lerp(1, MOBILE_BACKDROP_OPACITY, MathUtils.clamp(t * 1.5, 0, 1)) : 1
    canvas.style.opacity = MathUtils.damp(Number(canvas.style.opacity || 1), targetOpacity, DAMPING, delta).toFixed(3)

    // Touch devices have no hover cursor; a tap would leave the model stuck looking at it.
    const px = mobile ? 0 : state.pointer.x
    const py = mobile ? 0 : state.pointer.y
    const m = mouseGroup.current
    m.rotation.y = MathUtils.damp(m.rotation.y, px * MOUSE_YAW, DAMPING, delta)
    m.rotation.x = MathUtils.damp(m.rotation.x, -py * MOUSE_PITCH, DAMPING, delta)
  })

  return (
    <group ref={scrollGroup}>
      <group ref={mouseGroup}>{children}</group>
    </group>
  )
}

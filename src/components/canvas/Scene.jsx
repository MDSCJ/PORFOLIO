import { Canvas } from '@react-three/fiber'
import { Float, Sparkles, Stars } from '@react-three/drei'
import Model from './Model'
import ScrollRig from './ScrollRig'

// Phones get fewer particles and a lower pixel ratio to keep scrolling smooth.
const isSmallScreen = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches

function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <pointLight position={[-4, 1, 2]} color="#a855f7" intensity={30} />
      <pointLight position={[4, -1, 3]} color="#22d3ee" intensity={30} />
    </>
  )
}

// Global fixed canvas behind the page. The page scrolls natively; ScrollRig follows it.
export default function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={isSmallScreen ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !isSmallScreen, powerPreference: 'high-performance' }}
        // Listen on the whole page so the model tracks the cursor even over the HTML content.
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        <color attach="background" args={['#05060a']} />
        <fog attach="fog" args={['#05060a', 6, 16]} />
        <Lights />
        <Stars radius={60} depth={40} count={isSmallScreen ? 1000 : 2500} factor={3} fade speed={0.6} />
        <Sparkles count={isSmallScreen ? 25 : 60} scale={[10, 6, 4]} size={2} speed={0.3} color="#22d3ee" />
        <ScrollRig>
          <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
            <Model />
          </Float>
        </ScrollRig>
      </Canvas>
    </div>
  )
}

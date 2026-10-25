import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Stylised holographic bust shown until a real model.glb is provided.
export default function PlaceholderAvatar() {
  const ring = useRef()

  useFrame((_, delta) => {
    ring.current.rotation.z += delta * 0.6
  })

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.45, 48, 48]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 1.1, 0.33]}>
        <boxGeometry args={[0.62, 0.14, 0.2]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.55, 0.7, 8, 32]} />
        <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Wireframe shell */}
      <mesh position={[0, 0, 0]} scale={1.04}>
        <capsuleGeometry args={[0.55, 0.7, 8, 16]} />
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.25} />
      </mesh>
      {/* Halo ring */}
      <mesh ref={ring} position={[0, 0.3, 0]} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.1, 0.012, 16, 128]} />
        <meshBasicMaterial color="#3b82f6" toneMapped={false} />
      </mesh>
    </group>
  )
}

import { Component, Suspense } from 'react'
import { useGLTF } from '@react-three/drei'
import PlaceholderAvatar from './PlaceholderAvatar'

// Drop your model at public/model.glb. Until then (or if it fails to load) the placeholder renders.
// The portfolio page lives at /portfolio/, while public/ files are served from the site root.
export const MODEL_URL = '../model.glb'

function GLTFModel({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

class ModelErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export default function Model({ url = MODEL_URL }) {
  const fallback = <PlaceholderAvatar />
  return (
    <ModelErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GLTFModel url={url} />
      </Suspense>
    </ModelErrorBoundary>
  )
}

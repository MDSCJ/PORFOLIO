import { useState } from 'react'
import { PortfolioIcon } from '../icons'

export const PORTFOLIO_URL = 'portfolio/'

// Runs the full 3D portfolio site (portfolio/index.html) unchanged inside the window.
export default function Portfolio() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="absolute inset-0 bg-[#05060a]">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          <PortfolioIcon size={72} />
          <span className="h-6 w-6 rounded-full border-2 border-white/15 border-t-[#22d3ee]" style={{ animation: 'os-spin 0.8s linear infinite' }} />
        </div>
      )}
      <iframe
        src={PORTFOLIO_URL}
        title="Chamath Jayasinghe — 3D Portfolio"
        onLoad={() => setLoaded(true)}
        allow="fullscreen"
        className={`h-full w-full border-0 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}

import { G } from '../icons'

// Honest banner on built-in previews: the real site refuses to be framed, so offer the real thing in a new tab.
export function PreviewBar({ site, url, note, light }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:px-6 ${light ? 'bg-[#dbeafe] text-[#004182]' : 'bg-[#1f6feb]/15 text-[#9ecbff]'}`}>
      <span>
        {note} — {site} doesn't allow itself to be shown inside other sites.
      </span>
      <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-semibold hover:underline">
        Open on {site} <G.External size={12} />
      </a>
    </div>
  )
}

import { useState } from 'react'
import { G, RecycleBinIcon, TextFileIcon } from '../icons'
import { Button } from './ui'

const ITEMS = [
  { name: 'portfolio-v1 (HTML & CSS)', from: 'C:\\Users\\Chamath\\Projects', note: 'Replaced by this Windows 11 portfolio' },
  { name: 'bugs-from-last-hackathon.txt', from: 'C:\\Users\\Chamath\\Desktop', note: 'All fixed. Probably.' },
  { name: 'sleep-schedule.txt', from: 'C:\\Users\\Chamath\\Documents', note: 'Deleted during exam season' },
]

export default function RecycleBin() {
  const [items, setItems] = useState(ITEMS)

  return (
    <div className="absolute inset-0 flex flex-col bg-solid/70 text-sm">
      <div className="flex items-center gap-2 border-b border-line px-3 py-1.5">
        <Button disabled={!items.length} onClick={() => setItems([])} className="flex items-center gap-2 !border-transparent !bg-transparent hover:!bg-hover">
          <G.Trash size={14} /> Empty Recycle Bin
        </Button>
        <Button disabled={items.length === ITEMS.length} onClick={() => setItems(ITEMS)} className="flex items-center gap-2 !border-transparent !bg-transparent hover:!bg-hover">
          <G.Restart size={14} /> Restore all items
        </Button>
      </div>
      {items.length ? (
        <div className="os-scroll flex-1 overflow-auto">
          <table className="w-full table-fixed text-left">
            <thead className="text-xs text-fg-2">
              <tr>
                <th className="w-2/5 px-4 py-2 font-normal">Name</th>
                <th className="px-4 py-2 font-normal">Original location</th>
                <th className="hidden px-4 py-2 font-normal sm:table-cell">Note</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.name} className="hover:bg-hover">
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-2.5">
                      <TextFileIcon size={18} />
                      <span className="truncate">{it.name}</span>
                    </span>
                  </td>
                  <td className="truncate px-4 py-2 text-fg-2">{it.from}</td>
                  <td className="hidden truncate px-4 py-2 text-fg-2 sm:table-cell">{it.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-fg-2">
          <RecycleBinIcon size={64} />
          <p>Recycle Bin is empty</p>
        </div>
      )}
      <p className="border-t border-line px-4 py-1 text-xs text-fg-2">{items.length} items</p>
    </div>
  )
}

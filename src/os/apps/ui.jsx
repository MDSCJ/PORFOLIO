// Small Fluent-style controls shared by the apps.

export function Switch({ on, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-5 w-10 shrink-0 rounded-full border transition ${
        on ? 'border-transparent bg-accent' : 'border-fg-2 bg-transparent hover:bg-hover'
      }`}
    >
      <span
        className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full transition-all ${
          on ? 'left-[22px] bg-accent-fg' : 'left-[3px] bg-fg-2'
        }`}
      />
    </button>
  )
}

export function Button({ primary, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`rounded-md border px-4 py-1.5 text-sm transition disabled:opacity-40 ${
        primary
          ? 'border-transparent bg-accent text-accent-fg hover:brightness-110 active:brightness-95'
          : 'border-line bg-surface hover:bg-hover active:bg-active'
      } ${className}`}
    />
  )
}

export function IconButton({ label, className = '', ...props }) {
  return (
    <button
      aria-label={label}
      title={label}
      {...props}
      className={`flex h-8 w-8 items-center justify-center rounded-md text-fg transition hover:bg-hover active:bg-active disabled:opacity-35 disabled:hover:bg-transparent ${className}`}
    />
  )
}

// Settings-style row card.
export function Card({ icon, title, sub, children, className = '' }) {
  return (
    <div className={`flex items-center gap-4 rounded-md border border-line bg-surface px-4 py-3.5 ${className}`}>
      {icon && <span className="text-fg-2">{icon}</span>}
      <div className="min-w-0 flex-1">
        <p className="text-sm">{title}</p>
        {sub && <p className="text-xs text-fg-2">{sub}</p>}
      </div>
      {children}
    </div>
  )
}

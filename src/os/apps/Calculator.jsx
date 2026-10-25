import { useEffect, useState } from 'react'

const SYMBOL = { '+': '+', '-': '−', '*': '×', '/': '÷' }
const INITIAL = { display: '0', acc: null, op: null, fresh: true, expr: '', error: false }

const compute = (a, op, b) => (op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b)
const tidy = (n) => String(parseFloat(n.toPrecision(15)))

// Adds thousands separators to the integer part while keeping whatever the user typed after the point.
function pretty(s) {
  if (!/^-?\d/.test(s)) return s
  const [int, frac] = s.split('.')
  const sign = int.startsWith('-') ? '-' : ''
  const grouped = int.replace('-', '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return sign + grouped + (frac !== undefined ? `.${frac}` : '')
}

// Standard-mode semantics of the Windows calculator (immediate execution, left to right).
function reducer(s, key) {
  if (s.error && key !== 'C' && key !== 'CE') s = INITIAL
  const value = parseFloat(s.display)
  const fail = (msg) => ({ ...INITIAL, display: msg, error: true })
  const result = (n, expr) => (Number.isFinite(n) ? { ...s, display: tidy(n), fresh: true, expr } : fail('Cannot divide by zero'))

  if (/^\d$/.test(key)) {
    if (s.fresh) return { ...s, display: key, fresh: false, expr: s.op ? s.expr : '' }
    if (s.display.replace(/[-.]/g, '').length >= 16) return s
    return { ...s, display: s.display === '0' ? key : s.display + key }
  }
  switch (key) {
    case '.':
      if (s.fresh) return { ...s, display: '0.', fresh: false, expr: s.op ? s.expr : '' }
      return s.display.includes('.') ? s : { ...s, display: s.display + '.' }
    case '+':
    case '-':
    case '*':
    case '/': {
      if (s.op && !s.fresh) {
        const n = compute(s.acc, s.op, value)
        if (!Number.isFinite(n)) return fail('Cannot divide by zero')
        return { ...s, display: tidy(n), acc: n, op: key, fresh: true, expr: `${tidy(n)} ${SYMBOL[key]}` }
      }
      return { ...s, acc: value, op: key, fresh: true, expr: `${tidy(value)} ${SYMBOL[key]}` }
    }
    case '=': {
      if (!s.op) return { ...s, fresh: true, expr: `${tidy(value)} =` }
      const n = compute(s.acc, s.op, value)
      const expr = `${tidy(s.acc)} ${SYMBOL[s.op]} ${tidy(value)} =`
      return Number.isFinite(n) ? { ...INITIAL, display: tidy(n), expr } : fail('Cannot divide by zero')
    }
    case '%':
      return result(s.op === '+' || s.op === '-' ? ((s.acc ?? 0) * value) / 100 : value / 100, s.expr)
    case 'sqr':
      return result(value * value, `${s.op ? s.expr + ' ' : ''}sqr(${tidy(value)})`)
    case 'sqrt':
      return value < 0 ? fail('Invalid input') : result(Math.sqrt(value), `${s.op ? s.expr + ' ' : ''}√(${tidy(value)})`)
    case 'inv':
      return value === 0 ? fail('Cannot divide by zero') : result(1 / value, `${s.op ? s.expr + ' ' : ''}1/(${tidy(value)})`)
    case 'neg':
      return { ...s, display: s.display.startsWith('-') ? s.display.slice(1) : s.display === '0' ? '0' : `-${s.display}` }
    case 'back':
      if (s.fresh) return { ...s, expr: s.op ? s.expr : '' }
      return { ...s, display: s.display.length > 1 && s.display !== '-0' ? s.display.slice(0, -1).replace(/^-$/, '0') : '0' }
    case 'CE':
      return { ...s, display: '0', error: false }
    case 'C':
      return INITIAL
    default:
      return s
  }
}

const KEYS = [
  ['%', '%'], ['CE', 'CE'], ['C', 'C'], ['⌫', 'back'],
  ['¹⁄ₓ', 'inv'], ['x²', 'sqr'], ['²√x', 'sqrt'], ['÷', '/'],
  ['7', '7'], ['8', '8'], ['9', '9'], ['×', '*'],
  ['4', '4'], ['5', '5'], ['6', '6'], ['−', '-'],
  ['1', '1'], ['2', '2'], ['3', '3'], ['+', '+'],
  ['+/−', 'neg'], ['0', '0'], ['.', '.'], ['=', '='],
]

const KEYBOARD = { Enter: '=', '=': '=', Backspace: 'back', Escape: 'C', Delete: 'CE', '%': '%', '.': '.', ',': '.', '+': '+', '-': '-', '*': '*', '/': '/', x: '*' }

export default function Calculator({ focused }) {
  const [s, setS] = useState(INITIAL)
  const press = (key) => setS((st) => reducer(st, key))

  useEffect(() => {
    if (!focused) return
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const key = /^\d$/.test(e.key) ? e.key : KEYBOARD[e.key]
      if (key) {
        e.preventDefault()
        press(key)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focused])

  const shown = s.error ? s.display : pretty(s.display)

  return (
    <div className="absolute inset-0 flex flex-col bg-solid/70 p-1.5">
      <p className="px-3 pt-2 text-xl font-semibold">Standard</p>
      <div className="flex flex-1 flex-col justify-end px-3 pb-2 text-right">
        <p className="h-5 truncate text-sm text-fg-2">{s.expr}</p>
        <p
          className="truncate font-display font-semibold leading-tight"
          style={{ fontSize: shown.length > 14 ? '1.9rem' : shown.length > 10 ? '2.4rem' : '3rem' }}
        >
          {shown}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-0.5">
        {KEYS.map(([label, key]) => {
          const digit = /^\d$/.test(key) || key === '.' || key === 'neg'
          const equals = key === '='
          return (
            <button
              key={key}
              onClick={() => press(key)}
              className={`h-12 rounded-md text-base transition active:scale-[0.97] ${
                equals
                  ? 'bg-accent text-accent-fg hover:brightness-110'
                  : digit
                    ? 'bg-surface font-semibold hover:bg-hover dark:bg-white/[0.09] dark:hover:bg-white/[0.06]'
                    : 'bg-surface/60 hover:bg-hover dark:bg-white/[0.045] dark:hover:bg-white/[0.08]'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

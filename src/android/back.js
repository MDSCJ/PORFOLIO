import { createContext, useContext, useEffect } from 'react'

// Lets the foreground app claim the system Back button (e.g. to leave a sub-page) before the shell closes it.
export const BackContext = createContext(null)

export function useAndroidBack(handler, active = true) {
  const registry = useContext(BackContext)
  useEffect(() => {
    if (!registry || !active) return
    registry.current = handler
    return () => {
      if (registry.current === handler) registry.current = null
    }
  }, [registry, handler, active])
}

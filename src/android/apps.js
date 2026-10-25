// Android launcher entries. Each points at a shared app in src/os/apps/registry, with an Android-style name.
export const ANDROID_APPS = [
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'browser', label: 'Browser' },
  { id: 'mail', label: 'Mail' },
  { id: 'settings', label: 'Settings' },
  { id: 'github', label: 'GitHub' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'explorer', label: 'Files' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'notepad', label: 'Notes' },
  { id: 'calculator', label: 'Calculator' },
]

export const DOCK = ['portfolio', 'browser', 'mail', 'settings']
export const HOME_GRID = ['github', 'linkedin', 'explorer', 'terminal', 'notepad', 'calculator']

export const androidLabel = (appId) => ANDROID_APPS.find((a) => a.id === appId)?.label

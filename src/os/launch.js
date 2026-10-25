import { apps } from './apps/registry'

// Opens anything the shell can show: an app id, or a file-system node (file, link, shortcut, folder).
export function launch(wm, target, folderPath) {
  if (typeof target === 'string') {
    const app = apps[target]
    // `nav` changes on every launch so an already-open browser still navigates.
    if (app?.opens) wm.open(app.opens[0], { ...app.opens[1], nav: Date.now() })
    else if (app) wm.open(target)
    return
  }
  switch (target.type) {
    case 'app':
      return target.props ? wm.open(target.appId, target.props) : launch(wm, target.appId)
    case 'link':
      window.open(target.url, '_blank', 'noopener')
      return
    case 'file':
      wm.open('notepad', { title: `${target.name} - Notepad`, fileName: target.name, content: target.content })
      return
    case 'folder':
      wm.open('explorer', { path: [...(folderPath ?? []), target.name] })
      return
  }
}

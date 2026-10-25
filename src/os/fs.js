// Virtual file system generated from the portfolio data, shared by File Explorer, Notepad, Terminal and Start search.
import { achievements, contact, education, profile, projects, publications, skills } from '../data/portfolio'

const file = (name, content) => ({ type: 'file', name, content })
const link = (name, url) => ({ type: 'link', name, url })
const shortcut = (name, appId, icon, props) => ({ type: 'app', name, appId, icon, props })
const folder = (name, children) => ({ type: 'folder', name, children })

const aboutText = [
  profile.fullName,
  profile.role,
  '',
  ...profile.bio.flatMap((p) => [p, '']),
  `Focus: ${profile.focus.join(', ')}`,
  '',
  `Email:    ${contact.email}`,
  `GitHub:   ${contact.github}`,
  `LinkedIn: ${contact.linkedin}`,
  `Telegram: ${contact.telegram}`,
].join('\n')

const skillsText = skills.map((g) => `${g.group}\n${g.items.map((i) => `  • ${i}`).join('\n')}`).join('\n\n')

const educationText = education.map((e) => `${e.title}\n  ${e.detail}`).join('\n\n')

const awardsText = achievements.map((a) => `• ${a}`).join('\n')

const projectText = (p) =>
  [p.title, `${p.year} · ${p.tags.join(', ')}`, '', p.summary, '', p.link ? `Link: ${p.link}` : ''].join('\n').trim()

const publicationText = (p) => [p.title, '', p.venue, '', `Programme: ${p.link}`].join('\n')

const safe = (s) => s.replace(/[\\/:*?"<>|]/g, '-')

export const desktopItems = [
  shortcut('Recycle Bin', 'recycle'),
  shortcut('Portfolio', 'portfolio'),
  shortcut('This PC', 'explorer', 'pc', { path: ['This PC'] }),
  shortcut('Edge', 'browser'),
  shortcut('Terminal', 'terminal'),
  shortcut('Mail', 'mail'),
  file('About Me.txt', aboutText),
]

export const root = folder('This PC', [
  folder('Local Disk (C:)', [
    folder('Users', [
      folder('Chamath', [
        folder('Desktop', desktopItems),
        folder('Documents', [
          file('About Me.txt', aboutText),
          file('Skills.txt', skillsText),
          file('Education.txt', educationText),
          file('Awards & Involvement.txt', awardsText),
          folder('Projects', projects.map((p) => file(`${safe(p.title)}.txt`, projectText(p)))),
          folder(
            'Research',
            publications.map((p, i) => file(`Paper ${i + 1} — ${p.venue.split('·')[1]?.trim() ?? 'paper'}.txt`, publicationText(p))),
          ),
        ]),
        folder('Links', [
          link('GitHub.url', contact.github),
          link('LinkedIn.url', contact.linkedin),
          link('Telegram.url', contact.telegram),
          ...projects.filter((p) => p.link).map((p) => link(`${safe(p.title)}.url`, p.link)),
        ]),
      ]),
    ]),
    folder('Windows', [file('readme.txt', 'Nothing to see here — this Windows runs on React, Vite and a lot of curiosity.')]),
  ]),
])

export const HOME_PATH = ['This PC', 'Local Disk (C:)', 'Users', 'Chamath']
export const QUICK_ACCESS = [
  { label: 'Home', path: HOME_PATH },
  { label: 'Desktop', path: [...HOME_PATH, 'Desktop'] },
  { label: 'Documents', path: [...HOME_PATH, 'Documents'] },
  { label: 'Projects', path: [...HOME_PATH, 'Documents', 'Projects'] },
  { label: 'Research', path: [...HOME_PATH, 'Documents', 'Research'] },
  { label: 'Links', path: [...HOME_PATH, 'Links'] },
  { label: 'This PC', path: ['This PC'] },
]

export function resolve(path) {
  let node = root
  for (const part of path.slice(1)) {
    node = node?.children?.find((c) => c.name.toLowerCase() === part.toLowerCase())
    if (!node) return null
  }
  return node
}

// Every file/link with its folder path, for search.
export function allFiles(node = root, path = ['This PC']) {
  return (node.children ?? []).flatMap((c) =>
    c.type === 'folder' ? allFiles(c, [...path, c.name]) : c.type === 'app' ? [] : [{ ...c, path }],
  )
}

// Windows-style display path: "C:\Users\Chamath\Documents".
export function displayPath(path) {
  if (path.length === 1) return 'This PC'
  return ['C:', ...path.slice(2)].join('\\')
}

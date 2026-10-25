import { useEffect, useState } from 'react'
import { contact } from '../../data/portfolio'
import { skillIcons } from '../../data/skillIcons'
import { PreviewBar } from './PreviewBar'

export const GITHUB_USER = contact.github.split('/').filter(Boolean).pop()

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  C: '#555555',
  'C++': '#f34b7d',
  VHDL: '#adb2cb',
  Shell: '#89e051',
}

const CACHE_KEY = `cj-gh-${GITHUB_USER}`

// Live data from GitHub's public REST API (CORS-enabled, 60 req/h unauthenticated), cached per session.
function useGitHub() {
  const [state, setState] = useState(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    return cached ? { status: 'ok', ...JSON.parse(cached) } : { status: 'loading' }
  })

  useEffect(() => {
    if (state.status !== 'loading') return
    const ctrl = new AbortController()
    const get = (path) =>
      fetch(`https://api.github.com/${path}`, { signal: ctrl.signal, headers: { Accept: 'application/vnd.github+json' } }).then((r) => {
        if (!r.ok) throw new Error(r.status === 403 ? 'GitHub rate limit reached — try again in a few minutes.' : `GitHub responded ${r.status}`)
        return r.json()
      })
    Promise.all([get(`users/${GITHUB_USER}`), get(`users/${GITHUB_USER}/repos?per_page=100&sort=pushed`)])
      .then(([user, repos]) => {
        const data = { user, repos }
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data))
        setState({ status: 'ok', ...data })
      })
      .catch((e) => e.name !== 'AbortError' && setState({ status: 'error', message: e.message }))
    return () => ctrl.abort()
  }, [state.status])

  return [state, () => setState({ status: 'loading' })]
}

const ext = (url) => ({ href: url, target: '_blank', rel: 'noreferrer' })

function Octicon({ d, className = '' }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden className={`inline-block shrink-0 fill-current ${className}`}>
      <path d={d} />
    </svg>
  )
}
const ICON = {
  repo: 'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.5 2.5 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.5 2.5 0 0 1 4.5 9h8Z',
  star: 'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z',
  people: 'M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z',
  location: 'm12.596 11.596-3.535 3.536a1.5 1.5 0 0 1-2.122 0l-3.535-3.536a6.5 6.5 0 1 1 9.192 0Zm-1.06-8.132v-.001a5 5 0 1 0-7.072 7.072L8 14.07l3.536-3.534a5 5 0 0 0 0-7.072ZM8 9a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 9Z',
  fork: 'M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z',
}

function RepoMeta({ repo }) {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-4 pt-3 text-xs text-[#9198a1]">
      {repo.language && (
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ background: LANG_COLORS[repo.language] ?? '#8b949e' }} />
          {repo.language}
        </span>
      )}
      {repo.stargazers_count > 0 && (
        <span className="flex items-center gap-1">
          <Octicon d={ICON.star} /> {repo.stargazers_count}
        </span>
      )}
      <span>Updated {new Date(repo.pushed_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    </div>
  )
}

export default function GitHubPage() {
  const [state, retry] = useGitHub()
  const [tab, setTab] = useState('overview')
  const [q, setQ] = useState('')

  const user = state.user
  const repos = state.repos ?? []
  const own = repos.filter((r) => !r.fork)
  const popular = [...own].sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at)).slice(0, 6)
  const listed = repos.filter((r) => r.name.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <div className="os-scroll absolute inset-0 overflow-y-auto bg-[#0d1117] text-[#f0f6fc] [font-family:-apple-system,BlinkMacSystemFont,'Segoe_UI','Noto_Sans',Helvetica,Arial,sans-serif]">
      <PreviewBar site="GitHub" url={contact.github} note="Live data from the GitHub API" />

      <header className="flex items-center gap-3 border-b border-[#3d444d] bg-[#010409] px-4 py-3 sm:px-6">
        <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden className="fill-white">
          <path d={skillIcons.GitHub.paths[0]} />
        </svg>
        <span className="text-sm font-semibold">{GITHUB_USER}</span>
      </header>

      {state.status === 'loading' && (
        <div className="flex justify-center py-24">
          <span className="h-7 w-7 rounded-full border-2 border-[#3d444d] border-t-[#4493f8]" style={{ animation: 'os-spin 0.8s linear infinite' }} />
        </div>
      )}

      {state.status === 'error' && (
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <p className="text-lg font-semibold">Couldn't load GitHub</p>
          <p className="mt-2 text-sm text-[#9198a1]">{state.message}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={retry} className="rounded-md border border-[#3d444d] bg-[#212830] px-4 py-1.5 text-sm hover:bg-[#262c36]">
              Try again
            </button>
            <a {...ext(contact.github)} className="rounded-md bg-[#238636] px-4 py-1.5 text-sm font-semibold hover:bg-[#29903b]">
              Open on GitHub
            </a>
          </div>
        </div>
      )}

      {user && (
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:px-8">
          <aside className="flex shrink-0 flex-row gap-4 md:w-72 md:flex-col">
            <img src={user.avatar_url} alt={user.name ?? user.login} className="h-20 w-20 rounded-full border border-[#3d444d] md:h-72 md:w-72" />
            <div>
              <h1 className="text-2xl font-semibold leading-tight">{user.name}</h1>
              <p className="text-xl font-light text-[#9198a1]">{user.login}</p>
              {user.bio && <p className="mt-3 text-base">{user.bio}</p>}
              <a {...ext(user.html_url)} className="mt-4 block w-full rounded-md border border-[#3d444d] bg-[#212830] py-1.5 text-center text-sm font-semibold hover:bg-[#262c36]">
                Follow
              </a>
              <p className="mt-4 flex items-center gap-1 text-sm text-[#9198a1]">
                <Octicon d={ICON.people} />
                <b className="text-[#f0f6fc]">{user.followers}</b> followers · <b className="text-[#f0f6fc]">{user.following}</b> following
              </p>
              {user.location && (
                <p className="mt-2 flex items-center gap-2 text-sm">
                  <Octicon d={ICON.location} className="text-[#9198a1]" />
                  {user.location}
                </p>
              )}
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <nav className="mb-4 flex gap-1 border-b border-[#3d444d] text-sm">
              {[
                ['overview', 'Overview'],
                ['repositories', 'Repositories'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 ${tab === id ? 'border-[#f78166] font-semibold' : 'border-transparent text-[#9198a1] hover:text-[#f0f6fc]'}`}
                >
                  {id === 'repositories' && <Octicon d={ICON.repo} />}
                  {label}
                  {id === 'repositories' && <span className="rounded-full bg-[#2f3742] px-2 text-xs">{user.public_repos}</span>}
                </button>
              ))}
            </nav>

            {tab === 'overview' ? (
              <>
                <p className="mb-2 text-base">Popular repositories</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {popular.map((r) => (
                    <a key={r.id} {...ext(r.html_url)} className="flex flex-col rounded-md border border-[#3d444d] p-4 hover:border-[#9198a1]">
                      <span className="flex items-center gap-2">
                        <Octicon d={ICON.repo} className="text-[#9198a1]" />
                        <span className="truncate text-sm font-semibold text-[#4493f8]">{r.name}</span>
                        <span className="ml-auto rounded-full border border-[#3d444d] px-2 text-xs text-[#9198a1]">Public</span>
                      </span>
                      <span className="mt-2 line-clamp-2 text-xs text-[#9198a1]">{r.description}</span>
                      <RepoMeta repo={r} />
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Find a repository…"
                  className="mb-2 w-full rounded-md border border-[#3d444d] bg-[#0d1117] px-3 py-1.5 text-sm outline-none focus:border-[#4493f8]"
                />
                {listed.map((r) => (
                  <a key={r.id} {...ext(r.html_url)} className="flex flex-col border-b border-[#3d444d] py-5">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-lg font-semibold text-[#4493f8] hover:underline">{r.name}</span>
                      <span className="rounded-full border border-[#3d444d] px-2 text-xs text-[#9198a1]">Public</span>
                      {r.fork && (
                        <span className="flex items-center gap-1 text-xs text-[#9198a1]">
                          <Octicon d={ICON.fork} /> Forked
                        </span>
                      )}
                    </span>
                    {r.description && <span className="mt-1 text-sm text-[#9198a1]">{r.description}</span>}
                    <RepoMeta repo={r} />
                  </a>
                ))}
              </>
            )}
          </main>
        </div>
      )}
    </div>
  )
}

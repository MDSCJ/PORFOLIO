import { achievements, contact, education, profile, projects, publications, skills } from '../../data/portfolio'
import { Avatar } from '../icons'
import { PreviewBar } from './PreviewBar'

const ext = (url) => ({ href: url, target: '_blank', rel: 'noreferrer' })

function Card({ title, children }) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-[0_0_0_1px_rgb(140_140_140/0.2)] sm:p-6">
      {title && <h2 className="mb-3 text-xl font-semibold">{title}</h2>}
      {children}
    </section>
  )
}

function Entry({ logo, title, sub, meta, children }) {
  return (
    <div className="flex gap-3 border-t border-[#e8e8e8] py-4 first:border-t-0 first:pt-0">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-[#eef3f8] text-sm font-bold text-[#0a66c2]">{logo}</span>
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        {sub && <p className="text-sm">{sub}</p>}
        {meta && <p className="text-sm text-[#666]">{meta}</p>}
        {children}
      </div>
    </div>
  )
}

const certifications = achievements.filter((a) => /certification|nvq/i.test(a))
const honors = achievements.filter((a) => !certifications.includes(a) && !/^member/i.test(a))
const topSkills = skills.flatMap((g) => g.items).slice(0, 12)

// Built from portfolio data: LinkedIn has no public profile API and blocks framing.
export default function LinkedInPage() {
  return (
    <div className="os-scroll absolute inset-0 overflow-y-auto bg-[#f4f2ee] text-[#191919] [font-family:-apple-system,system-ui,'Segoe_UI',Roboto,sans-serif]">
      <PreviewBar light site="LinkedIn" url={contact.linkedin} note="Profile preview from portfolio data" />

      <header className="flex items-center gap-2 border-b border-[#e8e8e8] bg-white px-4 py-2 sm:px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-[#0a66c2] text-lg font-bold text-white">in</span>
      </header>

      <div className="mx-auto grid max-w-3xl gap-3 px-2 py-6 sm:px-4">
        <section className="overflow-hidden rounded-lg bg-white shadow-[0_0_0_1px_rgb(140_140_140/0.2)]">
          <div className="h-28 bg-gradient-to-r from-[#0b5cd5] via-[#22a3ee] to-[#7c3aed] sm:h-36" />
          <div className="px-5 pb-5 sm:px-6">
            <div className="-mt-14 mb-3 w-fit rounded-full border-4 border-white sm:-mt-20">
              <Avatar size={120} />
            </div>
            <h1 className="text-2xl font-semibold">{profile.fullName}</h1>
            <p className="mt-1 text-base">
              {profile.role} | {profile.focus.join(' · ')}
            </p>
            <p className="mt-2 text-sm text-[#666]">
              Sri Lanka ·{' '}
              <a {...ext(contact.linkedin)} className="font-semibold text-[#0a66c2] hover:underline">
                Contact info
              </a>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a {...ext(contact.linkedin)} className="rounded-full bg-[#0a66c2] px-5 py-1.5 font-semibold text-white hover:bg-[#004182]">
                Connect
              </a>
              <a href={`mailto:${contact.email}`} className="rounded-full border border-[#0a66c2] px-5 py-1.5 font-semibold text-[#0a66c2] hover:bg-[#ebf4fd]">
                Message
              </a>
            </div>
          </div>
        </section>

        <Card title="About">
          {profile.bio.map((p) => (
            <p key={p} className="mb-2 text-sm leading-relaxed last:mb-0">
              {p}
            </p>
          ))}
        </Card>

        <Card title="Projects">
          {projects.map((p) => (
            <Entry key={p.title} logo={p.title.slice(0, 2).toUpperCase()} title={p.title} meta={p.year}>
              <p className="mt-1 text-sm leading-relaxed">{p.summary}</p>
              <p className="mt-1 text-sm text-[#666]">Skills: {p.tags.join(' · ')}</p>
            </Entry>
          ))}
        </Card>

        <Card title="Education">
          {education.map((e) => (
            <Entry key={e.title} logo="🎓" title={e.institution} sub={e.title} meta={e.note} />
          ))}
        </Card>

        <Card title="Publications">
          {publications.map((p) => (
            <Entry key={p.title} logo="📄" title={p.title} meta={p.venue} />
          ))}
        </Card>

        <Card title="Honors & awards">
          {honors.map((a) => (
            <Entry key={a} logo="🏆" title={a.split('—')[0].trim()} sub={a.split('—')[1]?.trim()} />
          ))}
        </Card>

        <Card title="Licenses & certifications">
          {certifications.map((c) => (
            <Entry key={c} logo="✔" title={c} />
          ))}
        </Card>

        <Card title="Skills">
          <div className="flex flex-wrap gap-2">
            {topSkills.map((s) => (
              <span key={s} className="rounded-full border border-[#8c8c8c] px-3 py-1 text-sm">
                {s}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

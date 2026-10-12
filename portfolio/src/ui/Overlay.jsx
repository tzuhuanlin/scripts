import { profile, skills, projects, contact } from '../data.js'
import { isDay } from '../device.js'

// One full-viewport section per camera shot (see scene/shots.js).
export default function Overlay() {
  return (
    <main className="overlay">
      <section className="left">
        <div className="panel hero">
          <p className="eyebrow">Hi, I'm</p>
          <h1>{profile.name}</h1>
          <p className="role">{profile.role}</p>
          <p>{profile.tagline}</p>
          <p className="hint">Scroll to step inside ↓</p>
        </div>
      </section>

      <section className="left">
        <div className="panel">
          <p className="eyebrow">01 — About</p>
          <h2>A little about me</h2>
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="muted">
            📍 {profile.location} · the window shows {isDay() ? 'daytime' : 'night'}{' '}
            where you are.
          </p>
        </div>
      </section>

      <section className="right">
        <div className="panel">
          <p className="eyebrow">02 — Skills</p>
          <h2>The bookshelf</h2>
          <p>Every book is something I work with. Hover one to pull it off the shelf.</p>
          <ul className="chips">
            {skills.map((s) => (
              <li key={s.name} style={{ '--c': s.color }}>
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bottom">
        <div className="panel slim">
          <p className="eyebrow">03 — Projects</p>
          <p className="desktop-only">Click a project on the screen to open it.</p>
          {/* The monitor is small on phones, so list the projects here too. */}
          <ul className="mobile-only mobile-projects">
            {projects.map((p) => (
              <li key={p.title}>
                {p.link && p.link !== '#' ? <a href={p.link}>{p.title}</a> : p.title} <span className="muted">· {p.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="left">
        <div className="panel">
          <p className="eyebrow">04 — Contact</p>
          <h2>Let's build something</h2>
          <p>Pick up the phone (it's clickable) or reach me here:</p>
          <p>
            <a className="big-link" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </p>
          <ul className="links">
            {contact.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

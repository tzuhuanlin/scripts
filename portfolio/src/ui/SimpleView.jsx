import { profile, skills, projects, contact } from '../data.js'

// Plain, fast, accessible version of the portfolio — also the fallback when WebGL is unavailable.
export default function SimpleView({ canGo3D, onShow3D }) {
  return (
    <div className="simple">
      <header>
        <h1>{profile.name}</h1>
        <p className="role">{profile.role}</p>
        <p>{profile.tagline}</p>
        {canGo3D && (
          <p>
            <button type="button" className="link-button" onClick={onShow3D}>
              ← Back to the 3D version
            </button>
          </p>
        )}
      </header>
      <section>
        <h2>About</h2>
        {profile.about.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>
      <section>
        <h2>Skills</h2>
        <ul className="chips">
          {skills.map((s) => (
            <li key={s.name} style={{ '--c': s.color }}>
              {s.name}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Projects</h2>
        {projects.map((p) => (
          <article key={p.title}>
            <h3>
              {p.link && p.link !== '#' ? <a href={p.link}>{p.title}</a> : p.title} <small>{p.year}</small>
            </h3>
            <p>{p.description}</p>
            <p className="muted">{p.tech.join(' · ')}</p>
          </article>
        ))}
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
        <ul className="links">
          {contact.links.map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

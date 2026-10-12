import { useEffect, useState } from 'react'
import { projects, profile } from '../data.js'

// The fake desktop rendered on the 3D monitor.
export default function Screen({ width, height, active }) {
  const [open, setOpen] = useState(null)
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  // Return to the project list when the camera leaves the monitor.
  useEffect(() => {
    if (!active) setOpen(null)
  }, [active])

  const project = open !== null ? projects[open] : null

  return (
    <div className="screen" style={{ width, height }} aria-hidden={!active}>
      <div className="screen-bar">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span>{project ? `~/projects/${slug(project.title)}` : '~/projects'}</span>
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      {project ? (
        <article className="screen-detail">
          <button className="back" onClick={() => setOpen(null)} tabIndex={active ? 0 : -1}>
            ← back
          </button>
          <h2>
            {project.title} <small>{project.year}</small>
          </h2>
          <p>{project.description}</p>
          <ul className="tags">
            {project.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {project.link && project.link !== '#' && (
            <a className="open" href={project.link} target="_blank" rel="noreferrer" tabIndex={active ? 0 : -1}>
              Open project ↗
            </a>
          )}
        </article>
      ) : (
        <div className="screen-list">
          <p className="prompt">
            <span>{slug(profile.name)}@desk</span>:~$ ls projects/
          </p>
          <div className="grid">
            {projects.map((p, i) => (
              <button key={p.title} className="card" onClick={() => setOpen(i)} tabIndex={active ? 0 : -1}>
                <span className="year">{p.year}</span>
                <span className="title">{p.title}</span>
                <span className="tech">{p.tech.join(' · ')}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

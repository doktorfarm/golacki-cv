import { useCallback, useEffect, useRef, useState } from 'react'
import { projects as all } from '../data'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { onFrame, reducedMotion, scrollToId } from '../lib/motion'
import { ArrowUpRight, Picture } from './motion'
import ProjectArt from './ProjectArt'
import SectionHead from './SectionHead'
import Tilt from './Tilt'

const projects = all.filter((p) => !p.draft)
const Todo = ({ children }) => <span className="chip todo">{children}</span>

/** Real screenshots when the project has them, a quiet stand-in otherwise. */
function Visual({ p }) {
  // screenshots take turns every 4 s
  const [slide, setSlide] = useState(0)
  const n = p.shots?.desktop.length ?? 0
  useEffect(() => {
    if (n < 2 || reducedMotion) return
    const t = setInterval(() => setSlide((v) => (v + 1) % n), 4000)
    return () => clearInterval(t)
  }, [n])
  if (!p.shots) {
    return (
      <Tilt className="shot p-3 md:p-4">
        <div className="relative aspect-[16/10]">
          <ProjectArt id={p.key} />
        </div>
      </Tilt>
    )
  }
  return (
    <div>
      <Tilt className="shot relative p-3 pb-8 md:p-4 md:pb-10">
        <div className="slides w-[88%]">
          {p.shots.desktop.map(([name, alt], k) => (
            <Picture
              key={name}
              name={name}
              alt={alt}
              sizes="(min-width: 1024px) 620px, 92vw"
              className={`shot-desktop block h-auto w-full ${k === slide ? '' : 'off'}`}
            />
          ))}
        </div>
        {p.shots.phone && (
          <Picture
            name={p.shots.phone}
            alt={p.shots.phoneAlt}
            sizes="(min-width: 1024px) 170px, 26vw"
            className="shot-phone absolute bottom-3 right-3 block h-auto w-[26%] md:bottom-4 md:right-4"
          />
        )}
      </Tilt>
      {p.shots.desktop.length > 1 && (
        <div className="slide-dots" aria-hidden="true">
          {p.shots.desktop.map(([name], k) => (
            <i key={`${name}-${k === slide ? slide : 'x'}`} className={k === slide ? 'on' : ''} />
          ))}
        </div>
      )}
    </div>
  )
}

function Project({ p, i, last }) {
  const dev = import.meta.env.DEV // placeholders are an authoring aid; never ship them
  const slot = useRef(null)
  const card = useRef(null)
  // While the next card slides over this one, it eases back and dims a little.
  const apply = useCallback(
    (t) => {
      if (last || !card.current) return
      const k = Math.max(0, (t - 0.5) * 2)
      card.current.style.transform = `scale(${1 - k * 0.06})`
      card.current.style.filter = `brightness(${1 - k * 0.45})`
    },
    [last],
  )
  useScrollProgress(slot, apply, 'pass')
  return (
    <div ref={slot} id={`projekt-${p.key}`} className="stack-slot" style={{ '--i': i }}>
    <article ref={card} className="card proj-card stack-card grid items-center gap-8 p-5 md:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:p-10">
      <div className="min-w-0">
        <div className="flex items-end justify-between gap-4">
          <span className="proj-num hollow" aria-hidden="true">0{i + 1}</span>
          <p className="m-0 text-right text-[14.5px] text-accent-text">{p.meta.join(', ')}</p>
        </div>
        <h3 className="mb-0 mt-6 text-[clamp(34px,4vw,54px)] leading-[1.05]">{p.name.join('')}</h3>
        {p.description ? (
          <p className="mb-0 mt-4 max-w-[54ch] text-[17.5px] leading-[1.6] text-muted">{p.description}</p>
        ) : dev ? (
          <p className="mb-0 mt-4 max-w-[54ch] rounded-md border border-dashed border-line px-3.5 py-2.5 text-[14px] text-muted">
            Opis do uzupełnienia w src/data.js: jaki problem rozwiązuje, dla kogo i z jakim efektem.
          </p>
        ) : (
          <p className="mb-0 mt-4 max-w-[54ch] text-[17.5px] leading-[1.6] text-muted">Opis w przygotowaniu.</p>
        )}
        {p.points && (
          <ul className="points mb-0 mt-5 flex list-none flex-col gap-2 p-0 text-[16px] leading-snug">
            {p.points.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
          {p.tech.map((t, i) => (t ? <span key={i} className="chip">{t}</span> : dev ? <Todo key={i}>technologia</Todo> : null))}
        </div>
        {p.url && (
          <a className="btn btn-sm mt-7" href={p.url} target="_blank" rel="noopener noreferrer">
            Otwórz {p.name.join('')}
            <ArrowUpRight />
          </a>
        )}
      </div>
      <Visual p={p} />
    </article>
    </div>
  )
}

/** Pinned row above the stack: which project is on top, and how far through it you are. */
function Index() {
  const btns = useRef([])
  const [active, setActive] = useState(0)
  useEffect(
    () =>
      onFrame(() => {
        let cur = 0
        projects.forEach((p, i) => {
          const el = document.getElementById(`projekt-${p.key}`)
          const b = btns.current[i]
          if (!el || !b) return
          const r = el.getBoundingClientRect()
          const k = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / Math.max(1, r.height)))
          b.style.setProperty('--p', k.toFixed(3))
          if (r.top < window.innerHeight * 0.6) cur = i
        })
        setActive(cur)
      }),
    [],
  )
  return (
    <div className="proj-index">
      {projects.map((p, i) => (
        <button key={p.key} ref={(el) => (btns.current[i] = el)} type="button" className={i === active ? 'on' : ''} onClick={() => scrollToId(`#projekt-${p.key}`)}>
          <b>0{i + 1}</b>
          {p.name.join('')}
        </button>
      ))}
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projekty" className="pt-24 md:pt-36">
      <div className="wrap">
        <SectionHead ghost="Projekty" title="Narzędzia, które" hollow="sam zbudowałem">
          Każde zaczęło się od problemu, który widziałem z bliska: na oddziale, w laboratorium albo na uczelni.
        </SectionHead>
        <div>
          <Index />
          {projects.map((p, i) => (
            <Project key={p.key} p={p} i={i} last={i === projects.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

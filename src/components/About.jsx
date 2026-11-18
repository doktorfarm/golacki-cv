import { useCallback, useRef } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { about, certificates, education, experience, hero, person, publications, skills, talks } from '../data'
import { ArrowUpRight, Reveal, Roll } from './motion'
import Orbits from './Orbits'
import SectionHead from './SectionHead'

function BlockTitle({ title, note }) {
  return (
    <div className="mb-1 flex items-baseline justify-between border-b border-line pb-3">
      <h3 className="m-0 text-[21px]">{title}</h3>
      <span className="mono">{note}</span>
    </div>
  )
}

function Timeline({ items }) {
  return (
    <ul className="mb-16 list-none p-0">
      {items.map((it, i) => (
        <Reveal as="li" key={i} className="tl-row grid items-baseline gap-1 border-b border-line py-[18px] md:grid-cols-[120px_minmax(0,1fr)_auto] md:gap-5">
          <span className="mono">
            {it.from}
            {it.to !== undefined && (
              <>
                {'–'}
                {it.to === null ? <span className="font-semibold text-accent-text">dziś</span> : it.to}
              </>
            )}
          </span>
          <span className="text-[17.5px] font-semibold">
            {it.role}
            <span className="mt-0.5 block text-[15px] font-normal text-muted">{it.org}</span>
          </span>
          <span className="mono">{it.tag}</span>
        </Reveal>
      ))}
    </ul>
  )
}

// The CV PDF is offered for download; set VITE_SHOW_CV=false to hide the button in a build
const SHOW_CV = import.meta.env.VITE_SHOW_CV !== 'false'

export default function About() {
  const col = useRef(null)
  const line = useRef(null)
  const draw = useCallback((p) => {
    if (line.current) line.current.style.transform = `scaleY(${Math.min(1, Math.max(0, (p - 0.12) / 0.7))})`
  }, [])
  useScrollProgress(col, draw, 'pass')
  return (
    <section id="o-mnie" className="relative isolate pt-24 md:pt-36">
      <Orbits className="left-[-22%] top-[38%] hidden h-[760px] w-[760px] lg:block" />
      <div className="wrap">
        <SectionHead ghost="Ścieżka" dir={-1} title="Klinika, laboratorium," hollow="apteka, biznes" />

        <dl className="m-0 mb-12 grid grid-cols-2 gap-3 md:mb-16 md:grid-cols-4 md:gap-4">
          {hero.facts.map(([big, small], i) => (
            <Reveal key={big} delay={i * 0.07} className="card px-4 py-5 sm:px-5 md:px-6 md:py-6">
              <dt className="text-[clamp(21px,2.6vw,34px)] font-semibold leading-none tracking-[-.035em]">{big}</dt>
              <dd className="m-0 mt-2.5 text-[14.5px] leading-snug text-muted">{small}</dd>
            </Reveal>
          ))}
        </dl>

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-14">
          <div className="flex flex-col gap-4 lg:sticky lg:top-[110px]">
          <Reveal className="card p-6 md:p-8">
            <p className="m-0 max-w-[44ch] text-[17px] leading-[1.65]">{about.text}</p>
            {SHOW_CV && (
              <>
                <a className="btn btn-fill mt-7" href={person.cvUrl} target="_blank" rel="noopener noreferrer">
                  <Roll>Pobierz CV (PDF)</Roll>
                  <ArrowUpRight style={{ transform: 'rotate(135deg)' }} />
                </a>
                <p className="mono mb-0 mt-3">{person.cvNote}</p>
              </>
            )}
          </Reveal>
          <Reveal delay={0.1} className="navy rounded-[24px] p-6 md:p-8">
            <h3 className="m-0 text-[22px] leading-tight">Prowadzisz zespół?</h3>
            <p className="mb-0 mt-3 max-w-[40ch] text-[16px] leading-[1.6] text-muted">
              Szukam zespołu klinicznego i miejsca do nauki kardiochirurgii dziecięcej. Napisz, czym się zajmuje Twój zespół.
            </p>
            <a className="btn btn-fill mt-6" href={`mailto:${person.email}`}>
              <Roll>Napisz do mnie</Roll>
              <ArrowUpRight />
            </a>
          </Reveal>
          </div>

          <div ref={col} className="relative min-w-0 lg:pl-10">
            <div className="rail" aria-hidden="true"><i ref={line} /></div>
            <BlockTitle title="Doświadczenie" note="wybrane" />
            <Timeline items={experience} />

            <BlockTitle title="Wykształcenie" note="GUMed, UG" />
            <Timeline items={education} />

            <BlockTitle title="Kluczowe umiejętności" note={`${skills.length} obszary`} />
            <div className="mb-16 mt-7 grid gap-x-10 gap-y-9 md:grid-cols-2">
              {skills.map((s, i) => (
                <Reveal key={s.title} delay={(i % 2) * 0.1}>
                  <h4 className="mb-2.5 mt-0 text-[15px] font-semibold text-accent-text">{s.title}</h4>
                  <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                    {s.items.map((x) => (
                      <li key={x} className="text-[16.5px]">{x}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>

            <BlockTitle title="Publikacje, wystąpienia i certyfikaty" note={`${publications.length} + ${talks.length} + ${certificates.length}`} />
            <ul className="m-0 list-none p-0">
              {publications.map((p) => (
                <li key={p.title} className="grid items-baseline gap-1 border-b border-line py-[18px] md:grid-cols-[120px_minmax(0,1fr)] md:gap-5">
                  <span className="mono">{p.year}</span>
                  <span className="text-[16px] leading-snug">
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:decoration-accent">{p.title}</a>
                    ) : (
                      p.title
                    )}
                    <span className="mt-1 block text-[15px] text-muted">{p.venue}</span>
                  </span>
                </li>
              ))}
              {talks.map((t) => (
                <li key={t.title} className="grid items-baseline gap-1 border-b border-line py-[18px] md:grid-cols-[120px_minmax(0,1fr)_auto] md:gap-5">
                  <span className="mono">{t.year}</span>
                  <span className="text-[16px] leading-snug">
                    {t.title}
                    <span className="mt-1 block text-[15px] text-muted">{t.venue}</span>
                  </span>
                  <span className="mono">Wystąpienie</span>
                </li>
              ))}
              {certificates.map((c) => (
                <li key={c.name} className="grid items-baseline gap-1 border-b border-line py-[14px] md:grid-cols-[120px_minmax(0,1fr)_auto] md:gap-5">
                  <span className="mono">{c.year}</span>
                  <span className="text-[16px]">{c.name}</span>
                  <span className="mono">Certyfikat</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  )
}

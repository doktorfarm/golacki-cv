import { useCallback, useRef } from 'react'
import { hero, person } from '../data'
import { useMagnetic } from '../hooks/useMagnetic'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { anchorClick } from '../lib/motion'
import Network from './Network'
import { ArrowUpRight, Roll } from './motion'

/**
 * Navy opening screen. Left: name, headline, lead and buttons as one block, centred vertically.
 * Right: the turning sphere of connected points. Bottom: four facts, so the screen is full.
 * On scroll the copy drifts up and the sphere sinks a little, so the layers part.
 */
export default function Hero() {
  const section = useRef(null)
  const copy = useRef(null)
  const orb = useRef(null)
  const cta = useRef(null)
  useMagnetic(cta)

  const apply = useCallback((p) => {
    const t = Math.max(0, (p - 0.5) * 2) // 0 while the hero fills the screen, 1 when it has left
    copy.current.style.transform = `translate3d(0, ${t * -70}px, 0)`
    copy.current.style.opacity = String(1 - t * 1.25)
    orb.current.style.transform = `translate3d(0, ${t * 70}px, 0) scale(${1 + t * 0.1})`
  }, [])
  useScrollProgress(section, apply, 'pass')

  return (
    <section ref={section} className="navy relative isolate flex min-h-[100svh] flex-col overflow-hidden" aria-label="Wprowadzenie">
      <div className="hero-glow" aria-hidden="true" />

      <div className="wrap flex w-full flex-1 flex-col pt-[calc(96px+env(safe-area-inset-top,0px))]">
        <div className="grid flex-1 items-center gap-4 lg:grid-cols-[minmax(0,11fr)_minmax(0,10fr)] lg:gap-6">
          <div ref={copy} className="order-2 will-change-transform lg:order-1">
            <p className="fade m-0 flex items-center gap-3 text-[15px] text-muted">
              <i className="dot" aria-hidden="true" />
              <span>{person.name},</span>
              <span className="rotor" aria-label={hero.roles.join(', ')}>
                <span aria-hidden="true">
                  {[...hero.roles, hero.roles[0]].map((r, i) => (
                    <b key={i}>{r}</b>
                  ))}
                </span>
              </span>
            </p>
            <h1 className="hero-title mb-0 mt-5">
              {hero.lines.map((l, i) => (
                <span className={`line ${i % 2 ? 'hollow' : ''}`} key={i}>
                  <span>{l} </span>
                </span>
              ))}
            </h1>
            <p className="fade mb-0 mt-7 max-w-[48ch] text-[17px] leading-[1.6] text-muted md:text-[18px]">{hero.lead}</p>
            <div className="fade mt-8 flex flex-wrap gap-3">
              <a ref={cta} className="btn btn-fill" href="#kontakt" onClick={anchorClick}>
                <Roll>Napisz do mnie</Roll>
                <ArrowUpRight />
              </a>
              <a className="btn" href="#projekty" onClick={anchorClick}>
                <Roll>Zobacz projekty</Roll>
              </a>
            </div>
          </div>
          <div ref={orb} className="orb fade order-1 lg:order-2" aria-hidden="true">
            <Network className="h-full w-full" />
          </div>
        </div>

        <dl className="fade m-0 mt-8 grid grid-cols-2 border-t border-line md:grid-cols-4">
          {hero.facts.map(([big, small], i) => (
            <div key={big} className={`py-5 pr-4 md:py-6 ${i ? 'md:border-l md:border-line md:pl-6' : ''} ${i % 2 ? 'border-l border-line pl-4' : ''} ${i > 1 ? 'border-t border-line md:border-t-0' : ''}`}>
              <dt className="text-[clamp(20px,2vw,26px)] font-semibold leading-none tracking-[-.03em]">{big}</dt>
              <dd className="m-0 mt-2 text-[14px] leading-snug text-muted">{small}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

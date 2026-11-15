import { useCallback, useRef } from 'react'
import { hero } from '../data'
import { useScrollProgress } from '../hooks/useScrollProgress'
import Orbits from './Orbits'

/** Pinned statement: the words light up one by one as you scroll through it. */
export default function Manifest() {
  const section = useRef(null)
  const words = useRef([])
  const bar = useRef(null)

  const apply = useCallback((p) => {
    const n = words.current.length
    words.current.forEach((el, i) => {
      if (!el) return
      const k = Math.min(1, Math.max(0, p * (n + 6) - i))
      el.style.opacity = String(0.16 + k * 0.84)
    })
    if (bar.current) bar.current.style.transform = `scaleX(${p})`
  }, [])
  useScrollProgress(section, apply)

  let i = 0
  return (
    <section ref={section} className="manifest relative h-[200svh] pt-[14svh]" aria-label="Współpraca">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <Orbits className="right-[-38%] top-1/2 hidden h-[120svh] w-[120svh] -translate-y-1/2 md:block" />
        <div className="wrap w-full">
          {[hero.seeking, hero.value].map((b) => (
            <div key={b.label} className="mb-10 last:mb-0 md:mb-14">
              <h2 className="m-0 text-[15px] font-medium tracking-normal text-accent-text">{b.label}</h2>
              <p className="manifest-text mb-0 mt-3">
                {b.text.split(' ').map((w) => {
                  const idx = i++
                  return (
                    <span key={idx} ref={(el) => (words.current[idx] = el)}>
                      {w}{' '}
                    </span>
                  )
                })}
              </p>
            </div>
          ))}
          <div className="mt-10 h-px bg-line">
            <div ref={bar} className="h-px origin-left scale-x-0 bg-accent" />
          </div>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import { marquee } from '../data'
import { onFrame, reducedMotion } from '../lib/motion'

/** Two rows of oversized words sliding in opposite directions; scrolling pushes them faster. */
export default function Marquee() {
  const box = useRef(null)
  const rows = useRef([])

  useEffect(() => {
    if (reducedMotion) return
    let x = 0
    let last = window.scrollY
    let v = 0
    return onFrame(() => {
      const el = box.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const sy = window.scrollY
      v += ((sy - last) * 0.5 - v) * 0.12
      last = sy
      if (r.bottom < 0 || r.top > window.innerHeight) return
      x += 0.6 + Math.abs(v)
      rows.current.forEach((row, i) => {
        if (!row) return
        const half = row.scrollWidth / 2
        const pos = x % half
        row.style.transform = `translate3d(${i ? pos - half : -pos}px, 0, 0)`
      })
    })
  }, [])

  const items = [...marquee, ...marquee, ...marquee, ...marquee]
  return (
    <div ref={box} className="marquee navy navy-top overflow-hidden pb-16 pt-6 md:pb-24 md:pt-10" aria-hidden="true">
      {[0, 1].map((r) => (
        <div key={r} ref={(el) => (rows.current[r] = el)} className="flex w-max whitespace-nowrap will-change-transform">
          {(r ? [...items].reverse() : items).map((t, i) => (
            <span key={i} className={`marquee-item ${(i + r) % 2 ? 'hollow' : ''}`}>
              {t}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { person } from '../data'

/** Opening curtain: a counter runs to 100, then the panel lifts and the headline rises behind it.
 *  Only shown while <html> has the `pre` class (set by public/pre.js; skipped for reduced motion). */
export default function Intro({ onDone }) {
  const num = useRef(null)
  const [out, setOut] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('pre')) {
      setGone(true)
      onDone()
      return
    }
    const t0 = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1300)
      const e = 1 - Math.pow(1 - p, 3)
      if (num.current) num.current.textContent = String(Math.round(e * 100)).padStart(3, '0')
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        setOut(true)
        onDone()
        setTimeout(() => setGone(true), 1100)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  if (gone) return null
  return (
    <div className={`intro ${out ? 'out' : ''}`} aria-hidden="true">
      <span className="text-[15px] text-muted">{person.name}</span>
      <span ref={num} className="intro-num">000</span>
      <span className="text-[15px] text-muted">Medycyna, farmacja, kod</span>
    </div>
  )
}

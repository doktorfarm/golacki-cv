import { useEffect, useRef } from 'react'
import { onFrame, reducedMotion } from '../lib/motion'

/** Page-wide motion chrome: reading-progress line, trailing cursor, magnetic buttons. */
export default function Chrome() {
  const bar = useRef(null)
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (reducedMotion) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const m = { x: -100, y: -100 }
    const r = { x: -100, y: -100 }
    let over = null
    let magnet = null
    let grid = null

    const move = (e) => {
      m.x = e.clientX
      m.y = e.clientY
      const t = e.target.closest?.('a, button, summary, .shot')
      if (t !== over) {
        over = t
        ring.current?.classList.toggle('on', !!t)
        ring.current?.classList.toggle('view', !!t?.classList.contains('shot'))
      }
      // buttons lean toward the cursor
      const b = e.target.closest?.('.btn')
      if (magnet && magnet !== b) {
        magnet.style.transform = ''
        magnet = null
      }
      if (b) {
        magnet = b
        const q = b.getBoundingClientRect()
        b.style.transform = `translate(${(e.clientX - q.left - q.width / 2) * 0.22}px, ${(e.clientY - q.top - q.height / 2) * 0.3}px)`
      }
    }
    if (fine) {
      window.addEventListener('pointermove', move, { passive: true })
      document.documentElement.classList.add('has-cursor')
    }

    const off = onFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
      if (!fine) return
      r.x += (m.x - r.x) * 0.16
      r.y += (m.y - r.y) * 0.16
      if (!grid) grid = document.querySelector('.backdrop')
      if (grid) {
        grid.style.setProperty('--mx', `${r.x}px`)
        grid.style.setProperty('--my', `${r.y}px`)
      }
      if (dot.current) dot.current.style.transform = `translate3d(${m.x}px, ${m.y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`
    })
    return () => {
      off()
      window.removeEventListener('pointermove', move)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div aria-hidden="true">
      <div className="progress"><i ref={bar} /></div>
      <div ref={ring} className="cur-ring"><span>Zobacz</span></div>
      <div ref={dot} className="cur-dot" />
    </div>
  )
}

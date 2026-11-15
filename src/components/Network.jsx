import { useEffect, useRef } from 'react'
import meshUrl from '../assets/heart.bin?url'
import heartUrl from '../assets/heart.webp'
import { createHeart } from '../lib/heart3d'
import { onFrame, reducedMotion } from '../lib/motion'

/**
 * A slowly turning sphere of connected points: people, disciplines and tools linked together.
 * It breathes, leans toward the cursor, spins faster while the page scrolls, and now and
 * then a pulse of light runs along one of its links. In its centre an anatomical heart
 * (a 3D model) spins slowly. Paused when off-screen.
 */
export default function Network({ className = '', points = 110 }) {
  const canvas = useRef(null)

  useEffect(() => {
    const c = canvas.current
    const ctx = c.getContext('2d')
    let w = 0
    let h = 0
    let visible = true
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    let spin = 0
    let time = 0
    let lastScroll = window.scrollY
    let boost = 0

    // points spread evenly on a unit sphere
    const pts = Array.from({ length: points }, (_, i) => {
      const y = 1 - (i / (points - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const a = i * Math.PI * (3 - Math.sqrt(5))
      return { x: Math.cos(a) * r, y, z: Math.sin(a) * r, ph: (i * 1.7) % 6.28, hot: i % 11 === 3 }
    })
    // links between near neighbours (fixed, the sphere is rigid)
    const links = []
    for (let i = 0; i < points; i++)
      for (let j = i + 1; j < points; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y, pts[i].z - pts[j].z)
        if (d < 0.42) links.push([i, j])
      }
    const pulses = Array.from({ length: 5 }, (_, k) => ({ l: (k * 37) % links.length, t: k / 5 }))

    // the heart: a 3D model (prepared by scripts/heart.mjs), fetched after the sphere is already turning
    let solid = null
    let gone = false
    const tex = new Image()
    tex.src = heartUrl
    Promise.all([fetch(meshUrl).then((r) => r.arrayBuffer()), tex.decode()])
      .then(([buf]) => {
        if (gone) return
        solid = createHeart(buf, tex)
        if (reducedMotion) draw()
      })
      .catch(() => {}) // no heart is fine: the sphere stands on its own

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = c.clientWidth
      h = c.clientHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)
    const move = (e) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5
      mouse.ty = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('pointermove', move, { passive: true })
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(c)

    const css = getComputedStyle(c) // tokens of the section the canvas sits in (white or navy)
    const ink = css.getPropertyValue('--fg').trim() || '#0A1A4A'
    const accent = css.getPropertyValue('--accent').trim() || '#1F47D6'
    const sky = css.getPropertyValue('--sky').trim() || '#2E8BFF'
    const rgb = css.getPropertyValue('--accent-rgb').trim() || '31, 71, 214'
    const red = css.getPropertyValue('--pulse-rgb').trim() || '229, 35, 63'
    const P = new Array(points)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const R = Math.min(w, h) * 0.4
      const cx = w / 2 + mouse.x * 40
      const cy = h / 2 + mouse.y * 30
      const ry = spin + mouse.x * 0.9
      const rx = 0.35 + mouse.y * 0.7
      const sy = Math.sin(ry), cyy = Math.cos(ry), sx = Math.sin(rx), cxx = Math.cos(rx)
      for (let i = 0; i < points; i++) {
        const p = pts[i]
        const b = 1 + 0.045 * Math.sin(time * 1.4 + p.ph) // breathing
        const x1 = (p.x * cyy + p.z * sy) * b
        const z1 = (-p.x * sy + p.z * cyy) * b
        const y1 = p.y * b * cxx - z1 * sx
        const z2 = p.y * b * sx + z1 * cxx
        const k = 1 / (1.9 - z2 * 0.55) * 1.9 // perspective
        P[i] = { x: cx + x1 * R * k, y: cy + y1 * R * k, d: (z2 + 1) / 2 }
      }
      ctx.lineWidth = 1
      for (const [i, j] of links) {
        const a = P[i], b = P[j]
        ctx.strokeStyle = `rgba(${rgb}, ${0.05 + ((a.d + b.d) / 2) * 0.3})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
      // heart: no beating, it only spins slowly, against the sphere
      if (solid) {
        const hh = R * 1.05
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, hh * 0.95)
        glow.addColorStop(0, `rgba(${red}, 0.2)`)
        glow.addColorStop(1, `rgba(${red}, 0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(cx, cy, hh * 0.95, 0, 6.283)
        ctx.fill()
        solid.render(reducedMotion ? 0 : -time * 0.4 + mouse.x * 0.8, mouse.y * 0.5)
        const s = hh / 0.82 // the model fills 82% of its canvas height
        ctx.drawImage(solid.canvas, cx - s / 2, cy - s / 2, s, s)
      }
      for (const pu of pulses) {
        const [i, j] = links[pu.l]
        const a = P[i], b = P[j]
        ctx.fillStyle = sky
        ctx.globalAlpha = 0.9
        ctx.beginPath()
        ctx.arc(a.x + (b.x - a.x) * pu.t, a.y + (b.y - a.y) * pu.t, 3, 0, 6.283)
        ctx.fill()
      }
      for (let i = 0; i < points; i++) {
        const p = P[i]
        ctx.globalAlpha = 0.22 + p.d * 0.78
        ctx.fillStyle = pts[i].hot ? sky : i % 3 ? accent : ink
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.4 + p.d * (pts[i].hot ? 5 : 3.4), 0, 6.283)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const cleanup = () => {
      gone = true
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      io.disconnect()
    }
    if (reducedMotion) {
      draw()
      return cleanup
    }
    const off = onFrame(() => {
      if (!visible) return
      const s = window.scrollY
      boost += (Math.abs(s - lastScroll) * 0.0012 - boost) * 0.1
      lastScroll = s
      spin += 0.0035 + boost
      time += 0.016
      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      for (const pu of pulses) {
        pu.t += 0.02
        if (pu.t > 1) {
          pu.t = 0
          pu.l = (pu.l + 17) % links.length
        }
      }
      draw()
    })
    return () => {
      off()
      cleanup()
    }
  }, [points])

  return <canvas ref={canvas} className={className} aria-hidden="true" />
}

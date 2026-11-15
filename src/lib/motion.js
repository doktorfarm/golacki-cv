import Lenis from 'lenis'

export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// One shared requestAnimationFrame loop for every scroll-driven effect
// (Lenis, nav, marquee, parallax, cursor preview) instead of one loop per component.
const subscribers = new Set()
let running = false

function loop(t) {
  subscribers.forEach((fn) => fn(t))
  requestAnimationFrame(loop)
}

export function onFrame(fn) {
  subscribers.add(fn)
  if (!running) {
    running = true
    requestAnimationFrame(loop)
  }
  return () => subscribers.delete(fn)
}

// Smooth scroll
let lenis = null

export function startSmoothScroll() {
  if (reducedMotion || lenis) return () => {}
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  const off = onFrame((t) => lenis.raf(t))
  return () => {
    off()
    lenis.destroy()
    lenis = null
  }
}

export function scrollToId(id) {
  const el = id === '#top' ? document.body : document.querySelector(id)
  if (!el) return
  if (lenis) lenis.scrollTo(id === '#top' ? 0 : el, { offset: -20, duration: 1.6 })
  else el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
}

// Click handler for in-page anchor links
export function anchorClick(e) {
  const href = e.currentTarget.getAttribute('href')
  if (!href || !href.startsWith('#') || href.length < 2) return
  e.preventDefault()
  scrollToId(href)
}

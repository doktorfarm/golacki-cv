import { useEffect } from 'react'
import { reducedMotion } from '../lib/motion'

// Element drifts toward the cursor while hovered, springs back on leave.
export function useMagnetic(ref, strength = { x: 0.25, y: 0.35 }) {
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion || !window.matchMedia('(hover: hover)').matches) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left - r.width / 2) * strength.x
      const y = (e.clientY - r.top - r.height / 2) * strength.y
      el.style.transform = `translate(${x}px, ${y}px)`
    }
    const leave = () => (el.style.transform = '')
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [ref, strength.x, strength.y])
}

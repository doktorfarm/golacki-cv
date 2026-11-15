import { useEffect, useRef } from 'react'
import { reducedMotion } from '../lib/motion'

/** Leans its content toward the cursor in 3D, with a soft light following the pointer. */
export default function Tilt({ className = '', children }) {
  const box = useRef(null)
  useEffect(() => {
    const el = box.current
    if (!el || reducedMotion || !window.matchMedia('(hover: hover)').matches) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(1100px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) scale(1.02)`
      el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
      el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
    }
    const leave = () => (el.style.transform = '')
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])
  return (
    <div ref={box} className={`tilt ${className}`}>
      {children}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { reducedMotion } from '../lib/motion'

// Returns true once the element has entered the viewport (fires once).
export function useInView(ref, { rootMargin = '0px 0px -10% 0px', threshold = 0.12 } = {}) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    if (reducedMotion || !('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, inView, rootMargin, threshold])

  return inView
}

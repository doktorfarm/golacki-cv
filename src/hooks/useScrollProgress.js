import { useEffect } from 'react'
import { onFrame, reducedMotion } from '../lib/motion'

/**
 * Calls `apply(p)` every frame with p ∈ [0,1]: how far the page has scrolled
 * through `ref`'s element. Mode "sticky" measures the pinned scroll distance
 * (element height minus one viewport); mode "pass" measures from the element
 * entering at the bottom to leaving at the top.
 * Writes styles directly in `apply`, so React does not re-render on scroll.
 */
export function useScrollProgress(ref, apply, mode = 'sticky') {
  useEffect(() => {
    if (reducedMotion) return
    let last = -1
    return onFrame(() => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p =
        mode === 'sticky'
          ? Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)))
          : Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
      if (Math.abs(p - last) < 0.0005) return
      last = p
      apply(p)
    })
  }, [ref, apply, mode])
}

import { useCallback, useRef } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'

/** A huge outlined word that slides sideways as the section scrolls past. Decorative. */
export default function Ghost({ children, dir = 1 }) {
  const box = useRef(null)
  const word = useRef(null)
  const apply = useCallback(
    (p) => {
      if (word.current) word.current.style.transform = `translate3d(${(0.5 - p) * 34 * dir}%, 0, 0)`
    },
    [dir],
  )
  useScrollProgress(box, apply, 'pass')
  return (
    <div ref={box} className="ghost" aria-hidden="true">
      <div ref={word}>{children}</div>
    </div>
  )
}

import { Children, cloneElement, forwardRef, isValidElement, useEffect, useRef, useState } from 'react'
import images from '../images.json'
import { useInView } from '../hooks/useInView'
import { onFrame, reducedMotion } from '../lib/motion'

/** Fades, lifts and un-blurs its content when scrolled into view. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  return (
    <Tag
      ref={ref}
      className={`rv ${inView ? 'in' : ''} ${className}`}
      style={{ '--d': `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Splits text into words that slide up one after another when scrolled into view.
 *  Nested elements (e.g. <em>) keep their styling; their text is split too. */
export function SplitText({ as: Tag = 'h2', className = '', children }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  let i = 0

  const split = (node) =>
    Children.map(node, (child) => {
      if (typeof child === 'string') {
        return child.split(/(\s+)/).map((part, k) => {
          if (!part) return null
          if (/^\s+$/.test(part)) return ' '
          return (
            <span className="w" key={k}>
              <span style={{ '--i': i++ }}>{part}</span>
            </span>
          )
        })
      }
      if (isValidElement(child) && child.props.children) {
        return cloneElement(child, {}, split(child.props.children))
      }
      return child
    })

  return (
    <Tag ref={ref} className={`split ${inView ? 'in' : ''} ${className}`}>
      {split(children)}
    </Tag>
  )
}

/** Label that rolls up on hover of the nearest `.group` parent. */
export function Roll({ children }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}

/** Responsive image: AVIF → WebP → JPG/PNG, with intrinsic size (no layout shift).
 *  `name` is a key of src/images.json; `sizes` tells the browser the rendered width. */
export const Picture = forwardRef(function Picture({ name, alt, sizes = '100vw', priority = false, className = '', ...rest }, ref) {
  const m = images[name]
  if (!m) return null
  const set = (ext) => m.widths.map((w) => `assets/img/${name}-${w}.${ext} ${w}w`).join(', ')
  const last = m.widths.at(-1)
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        ref={ref}
        src={`assets/img/${name}-${last}.${m.fallback}`}
        alt={alt}
        width={m.width}
        height={m.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchpriority={priority ? 'high' : undefined}
        className={className}
        {...rest}
      />
    </picture>
  )
})

/** Image that drifts slower than the page while it is on screen. */
export function ParallaxImage({ name, alt, sizes, className = '', children, ...rest }) {
  const box = useRef(null)
  const img = useRef(null)
  useEffect(() => {
    if (reducedMotion) return
    return onFrame(() => {
      const el = box.current
      if (!el || !img.current) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < 0 || r.top > vh) return
      const p = (r.top + r.height / 2 - vh / 2) / vh
      img.current.style.transform = `translate3d(0, ${p * -8}%, 0) scale(1.18)`
    })
  }, [])
  return (
    <div ref={box} className={`ph relative overflow-hidden rounded bg-bg-2 ${className}`} {...rest}>
      <Picture ref={img} name={name} alt={alt} sizes={sizes} className="h-full w-full object-cover" />
      {children}
    </div>
  )
}

/** Number that counts up from 0 when scrolled into view. */
export function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const [n, setN] = useState(to)
  useEffect(() => {
    if (!inView || reducedMotion) return
    const t0 = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1400)
      setN(Math.round(to * (1 - Math.pow(1 - p, 4))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return (
    <b ref={ref} className="text-[clamp(40px,5vw,64px)] font-normal leading-none tracking-[-.04em] tabular-nums">
      {n}
      {suffix}
    </b>
  )
}

export const ArrowUpRight = ({ className = 'arr', style }) => (
  <svg className={className} style={style} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M1 13 13 1M4 1h9v9" />
  </svg>
)

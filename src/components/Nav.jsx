import { useEffect, useRef, useState } from 'react'
import { person } from '../data'
import { anchorClick, onFrame } from '../lib/motion'
import { Roll } from './motion'

const links = [
  ['#projekty', 'Projekty'],
  ['#o-mnie', 'O mnie'],
  ['#kontakt', 'Kontakt'],
]

export default function Nav() {
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [active, setActive] = useState('')
  const last = useRef(0)

  // Hide on scroll down, show on scroll up; frosted background after the top.
  useEffect(
    () =>
      onFrame(() => {
        const y = window.scrollY
        const dy = y - last.current
        last.current = y
        setSolid(y > 40)
        if (Math.abs(dy) > 2) setHidden(dy > 0 && y > 300)
        let cur = ''
        for (const [href] of links) {
          const el = document.querySelector(href)
          if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) cur = href
        }
        setActive(cur)
      }),
    [],
  )

  return (
    <header
      className={`nav-bar fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-out ${hidden ? '-translate-y-full' : ''} ${solid ? 'solid' : ''}`}
      style={{ paddingTop: `calc(env(safe-area-inset-top, 0px) + ${solid ? 12 : 22}px)` }}
    >
      <div className="wrap flex items-center justify-between gap-4">
        <a href="#top" onClick={anchorClick} className="nav-logo text-[22px] leading-none tracking-[-.03em]" aria-label={`${person.name}, początek strony`}>
          <b>Krzysztof</b> <span className="hollow font-semibold">Gołacki</span>
        </a>
        <nav aria-label="Główna" className="hidden md:block">
          <ul className="m-0 flex list-none gap-9 p-0">
            {links.map(([href, label], i) => (
              <li key={href}>
                <a href={href} onClick={anchorClick} className={`nav-link group inline-flex items-baseline gap-1.5 py-2.5 text-[15px] transition-colors hover:text-fg ${active === href ? 'on text-fg' : 'text-muted'}`}>
                  <span className="text-[11px] tabular-nums text-accent-text">0{i + 1}</span>
                  <Roll>{label}</Roll>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn-fill btn-sm" href="#kontakt" onClick={anchorClick}>
          Napisz do mnie
        </a>
      </div>
    </header>
  )
}

import { useRef, useState } from 'react'
import { contact, person } from '../data'
import { anchorClick } from '../lib/motion'
import { useCallback } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { Reveal, SplitText } from './motion'

export default function Contact() {
  const addr = useRef(null)
  useMagnetic(addr, { x: 0.12, y: 0.25 })
  const foot = useRef(null)
  const giant = useRef(null)
  const rise = useCallback((p) => {
    if (giant.current) giant.current.style.transform = `translate3d(0, ${(1 - Math.min(1, p * 2)) * 45}%, 0)`
  }, [])
  useScrollProgress(foot, rise, 'pass')
  const [label, setLabel] = useState('Kopiuj')

  const copy = () => {
    const select = () => {
      const r = document.createRange()
      r.selectNodeContents(addr.current)
      const s = window.getSelection()
      s.removeAllRanges()
      s.addRange(r)
      setLabel('Zaznaczono')
    }
    try {
      navigator.clipboard.writeText(person.email).then(() => {
        setLabel('Skopiowano')
        setTimeout(() => setLabel('Kopiuj'), 1800)
      }, select)
    } catch {
      select()
    }
  }

  return (
    <section id="kontakt" className="navy navy-bottom relative isolate mt-24 overflow-hidden pt-24 md:mt-36 md:pt-32">
      <div className="wrap">
        <SplitText className="m-0 text-[clamp(32px,10vw,152px)] leading-[.95]">
          {contact.title} <span className="hollow">{contact.accent}</span>
        </SplitText>

        <div className="mt-14 flex flex-wrap items-end justify-between gap-10 border-t border-line pt-8">
          <Reveal as="p" className="m-0 max-w-[44ch] text-[19px] leading-[1.45] text-muted">
            {contact.text}
          </Reveal>
          <Reveal className="flex flex-wrap items-center gap-3.5">
            <a ref={addr} href={`mailto:${person.email}`} className="mail-addr inline-block py-2 transition-transform duration-500 ease-out text-[clamp(24px,3vw,40px)] font-semibold tracking-[-.03em]">
              {person.email}
            </a>
            <button type="button" onClick={copy} aria-live="polite" className="btn btn-sm min-h-[44px]">
              {label}
            </button>
          </Reveal>
        </div>

        <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-line py-10 text-muted">
          <span>© 2026 {person.name}</span>
          <span>Gdańsk</span>
          <a href="#top" onClick={anchorClick} className="underline-sweep inline-block py-3">
            Wróć na górę
          </a>
        </footer>
      </div>
      <div ref={foot} className="giant-wrap" aria-hidden="true">
        <div ref={giant} className="giant">{person.name.split(' ')[1]}</div>
      </div>
    </section>
  )
}

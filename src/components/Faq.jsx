import { faq } from '../data'
import Orbits from './Orbits'
import SectionHead from './SectionHead'

// Native <details>: works without JS, keyboard-accessible, answers stay in the HTML for crawlers and AI search.
export default function Faq() {
  return (
    <section id="faq" className="faq relative isolate overflow-x-clip pt-24 md:pt-36">
      <Orbits className="bottom-[-10%] right-[-12%] hidden h-[640px] w-[640px] lg:block" />
      <div className="wrap">
        <SectionHead ghost="Pytania" title="Krótko" hollow="i konkretnie" />
        <div className="max-w-[820px] border-t border-line">
          {faq.map((f) => (
            <div key={f.q}>
              <details className="border-b border-line">
                <summary className="flex min-h-[44px] items-center justify-between gap-6 py-5">
                  <h3 className="m-0 font-display text-[clamp(18px,1.8vw,21px)] font-semibold tracking-normal">{f.q}</h3>
                  <span className="plus text-2xl font-light leading-none" aria-hidden="true">+</span>
                </summary>
                <p className="mb-6 mt-0 max-w-[62ch] text-[17px] leading-relaxed text-muted">{f.a}</p>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import Ghost from './Ghost'
import { Reveal, SplitText } from './motion'

/** `title` solid, `hollow` continues it in outlined type; `ghost` is the giant sliding word above. */
export default function SectionHead({ title, hollow, ghost, dir, children }) {
  return (
    <div className="mb-10 md:mb-14">
      {ghost && <Ghost dir={dir}>{ghost}</Ghost>}
      <SplitText className="relative m-0 max-w-[18ch] text-[clamp(36px,5.6vw,80px)] leading-[1]">
        {title}
        {hollow && <> <span className="hollow">{hollow}</span></>}
      </SplitText>
      {children && (
        <Reveal as="p" delay={0.15} className="mb-0 mt-6 max-w-[56ch] text-[19px] leading-[1.55] text-muted">
          {children}
        </Reveal>
      )}
    </div>
  )
}

import SplitText from './fx/SplitText'
import Reveal from './fx/Reveal'

export default function SectionHead({ label, title, lead, action, className = '' }) {
  return (
    <div className={`section-head ${className}`}>
      <div className="section-head-main">
        <Reveal as="p" className="label">
          {label}
        </Reveal>
        <SplitText text={title} className="title" />
      </div>
      {(lead || action) && (
        <div className="section-head-side">
          {lead && (
            <Reveal as="p" className="lead" delay={0.1}>
              {lead}
            </Reveal>
          )}
          {action && (
            <Reveal delay={0.18} className="section-head-action">
              {action}
            </Reveal>
          )}
        </div>
      )}
    </div>
  )
}

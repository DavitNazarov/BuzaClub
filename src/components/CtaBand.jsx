import { Link } from 'react-router-dom'
import { useContent } from '../i18n/LanguageContext'
import SplitText from './fx/SplitText'
import Reveal from './fx/Reveal'

export default function CtaBand() {
  const { content } = useContent()
  const { cta } = content

  return (
    <section className="section cta">
      <div className="container cta-inner">
        <Reveal as="p" className="label">
          {cta.label}
        </Reveal>
        <SplitText text={cta.title} className="title cta-title" />
        <Reveal as="p" className="lead" delay={0.1}>
          {cta.text}
        </Reveal>
        <Reveal delay={0.2}>
          <Link className="btn" to="/contact">
            {cta.button}
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

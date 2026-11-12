import { Link } from 'react-router-dom'
import { useContent } from '../i18n/LanguageContext'
import ScrollWords from './fx/ScrollWords'
import Reveal from './fx/Reveal'

export default function Intro() {
  const { content } = useContent()
  const { intro } = content

  return (
    <section className="section intro">
      <div className="container intro-inner">
        <Reveal as="p" className="label">
          {intro.label}
        </Reveal>
        <ScrollWords text={intro.text} className="intro-text" />
        <Reveal delay={0.1}>
          <Link className="link-arrow" to="/team">
            {intro.link}
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

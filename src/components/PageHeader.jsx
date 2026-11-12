import SplitText from './fx/SplitText'
import Reveal from './fx/Reveal'

export default function PageHeader({ label, title, lead }) {
  return (
    <header className="page-header">
      <div className="container">
        <Reveal as="p" className="label" y={12}>
          {label}
        </Reveal>
        <SplitText as="h1" text={title} className="title page-title" immediate delay={0.1} />
        <Reveal as="p" className="lead" delay={0.35}>
          {lead}
        </Reveal>
      </div>
    </header>
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useContent } from '../i18n/LanguageContext'
import SectionHead from './SectionHead'

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const row = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

export default function DisciplineList({ teaser = false }) {
  const { content } = useContent()
  const { disciplines } = content

  return (
    <section className="section disciplines" id="disciplines">
      <div className="container">
        <SectionHead
          label={disciplines.label}
          title={disciplines.title}
          lead={disciplines.lead}
          action={
            teaser && (
              <Link className="link-arrow" to="/training">
                {disciplines.link}
                <span aria-hidden="true">→</span>
              </Link>
            )
          }
        />

        <motion.ul
          className="discipline-list"
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {disciplines.items.map((d, i) => (
            <motion.li key={d.id} className="discipline-row" variants={row}>
              <span className="discipline-index">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="discipline-name">{d.name}</h3>
              <p className="discipline-desc">{d.description}</p>
              <span className="discipline-arrow" aria-hidden="true">
                →
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

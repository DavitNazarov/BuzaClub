import { motion } from 'framer-motion'
import { useContent } from '../i18n/LanguageContext'
import SectionHead from './SectionHead'

export default function Values() {
  const { content } = useContent()
  const { values } = content

  return (
    <section className="section values">
      <div className="container">
        <SectionHead label={values.label} title={values.title} />
        <ul className="values-grid">
          {values.items.map((item, i) => (
            <motion.li
              key={item.title}
              className="value"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="value-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

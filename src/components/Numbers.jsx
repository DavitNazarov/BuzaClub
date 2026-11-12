import { motion } from 'framer-motion'
import { useContent } from '../i18n/LanguageContext'
import Counter from './fx/Counter'

const YEAR = new Date().getFullYear()

export default function Numbers() {
  const { content } = useContent()
  const { stats, established, classDays, minAge, price } = content

  const cells = [
    { id: 'years', value: YEAR - established, label: stats.years, suffix: '+' },
    { id: 'days', value: classDays.length, label: stats.days },
    { id: 'age', value: minAge, label: stats.age, suffix: '+' },
    { id: 'price', value: price, label: stats.price, prefix: '€' },
  ]

  return (
    <section className="numbers" aria-label="Buza Club in numbers">
      <div className="container numbers-grid">
        {cells.map((cell, i) => (
          <motion.div
            key={cell.id}
            className="number"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="number-value">
              <Counter to={cell.value} prefix={cell.prefix} suffix={cell.suffix} />
            </p>
            <p className="number-label">{cell.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

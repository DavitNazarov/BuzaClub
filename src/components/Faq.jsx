import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useContent } from '../i18n/LanguageContext'
import SectionHead from './SectionHead'

export default function Faq() {
  const { content } = useContent()
  const { faq } = content
  const [open, setOpen] = useState(0)

  return (
    <section className="section faq">
      <div className="container faq-grid">
        <SectionHead label={faq.label} title={faq.title} className="faq-head" />

        <ul className="faq-list">
          {faq.items.map((item, i) => {
            const isOpen = open === i
            return (
              <li key={item.q} className="faq-item">
                <h3>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{item.q}</span>
                    <span className={`faq-icon ${isOpen ? 'is-open' : ''}`} aria-hidden="true" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-a-${i}`}
                      className="faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

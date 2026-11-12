import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useContent } from '../i18n/LanguageContext'
import SectionHead from './SectionHead'
import Reveal from './fx/Reveal'
import Counter from './fx/Counter'

const ease = [0.22, 1, 0.36, 1]

export default function Pricing({ compact = false, withHead = true }) {
  const { content } = useContent()
  const { pricing, price } = content

  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        {withHead && (
          <SectionHead
            label={pricing.label}
            title={pricing.title}
            lead={pricing.lead}
            action={
              compact && (
                <Link className="link-arrow" to="/membership">
                  {pricing.link}
                  <span aria-hidden="true">→</span>
                </Link>
              )
            }
          />
        )}

        <div className="pricing-grid">
          <Reveal className="pricing-price" amount={0.3}>
            <p className="price-amount">
              <span className="price-currency">€</span>
              <span className="price-value">
                <Counter to={price} duration={1.6} />
              </span>
            </p>
            <p className="price-period">{pricing.perMonth}</p>
          </Reveal>

          <motion.ul
            className="pricing-includes"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
            }}
          >
            {pricing.includes.map((item) => (
              <motion.li
                key={item}
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
                }}
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>

          <Reveal className="pricing-offer" delay={0.15} amount={0.3}>
            <p className="label">{pricing.offerLabel}</p>
            <p className="offer-title">{pricing.offerTitle}</p>
            <p className="offer-detail">{pricing.offerDetail}</p>
            <Link className="btn btn-red" to="/contact">
              {pricing.cta}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

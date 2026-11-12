import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useContent } from '../i18n/LanguageContext'
import SectionHead from './SectionHead'
import TiltCard from './fx/TiltCard'
import ParallaxImage from './fx/ParallaxImage'

const ease = [0.22, 1, 0.36, 1]

function CoachCard({ coach, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const state = inView ? 'show' : 'hidden'

  return (
    <motion.article
      ref={ref}
      className="coach"
      initial="hidden"
      animate={state}
      variants={{
        hidden: { opacity: 0, y: 50 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, delay: index * 0.15, ease },
        },
      }}
    >
      <TiltCard className="coach-card">
        <motion.div
          className="coach-photo"
          initial="hidden"
          animate={state}
          variants={{
            hidden: { clipPath: 'inset(100% 0 0 0)' },
            show: {
              clipPath: 'inset(0% 0 0 0)',
              transition: { duration: 1.1, delay: 0.1 + index * 0.15, ease },
            },
          }}
        >
          <ParallaxImage
            src={coach.image}
            alt={`${coach.name} — ${coach.role}`}
            position={coach.position}
            range={7}
          />
          <span className="coach-num" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </motion.div>

        <div className="coach-info">
          <p className="coach-role">{coach.role}</p>
          <h3 className="coach-name">{coach.name}</h3>
          <p className="coach-bio">{coach.bio}</p>
          <motion.ul
            className="coach-tags"
            initial="hidden"
            animate={state}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07, delayChildren: 0.6 } },
            }}
          >
            {coach.tags.map((tag) => (
              <motion.li
                key={tag}
                variants={{
                  hidden: { opacity: 0, scale: 0.7 },
                  show: {
                    opacity: 1,
                    scale: 1,
                    transition: { type: 'spring', stiffness: 320, damping: 18 },
                  },
                }}
              >
                {tag}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </TiltCard>
    </motion.article>
  )
}

export default function CoachGrid({ teaser = false, withHead = true }) {
  const { content } = useContent()
  const { coaches } = content
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // big outlined word that travels sideways as you scroll
  const bgX = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ['0%', '0%'] : ['18%', '-32%'],
  )

  return (
    <section className="section coaches is-dark" id="coaches" ref={ref}>
      <motion.p className="coaches-bgword" style={{ x: bgX }} aria-hidden="true">
        {coaches.bgWord}
      </motion.p>

      <div className="container coaches-inner">
        {withHead && (
          <SectionHead
            label={coaches.label}
            title={coaches.title}
            lead={coaches.lead}
            action={
              teaser && (
                <Link className="link-arrow link-arrow--light" to="/team">
                  {coaches.link}
                  <span aria-hidden="true">→</span>
                </Link>
              )
            }
          />
        )}
        <div className="coaches-grid">
          {coaches.items.map((coach, i) => (
            <CoachCard key={coach.id} coach={coach} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

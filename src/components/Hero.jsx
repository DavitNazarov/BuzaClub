import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useContent } from '../i18n/LanguageContext'
import SplitText from './fx/SplitText'

const ease = [0.22, 1, 0.36, 1]

export default function Hero() {
  const { content } = useContent()
  const { hero, name, images } = content
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()

  // The hero is sticky: the rest of the page slides over it while the photo
  // drifts down slower than the scroll, zooms and darkens — it "goes under".
  const imgY = useTransform(scrollY, [0, 900], [0, reduce ? 0 : 130])
  const imgScale = useTransform(scrollY, [0, 900], [1.05, reduce ? 1.05 : 1.2])
  const contentY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -110])
  const contentOpacity = useTransform(scrollY, [0, 480], [1, 0])
  const dim = useTransform(scrollY, [0, 760], [0, 0.88])

  return (
    <section className="hero" id="top" aria-label={name}>
      <div className="hero-media" aria-hidden="true">
        <motion.img
          src={images.hero}
          alt=""
          className="hero-img"
          fetchPriority="high"
          style={{ y: imgY, scale: imgScale }}
        />
        <div className="hero-shade" />
        <div className="hero-grain" />
        <motion.div className="hero-dim" style={{ opacity: dim }} />
        <span className="hero-slash hero-slash--a" />
        <span className="hero-slash hero-slash--b" />
      </div>

      <motion.div
        className="container hero-content"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <SplitText
          as="h1"
          by="chars"
          text={name.toUpperCase()}
          className="hero-brand"
          immediate
          delay={0.15}
        />

        <motion.p
          className="hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease }}
        >
          {hero.tagline}
        </motion.p>

        <motion.p
          className="hero-lead"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.88, ease }}
        >
          {hero.label}
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1, ease }}
        >
          <Link className="btn btn-red btn-shine" to="/contact">
            {hero.ctaPrimary}
          </Link>
          <Link className="btn btn-outline-light" to="/training">
            {hero.ctaSecondary}
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="scroll-cue"
        style={{ opacity: contentOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        aria-hidden="true"
      >
        <span>{hero.scroll}</span>
        <i />
      </motion.div>
    </section>
  )
}

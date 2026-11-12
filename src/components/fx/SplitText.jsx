import { Fragment } from 'react'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const item = {
  hidden: { y: '115%', rotate: 4 },
  show: { y: '0%', rotate: 0, transition: { duration: 0.8, ease } },
}

/**
 * Masked word / letter reveal. `immediate` plays on mount (hero),
 * otherwise it plays once when scrolled into view.
 */
export default function SplitText({
  text,
  as = 'h2',
  by = 'words',
  className,
  delay = 0,
  immediate = false,
  stagger,
}) {
  const Tag = motion[as]
  const step = stagger ?? (by === 'chars' ? 0.04 : 0.07)
  const words = text.split(' ')

  const trigger = immediate
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, amount: 0.5 } }

  return (
    <Tag
      className={className}
      aria-label={text}
      initial="hidden"
      {...trigger}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: step, delayChildren: delay } },
      }}
    >
      {words.map((word, wi) => (
        <Fragment key={`${word}-${wi}`}>
          <span className="split-word" aria-hidden="true">
            {by === 'chars' ? (
              [...word].map((char, ci) => (
                <span className="split-mask" key={ci}>
                  <motion.span className="split-inner" variants={item}>
                    {char}
                  </motion.span>
                </span>
              ))
            ) : (
              <span className="split-mask">
                <motion.span className="split-inner" variants={item}>
                  {word}
                </motion.span>
              </span>
            )}
          </span>
          {wi < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  )
}

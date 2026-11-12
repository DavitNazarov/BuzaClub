import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

function Word({ word, progress, range, reduce }) {
  const opacity = useTransform(progress, range, reduce ? [1, 1] : [0.16, 1])
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>{' '}
    </>
  )
}

/** Statement text whose words light up one by one as you scroll. */
export default function ScrollWords({ text, className }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.5'],
  })
  const words = text.split(' ')

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          word={word}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          reduce={reduce}
        />
      ))}
    </p>
  )
}

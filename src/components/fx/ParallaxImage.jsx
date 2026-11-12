import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/** Image that drifts inside its frame as the page scrolls. */
export default function ParallaxImage({
  src,
  alt = '',
  className = '',
  position = 'center',
  range = 8,
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ['0%', '0%'] : [`-${range}%`, `${range}%`],
  )

  return (
    <div ref={ref} className={`parallax-frame ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ y, objectPosition: position }}
      />
    </div>
  )
}

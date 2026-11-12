import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'

function canTilt() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1000px)')
      .matches
  )
}

export default function TiltCard({ children, className, max = 7 }) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 180, damping: 18, mass: 0.6 }
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring)
  const glareX = useTransform(px, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(py, [-0.5, 0.5], ['0%', '100%'])

  const onMove = (e) => {
    if (reduce || e.pointerType === 'touch' || !canTilt()) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
      <motion.span
        className="tilt-glare"
        aria-hidden="true"
        style={{ '--gx': glareX, '--gy': glareY }}
      />
    </motion.div>
  )
}

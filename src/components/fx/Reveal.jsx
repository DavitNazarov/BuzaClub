import { motion } from 'framer-motion'

export default function Reveal({
  children,
  as = 'div',
  className,
  delay = 0,
  y = 28,
  x = 0,
  amount = 0.25,
  ...rest
}) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

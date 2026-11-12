import { useEffect } from 'react'
import Lenis from 'lenis'
import { setLenis } from '../../lib/smoothScroll'

/** Smooth, slow, inertial page scrolling (mouse wheel / trackpad). */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.85,
      touchMultiplier: 1,
    })
    setLenis(lenis)

    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    })

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return null
}

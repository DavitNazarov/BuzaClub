import { Suspense, lazy, useEffect, useRef, useState } from 'react'

/**
 * True once the element has come within `rootMargin` of the viewport.
 * Stays true afterwards, so a section is only ever loaded once.
 * Browsers without IntersectionObserver just get everything straight away.
 */
function useNearViewport(rootMargin) {
  const ref = useRef(null)
  const [near, setNear] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )

  useEffect(() => {
    const node = ref.current
    if (near || !node) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [near, rootMargin])

  return [ref, near]
}

/**
 * Wrap a section so that neither its code nor its images/animations are
 * loaded until the visitor scrolls close to it.
 *
 *   const Pricing = lazySection(() => import('./Pricing'), { minHeight: '90vh' })
 *
 * `minHeight` reserves space while the section is not loaded yet so the
 * scrollbar and layout don't jump around. `rootMargin` is how far ahead of
 * the viewport loading starts (a bit generous so it is ready before it shows).
 */
export function lazySection(
  loader,
  { minHeight = '70vh', rootMargin = '600px 0px' } = {},
) {
  const Section = lazy(loader)

  function LazySection(props) {
    const [ref, near] = useNearViewport(rootMargin)
    const placeholder = <div aria-hidden="true" style={{ minHeight }} />

    return (
      <div ref={ref}>
        {near ? <Suspense fallback={placeholder}><Section {...props} /></Suspense> : placeholder}
      </div>
    )
  }

  return LazySection
}

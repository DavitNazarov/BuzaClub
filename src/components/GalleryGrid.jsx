import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useContent } from '../i18n/LanguageContext'
import Reveal from './fx/Reveal'

export default function GalleryGrid() {
  const { content } = useContent()
  const { photos, gallery, ui } = content
  const alts = gallery.alts
  const [active, setActive] = useState(null)
  const closeRef = useRef(null)
  const lastFocus = useRef(null)

  const close = useCallback(() => setActive(null), [])
  const step = useCallback(
    (dir) =>
      setActive((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  )

  useEffect(() => {
    if (active === null) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      lastFocus.current?.focus()
    }
  }, [active, close, step])

  return (
    <section className="section gallery">
      <div className="container">
        <ul className="gallery-grid">
          {photos.map((photo, i) => (
            <Reveal as="li" key={photo.src} className="gallery-item" delay={(i % 3) * 0.08} y={36}>
              <button
                type="button"
                className="gallery-btn photo-mono"
                aria-label={alts?.[i]}
                onClick={(e) => {
                  lastFocus.current = e.currentTarget
                  setActive(i)
                }}
              >
                <img
                  src={photo.src}
                  alt={alts?.[i] ?? ''}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="lightbox"
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label={alts?.[active]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          >
            <button
              ref={closeRef}
              type="button"
              className="lightbox-close"
              aria-label={ui.close}
              onClick={close}
            >
              <span />
              <span />
            </button>
            <button
              type="button"
              className="lightbox-nav lightbox-nav--prev"
              aria-label={ui.previous}
              onClick={(e) => {
                e.stopPropagation()
                step(-1)
              }}
            >
              ←
            </button>
            <motion.img
              key={photos[active].src}
              src={photos[active].src}
              alt={alts?.[active] ?? ''}
              className="lightbox-img"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="lightbox-nav lightbox-nav--next"
              aria-label={ui.next}
              onClick={(e) => {
                e.stopPropagation()
                step(1)
              }}
            >
              →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

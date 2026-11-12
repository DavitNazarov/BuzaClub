import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '../i18n/LanguageContext'

export default function Header() {
  const { content, lang, setLang, languages } = useContent()
  const { ui, nav, name, established } = content
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // transparent over the home hero, solid blue everywhere else
  const solid = (!isHome || scrolled) && !open

  return (
    <>
      <header className={`site-header ${solid ? 'is-solid' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="logo" aria-label={ui.homeLabel}>
            <span className="logo-mark" aria-hidden="true" />
            <span className="logo-text">
              <span className="logo-name">{name}</span>
              <span className="logo-sub">Est. {established}</span>
            </span>
          </Link>

          <nav className="nav-desktop" aria-label={ui.mainNav}>
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-tools">
            <div className="lang-switch" role="group" aria-label={ui.language}>
              {languages.map((code) => (
                <button
                  key={code}
                  type="button"
                  className={code === lang ? 'is-active' : ''}
                  aria-pressed={code === lang}
                  onClick={() => setLang(code)}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            <Link className="btn btn-red header-cta" to="/contact">
              {ui.joinCta}
            </Link>

            <button
              type="button"
              className={`nav-toggle ${open ? 'is-open' : ''}`}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? ui.menuClose : ui.menuOpen}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            className="nav-mobile"
            data-lenis-prevent
            aria-label={ui.mobileNav}
            initial={{ clipPath: 'circle(0% at 90% 4%)' }}
            animate={{ clipPath: 'circle(150% at 90% 4%)' }}
            exit={{ clipPath: 'circle(0% at 90% 4%)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {nav.map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.05, duration: 0.45 }}
              >
                <NavLink to={item.to} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
            <Link
              className="btn btn-red"
              to="/contact"
              onClick={() => setOpen(false)}
            >
              {ui.joinCta}
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

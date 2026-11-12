import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { LanguageProvider } from './i18n/LanguageContext'
import Seo from './components/Seo'
import ScrollProgress from './components/fx/ScrollProgress'
import SmoothScroll from './components/fx/SmoothScroll'
import { scrollToTop } from './lib/smoothScroll'
import 'lenis/dist/lenis.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import './App.css'

// Other pages are separate chunks, downloaded when first visited.
const Training = lazy(() => import('./pages/Training'))
const Team = lazy(() => import('./pages/Team'))
const Membership = lazy(() => import('./pages/Membership'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={scrollToTop}
    >
      <motion.main
        key={location.pathname}
        className="page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Suspense fallback={<div className="route-loading" aria-hidden="true" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/training" element={<Training />} />
            <Route path="/team" element={<Team />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </motion.main>
    </AnimatePresence>
  )
}

function App() {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <Seo />
        <SmoothScroll />
        <ScrollProgress />
        <Header />
        <AnimatedRoutes />
        <Footer />
      </MotionConfig>
    </LanguageProvider>
  )
}

export default App

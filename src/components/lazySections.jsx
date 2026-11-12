import { lazySection } from './fx/LazySection'

// Below-the-fold sections. Each one is split into its own JS chunk and is only
// loaded (code + images) when the visitor scrolls near it. `minHeight` is just
// a rough guess of the section's height so the page doesn't jump while waiting.
export const LazyImageBand = lazySection(() => import('./ImageBand'), { minHeight: '70vh' })
export const LazyMarquee = lazySection(() => import('./Marquee'), { minHeight: '8rem' })
export const LazyNumbers = lazySection(() => import('./Numbers'), { minHeight: '60vh' })
export const LazyCoachGrid = lazySection(() => import('./CoachGrid'), { minHeight: '120vh' })
export const LazyPricing = lazySection(() => import('./Pricing'), { minHeight: '100vh' })
export const LazyCtaBand = lazySection(() => import('./CtaBand'), { minHeight: '60vh' })
export const LazyGroups = lazySection(() => import('./Groups'), { minHeight: '100vh' })
export const LazySchedule = lazySection(() => import('./Schedule'), { minHeight: '80vh' })
export const LazyValues = lazySection(() => import('./Values'), { minHeight: '80vh' })
export const LazyFaq = lazySection(() => import('./Faq'), { minHeight: '80vh' })

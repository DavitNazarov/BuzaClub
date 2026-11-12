import Hero from '../components/Hero'
import Intro from '../components/Intro'
import DisciplineList from '../components/DisciplineList'
import {
  LazyCoachGrid,
  LazyCtaBand,
  LazyImageBand,
  LazyMarquee,
  LazyNumbers,
  LazyPricing,
} from '../components/lazySections'

export default function Home() {
  return (
    <>
      <Hero />
      {/* everything below slides over the sticky hero */}
      <div className="cover">
        <Intro />
        <DisciplineList teaser />
        <LazyImageBand />
        <LazyMarquee />
        <LazyNumbers />
        <LazyCoachGrid teaser />
        <LazyPricing compact />
        <LazyCtaBand />
      </div>
    </>
  )
}

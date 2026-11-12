import { useContent } from '../i18n/LanguageContext'
import PageHeader from '../components/PageHeader'
import CoachGrid from '../components/CoachGrid'
import { LazyCtaBand, LazyImageBand, LazyValues } from '../components/lazySections'

export default function Team() {
  const { content } = useContent()
  return (
    <>
      <PageHeader {...content.pages.team} />
      <CoachGrid withHead={false} />
      <LazyImageBand />
      <LazyValues />
      <LazyCtaBand />
    </>
  )
}

import { useContent } from '../i18n/LanguageContext'
import PageHeader from '../components/PageHeader'
import DisciplineList from '../components/DisciplineList'
import { LazyCtaBand, LazyGroups, LazySchedule } from '../components/lazySections'

export default function Training() {
  const { content } = useContent()
  return (
    <>
      <PageHeader {...content.pages.training} />
      <DisciplineList />
      <LazyGroups />
      <LazySchedule />
      <LazyCtaBand />
    </>
  )
}

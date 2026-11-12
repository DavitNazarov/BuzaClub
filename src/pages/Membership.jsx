import { useContent } from '../i18n/LanguageContext'
import PageHeader from '../components/PageHeader'
import Pricing from '../components/Pricing'
import { LazyCtaBand, LazyFaq } from '../components/lazySections'

export default function Membership() {
  const { content } = useContent()
  return (
    <>
      <PageHeader {...content.pages.membership} />
      <Pricing withHead={false} />
      <LazyFaq />
      <LazyCtaBand />
    </>
  )
}

import { useContent } from '../i18n/LanguageContext'
import PageHeader from '../components/PageHeader'
import ContactSection from '../components/ContactSection'

export default function Contact() {
  const { content } = useContent()
  return (
    <>
      <PageHeader {...content.pages.contact} />
      <ContactSection />
    </>
  )
}

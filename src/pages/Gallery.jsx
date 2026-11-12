import { useContent } from '../i18n/LanguageContext'
import PageHeader from '../components/PageHeader'
import GalleryGrid from '../components/GalleryGrid'
import { LazyCtaBand } from '../components/lazySections'

export default function Gallery() {
  const { content } = useContent()
  return (
    <>
      <PageHeader {...content.pages.gallery} />
      <GalleryGrid />
      <LazyCtaBand />
    </>
  )
}

import { useContent } from '../i18n/LanguageContext'
import ParallaxImage from './fx/ParallaxImage'
import Reveal from './fx/Reveal'

export default function ImageBand() {
  const { content } = useContent()
  const { images, band, gallery } = content

  return (
    <section className="band">
      <div className="container">
        <Reveal className="band-frame photo-mono" y={40} amount={0.15}>
          <ParallaxImage src={images.team} alt={gallery.alts[0]} position="center 30%" range={6} />
        </Reveal>
        <Reveal as="p" className="band-caption" delay={0.1}>
          {band.caption}
        </Reveal>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { useContent } from '../i18n/LanguageContext'
import SectionHead from './SectionHead'
import ParallaxImage from './fx/ParallaxImage'

export default function Groups() {
  const { content } = useContent()
  const { groups } = content

  return (
    <section className="section groups" id="groups">
      <div className="container">
        <SectionHead label={groups.label} title={groups.title} lead={groups.lead} />

        <div className="groups-grid">
          {groups.items.map((group, index) => (
            <motion.article
              key={group.id}
              className="group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="group-media photo-mono">
                <ParallaxImage src={group.image} position={group.position} range={7} />
              </div>
              <div className="group-copy">
                <p className="group-audience">{group.audience}</p>
                <h3>{group.name}</h3>
                <p>{group.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

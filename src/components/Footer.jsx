import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useContent } from '../i18n/LanguageContext'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const { content } = useContent()
  const { name, fullName, established, info, footer, nav } = content

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col footer-brand">
          <p className="footer-name">{name}</p>
          <p className="footer-muted">{fullName}</p>
        </div>

        <div className="footer-col">
          <p className="footer-title">{footer.explore}</p>
          <ul>
            {nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-title">{footer.visit}</p>
          <address>
            {info.address.street}
            <br />
            {info.address.zip} {info.address.city}
            <br />
            <a href={info.phoneHref}>{info.phone}</a>
            <br />
            <a href={`mailto:${info.email}`}>{info.email}</a>
          </address>
        </div>
      </div>

      <motion.p
        className="footer-giant"
        aria-hidden="true"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        BUZA CLUB
      </motion.p>

      <div className="container footer-bottom">
        <p>
          © {YEAR} {name} · Est. {established}
        </p>
        <p>{footer.rights}</p>
      </div>
    </footer>
  )
}

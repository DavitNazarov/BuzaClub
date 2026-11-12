import { useState } from 'react'
import { useContent } from '../i18n/LanguageContext'
import Reveal from './fx/Reveal'
import ParallaxImage from './fx/ParallaxImage'

export default function ContactSection() {
  const { content } = useContent()
  const { info, images } = content
  const t = content.contact
  const { address, phone, phoneHref, email, facebook, mapsUrl } = info
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    const subject = `${t.form.subject} ${form.name}`.trim()
    const body = `${form.message}\n\n— ${form.name} (${form.email})`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="section contact">
      <div className="container contact-grid">
        <div className="contact-left">
          <Reveal as="address" className="contact-details">
            <p>
              <span className="contact-key">{t.address}</span>
              <span>
                {address.street}
                <br />
                {address.zip} {address.city}
                <br />
                {t.country}
              </span>
            </p>
            <p>
              <span className="contact-key">{t.phone}</span>
              <a href={phoneHref}>{phone}</a>
            </p>
            <p>
              <span className="contact-key">{t.email}</span>
              <a href={`mailto:${email}`}>{email}</a>
            </p>
            <p>
              <span className="contact-key">{t.facebook}</span>
              <span>{facebook}</span>
            </p>
          </Reveal>

          <Reveal className="contact-actions" delay={0.1}>
            <a className="btn" href={phoneHref}>
              {t.callCta}
            </a>
            <a className="btn btn-ghost" href={mapsUrl} target="_blank" rel="noreferrer">
              {t.routeCta}
            </a>
          </Reveal>

          <Reveal className="contact-poster-wrap" delay={0.15} amount={0.15}>
            <div className="contact-poster">
              <ParallaxImage src={images.poster} alt={t.posterAlt} position="center 40%" range={5} />
            </div>
            <p className="contact-caption">{t.posterCaption}</p>
          </Reveal>
        </div>

        <Reveal className="contact-right" delay={0.1} amount={0.1}>
          <form className="form" onSubmit={onSubmit}>
            <h2 className="form-title">{t.form.title}</h2>

            <label className="field">
              <span>{t.form.name}</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                value={form.name}
                onChange={update('name')}
              />
            </label>
            <label className="field">
              <span>{t.form.email}</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={update('email')}
              />
            </label>
            <label className="field">
              <span>{t.form.message}</span>
              <textarea
                name="message"
                rows="5"
                required
                value={form.message}
                onChange={update('message')}
              />
            </label>

            <button type="submit" className="btn">
              {t.form.send}
            </button>
            <p className="form-hint">{t.form.hint}</p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

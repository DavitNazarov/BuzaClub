import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import shared from '../data/club.json'
import { useContent } from '../i18n/LanguageContext'
import { buildJsonLd, buildMeta, findRoute, routes, serializeJsonLd } from '../lib/seo'

const SITE_URL = (import.meta.env.VITE_SITE_URL || shared.siteUrl).replace(/\/+$/, '')

function upsert(tag, attr, key, content) {
  let el = document.head.querySelector(`${tag}[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement(tag)
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute(tag === 'link' ? 'href' : 'content', content)
}

/**
 * The static HTML already carries the right tags for the landing URL. This
 * keeps them correct while the visitor navigates and switches language.
 */
export default function Seo() {
  const { pathname } = useLocation()
  const { lang } = useContent()

  useEffect(() => {
    const route = findRoute(pathname)
    const meta = buildMeta(route ?? routes[0], lang, SITE_URL, { noindex: !route })

    document.documentElement.lang = lang
    document.title = meta.title
    for (const t of meta.tags) upsert('meta', t.attr, t.key, t.content)
    upsert('link', 'rel', 'canonical', meta.canonical)

    let ld = document.getElementById('seo-jsonld')
    if (!ld) {
      ld = document.createElement('script')
      ld.type = 'application/ld+json'
      ld.id = 'seo-jsonld'
      document.head.appendChild(ld)
    }
    ld.textContent = serializeJsonLd(buildJsonLd(route ?? routes[0], lang, SITE_URL))
  }, [pathname, lang])

  return null
}

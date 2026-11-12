// Single source of truth for everything search engines, AI assistants and
// link-preview scrapers need to know about a page. Pure functions only (no DOM)
// so the same code runs in the browser AND in the build-time prerenderer
// (scripts/seo/plugin.js).
import shared from '../data/club.json'
import en from '../data/en.json'
import de from '../data/de.json'

export const DICTIONARIES = { en, de }
// Language that is baked into the static HTML (what crawlers and link
// previews see). Visitors still get their own language once the app loads.
export const DEFAULT_LANG = 'de'

export const OG_IMAGE = { width: 1200, height: 630, type: 'image/jpeg' }

const LOCALES = { de: 'de_DE', en: 'en_US' }
const ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

export const routes = [
  { key: 'home', path: '/', pageType: 'WebPage', priority: 1.0, changefreq: 'weekly' },
  { key: 'training', path: '/training', pageType: 'WebPage', priority: 0.9, changefreq: 'monthly' },
  { key: 'membership', path: '/membership', pageType: 'WebPage', priority: 0.9, changefreq: 'monthly' },
  { key: 'team', path: '/team', pageType: 'AboutPage', priority: 0.7, changefreq: 'monthly' },
  { key: 'contact', path: '/contact', pageType: 'ContactPage', priority: 0.8, changefreq: 'yearly' },
  { key: 'gallery', path: '/gallery', pageType: 'ImageGallery', priority: 0.5, changefreq: 'monthly' },
].map((r) => ({ ...r, image: `/og/${r.key}.jpg` }))

export function content(lang) {
  return { ...shared, ...DICTIONARIES[lang] }
}

export function findRoute(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/'
  return routes.find((r) => r.path === clean) ?? null
}

const trim = (url) => url.replace(/\/+$/, '')
export const absolute = (siteUrl, path) => `${trim(siteUrl)}${path}`

function pageText(route, lang) {
  const c = content(lang)
  return route.key === 'home' ? c.meta : c.meta.pages[route.key]
}

/** Title, description, canonical and every <meta> tag for one page + language. */
export function buildMeta(route, lang, siteUrl, { noindex = false } = {}) {
  const c = content(lang)
  const { title, description } = pageText(route, lang)
  const url = absolute(siteUrl, route.path)
  const image = absolute(siteUrl, route.image)
  const other = lang === 'de' ? 'en' : 'de'

  const tags = [
    ['name', 'description', description],
    ['name', 'robots', noindex ? 'noindex, follow' : ROBOTS],
    ['property', 'og:type', 'website'],
    ['property', 'og:site_name', c.name],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', url],
    ['property', 'og:image', image],
    ['property', 'og:image:secure_url', image],
    ['property', 'og:image:type', OG_IMAGE.type],
    ['property', 'og:image:width', String(OG_IMAGE.width)],
    ['property', 'og:image:height', String(OG_IMAGE.height)],
    ['property', 'og:image:alt', title],
    ['property', 'og:locale', LOCALES[lang]],
    ['property', 'og:locale:alternate', LOCALES[other]],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
    ['name', 'twitter:image', image],
    ['name', 'twitter:image:alt', title],
  ].map(([attr, key, value]) => ({ attr, key, content: value }))

  return { title, description, canonical: url, tags }
}

/** schema.org graph: the club, the site, this page, breadcrumbs, FAQ, gallery. */
export function buildJsonLd(route, lang, siteUrl) {
  const c = content(lang)
  const site = trim(siteUrl)
  const { address, email, mapsUrl } = c.info
  const clubId = `${site}/#club`
  const siteId = `${site}/#website`
  const pageUrl = absolute(siteUrl, route.path)
  const pageId = `${pageUrl}#webpage`
  const { title, description } = pageText(route, lang)
  const img = (src) => absolute(siteUrl, src)

  const coaches = c.coaches.items.map((coach) => ({
    '@type': 'Person',
    '@id': `${site}/team#${coach.id}`,
    name: coach.name,
    jobTitle: coach.role,
    description: coach.bio,
    image: img(coach.image),
    knowsAbout: coach.tags,
    worksFor: { '@id': clubId },
  }))

  const offer = (name, price, description) => ({
    '@type': 'Offer',
    name,
    description,
    price: String(price),
    priceCurrency: c.currency,
    availability: 'https://schema.org/InStock',
    url: absolute(siteUrl, '/membership'),
    itemOffered: {
      '@type': 'Service',
      name: c.pricing.includes[0],
      serviceType: c.disciplines.items.map((d) => d.name).join(', '),
      provider: { '@id': clubId },
    },
  })

  const club = {
    '@type': ['SportsClub', 'LocalBusiness'],
    '@id': clubId,
    name: c.name,
    alternateName: c.fullName,
    description: c.meta.description,
    url: `${site}/`,
    image: [img(routes[0].image), ...c.photos.map((p) => img(p.src))],
    logo: img('/icon-512.png'),
    foundingDate: String(c.established),
    telephone: c.info.phoneHref.replace(/^tel:/, ''),
    email,
    priceRange: `€${c.price} / ${lang === 'de' ? 'Monat' : 'month'}`,
    currenciesAccepted: c.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      postalCode: address.zip,
      addressLocality: address.city,
      addressRegion: 'Kärnten',
      addressCountry: 'AT',
    },
    hasMap: mapsUrl,
    areaServed: { '@type': 'City', name: address.city },
    knowsLanguage: ['de', 'en'],
    slogan: c.hero.tagline,
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: c.minAge,
      description: c.groups.lead,
    },
    knowsAbout: c.disciplines.items.map((d) => d.name),
    makesOffer: [
      offer(
        lang === 'de' ? 'Mitgliedschaft' : 'Membership',
        c.price,
        c.pricing.lead,
      ),
      offer(c.pricing.offerTitle, 0, c.pricing.offerDetail),
    ],
    employee: coaches,
  }

  const website = {
    '@type': 'WebSite',
    '@id': siteId,
    url: `${site}/`,
    name: c.name,
    inLanguage: ['de', 'en'],
    publisher: { '@id': clubId },
  }

  const page = {
    '@type': route.pageType,
    '@id': pageId,
    url: pageUrl,
    name: title,
    description,
    inLanguage: lang,
    isPartOf: { '@id': siteId },
    about: { '@id': clubId },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: img(route.image),
      width: OG_IMAGE.width,
      height: OG_IMAGE.height,
    },
  }

  const graph = [club, website, page]

  if (route.key !== 'home') {
    page.breadcrumb = { '@id': `${pageUrl}#breadcrumb` }
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: c.name, item: `${site}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: c.pages[route.key].label,
          item: pageUrl,
        },
      ],
    })
  }

  if (route.key === 'membership') {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      inLanguage: lang,
      mainEntity: c.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    })
    page.mainEntity = { '@id': `${pageUrl}#faq` }
  }

  if (route.key === 'gallery') {
    page.image = c.photos.map((p, i) => ({
      '@type': 'ImageObject',
      contentUrl: img(p.src),
      width: p.width,
      height: p.height,
      caption: c.gallery.alts[i],
      description: c.gallery.alts[i],
    }))
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

// JSON inside <script> must never contain a literal "</script" or "<!--".
export const serializeJsonLd = (data) =>
  JSON.stringify(data).replace(/</g, '\\u003c').replace(/\u2028|\u2029/g, '')

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** The page-specific part of <head>, as an HTML string (used at build time). */
export function renderHead(route, lang, siteUrl) {
  const meta = buildMeta(route, lang, siteUrl)
  const lines = [
    `<title>${esc(meta.title)}</title>`,
    ...meta.tags.map((t) => `<meta ${t.attr}="${t.key}" content="${esc(t.content)}" />`),
    `<link rel="canonical" href="${esc(meta.canonical)}" />`,
    `<script type="application/ld+json" id="seo-jsonld">${serializeJsonLd(
      buildJsonLd(route, lang, siteUrl),
    )}</script>`,
  ]
  return lines.join('\n    ')
}

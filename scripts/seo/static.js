// Build-time generators: crawlable HTML for each route, robots.txt, sitemap.xml
// and llms.txt. Everything is derived from src/data/*.json, so editing the
// content files updates SEO automatically.
import { DEFAULT_LANG, absolute, content, routes } from '../../src/lib/seo.js'

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const dayNames = (c) => c.classDays.map((d) => c.schedule.days[[1, 3, 5].indexOf(d)]?.full).filter(Boolean)

function disciplines(c) {
  return `<section><h2>${esc(c.disciplines.title)}</h2><p>${esc(c.disciplines.lead)}</p><ul>${c.disciplines.items
    .map((d) => `<li><h3>${esc(d.name)}</h3><p>${esc(d.description)}</p></li>`)
    .join('')}</ul></section>`
}

function groups(c) {
  return `<section><h2>${esc(c.groups.title)}</h2><p>${esc(c.groups.lead)}</p><ul>${c.groups.items
    .map((g) => `<li><h3>${esc(g.name)} — ${esc(g.audience)}</h3><p>${esc(g.description)}</p></li>`)
    .join('')}</ul></section>`
}

function schedule(c) {
  return `<section><h2>${esc(c.schedule.title)}</h2><p>${esc(c.schedule.lead)}</p><ul>${dayNames(c)
    .map((d) => `<li>${esc(d)}: ${esc(c.schedule.from)} ${esc(c.startTime)}</li>`)
    .join('')}</ul><p>${esc(c.schedule.privateTitle)}: ${esc(c.schedule.privateNote)}</p></section>`
}

function coaches(c) {
  return `<section><h2>${esc(c.coaches.title)}</h2><p>${esc(c.coaches.lead)}</p><ul>${c.coaches.items
    .map(
      (p) =>
        `<li><h3>${esc(p.name)} — ${esc(p.role)}</h3><p>${esc(p.bio)}</p><p>${esc(p.tags.join(', '))}</p></li>`,
    )
    .join('')}</ul></section>`
}

function values(c) {
  return `<section><h2>${esc(c.values.title)}</h2><ul>${c.values.items
    .map((v) => `<li><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></li>`)
    .join('')}</ul></section>`
}

function pricing(c) {
  const p = c.pricing
  return `<section><h2>${esc(p.title)}</h2><p>${esc(p.lead)}</p><p><strong>€${c.price} ${esc(
    p.perMonth,
  )}</strong></p><ul>${p.includes.map((i) => `<li>${esc(i)}</li>`).join('')}</ul><h3>${esc(
    p.offerTitle,
  )}</h3><p>${esc(p.offerDetail)}</p></section>`
}

function faq(c) {
  return `<section><h2>${esc(c.faq.title)}</h2>${c.faq.items
    .map((i) => `<h3>${esc(i.q)}</h3><p>${esc(i.a)}</p>`)
    .join('')}</section>`
}

function gallery(c) {
  return `<section><ul>${c.photos
    .map(
      (p, i) =>
        `<li><img src="${esc(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(
          c.gallery.alts[i],
        )}" loading="lazy" /></li>`,
    )
    .join('')}</ul></section>`
}

function contact(c) {
  const { address, phone, phoneHref, email, mapsUrl } = c.info
  return `<section><h2>${esc(c.contact.label)}</h2><address>${esc(c.fullName)}<br />${esc(address.street)}<br />${esc(
    address.zip,
  )} ${esc(address.city)}<br />${esc(c.contact.country)}<br /><a href="${esc(phoneHref)}">${esc(
    phone,
  )}</a><br /><a href="mailto:${esc(email)}">${esc(email)}</a></address><p><a href="${esc(mapsUrl)}">${esc(
    c.contact.routeCta,
  )}</a></p></section>`
}

const sections = {
  home: (c) => [
    `<section><h2>${esc(c.intro.label)}</h2><p>${esc(c.intro.text)}</p></section>`,
    disciplines(c),
    coaches(c),
    pricing(c),
    schedule(c),
    contact(c),
  ],
  training: (c) => [disciplines(c), groups(c), schedule(c)],
  team: (c) => [coaches(c), values(c)],
  membership: (c) => [pricing(c), faq(c)],
  gallery: (c) => [gallery(c)],
  contact: (c) => [contact(c)],
}

/**
 * Plain semantic HTML for the page. It sits inside #root so crawlers and AI
 * bots that never run JavaScript still read real content; React replaces it
 * as soon as the app mounts. It is visually hidden (see index.html).
 */
export function renderBody(route, lang = DEFAULT_LANG) {
  const c = content(lang)
  const heading =
    route.key === 'home'
      ? `${c.name} — ${c.hero.label}`
      : `${c.pages[route.key].title}`
  const lead = route.key === 'home' ? c.hero.tagline : c.pages[route.key].lead

  return `<div class="seo-static">
      <header>
        <p><a href="/">${esc(c.name)}</a> — ${esc(c.fullName)}</p>
        <nav aria-label="${esc(c.ui.mainNav)}"><ul>${c.nav
          .map((n) => `<li><a href="${esc(n.to)}">${esc(n.label)}</a></li>`)
          .join('')}</ul></nav>
      </header>
      <main>
        <h1>${esc(heading)}</h1>
        <p>${esc(lead)}</p>
        ${sections[route.key](c).join('\n        ')}
      </main>
      <footer><p>© ${esc(c.name)} · Est. ${c.established} · ${esc(c.info.address.street)}, ${esc(
        c.info.address.zip,
      )} ${esc(c.info.address.city)}</p></footer>
    </div>`
}

// ——— robots.txt ———————————————————————————————————————————————————————
// Search + AI crawlers are explicitly welcome. To opt out of AI *training*
// only, add `Disallow: /` blocks for GPTBot, Google-Extended and CCBot.
const AI_AGENTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Bingbot',
  'DuckDuckBot',
  'CCBot',
  'cohere-ai',
  'MistralAI-User',
]

export function renderRobots(siteUrl) {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# AI search & assistant crawlers',
    ...AI_AGENTS.flatMap((a) => [`User-agent: ${a}`, 'Allow: /', '']),
    `Sitemap: ${absolute(siteUrl, '/sitemap.xml')}`,
    '',
  ].join('\n')
}

// ——— sitemap.xml ——————————————————————————————————————————————————————
export function renderSitemap(siteUrl, lastmod) {
  const date = lastmod.toISOString().slice(0, 10)
  const c = content(DEFAULT_LANG)
  const urls = routes
    .map((r) => {
      const images =
        r.key === 'gallery'
          ? c.photos
          : [{ src: r.image }]
      return `  <url>
    <loc>${esc(absolute(siteUrl, r.path))}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
${images
  .map(
    (i, n) =>
      `    <image:image><image:loc>${esc(absolute(siteUrl, i.src))}</image:loc>${
        r.key === 'gallery' ? `<image:caption>${esc(c.gallery.alts[n])}</image:caption>` : ''
      }</image:image>`,
  )
  .join('\n')}
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`
}

// ——— llms.txt / llms-full.txt ————————————————————————————————————————————
function factsMarkdown(lang) {
  const c = content(lang)
  const { address, phone, email, mapsUrl } = c.info
  return [
    `- ${c.name} (${c.fullName}), founded ${c.established}`,
    `- ${c.hero.label}`,
    `- ${address.street}, ${address.zip} ${address.city}, ${c.contact.country}`,
    `- ${c.contact.phone}: ${phone} · ${c.contact.email}: ${email}`,
    `- ${c.contact.routeCta}: ${mapsUrl}`,
    `- ${c.pricing.title} €${c.price} ${c.pricing.perMonth}. ${c.pricing.offerTitle}: ${c.pricing.offerDetail}`,
    `- ${c.schedule.title}: ${dayNames(c).join(', ')} · ${c.schedule.from} ${c.startTime}`,
    `- ${c.stats.age}: ${c.minAge}`,
  ].join('\n')
}

export function renderLlms(siteUrl) {
  const c = content('en')
  return `# ${c.name}

> ${c.meta.description}

${factsMarkdown('en')}

## Pages

${routes
  .map((r) => {
    const t = r.key === 'home' ? c.meta : c.meta.pages[r.key]
    return `- [${t.title}](${absolute(siteUrl, r.path)}): ${t.description}`
  })
  .join('\n')}

## More

- [Full content in English and German](${absolute(siteUrl, '/llms-full.txt')})
- [Sitemap](${absolute(siteUrl, '/sitemap.xml')})
`
}

export function renderLlmsFull(siteUrl) {
  const out = []
  for (const lang of ['en', 'de']) {
    const c = content(lang)
    out.push(`# ${c.name} — ${lang === 'en' ? 'English' : 'Deutsch'}\n`, `> ${c.meta.description}\n`, factsMarkdown(lang), '')
    out.push(`## ${c.disciplines.title}`, '', ...c.disciplines.items.map((d) => `- **${d.name}**: ${d.description}`), '')
    out.push(`## ${c.groups.title}`, '', ...c.groups.items.map((g) => `- **${g.name}** (${g.audience}): ${g.description}`), '')
    out.push(`## ${c.coaches.title}`, '', ...c.coaches.items.map((p) => `- **${p.name}**, ${p.role}: ${p.bio}`), '')
    out.push(`## ${c.values.title}`, '', ...c.values.items.map((v) => `- **${v.title}**: ${v.text}`), '')
    out.push(
      `## ${c.pricing.title}`,
      '',
      `${c.pricing.lead} €${c.price} ${c.pricing.perMonth}.`,
      '',
      ...c.pricing.includes.map((i) => `- ${i}`),
      '',
      `${c.pricing.offerTitle}: ${c.pricing.offerDetail}`,
      '',
    )
    out.push(`## ${c.faq.title}`, '', ...c.faq.items.flatMap((i) => [`**${i.q}**`, i.a, '']))
    out.push(`## ${lang === 'en' ? 'Pages' : 'Seiten'}`, '', ...routes.map((r) => `- ${absolute(siteUrl, r.path)}`), '')
  }
  return out.join('\n')
}

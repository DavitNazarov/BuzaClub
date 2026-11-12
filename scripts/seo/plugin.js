// Vite plugin: turns the single-page app into per-route static HTML so that
// link previews (WhatsApp, iMessage, Facebook, LinkedIn, Slack, X…), Google and
// AI crawlers — none of which reliably run JavaScript — get the right title,
// description, preview image, structured data and real text for every URL.
import { statSync } from 'node:fs'
import { resolve } from 'node:path'
import { DEFAULT_LANG, renderHead, routes } from '../../src/lib/seo.js'
import {
  renderBody,
  renderLlms,
  renderLlmsFull,
  renderRobots,
  renderSitemap,
} from './static.js'

const HEAD = /<!--seo:head:start-->[\s\S]*?<!--seo:head:end-->/
const BODY = /<!--seo:body:start-->[\s\S]*?<!--seo:body:end-->/

const wrapHead = (s) => `<!--seo:head:start-->\n    ${s}\n    <!--seo:head:end-->`
const wrapBody = (s) => `<!--seo:body:start-->${s}<!--seo:body:end-->`

export default function seo({ siteUrl, isDefaultSiteUrl, root }) {
  const home = routes[0]
  let isBuild = false

  return {
    name: 'buza-seo',
    enforce: 'post',

    configResolved(config) {
      isBuild = config.command === 'build'
      if (isBuild && isDefaultSiteUrl) {
        config.logger.warn(
          `\n[seo] Using placeholder site URL ${siteUrl}. Set VITE_SITE_URL=https://your-domain (or "siteUrl" in src/data/club.json) before deploying, ` +
            `otherwise canonical links and link previews will point to the wrong domain.\n`,
        )
      }
    },

    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace('<!--seo:head-->', wrapHead(renderHead(home, DEFAULT_LANG, siteUrl)))
          .replace('<!--seo:body-->', wrapBody(renderBody(home, DEFAULT_LANG)))
      },
    },

    generateBundle(_, bundle) {
      const index = bundle['index.html']
      if (!index || index.type !== 'asset') return
      const shell = String(index.source)

      for (const route of routes) {
        if (route === home) continue
        this.emitFile({
          type: 'asset',
          fileName: `${route.path.slice(1)}/index.html`,
          source: shell
            .replace(HEAD, () => wrapHead(renderHead(route, DEFAULT_LANG, siteUrl)))
            .replace(BODY, () => wrapBody(renderBody(route, DEFAULT_LANG))),
        })
      }

      // "lastmod" = when the content files last changed, not "now".
      const lastmod = ['club.json', 'en.json', 'de.json']
        .map((f) => statSync(resolve(root, 'src/data', f)).mtime)
        .reduce((a, b) => (a > b ? a : b))

      const files = {
        'robots.txt': renderRobots(siteUrl),
        'sitemap.xml': renderSitemap(siteUrl, lastmod),
        'llms.txt': renderLlms(siteUrl),
        'llms-full.txt': renderLlmsFull(siteUrl),
      }
      for (const [fileName, source] of Object.entries(files)) {
        this.emitFile({ type: 'asset', fileName, source })
      }
    },
  }
}

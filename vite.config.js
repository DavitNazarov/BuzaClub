import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import seo from './scripts/seo/plugin.js'

const club = JSON.parse(readFileSync(new URL('./src/data/club.json', import.meta.url), 'utf8'))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = (env.VITE_SITE_URL || club.siteUrl).replace(/\/+$/, '')

  return {
    plugins: [
      react(),
      seo({
        siteUrl,
        isDefaultSiteUrl: !env.VITE_SITE_URL && siteUrl === 'https://buzaclub.at',
        root: process.cwd(),
      }),
    ],
  }
})

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import shared from '../data/club.json'
import en from '../data/en.json'
import de from '../data/de.json'

const dictionaries = { en, de }
const STORAGE_KEY = 'buza-lang'

const LanguageContext = createContext(null)

function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && dictionaries[saved]) return saved
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectLanguage)

  const setLang = useCallback((next) => {
    if (!dictionaries[next]) return
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable */
    }
  }, [])

  const content = useMemo(() => ({ ...shared, ...dictionaries[lang] }), [lang])

  // <title>, meta tags and structured data are handled by <Seo /> (per route).
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(
    () => ({ lang, setLang, content, languages: Object.keys(dictionaries) }),
    [lang, setLang, content],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

// eslint-disable-next-line react/only-export-components
export function useContent() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useContent must be used inside LanguageProvider')
  return ctx
}

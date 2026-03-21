/**
 * lib/i18n.ts
 *
 * react-i18next initialisation.
 * Import once in main.tsx / index.tsx before rendering the app.
 *
 * Migration path from custom AppContext i18n:
 *   BEFORE: const { t } = useApp()    — t('res.title')
 *   AFTER:  const { t } = useTranslation()  — t('res.title')
 *   Key structure is identical — no component changes needed.
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import zhTW from '../locales/zh-TW.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'zh-TW': { translation: zhTW },
  },
  lng: localStorage.getItem('mitaya-lang') ?? 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,   // React already escapes
  },
})

export default i18n

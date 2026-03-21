/**
 * store/language.store.ts
 *
 * Replaces AppContext language state with a Zustand store.
 * Isolated from cart — language toggle no longer triggers
 * cart component re-renders.
 *
 * Migration from AppContext:
 *   BEFORE: const { language, setLanguage } = useApp()
 *   AFTER:  const language = useLanguageStore(s => s.language)
 *           const setLanguage = useLanguageStore(s => s.setLanguage)
 */
import { create } from 'zustand'
import type { Language } from '../types'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
  toggle: () => void
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: (localStorage.getItem('mitaya-lang') as Language) ?? 'en',

  setLanguage: (language) => {
    localStorage.setItem('mitaya-lang', language)
    set({ language })
  },

  toggle: () => {
    const next = get().language === 'en' ? 'zh-TW' : 'en'
    get().setLanguage(next)
  },
}))

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { LANGUAGES, translate } from '../utils/i18n.js'

const PREFS_KEY = 'logrithoo:prefs'

const DEFAULT_PREFS = {
  theme: 'light',
  language: 'en',
  defaultExport: 'pdf',
  profile: {
    name: 'Demo User',
    email: 'demo@logrithoo.app',
  },
}

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return DEFAULT_PREFS
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_PREFS,
      ...parsed,
      profile: { ...DEFAULT_PREFS.profile, ...(parsed.profile || {}) },
    }
  } catch {
    return DEFAULT_PREFS
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [prefs, setPrefs] = useState(loadPrefs)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
    } catch {
      /* storage may be unavailable */
    }
  }, [prefs])

  useEffect(() => {
    const lang = LANGUAGES.find((l) => l.code === prefs.language) || LANGUAGES[0]
    document.documentElement.dir = lang.dir
    document.documentElement.lang = lang.code
  }, [prefs.language])

  useEffect(() => {
    document.documentElement.dataset.theme = prefs.theme === 'dim' ? 'dim' : 'light'
  }, [prefs.theme])

  const setPreference = useCallback((key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }))
  }, [])

  const setProfile = useCallback((patch) => {
    setPrefs((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }))
  }, [])

  const pushToast = useCallback((type, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { id, type, message }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const t = useCallback((key) => translate(key, prefs.language), [prefs.language])

  const value = useMemo(
    () => ({ prefs, setPreference, setProfile, t, toasts, pushToast, dismissToast }),
    [prefs, setPreference, setProfile, t, toasts, pushToast, dismissToast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

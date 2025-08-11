"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Lang = "ar" | "en"

type LanguageContextType = {
  lang: Lang
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar")

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null
    if (saved === "ar" || saved === "en") setLang(saved)
  }, [])

  const value = useMemo(
    () => ({
      lang,
      setLang: (l: Lang) => {
        setLang(l)
        if (typeof window !== "undefined") localStorage.setItem("lang", l)
      },
    }),
    [lang],
  )
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}

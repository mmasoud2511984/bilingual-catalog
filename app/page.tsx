"use client"

import { useEffect } from "react"
import { FeaturedProducts } from "@/components/featured-products"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useLanguage } from "@/components/language-provider"
import { useSeedOnce } from "@/lib/seed"
import { Slider } from "@/components/slider"
import { getSettings } from "@/lib/store"

export default function HomePage() {
  useSeedOnce()
  const { lang } = useLanguage()
  const settings = getSettings()

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }, [lang])

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section aria-label={lang === "ar" ? "عارض الصور" : "Hero Slider"} className="bg-muted">
          <div className="container px-4 py-4">
            <Slider images={settings.slider.images} />
          </div>
        </section>
        <section className="container px-4 py-10">
          <FeaturedProducts />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

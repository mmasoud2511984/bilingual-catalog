"use client"

import Link from "next/link"
import { ShoppingCart, Menu, Globe, Search } from "lucide-react"
import { useLanguage } from "./language-provider"
import { useCart } from "./cart-store"
import { getSettings } from "@/lib/store"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const settings = getSettings()
  const { lang, setLang } = useLanguage()
  const { count } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  const siteName = settings.header.siteName[lang] || settings.header.siteName.en || settings.header.siteName.ar
  const logoAlt = settings.header.logoAlt[lang] || settings.header.logoAlt.en || settings.header.logoAlt.ar

  const MenuLinks = useMemo(
    () => (
      <>
        <Link
          href="/"
          className={cn("px-3 py-2 rounded-md transition-colors", "hover:opacity-90")}
          style={{ color: settings.header.menuItemColor }}
        >
          {lang === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <Link
          href="/products"
          className={cn("px-3 py-2 rounded-md transition-colors", "hover:opacity-90")}
          style={{ color: settings.header.menuItemColor }}
        >
          {lang === "ar" ? "المنتجات" : "Products"}
        </Link>
        <Link
          href="/admin"
          className={cn("px-3 py-2 rounded-md transition-colors", "hover:opacity-90")}
          style={{ color: settings.header.menuItemColor }}
        >
          {lang === "ar" ? "لوحة التحكم" : "Admin"}
        </Link>
      </>
    ),
    [lang, settings.header.menuItemColor],
  )

  return (
    <header
      className={cn(settings.header.sticky ? "sticky top-0 z-50" : "", "w-full border-b")}
      style={{ backgroundColor: settings.header.bgColor }}
    >
      {settings.header.topBar.enabled ? (
        <div className="text-xs sm:text-sm w-full" style={{ backgroundColor: settings.header.bgColor }}>
          <div className="container px-4 py-2 flex items-center justify-between">
            <div className="text-muted-foreground">
              {settings.header.topBar.text[lang] || settings.header.topBar.text.en || settings.header.topBar.text.ar}
            </div>
            <div className="hidden sm:block text-muted-foreground">
              {settings.header.topBar.contact[lang] ||
                settings.header.topBar.contact.en ||
                settings.header.topBar.contact.ar}
            </div>
          </div>
        </div>
      ) : null}
      <div className="container px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          {settings.header.logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.header.logoSrc || "/placeholder.svg"}
              alt={logoAlt || "Logo"}
              className="h-10 w-auto"
              style={{ objectFit: "contain" }}
            />
          ) : null}
          <span
            className="font-bold"
            style={{ color: settings.header.siteNameColor, fontSize: settings.header.siteNameFontSize }}
          >
            {siteName || "Catalog"}
          </span>
        </Link>

        <div className="ms-auto hidden md:flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground ms-3" />
            <Input
              placeholder={lang === "ar" ? "ابحث..." : "Search..."}
              className="ps-9"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = (e.target as HTMLInputElement).value
                  if (q.trim()) window.location.href = `/products?query=${encodeURIComponent(q)}`
                }
              }}
            />
          </div>
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            aria-label={lang === "ar" ? "تبديل اللغة" : "Toggle language"}
          >
            <Globe className="size-4" />
            {lang === "ar" ? "English" : "العربية"}
          </Button>
          <Link href="/products" className="relative inline-flex items-center gap-2">
            <ShoppingCart className="size-5" />
            <span className="sr-only">Cart</span>
            {count > 0 ? (
              <span className="absolute -top-2 -end-2 bg-primary text-primary-foreground text-xs px-1.5 rounded-full">
                {count}
              </span>
            ) : null}
          </Link>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="md:hidden ms-auto bg-transparent"
          onClick={() => setMobileOpen((s) => !s)}
        >
          <Menu className="size-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </div>

      <nav className="container px-4 pb-3">
        {settings.header.menuOrientation === "horizontal" ? (
          <div className="hidden md:flex items-center gap-1">{MenuLinks}</div>
        ) : (
          <div className="hidden md:flex flex-col gap-1">{MenuLinks}</div>
        )}
        {mobileOpen ? <div className="md:hidden flex flex-col gap-1 pb-3">{MenuLinks}</div> : null}
      </nav>
    </header>
  )
}

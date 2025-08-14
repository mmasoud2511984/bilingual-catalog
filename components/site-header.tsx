"use client"

import Link from "next/link"
import { ShoppingCart, Menu, Globe, Search } from "lucide-react"
import { useLanguage } from "./language-provider"
import { useCart } from "./cart-store"
import { useSettings } from "@/lib/hooks/use-api-data"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  const { settings } = useSettings()
  const { lang, setLang } = useLanguage()
  const { count } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  const siteName =
    settings?.header.siteName[lang] || settings?.header.siteName.en || settings?.header.siteName.ar || "Catalog"
  const logoAlt = settings?.header.logoAlt[lang] || settings?.header.logoAlt.en || settings?.header.logoAlt.ar || "Logo"

  const MenuLinks = useMemo(
    () => (
      <>
        <Link
          href="/"
          className={cn("px-3 py-2 rounded-md transition-colors", "hover:opacity-90")}
          style={{ color: settings?.header.menuItemColor || "#222222" }}
        >
          {lang === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <Link
          href="/admin"
          className={cn("px-3 py-2 rounded-md transition-colors", "hover:opacity-90")}
          style={{ color: settings?.header.menuItemColor || "#222222" }}
        >
          {lang === "ar" ? "لوحة التحكم" : "Admin"}
        </Link>
      </>
    ),
    [lang, settings?.header.menuItemColor],
  )

  return (
    <header
      className={cn(settings?.header.sticky ? "sticky top-0 z-50" : "", "w-full border-b backdrop-blur-sm")}
      style={{ backgroundColor: settings?.header.bgColor || "#ffffff" }}
    >
      {settings?.header.topBar.enabled ? (
        <div className="text-xs sm:text-sm w-full" style={{ backgroundColor: settings?.header.bgColor || "#ffffff" }}>
          <div className="container px-4 py-2 flex items-center justify-between">
            <div className="text-muted-foreground">
              {settings?.header.topBar.text[lang] ||
                settings?.header.topBar.text.en ||
                settings?.header.topBar.text.ar ||
                ""}
            </div>
            <div className="hidden sm:block text-muted-foreground">
              {settings?.header.topBar.contact[lang] ||
                settings?.header.topBar.contact.en ||
                settings?.header.topBar.contact.ar ||
                ""}
            </div>
          </div>
        </div>
      ) : null}
      <div className="container px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          {settings?.header.logoSrc ? (
            <img
              src={settings.header.logoSrc || "/placeholder.svg"}
              alt={logoAlt}
              className="h-8 sm:h-10 w-auto"
              style={{ objectFit: "contain" }}
            />
          ) : null}
          <span
            className="font-bold text-sm sm:text-base"
            style={{
              color: settings?.header.siteNameColor || "#111111",
              fontSize: `${settings?.header.siteNameFontSize || 20}px`,
            }}
          >
            {siteName}
          </span>
        </Link>

        <div className="ms-auto hidden lg:flex items-center gap-2">
          <div className="relative w-48 xl:w-64">
            <Search className="absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground ms-3" />
            <Input
              placeholder={lang === "ar" ? "ابحث..." : "Search..."}
              className="ps-9"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = (e.target as HTMLInputElement).value
                  if (q.trim()) {
                    window.location.href = `/?query=${encodeURIComponent(q)}`
                  }
                }
              }}
            />
          </div>
          <ThemeToggle />
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            aria-label={lang === "ar" ? "تبديل اللغة" : "Toggle language"}
          >
            <Globe className="size-4" />
            <span className="hidden xl:inline">{lang === "ar" ? "English" : "العربية"}</span>
          </Button>
          <Link href="/cart" className="relative inline-flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="size-5" />
              <span className="sr-only">Cart</span>
              {count > 0 ? (
                <span className="absolute -top-1 -end-1 bg-primary text-primary-foreground text-xs px-1.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                  {count}
                </span>
              ) : null}
            </Button>
          </Link>
        </div>

        <div className="ms-auto flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            aria-label={lang === "ar" ? "تبديل اللغة" : "Toggle language"}
          >
            <Globe className="size-4" />
          </Button>
          <Link href="/cart" className="relative inline-flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="size-5" />
              <span className="sr-only">Cart</span>
              {count > 0 ? (
                <span className="absolute -top-1 -end-1 bg-primary text-primary-foreground text-xs px-1.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                  {count}
                </span>
              ) : null}
            </Button>
          </Link>
          <Button variant="outline" size="icon" onClick={() => setMobileOpen((s) => !s)}>
            <Menu className="size-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      <nav className="container px-4 pb-3">
        {settings?.header.menuOrientation === "horizontal" ? (
          <div className="hidden lg:flex items-center gap-1">{MenuLinks}</div>
        ) : (
          <div className="hidden lg:flex flex-col gap-1">{MenuLinks}</div>
        )}
        {mobileOpen ? (
          <div className="lg:hidden flex flex-col gap-1 pb-3 border-t pt-3">
            {MenuLinks}
            <div className="relative mt-2">
              <Search className="absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground ms-3" />
              <Input
                placeholder={lang === "ar" ? "ابحث..." : "Search..."}
                className="ps-9"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const q = (e.target as HTMLInputElement).value
                    if (q.trim()) {
                      window.location.href = `/?query=${encodeURIComponent(q)}`
                    }
                  }
                }}
              />
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  )
}

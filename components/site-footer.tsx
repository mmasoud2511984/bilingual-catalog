"use client"

import Link from "next/link"
import { useSettings } from "@/lib/hooks/use-api-data"
import { useLanguage } from "./language-provider"

export function SiteFooter() {
  const { settings } = useSettings()
  const { lang } = useLanguage()

  if (!settings) return null

  return (
    <footer className="border-t mt-8">
      <div className="container px-4 py-8 grid gap-6 md:grid-cols-3">
        <div className="flex items-start gap-3">
          {settings.footer.logoSrc ? (
            <img
              src={settings.footer.logoSrc || "/placeholder.svg"}
              alt="Footer Logo"
              className="h-10 w-auto object-contain"
            />
          ) : null}
          <p className="text-sm text-muted-foreground">
            {settings.footer.description[lang] || settings.footer.description.en || settings.footer.description.ar}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">{lang === "ar" ? "روابط سريعة" : "Quick Links"}</h3>
          <ul className="grid gap-2 text-sm">
            <li>
              <Link className="hover:underline" href="/">
                {lang === "ar" ? "الرئيسية" : "Home"}
              </Link>
            </li>
            {settings.footer.quickLinks.map((l) => (
              <li key={l.href}>
                <Link className="hover:underline" href={l.href}>
                  {l.label[lang] || l.label.en || l.label.ar}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">{lang === "ar" ? "معلومات الاتصال" : "Contact"}</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {settings.footer.contact[lang] || settings.footer.contact.en || settings.footer.contact.ar}
          </p>
        </div>
      </div>
      <div className="text-xs text-center text-muted-foreground pb-6">
        © {new Date().getFullYear()} {settings.header.siteName.ar || settings.header.siteName.en || "Catalog"}
      </div>
    </footer>
  )
}

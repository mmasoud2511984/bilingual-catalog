"use client"

import { useState } from "react"
import { getSettings, saveSettings } from "@/lib/store"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function FooterSettingsForm() {
  const { lang } = useLanguage()
  const [s, setS] = useState(getSettings())

  return (
    <Card>
      <CardHeader>
        <CardTitle>{lang === "ar" ? "إعدادات التذييل" : "Footer Settings"}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <Label>{lang === "ar" ? "شعار (تحميل)" : "Logo (Upload)"}</Label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const dataUrl = await fileToDataUrl(file)
              setS({ ...s, footer: { ...s.footer, logoSrc: dataUrl } })
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>{lang === "ar" ? "وصف (ع)" : "Description (AR)"}</Label>
            <Textarea
              value={s.footer.description.ar}
              onChange={(e) =>
                setS({ ...s, footer: { ...s.footer, description: { ...s.footer.description, ar: e.target.value } } })
              }
            />
          </div>
          <div>
            <Label>{lang === "ar" ? "وصف (EN)" : "Description (EN)"}</Label>
            <Textarea
              value={s.footer.description.en}
              onChange={(e) =>
                setS({ ...s, footer: { ...s.footer, description: { ...s.footer.description, en: e.target.value } } })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label>{lang === "ar" ? "اتصال (ع)" : "Contact (AR)"}</Label>
            <Textarea
              value={s.footer.contact.ar}
              onChange={(e) =>
                setS({ ...s, footer: { ...s.footer, contact: { ...s.footer.contact, ar: e.target.value } } })
              }
            />
          </div>
          <div>
            <Label>{lang === "ar" ? "اتصال (EN)" : "Contact (EN)"}</Label>
            <Textarea
              value={s.footer.contact.en}
              onChange={(e) =>
                setS({ ...s, footer: { ...s.footer, contact: { ...s.footer.contact, en: e.target.value } } })
              }
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>{lang === "ar" ? "روابط سريعة" : "Quick Links"}</Label>
          {s.footer.quickLinks.map((l, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_160px_40px] gap-2">
              <Input
                placeholder={lang === "ar" ? "نص (ع)" : "Label (AR)"}
                value={l.label.ar}
                onChange={(e) => {
                  const arr = s.footer.quickLinks.slice()
                  arr[i] = { ...l, label: { ...l.label, ar: e.target.value } }
                  setS({ ...s, footer: { ...s.footer, quickLinks: arr } })
                }}
              />
              <Input
                placeholder="Label (EN)"
                value={l.label.en}
                onChange={(e) => {
                  const arr = s.footer.quickLinks.slice()
                  arr[i] = { ...l, label: { ...l.label, en: e.target.value } }
                  setS({ ...s, footer: { ...s.footer, quickLinks: arr } })
                }}
              />
              <Input
                placeholder="https://"
                value={l.href}
                onChange={(e) => {
                  const arr = s.footer.quickLinks.slice()
                  arr[i] = { ...l, href: e.target.value }
                  setS({ ...s, footer: { ...s.footer, quickLinks: arr } })
                }}
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  const arr = s.footer.quickLinks.slice()
                  arr.splice(i, 1)
                  setS({ ...s, footer: { ...s.footer, quickLinks: arr } })
                }}
              >
                −
              </Button>
            </div>
          ))}
          <div>
            <Button
              variant="outline"
              onClick={() =>
                setS({
                  ...s,
                  footer: {
                    ...s.footer,
                    quickLinks: [...s.footer.quickLinks, { href: "#", label: { ar: "رابط", en: "Link" } }],
                  },
                })
              }
            >
              {lang === "ar" ? "إضافة رابط" : "Add Link"}
            </Button>
          </div>
        </div>

        <div>
          <Button
            onClick={() => {
              saveSettings(s)
              alert(lang === "ar" ? "تم الحفظ" : "Saved")
            }}
          >
            {lang === "ar" ? "حفظ" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

"use client"

import { getSettings, saveSettings } from "@/lib/store"
import { useLanguage } from "@/components/language-provider"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export function HeaderSettingsForm() {
  const { lang } = useLanguage()
  const [s, setS] = useState(getSettings())

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{lang === "ar" ? "إعدادات الهيدر" : "Header Settings"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>{lang === "ar" ? "اسم الموقع (ع)" : "Site Name (AR)"}</Label>
              <Input
                value={s.header.siteName.ar}
                onChange={(e) =>
                  setS({ ...s, header: { ...s.header, siteName: { ...s.header.siteName, ar: e.target.value } } })
                }
              />
            </div>
            <div>
              <Label>{lang === "ar" ? "اسم الموقع (EN)" : "Site Name (EN)"}</Label>
              <Input
                value={s.header.siteName.en}
                onChange={(e) =>
                  setS({ ...s, header: { ...s.header, siteName: { ...s.header.siteName, en: e.target.value } } })
                }
              />
            </div>
            <div>
              <Label>{lang === "ar" ? "لون الاسم" : "Name Color"}</Label>
              <Input
                type="color"
                value={s.header.siteNameColor}
                onChange={(e) => setS({ ...s, header: { ...s.header, siteNameColor: e.target.value } })}
              />
            </div>
            <div>
              <Label>{lang === "ar" ? "حجم الاسم (px)" : "Name Size (px)"}</Label>
              <Input
                type="number"
                value={String(s.header.siteNameFontSize)}
                onChange={(e) =>
                  setS({ ...s, header: { ...s.header, siteNameFontSize: Number(e.target.value || 18) } })
                }
              />
            </div>
            <div>
              <Label>{lang === "ar" ? "لون الخلفية" : "Background Color"}</Label>
              <Input
                type="color"
                value={s.header.bgColor}
                onChange={(e) => setS({ ...s, header: { ...s.header, bgColor: e.target.value } })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{lang === "ar" ? "هيدر ثابت" : "Sticky Header"}</Label>
              <Switch
                checked={s.header.sticky}
                onCheckedChange={(v) => setS({ ...s, header: { ...s.header, sticky: v } })}
              />
            </div>
            <div>
              <Label>{lang === "ar" ? "اتجاه القائمة" : "Menu Orientation"}</Label>
              <select
                className="border rounded-md h-10 px-3"
                value={s.header.menuOrientation}
                onChange={(e) => setS({ ...s, header: { ...s.header, menuOrientation: e.target.value as any } })}
              >
                <option value="horizontal">{lang === "ar" ? "أفقي" : "Horizontal"}</option>
                <option value="vertical">{lang === "ar" ? "رأسي" : "Vertical"}</option>
              </select>
            </div>
            <div>
              <Label>{lang === "ar" ? "لون عناصر القائمة" : "Menu Item Color"}</Label>
              <Input
                type="color"
                value={s.header.menuItemColor}
                onChange={(e) => setS({ ...s, header: { ...s.header, menuItemColor: e.target.value } })}
              />
            </div>
          </div>

          <Separator />
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label>{lang === "ar" ? "شريط علوي" : "Top Bar"}</Label>
              <Switch
                checked={s.header.topBar.enabled}
                onCheckedChange={(v) => setS({ ...s, header: { ...s.header, topBar: { ...s.header.topBar, enabled: v } } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>{lang === "ar" ? "نص ترحيبي (ع)" : "Welcome Text (AR)"}</Label>
                <Input
                  value={s.header.topBar.text.ar}
                  onChange={(e) =>
                    setS({
                      ...s,
                      header: {
                        ...s.header,
                        topBar: { ...s.header.topBar, text: { ...s.header.topBar.text, ar: e.target.value } },
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>{lang === "ar" ? "نص ترحيبي (EN)" : "Welcome Text (EN)"}</Label>
                <Input
                  value={s.header.topBar.text.en}
                  onChange={(e) =>
                    setS({
                      ...s,
                      header: {
                        ...s.header,
                        topBar: { ...s.header.topBar, text: { ...s.header.topBar.text, en: e.target.value } },
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>{lang === "ar" ? "معلومات الاتصال (ع)" : "Contact (AR)"}</Label>
                <Input
                  value={s.header.topBar.contact.ar}
                  onChange={(e) =>
                    setS({
                      ...s,
                      header: {
                        ...s.header,
                        topBar: { ...s.header.topBar, contact: { ...s.header.topBar.contact, ar: e.target.value } },
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>{lang === "ar" ? "معلومات الاتصال (EN)" : "Contact (EN)"}</Label>
                <Input
                  value={s.header.topBar.contact.en}
                  onChange={(e) =>
                    setS({
                      ...s,
                      header: {
                        ...s.header,
                        topBar: { ...s.header.topBar, contact: { ...s.header.topBar.contact, en: e.target.value } },
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />
          <div className="grid gap-3">
            <Label>{lang === "ar" ? "شعار (تحميل)" : "Logo (Upload)"}</Label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const dataUrl = await fileToDataUrl(file)
                setS({ ...s, header: { ...s.header, logoSrc: dataUrl } })
              }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>{lang === "ar" ? "نص بديل (ع)" : "Alt Text (AR)"}</Label>
                <Input
                  value={s.header.logoAlt.ar}
                  onChange={(e) =>
                    setS({ ...s, header: { ...s.header, logoAlt: { ...s.header.logoAlt, ar: e.target.value } } })
                  }
                />
              </div>
              <div>
                <Label>{lang === "ar" ? "نص بديل (EN)" : "Alt Text (EN)"}</Label>
                <Input
                  value={s.header.logoAlt.en}
                  onChange={(e) =>
                    setS({ ...s, header: { ...s.header, logoAlt: { ...s.header.logoAlt, en: e.target.value } } })
                  }
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
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

      <Card>
        <CardHeader>
          <CardTitle>{lang === "ar" ? "معاينة الهيدر" : "Header Preview"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4" style={{ backgroundColor: s.header.bgColor }}>
            <div className="flex items-center gap-3">
              {s.header.logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.header.logoSrc || "/placeholder.svg"}
                  alt="logo preview"
                  className="h-10 w-auto object-contain"
                />
              ) : null}
              <span
                style={{ color: s.header.siteNameColor, fontSize: s.header.siteNameFontSize }}
              >
                {s.header.siteName.ar || s.header.siteName.en || "Site Name"}
              </span>
            </div>
            {s.header.topBar.enabled ? (
              <div className="text-xs text-muted-foreground mt-3">
                {s.header.topBar.text.ar} · {s.header.topBar.contact.ar}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
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

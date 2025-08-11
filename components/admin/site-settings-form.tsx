"use client"

import { getSettings, saveSettings } from "@/lib/store"
import { useLanguage } from "@/components/language-provider"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function SiteSettingsForm() {
  const { lang } = useLanguage()
  const [s, setS] = useState(getSettings())

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{lang === "ar" ? "إعدادات عامة" : "General Settings"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>{lang === "ar" ? "العملة (عربي)" : "Currency (Arabic)"}</Label>
              <Input
                value={s.currency.ar}
                onChange={(e) => setS({ ...s, currency: { ...s.currency, ar: e.target.value } })}
              />
            </div>
            <div>
              <Label>{lang === "ar" ? "العملة (إنجليزي)" : "Currency (English)"}</Label>
              <Input
                value={s.currency.en}
                onChange={(e) => setS({ ...s, currency: { ...s.currency, en: e.target.value } })}
              />
            </div>
          </div>

          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{lang === "ar" ? "تفعيل واتساب" : "Enable WhatsApp"}</Label>
              </div>
              <Switch
                checked={s.whatsapp.enabled}
                onCheckedChange={(v) => setS({ ...s, whatsapp: { ...s.whatsapp, enabled: v } })}
              />
            </div>
            <div>
              <Label>{lang === "ar" ? "رقم واتساب" : "WhatsApp Number"}</Label>
              <Input
                placeholder="+9665xxxxxxxx"
                value={s.whatsapp.phone}
                onChange={(e) => setS({ ...s, whatsapp: { ...s.whatsapp, phone: e.target.value } })}
              />
            </div>
            <div>
              <Label>{lang === "ar" ? "رسالة واتساب (ع)" : "WhatsApp Message (AR)"} </Label>
              <Input
                value={s.whatsapp.defaultMessage.ar}
                onChange={(e) =>
                  setS({
                    ...s,
                    whatsapp: { ...s.whatsapp, defaultMessage: { ...s.whatsapp.defaultMessage, ar: e.target.value } },
                  })
                }
              />
            </div>
            <div>
              <Label>{lang === "ar" ? "رسالة واتساب (EN)" : "WhatsApp Message (EN)"}</Label>
              <Input
                value={s.whatsapp.defaultMessage.en}
                onChange={(e) =>
                  setS({
                    ...s,
                    whatsapp: { ...s.whatsapp, defaultMessage: { ...s.whatsapp.defaultMessage, en: e.target.value } },
                  })
                }
              />
            </div>
          </div>

          <Separator />
          <div className="grid gap-3">
            <ToggleRow
              label={lang === "ar" ? "إظهار زر السلة" : "Show Add to Cart"}
              value={s.showCartButton}
              onChange={(v) => setS({ ...s, showCartButton: v })}
            />
            <ToggleRow
              label={lang === "ar" ? "إظهار زر الطلب المباشر" : "Show Direct Order"}
              value={s.showDirectOrderButton}
              onChange={(v) => setS({ ...s, showDirectOrderButton: v })}
            />
            <ToggleRow
              label={lang === "ar" ? "إظهار الكمية المتاحة" : "Show Stock Quantity"}
              value={s.showStock}
              onChange={(v) => setS({ ...s, showStock: v })}
            />
            <ToggleRow
              label={lang === "ar" ? "تفعيل التعليقات" : "Enable Reviews"}
              value={s.enableComments}
              onChange={(v) => setS({ ...s, enableComments: v })}
            />
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
    </div>
  )
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm">{label}</div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  )
}

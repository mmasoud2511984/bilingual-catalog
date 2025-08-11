"use client"

import { getSettings, saveSettings } from "@/lib/store"
import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function SliderSettings() {
  const { lang } = useLanguage()
  const [s, setS] = useState(getSettings())

  return (
    <Card>
      <CardHeader>
        <CardTitle>{lang === "ar" ? "سلايدر الرئيسية" : "Home Slider"}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3">
          {s.slider.images.map((img, i) => (
            <div key={img.id} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src || "/placeholder.svg"}
                alt={"slide " + (i + 1)}
                className="h-16 w-28 object-cover rounded border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const dataUrl = await fileToDataUrl(file)
                  const arr = s.slider.images.slice()
                  arr[i] = { ...arr[i], src: dataUrl }
                  setS({ ...s, slider: { images: arr } })
                }}
              />
              <Button
                variant="outline"
                onClick={() => {
                  const arr = s.slider.images.slice()
                  if (i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]
                  setS({ ...s, slider: { images: arr } })
                }}
              >
                {lang === "ar" ? "أعلى" : "Up"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const arr = s.slider.images.slice()
                  if (i < arr.length - 1) [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]
                  setS({ ...s, slider: { images: arr } })
                }}
              >
                {lang === "ar" ? "أسفل" : "Down"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const arr = s.slider.images.slice()
                  arr.splice(i, 1)
                  setS({ ...s, slider: { images: arr } })
                }}
              >
                {lang === "ar" ? "حذف" : "Remove"}
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setS({
                ...s,
                slider: {
                  images: [...s.slider.images, { id: crypto.randomUUID(), src: "/blank-presentation-slide.png" }],
                },
              })
            }
          >
            {lang === "ar" ? "إضافة صورة" : "Add Slide"}
          </Button>
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

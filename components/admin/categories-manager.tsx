"use client"

import { useState } from "react"
import { getAllCategories, saveCategory, deleteCategory, moveCategory } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "../language-provider"
import { Trash } from "lucide-react"

export function CategoriesManager() {
  const { lang } = useLanguage()
  const [items, setItems] = useState(getAllCategories())
  const [ar, setAr] = useState("")
  const [en, setEn] = useState("")

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{lang === "ar" ? "إضافة فئة" : "Add Category"}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3">
          <div>
            <Label>{lang === "ar" ? "الاسم (ع)" : "Name (AR)"}</Label>
            <Input value={ar} onChange={(e) => setAr(e.target.value)} />
          </div>
          <div>
            <Label>{lang === "ar" ? "الاسم (EN)" : "Name (EN)"}</Label>
            <Input value={en} onChange={(e) => setEn(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                saveCategory({ id: crypto.randomUUID(), name: { ar, en }, order: items.length })
                setAr("")
                setEn("")
                setItems(getAllCategories())
              }}
            >
              {lang === "ar" ? "إضافة" : "Add"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{lang === "ar" ? "القائمة" : "List"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2">
            {items.map((c, i) => (
              <li key={c.id} className="border rounded-md p-2 flex items-center gap-2">
                <div className="flex-1">
                  <div className="font-medium">{c.name[lang] || c.name.en || c.name.ar}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      moveCategory(c.id, "up")
                      setItems(getAllCategories())
                    }}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      moveCategory(c.id, "down")
                      setItems(getAllCategories())
                    }}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      deleteCategory(c.id)
                      setItems(getAllCategories())
                    }}
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

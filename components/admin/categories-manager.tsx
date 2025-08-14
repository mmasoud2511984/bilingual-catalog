"use client"

import { useState } from "react"
import { useCategories } from "@/lib/hooks/use-api-data"
import { useLanguage } from "@/components/language-provider" // Updated import for useLanguage
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash, Loader2 } from "lucide-react"
import { generateId } from "@/lib/utils"

export function CategoriesManager() {
  const { lang } = useLanguage()
  const { categories, loading, refetch } = useCategories()
  const [ar, setAr] = useState("")
  const [en, setEn] = useState("")
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (!ar.trim() && !en.trim()) {
      alert(lang === "ar" ? "يرجى إدخال اسم الفئة" : "Please enter category name")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: generateId(),
          name: { ar: ar.trim(), en: en.trim() },
          order: categories.length,
        }),
      })

      if (response.ok) {
        setAr("")
        setEn("")
        await refetch()
        alert(lang === "ar" ? "تم إضافة الفئة بنجاح" : "Category added successfully")
      } else {
        throw new Error("Failed to add category")
      }
    } catch (error) {
      alert(lang === "ar" ? "حدث خطأ في إضافة الفئة" : "Error adding category")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(lang === "ar" ? "حذف الفئة؟" : "Delete category?")) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await refetch()
        alert(lang === "ar" ? "تم حذف الفئة بنجاح" : "Category deleted successfully")
      } else {
        throw new Error("Failed to delete category")
      }
    } catch (error) {
      alert(lang === "ar" ? "حدث خطأ في حذف الفئة" : "Error deleting category")
    }
  }

  const handleMove = async (id: string, direction: "up" | "down") => {
    const currentIndex = categories.findIndex((c) => c.id === id)
    if (currentIndex === -1) return

    const newCategories = [...categories]
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (direction === "up" && currentIndex === 0) return
    if (direction === "down" && currentIndex === categories.length - 1) return // Swap categories
    ;[newCategories[currentIndex], newCategories[targetIndex]] = [
      newCategories[targetIndex],
      newCategories[currentIndex],
    ]

    try {
      const response = await fetch("/api/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: newCategories.map((c) => c.id) }),
      })

      if (response.ok) {
        await refetch()
      } else {
        throw new Error("Failed to reorder categories")
      }
    } catch (error) {
      alert(lang === "ar" ? "حدث خطأ في إعادة ترتيب الفئات" : "Error reordering categories")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{lang === "ar" ? "جاري تحميل الفئات..." : "Loading categories..."}</p>
        </div>
      </div>
    )
  }

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
            <Button onClick={handleAdd} disabled={saving}>
              {saving ? (lang === "ar" ? "جاري الإضافة..." : "Adding...") : lang === "ar" ? "إضافة" : "Add"}
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
            {categories.map((c, i) => (
              <li key={c.id} className="border rounded-md p-2 flex items-center gap-2">
                <div className="flex-1">
                  <div className="font-medium">{c.name[lang] || c.name.en || c.name.ar}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleMove(c.id, "up")} disabled={i === 0}>
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleMove(c.id, "down")}
                    disabled={i === categories.length - 1}
                  >
                    ↓
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(c.id)}>
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

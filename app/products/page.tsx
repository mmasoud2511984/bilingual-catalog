"use client"

import { useMemo, useState, useEffect } from "react"
import { LayoutGrid, LayoutList, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/product-card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useProducts, useCategories } from "@/lib/hooks/use-api-data"
import { useLanguage } from "@/components/language-provider"

type ViewMode = "grid" | "list"

export default function ProductsPage() {
  const { lang } = useLanguage()
  const { products, loading: productsLoading } = useProducts()
  const { categories, loading: categoriesLoading } = useCategories()

  const [query, setQuery] = useState("")
  const [cat, setCat] = useState<string>("all")
  const [sort, setSort] = useState<string>("date_desc")
  const [mode, setMode] = useState<ViewMode>("grid")

  const filtered = useMemo(() => {
    if (!products) return []

    let arr = [...products]
    if (cat !== "all") arr = arr.filter((p) => p.categoryId === cat)
    if (query.trim()) {
      const q = query.toLowerCase()
      arr = arr.filter(
        (p) =>
          (p.name[lang] || p.name.en || p.name.ar).toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q),
      )
    }
    switch (sort) {
      case "name_asc":
        arr.sort((a, b) => (a.name[lang] || "").localeCompare(b.name[lang] || ""))
        break
      case "name_desc":
        arr.sort((a, b) => (b.name[lang] || "").localeCompare(a.name[lang] || ""))
        break
      case "price_asc":
        arr.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        arr.sort((a, b) => b.price - a.price)
        break
      default:
        // date_desc
        arr.sort((a, b) => b.createdAt - a.createdAt)
    }
    return arr
  }, [products, cat, query, sort, lang])

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }, [lang])

  const isLoading = productsLoading || categoriesLoading

  if (isLoading) {
    return (
      <div className="min-h-dvh flex flex-col">
        <SiteHeader />
        <main className="container px-4 py-6 flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="size-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">{lang === "ar" ? "جاري تحميل المنتجات..." : "Loading products..."}</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main className="container px-4 py-6 flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground ms-3" />
              <Input
                placeholder={lang === "ar" ? "ابحث عن منتج..." : "Search products..."}
                className="ps-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all" onValueChange={setCat}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder={lang === "ar" ? "الفئة" : "Category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang === "ar" ? "الكل" : "All"}</SelectItem>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name[lang] || c.name.en || c.name.ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="date_desc" onValueChange={setSort}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={lang === "ar" ? "ترتيب" : "Sort"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">{lang === "ar" ? "الأحدث" : "Newest"}</SelectItem>
                  <SelectItem value="name_asc">{lang === "ar" ? "الاسم أ-ي" : "Name A-Z"}</SelectItem>
                  <SelectItem value="name_desc">{lang === "ar" ? "الاسم ي-أ" : "Name Z-A"}</SelectItem>
                  <SelectItem value="price_asc">{lang === "ar" ? "السعر من الأقل" : "Price Low-High"}</SelectItem>
                  <SelectItem value="price_desc">{lang === "ar" ? "السعر من الأعلى" : "Price High-Low"}</SelectItem>
                </SelectContent>
              </Select>
              <div className="ms-auto flex gap-1">
                <Button
                  variant={mode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setMode("grid")}
                  aria-label="Grid"
                >
                  <LayoutGrid className="size-4" />
                </Button>
                <Button
                  variant={mode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setMode("list")}
                  aria-label="List"
                >
                  <LayoutList className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              {lang === "ar" ? "لا توجد منتجات مطابقة" : "No matching products"}
            </div>
          ) : mode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} mode="grid" />
              ))}
            </div>
          ) : (
            <div className="grid gap-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} mode="list" />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

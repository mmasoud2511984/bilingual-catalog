"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Slider } from "@/components/slider"
import { ProductCard } from "@/components/product-card"
import { getAllProducts, getAllCategories, getSettings } from "@/lib/store"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const { lang } = useLanguage()
  const [products] = useState(getAllProducts())
  const [categories] = useState(getAllCategories())
  const [settings] = useState(getSettings())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("order")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang

    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get("query")
    if (query) {
      setSearchQuery(query)
    }
  }, [lang])

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.ar.toLowerCase().includes(query) ||
          p.name.en.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.shortDescription.ar.toLowerCase().includes(query) ||
          p.shortDescription.en.toLowerCase().includes(query),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.categoryId === selectedCategory)
    }

    // Sort products
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) =>
          (a.name[lang] || a.name.en || a.name.ar).localeCompare(b.name[lang] || b.name.en || b.name.ar),
        )
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered.sort((a, b) => b.createdAt - a.createdAt)
        break
      default:
        filtered.sort((a, b) => a.order - b.order)
    }

    return filtered
  }, [products, searchQuery, selectedCategory, sortBy, lang])

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {settings.slider.enabled && settings.slider.images.length > 0 ? (
          <section className="mb-8">
            <Slider />
          </section>
        ) : null}

        <section className="container px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{lang === "ar" ? "جميع المنتجات" : "All Products"}</h1>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground ms-3" />
                <Input
                  placeholder={lang === "ar" ? "ابحث في المنتجات..." : "Search products..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder={lang === "ar" ? "جميع الفئات" : "All Categories"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{lang === "ar" ? "جميع الفئات" : "All Categories"}</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name[lang] || cat.name.en || cat.name.ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">{lang === "ar" ? "الترتيب الافتراضي" : "Default Order"}</SelectItem>
                    <SelectItem value="name">{lang === "ar" ? "الاسم" : "Name"}</SelectItem>
                    <SelectItem value="price-low">
                      {lang === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High"}
                    </SelectItem>
                    <SelectItem value="price-high">
                      {lang === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low"}
                    </SelectItem>
                    <SelectItem value="newest">{lang === "ar" ? "الأحدث" : "Newest"}</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-e-none"
                  >
                    <Grid className="size-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-s-none"
                  >
                    <List className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground mb-4">
              {lang === "ar"
                ? `عرض ${filteredProducts.length} من ${products.length} منتج`
                : `Showing ${filteredProducts.length} of ${products.length} products`}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div
              className={cn(
                "grid gap-4 sm:gap-6",
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
              )}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} mode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {lang === "ar" ? "لم يتم العثور على منتجات" : "No products found"}
              </div>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

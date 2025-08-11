"use client"

import { useLanguage } from "./language-provider"
import { getAllProducts } from "@/lib/store"
import { ProductCard } from "./product-card"

export function FeaturedProducts() {
  const { lang } = useLanguage()
  const prods = getAllProducts()
    .filter((p) => p.featured)
    .slice(0, 8)

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{lang === "ar" ? "منتجات مميزة" : "Featured Products"}</h2>
      </div>
      {prods.length === 0 ? (
        <div className="text-muted-foreground">{lang === "ar" ? "لا توجد منتجات." : "No products."}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {prods.map((p) => (
            <ProductCard key={p.id} product={p} mode="grid" />
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useLanguage } from "./language-provider"
import { type Product, getSettings } from "@/lib/store"
import { WhatsappButton } from "./whatsapp-button"
import { useCart } from "./cart-store"

export function ProductCard({
  product,
  mode = "grid",
}: {
  product: Product
  mode?: "grid" | "list"
}) {
  const { lang } = useLanguage()
  const settings = getSettings()
  const { addItem } = useCart()
  const currency = settings.currency[lang] || settings.currency.en || settings.currency.ar

  const main = product.images[0]?.src || "/modern-tech-product.png"

  return (
    <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-lg", mode === "list" ? "p-2" : "")}>
      <CardContent className={cn("p-0", mode === "list" ? "flex gap-3" : "")}>
        <Link
          href={`/products/${product.slug}`}
          className={cn("block", mode === "list" ? "w-32 sm:w-40 shrink-0" : "")}
        >
          <img
            src={main || "/placeholder.svg"}
            alt={product.name[lang] || product.name.en || product.name.ar}
            className={cn(
              "w-full object-cover transition-transform duration-200 hover:scale-105",
              mode === "list" ? "h-24 sm:h-28 rounded-md" : "h-40 sm:h-44 rounded-t-md",
            )}
          />
        </Link>
        <div className={cn("p-3", mode === "list" ? "flex-1" : "")}>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
              {product.name[lang] || product.name.en || product.name.ar}
            </h3>
          </Link>
          <div className="text-xs text-muted-foreground mt-1">
            {(lang === "ar" ? "رقم" : "SKU") + ": "}
            {product.sku}
          </div>
          <div className="mt-2 font-semibold text-lg">
            {currency} {product.price.toFixed(2)}
          </div>
          {settings.showStock ? (
            <div className="text-xs text-muted-foreground mt-1">
              {lang === "ar" ? "المتوفر:" : "Stock:"} {product.stock}
              {product.dozenQty ? (
                <span className="ms-2">
                  {lang === "ar" ? "الدستة:" : "Dozen:"} {product.dozenQty}
                </span>
              ) : null}
            </div>
          ) : null}
          <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
            {product.shortDescription[lang] || product.shortDescription.en || product.shortDescription.ar}
          </p>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            {settings.whatsapp.enabled ? <WhatsappButton product={product} size="sm" /> : null}
            {settings.showCartButton ? (
              <Button size="sm" className="gap-2 flex-1" onClick={() => addItem(product)}>
                <ShoppingCart className="size-4" />
                {lang === "ar" ? "أضف" : "Add"}
              </Button>
            ) : null}
          </div>
          {product.images.length > 1 ? (
            <div className="mt-3 flex gap-1 overflow-x-auto">
              {product.images.slice(0, 5).map((img) => (
                <img
                  key={img.id}
                  src={img.src || "/placeholder.svg"}
                  alt={img.caption[lang] || img.caption.en || img.caption.ar || "thumb"}
                  className="h-6 w-6 sm:h-8 sm:w-8 object-cover rounded border flex-shrink-0"
                />
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

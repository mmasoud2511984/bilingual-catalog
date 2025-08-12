"use client"

import { useState } from "react"
import type { Product } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useLanguage } from "./language-provider"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProductGallery({ product }: { product: Product }) {
  const [idx, setIdx] = useState(0)
  const { lang } = useLanguage()

  const images = product.images.length
    ? product.images
    : [
        {
          id: "placeholder",
          src: "/product-gallery.png",
          caption: { ar: "صورة المنتج", en: "Product image" },
        },
      ]

  const current = images[idx] || images[0]

  const nextImage = () => {
    setIdx((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setIdx((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative border rounded-lg overflow-hidden bg-muted">
        {/* Main Image */}
        <div className="relative">
          <img
            src={current.src || "/placeholder.svg"}
            alt={current.caption[lang] || current.caption.en || current.caption.ar}
            className="w-full h-80 sm:h-96 lg:h-[500px] object-cover"
          />

          {/* Navigation arrows for mobile */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 lg:hidden"
                onClick={prevImage}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 lg:hidden"
                onClick={nextImage}
              >
                <ChevronRight className="size-4" />
              </Button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {idx + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Grid - Inside the main container */}
        {images.length > 1 && (
          <div className="p-3 bg-background/95 backdrop-blur-sm border-t">
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setIdx(i)}
                  className={cn(
                    "relative border-2 rounded-md overflow-hidden transition-all duration-200",
                    "hover:border-primary focus:outline-none focus:border-primary",
                    i === idx ? "border-primary ring-2 ring-primary/20" : "border-border",
                  )}
                >
                  <img
                    src={img.src || "/placeholder.svg"}
                    alt={img.caption[lang] || img.caption.en || img.caption.ar}
                    className="w-full h-12 sm:h-16 object-cover"
                  />
                  {i === idx && <div className="absolute inset-0 bg-primary/10" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

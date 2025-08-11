"use client"

import { useState } from "react"
import type { Product } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useLanguage } from "./language-provider"

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

  return (
    <div className="grid gap-3">
      <div className="border rounded-md overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src || "/placeholder.svg"}
          alt={current.caption[lang] || current.caption.en || current.caption.ar}
          className="w-full h-96 object-cover"
        />
      </div>
      <div className="flex gap-2 overflow-auto">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setIdx(i)}
            className={cn(
              "border rounded-md overflow-hidden focus:outline-none focus:ring-2",
              i === idx ? "ring-2 ring-primary" : "",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src || "/placeholder.svg"}
              alt={img.caption[lang] || img.caption.en || img.caption.ar}
              className="h-16 w-16 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { getAllProducts, getAllCategories, getSettings, saveSettings, saveProduct, saveCategory } from "./store"

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, { ...init, cache: "no-store" })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export function useSeedOnce() {
  useEffect(() => {
    ;(async () => {
      if (typeof window === "undefined") return
      if (localStorage.getItem("seeded")) return

      // Try to sync from server first
      const [remoteSettings, remoteCategories, remoteProducts] = await Promise.all([
        fetchJSON<any>("/api/settings"),
        fetchJSON<any[]>("/api/categories"),
        fetchJSON<any[]>("/api/products"),
      ])

      let usedRemote = false

      if (remoteSettings && Object.keys(remoteSettings).length > 0) {
        // If DB settings exist, prefer them
        const def = getSettings()
        const merged = deepMerge(def, remoteSettings)
        saveSettings(merged)
        usedRemote = true
      }

      if (Array.isArray(remoteCategories) && remoteCategories.length > 0) {
        for (const c of remoteCategories) {
          saveCategory({
            id: c.id,
            name: c.name,
            order: c.order ?? 0,
          })
        }
        usedRemote = true
      }

      if (Array.isArray(remoteProducts) && remoteProducts.length > 0) {
        for (const p of remoteProducts) {
          saveProduct({
            id: p.id,
            slug: p.slug,
            sku: p.sku,
            name: p.name,
            shortDescription: p.shortDescription ?? p.short_description ?? { ar: "", en: "" },
            description: p.description,
            images: Array.isArray(p.images)
              ? p.images.map((img: any, i: number) => ({
                  id: img.id,
                  src: img.src,
                  caption: img.caption ?? { ar: "", en: "" },
                  // local type does not need position, order handled by array
                }))
              : [],
            videoUrl: p.videoUrl ?? "", // not persisted on server in this version
            price: Number(p.price ?? 0),
            stock: Number(p.stock ?? 0),
            dozenQty: p.dozenQty ?? p.dozen_qty ?? 0,
            size: p.size ?? "",
            featured: !!p.featured,
            categoryId: p.categoryId ?? p.category_id ?? undefined,
            createdAt: typeof p.createdAt === "string" ? Date.parse(p.createdAt) : (p.createdAt ?? Date.now()),
            order: p.order ?? 0,
          } as any)
        }
        usedRemote = true
      }

      // Fallback demo seed if DB empty or unreachable
      if (!usedRemote) {
        const settings = getSettings()
        if (!settings.header.siteName.ar && !settings.header.siteName.en) {
          saveSettings({
            ...settings,
            header: {
              ...settings.header,
              siteName: { ar: "كتالوج", en: "Catalog" },
              logoAlt: { ar: "شعار", en: "Logo" },
            },
            slider: {
              enabled: true,
              images: [
                { id: "s1", src: "/slide-1-abstract-network.png" },
                { id: "s2", src: "/slide-2-abstract.png" },
                { id: "s3", src: "/slide-3-abstract.png" },
              ],
            },
          })
        }
        if (getAllCategories().length === 0) {
          saveCategory({ id: "c1", name: { ar: "أحذية", en: "Shoes" }, order: 0 })
          saveCategory({ id: "c2", name: { ar: "حقائب", en: "Bags" }, order: 1 })
        }
        if (getAllProducts().length === 0) {
          const demo = [
            {
              id: crypto.randomUUID(),
              slug: "classic-shoe",
              sku: "SH-001",
              name: { ar: "حذاء كلاسيكي", en: "Classic Shoe" },
              shortDescription: { ar: "حذاء مريح وأنيق.", en: "Comfortable and stylish shoe." },
              description: { ar: "تفاصيل طويلة عن المنتج.", en: "Long details about the product." },
              images: [
                { id: crypto.randomUUID(), src: "/single-athletic-shoe.png", caption: { ar: "صورة 1", en: "Image 1" } },
                { id: crypto.randomUUID(), src: "/shoe-2.png", caption: { ar: "صورة 2", en: "Image 2" } },
              ],
              videoUrl: "",
              price: 199,
              stock: 25,
              dozenQty: 12,
              size: "42",
              featured: true,
              categoryId: "c1",
              createdAt: Date.now(),
              order: 0,
            },
            {
              id: crypto.randomUUID(),
              slug: "leather-bag",
              sku: "BG-010",
              name: { ar: "حقيبة جلد", en: "Leather Bag" },
              shortDescription: { ar: "حقيبة جلد فاخرة.", en: "Premium leather bag." },
              description: { ar: "وصف تفصيلي.", en: "Detailed description." },
              images: [{ id: crypto.randomUUID(), src: "/bag-1.png", caption: { ar: "صورة 1", en: "Image 1" } }],
              videoUrl: "",
              price: 349,
              stock: 10,
              dozenQty: 6,
              size: "",
              featured: true,
              categoryId: "c2",
              createdAt: Date.now(),
              order: 1,
            },
          ]
          demo.forEach((p) => saveProduct(p as any))
        }
      }

      localStorage.setItem("seeded", "1")
    })()
  }, [])
  return null
}

function deepMerge<T>(base: T, override: Partial<T>): T {
  if (Array.isArray(base) || Array.isArray(override)) return (override as any) ?? (base as any)
  if (typeof base === "object" && typeof override === "object" && base && override) {
    const out: any = { ...base }
    for (const k of Object.keys(override)) {
      const v: any = (override as any)[k]
      out[k] = deepMerge((base as any)[k], v)
    }
    return out
  }
  return (override as any) ?? (base as any)
}

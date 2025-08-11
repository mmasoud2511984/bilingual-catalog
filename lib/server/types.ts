export type Localized = { ar: string; en: string }

export type ProductImage = {
  id: string
  src: string
  caption: Localized
  position: number
}

export type Product = {
  id: string
  slug: string
  sku: string
  name: Localized
  shortDescription: Localized
  description: Localized
  images: ProductImage[]
  videoUrl?: string | null // optional for future storage
  price: number
  stock: number
  dozenQty?: number | null
  size?: string | null
  featured?: boolean
  categoryId?: string | null
  createdAt: string
  order: number
}

export type Category = {
  id: string
  name: Localized
  order: number
}

export type SettingsRow = {
  id: number
  data: any
}

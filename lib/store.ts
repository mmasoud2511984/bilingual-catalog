"use client"

// This file now serves as a simple wrapper around API calls
// All data is fetched from the server APIs instead of localStorage

export type Localized = { ar: string; en: string }

export type ProductImage = {
  id: string
  src: string
  caption: Localized
}

export type Product = {
  id: string
  slug: string
  sku: string
  name: Localized
  shortDescription: Localized
  description: Localized
  images: ProductImage[]
  videoUrl?: string
  price: number
  stock: number
  dozenQty?: number
  size?: string
  featured?: boolean
  active?: boolean
  categoryId?: string
  createdAt: number
  order: number
}

export type Category = {
  id: string
  name: Localized
  order: number
}

export type Order = {
  id: string
  productId: string
  productName: Localized
  productSku: string
  productPrice: number
  customerName: string
  customerPhone: string
  country: Localized
  city: string
  address: string
  quantity: number
  notes: string
  totalAmount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  createdAt: number
  orderDate: string
  orderTime: string
}

export type Settings = {
  currency: Localized
  showCartButton: boolean
  showDirectOrderButton: boolean
  showStock: boolean
  enableComments: boolean
  whatsapp: {
    enabled: boolean
    phone: string
    defaultMessage: Localized
  }
  header: {
    logoSrc?: string
    logoAlt: Localized
    siteName: Localized
    siteNameColor: string
    siteNameFontSize: number
    sticky: boolean
    bgColor: string
    menuOrientation: "horizontal" | "vertical"
    menuItemColor: string
    topBar: {
      enabled: boolean
      text: Localized
      contact: Localized
    }
  }
  footer: {
    logoSrc?: string
    description: Localized
    quickLinks: { href: string; label: Localized }[]
    contact: Localized
  }
  slider: {
    enabled: boolean
    images: { id: string; src: string }[]
  }
}

// Legacy functions - these are now deprecated
// Use the new hooks from @/lib/hooks/use-api-data instead

export function getAllProducts(): Product[] {
  console.warn("getAllProducts is deprecated. Use useProducts hook instead.")
  return []
}

export function getAllProductsForAdmin(): Product[] {
  console.warn("getAllProductsForAdmin is deprecated. Use useAllProducts hook instead.")
  return []
}

export function getProductBySlug(slug: string): Product | undefined {
  console.warn("getProductBySlug is deprecated. Use useProduct hook instead.")
  return undefined
}

export function getAllCategories(): Category[] {
  console.warn("getAllCategories is deprecated. Use useCategories hook instead.")
  return []
}

export function getAllOrders(): Order[] {
  console.warn("getAllOrders is deprecated. Use useOrders hook instead.")
  return []
}

export function getSettings(): Settings {
  console.warn("getSettings is deprecated. Use useSettings hook instead.")
  return {
    currency: { ar: "ر.س", en: "SAR" },
    showCartButton: true,
    showDirectOrderButton: true,
    showStock: true,
    enableComments: false,
    whatsapp: {
      enabled: true,
      phone: "+966500000000",
      defaultMessage: { ar: "مرحباً، أود الاستفسار عن المنتج", en: "Hello, I am interested in this product" },
    },
    header: {
      logoSrc: "",
      logoAlt: { ar: "", en: "" },
      siteName: { ar: "كتالوج", en: "Catalog" },
      siteNameColor: "#111111",
      siteNameFontSize: 20,
      sticky: true,
      bgColor: "#ffffff",
      menuOrientation: "horizontal",
      menuItemColor: "#222222",
      topBar: {
        enabled: true,
        text: { ar: "أهلاً بكم في متجرنا", en: "Welcome to our store" },
        contact: { ar: "اتصل بنا: 0123456789", en: "Contact: 0123456789" },
      },
    },
    footer: {
      logoSrc: "",
      description: { ar: "وصف مختصر في التذييل.", en: "Short footer description." },
      quickLinks: [{ href: "/", label: { ar: "الرئيسية", en: "Home" } }],
      contact: { ar: "العنوان: ...\nالهاتف: ...", en: "Address: ...\nPhone: ..." },
    },
    slider: {
      enabled: true,
      images: [],
    },
  }
}

// These functions are still used for API operations
export function saveProduct(p: Product) {
  // This is handled by the API now
  console.warn("saveProduct should use API directly")
}

export function deleteProduct(id: string) {
  // This is handled by the API now
  console.warn("deleteProduct should use API directly")
}

export function saveCategory(c: Category) {
  // This is handled by the API now
  console.warn("saveCategory should use API directly")
}

export function deleteCategory(id: string) {
  // This is handled by the API now
  console.warn("deleteCategory should use API directly")
}

export function saveOrder(order: Order) {
  // This is handled by the API now
  console.warn("saveOrder should use API directly")
}

export function updateOrderStatus(id: string, status: Order["status"]) {
  // This is handled by the API now
  console.warn("updateOrderStatus should use API directly")
}

export function deleteOrder(id: string) {
  // This is handled by the API now
  console.warn("deleteOrder should use API directly")
}

export function saveSettings(s: Settings) {
  // This is handled by the API now
  console.warn("saveSettings should use API directly")
}

export function moveCategory(id: string, dir: "up" | "down") {
  // This is handled by the API now
  console.warn("moveCategory should use API directly")
}

export function reorderProducts(ids: string[]) {
  // This is handled by the API now
  console.warn("reorderProducts should use API directly")
}

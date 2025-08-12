"use client"

// Local cache types and helpers, plus background sync to server APIs.

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

const KEYS = {
  products: "cms_products",
  categories: "cms_categories",
  settings: "cms_settings",
  orders: "cms_orders",
}

function safeLocalSet<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch {}
}
function safeLocalGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

async function api<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      cache: "no-store",
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export function getSettings(): Settings {
  const def: Settings = {
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
      siteName: { ar: "", en: "" },
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
  return safeLocalGet<Settings>(KEYS.settings, def)
}

export function saveSettings(s: Settings) {
  safeLocalSet(KEYS.settings, s)
  // background sync to server
  void api<{ ok: true }>("/api/settings", { method: "PUT", body: JSON.stringify(s) })
}

export function getAllProducts(): Product[] {
  const arr = safeLocalGet<Product[]>(KEYS.products, [])
  return arr.sort((a, b) => a.order - b.order)
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug)
}

export function saveProduct(p: Product) {
  const arr = getAllProducts()
  const idx = arr.findIndex((x) => x.id === p.id)
  const slug = p.slug || makeSlug(p.name.en || p.name.ar || "product")
  const prod: Product = { ...p, slug }
  if (idx >= 0) {
    arr[idx] = prod
  } else {
    prod.order = arr.length
    arr.push(prod)
  }
  safeLocalSet(KEYS.products, arr)

  // background sync to server
  const body = {
    ...prod,
    // map image order for server
    images: prod.images.map((img, i) => ({ ...img, position: i })),
  }
  void api<{ ok: true; id: string }>("/api/products", { method: "POST", body: JSON.stringify(body) })
}

export function deleteProduct(id: string) {
  const arr = getAllProducts().filter((p) => p.id !== id)
  safeLocalSet(KEYS.products, arr)
  // server
  void api<{ ok: true }>(`/api/products/${id}`, { method: "DELETE" })
}

export function reorderProducts(ids: string[]) {
  const arr = getAllProducts()
  const map = new Map(ids.map((id, index) => [id, index]))
  arr.forEach((p) => {
    const order = map.get(p.id)
    if (order != null) p.order = order
  })
  safeLocalSet(KEYS.products, arr)
  // server
  void api<{ ok: true }>(`/api/products/reorder`, { method: "POST", body: JSON.stringify({ ids }) })
}

export function getAllCategories(): Category[] {
  const arr = safeLocalGet<Category[]>(KEYS.categories, [])
  return arr.sort((a, b) => a.order - b.order)
}

export function saveCategory(c: Category) {
  const arr = getAllCategories()
  const idx = arr.findIndex((x) => x.id === c.id)
  if (idx >= 0) arr[idx] = c
  else arr.push(c)
  arr.forEach((x, i) => (x.order = i))
  safeLocalSet(KEYS.categories, arr)
  // server
  void api<{ ok: true; id: string }>(`/api/categories`, { method: "POST", body: JSON.stringify(c) })
}

export function deleteCategory(id: string) {
  const arr = getAllCategories().filter((c) => c.id !== id)
  arr.forEach((x, i) => (x.order = i))
  safeLocalSet(KEYS.categories, arr)
  // server
  void api<{ ok: true }>(`/api/categories/${id}`, { method: "DELETE" })
}

export function moveCategory(id: string, dir: "up" | "down") {
  const arr = getAllCategories()
  const i = arr.findIndex((c) => c.id === id)
  if (i === -1) return
  if (dir === "up" && i > 0) {
    const tmp = arr[i - 1]
    arr[i - 1] = arr[i]
    arr[i] = tmp
  }
  if (dir === "down" && i < arr.length - 1) {
    const tmp = arr[i + 1]
    arr[i + 1] = arr[i]
    arr[i] = tmp
  }
  arr.forEach((c, idx) => (c.order = idx))
  safeLocalSet(KEYS.categories, arr)
  // server reorder
  const ids = arr.map((c) => c.id)
  void api<{ ok: true }>(`/api/categories/reorder`, { method: "POST", body: JSON.stringify({ ids }) })
}

export function getAllOrders(): Order[] {
  const arr = safeLocalGet<Order[]>(KEYS.orders, [])
  return arr.sort((a, b) => b.createdAt - a.createdAt)
}

export function saveOrder(order: Order) {
  // Ensure proper time format before saving
  const orderToSave = {
    ...order,
    orderTime:
      order.orderTime.includes("م") || order.orderTime.includes("ص")
        ? new Date().toTimeString().split(" ")[0]
        : order.orderTime,
  }

  const arr = getAllOrders()
  const idx = arr.findIndex((x) => x.id === orderToSave.id)
  if (idx >= 0) {
    arr[idx] = orderToSave
  } else {
    arr.unshift(orderToSave)
  }
  safeLocalSet(KEYS.orders, arr)
  // background sync to server
  void api<{ ok: true; id: string }>("/api/orders", { method: "POST", body: JSON.stringify(orderToSave) })
}

export function updateOrderStatus(id: string, status: Order["status"]) {
  const arr = getAllOrders()
  const idx = arr.findIndex((x) => x.id === id)
  if (idx >= 0) {
    arr[idx].status = status
    safeLocalSet(KEYS.orders, arr)
    // server
    void api<{ ok: true }>(`/api/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) })
  }
}

export function deleteOrder(id: string) {
  const arr = getAllOrders().filter((o) => o.id !== id)
  safeLocalSet(KEYS.orders, arr)
  // server
  void api<{ ok: true }>(`/api/orders/${id}`, { method: "DELETE" })
}

function makeSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

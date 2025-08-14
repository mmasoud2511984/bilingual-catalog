"use client"

import { useState, useEffect, useCallback } from "react"
import type { Product, Category, Order, Settings } from "@/lib/store"

// Generic API fetch function
async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...options,
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Error for ${url}:`, error)
    return null
  }
}

// Hook for products
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    const data = await fetchAPI<Product[]>("/api/products")

    if (data) {
      // Filter only active products for public view
      const activeProducts = data.filter((p) => p.active !== false)
      setProducts(activeProducts)
    } else {
      setError("Failed to fetch products")
      setProducts([])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}

// Hook for all products (admin view)
export function useAllProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    const data = await fetchAPI<Product[]>("/api/products")

    if (data) {
      setProducts(data)
    } else {
      setError("Failed to fetch products")
      setProducts([])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}

// Hook for categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)

    const data = await fetchAPI<Category[]>("/api/categories")

    if (data) {
      setCategories(data)
    } else {
      setError("Failed to fetch categories")
      setCategories([])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, loading, error, refetch: fetchCategories }
}

// Hook for orders
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)

    const response = await fetchAPI<{ orders: any[] }>("/api/orders")

    if (response?.orders) {
      // Convert server format to local format
      const formattedOrders = response.orders.map((order: any) => ({
        id: order.id,
        productId: order.product_id,
        productName: {
          ar: order.product_name_ar,
          en: order.product_name_en,
        },
        productSku: order.product_sku,
        productPrice: Number(order.product_price),
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        country: {
          ar: order.country_ar || "",
          en: order.country_en || "",
        },
        city: order.city,
        address: order.address,
        quantity: Number(order.quantity),
        notes: order.notes || "",
        totalAmount: Number(order.total_amount),
        status: order.status,
        createdAt: new Date(order.created_at).getTime(),
        orderDate: order.order_date,
        orderTime: order.order_time,
      }))

      setOrders(formattedOrders)
    } else {
      setError("Failed to fetch orders")
      setOrders([])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return { orders, loading, error, refetch: fetchOrders }
}

// Hook for settings
export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    setError(null)

    const data = await fetchAPI<Settings>("/api/settings")

    if (data) {
      setSettings(data)
    } else {
      // Fallback to default settings
      const defaultSettings: Settings = {
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
      setSettings(defaultSettings)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return { settings, loading, error, refetch: fetchSettings }
}

// Hook for single product by slug
export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    if (!slug) return

    setLoading(true)
    setError(null)

    const products = await fetchAPI<Product[]>("/api/products")

    if (products) {
      const foundProduct = products.find((p) => p.slug === slug && p.active !== false)
      setProduct(foundProduct || null)
      if (!foundProduct) {
        setError("Product not found")
      }
    } else {
      setError("Failed to fetch product")
      setProduct(null)
    }

    setLoading(false)
  }, [slug])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  return { product, loading, error, refetch: fetchProduct }
}

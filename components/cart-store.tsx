"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { Product } from "@/lib/store"

type CartItem = {
  id: string
  name: string
  sku: string
  price: number
  quantity: number
  image?: string
}

type CartContextType = {
  items: CartItem[]
  count: number
  total: number
  addItem: (product: Product, qty?: number) => void
  updateQuantity: (id: string, qty: number) => void
  removeItem: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const raw = localStorage.getItem("cart")
    if (raw) {
      try {
        setItems(JSON.parse(raw))
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const value = useMemo<CartContextType>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem: (product, qty = 1) =>
        setItems((arr) => {
          const existing = arr.find((item) => item.id === product.id)
          if (existing) {
            return arr.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + qty } : item))
          }
          return [
            ...arr,
            {
              id: product.id,
              name: product.name.en || product.name.ar,
              sku: product.sku,
              price: product.price,
              quantity: qty,
              image: product.images[0]?.src,
            },
          ]
        }),
      updateQuantity: (id, qty) =>
        setItems((arr) => {
          if (qty <= 0) {
            return arr.filter((item) => item.id !== id)
          }
          return arr.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
        }),
      removeItem: (id) => setItems((arr) => arr.filter((item) => item.id !== id)),
      clear: () => setItems([]),
    }),
    [items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

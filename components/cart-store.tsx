"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { Product } from "@/lib/store"

type CartItem = { id: string; qty: number; price: number; name: string }
type CartContextType = {
  count: number
  items: CartItem[]
  addItem: (p: Product, qty?: number) => void
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
      count: items.reduce((s, i) => s + i.qty, 0),
      items,
      addItem: (p, qty = 1) =>
        setItems((arr) => {
          const ex = arr.find((i) => i.id === p.id)
          if (ex) return arr.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i))
          return [...arr, { id: p.id, qty, price: p.price, name: p.name.en || p.name.ar }]
        }),
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

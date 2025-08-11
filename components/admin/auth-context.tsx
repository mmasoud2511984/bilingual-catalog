"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type Ctx = {
  isAuthed: boolean
  login: (pin: string) => void
  logout: () => void
  setPin: (pin: string) => void
}
const AdminAuthContext = createContext<Ctx | null>(null)
const PIN_KEY = "admin_pin"
const TOKEN_KEY = "admin_token"

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [pin, setPinState] = useState("1234")
  const [isAuthed, setAuthed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedPin = localStorage.getItem(PIN_KEY)
    if (savedPin) setPinState(savedPin)
    const tok = localStorage.getItem(TOKEN_KEY)
    setAuthed(!!tok)
  }, [])

  const value = useMemo<Ctx>(
    () => ({
      isAuthed,
      login: (p: string) => {
        if (p === pin) {
          localStorage.setItem(TOKEN_KEY, "ok")
          setAuthed(true)
          router.push("/admin")
        } else {
          alert("Invalid PIN")
        }
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY)
        setAuthed(false)
        router.push("/admin/login")
      },
      setPin: (p: string) => {
        setPinState(p)
        localStorage.setItem(PIN_KEY, p)
      },
    }),
    [isAuthed, pin, router],
  )
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider")
  return ctx
}

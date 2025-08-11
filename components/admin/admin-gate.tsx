"use client"

import type React from "react"

import { useAdminAuth } from "./auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AdminGate({ children }: { children: React.ReactNode }) {
  const { isAuthed } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthed) router.replace("/admin/login")
  }, [isAuthed, router])

  if (!isAuthed) return null
  return <>{children}</>
}

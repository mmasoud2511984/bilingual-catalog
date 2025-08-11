"use client"

import type React from "react"

import { AdminAuthProvider } from "@/components/admin/auth-context"

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>
}

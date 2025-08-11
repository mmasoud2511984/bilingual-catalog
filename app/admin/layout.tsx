"use client"

import type React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/auth-context"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main className="container px-4 py-6 flex-1">
        <AdminAuthProvider>
          <AdminShell>{children}</AdminShell>
        </AdminAuthProvider>
      </main>
      <SiteFooter />
    </div>
  )
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthed, logout } = useAdminAuth()
  const { lang } = useLanguage()

  return (
    <>
      {isAuthed ? (
        <div className="flex items-center justify-between mb-4">
          <nav className="flex gap-2 text-sm">
            <Link href="/admin" className="hover:underline">
              {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
            </Link>
            <span>{" / "}</span>
          </nav>
          <Button variant="outline" size="sm" onClick={logout}>
            {lang === "ar" ? "تسجيل خروج" : "Logout"}
          </Button>
        </div>
      ) : null}
      {children}
    </>
  )
}

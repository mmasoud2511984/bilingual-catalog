"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AdminAuthProvider } from "@/components/admin/auth-context"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Settings, Package, FolderOpen, ShoppingBag, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { lang } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    {
      name: lang === "ar" ? "لوحة التحكم" : "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: lang === "ar" ? "المنتجات" : "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: lang === "ar" ? "الفئات" : "Categories",
      href: "/admin/categories",
      icon: FolderOpen,
    },
    {
      name: lang === "ar" ? "الطلبات" : "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: lang === "ar" ? "الإعدادات" : "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-background">
          {sidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:inset-0",
        )}
      >
        <div className="flex flex-col h-full pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h2 className="text-lg font-semibold">{lang === "ar" ? "لوحة التحكم" : "Admin Panel"}</h2>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <item.icon className={cn("mr-3 flex-shrink-0 h-5 w-5", lang === "ar" ? "ml-3 mr-0" : "")} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn("transition-all duration-200", "lg:pl-64")}>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  )
}

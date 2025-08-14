"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Settings, Tags } from "lucide-react"
import { useLanguage } from "../language-provider"
import { useAllProducts, useCategories } from "@/lib/hooks/use-api-data"

export function DashboardCards() {
  const { lang } = useLanguage()
  const { products } = useAllProducts()
  const { categories } = useCategories()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">{lang === "ar" ? "المنتجات" : "Products"}</CardTitle>
          <Package className="size-5" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{products.length}</div>
          <Link href="/admin/products" className="text-sm text-primary hover:underline">
            {lang === "ar" ? "إدارة المنتجات" : "Manage products"}
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">{lang === "ar" ? "الفئات" : "Categories"}</CardTitle>
          <Tags className="size-5" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{categories.length}</div>
          <Link href="/admin/categories" className="text-sm text-primary hover:underline">
            {lang === "ar" ? "إدارة الفئات" : "Manage categories"}
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">{lang === "ar" ? "الإعدادات" : "Settings"}</CardTitle>
          <Settings className="size-5" />
        </CardHeader>
        <CardContent>
          <Link href="/admin/settings" className="text-sm text-primary hover:underline">
            {lang === "ar" ? "إدارة الإعدادات" : "Manage settings"}
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

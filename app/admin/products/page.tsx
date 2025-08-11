"use client"

import { AdminGate } from "@/components/admin/admin-gate"
import { ProductsManager } from "@/components/admin/products-manager"

export default function AdminProductsPage() {
  return (
    <AdminGate>
      <ProductsManager />
    </AdminGate>
  )
}

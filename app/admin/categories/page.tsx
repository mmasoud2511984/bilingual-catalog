"use client"

import { AdminGate } from "@/components/admin/admin-gate"
import { CategoriesManager } from "@/components/admin/categories-manager"

export default function AdminCategoriesPage() {
  return (
    <AdminGate>
      <CategoriesManager />
    </AdminGate>
  )
}

"use client"

import { AdminGate } from "@/components/admin/admin-gate"
import { DashboardCards } from "@/components/admin/dashboard-cards"

export default function AdminPage() {
  return (
    <AdminGate>
      <DashboardCards />
    </AdminGate>
  )
}

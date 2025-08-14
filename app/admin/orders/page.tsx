"use client"

import { AdminGate } from "@/components/admin/admin-gate"
import { useOrders } from "@/lib/hooks/use-api-data"
import { useLanguage } from "@/components/language-provider"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Eye, RefreshCw, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export default function OrdersPage() {
  const { lang } = useLanguage()
  const { orders, loading, refetch } = useOrders()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date_desc")

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders]

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Sort orders
    switch (sortBy) {
      case "date_asc":
        filtered.sort((a, b) => a.createdAt - b.createdAt)
        break
      case "date_desc":
        filtered.sort((a, b) => b.createdAt - a.createdAt)
        break
      case "status":
        filtered.sort((a, b) => a.status.localeCompare(b.status))
        break
      case "amount_asc":
        filtered.sort((a, b) => a.totalAmount - b.totalAmount)
        break
      case "amount_desc":
        filtered.sort((a, b) => b.totalAmount - a.totalAmount)
        break
      case "customer":
        filtered.sort((a, b) => a.customerName.localeCompare(b.customerName))
        break
      default:
        filtered.sort((a, b) => b.createdAt - a.createdAt)
    }

    return filtered
  }, [orders, statusFilter, sortBy])

  const handleStatusChange = async (orderId: string, newStatus: any) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await refetch()
        alert(lang === "ar" ? "تم تحديث حالة الطلب" : "Order status updated")
      } else {
        throw new Error("Failed to update order status")
      }
    } catch (error) {
      alert(lang === "ar" ? "حدث خطأ في تحديث الطلب" : "Error updating order")
    }
  }

  const handleDelete = async (orderId: string) => {
    if (confirm(lang === "ar" ? "هل أنت متأكد من حذف هذا الطلب؟" : "Are you sure you want to delete this order?")) {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await refetch()
          alert(lang === "ar" ? "تم حذف الطلب بنجاح" : "Order deleted successfully")
        } else {
          throw new Error("Failed to delete order")
        }
      } catch (error) {
        alert(lang === "ar" ? "حدث خطأ في حذف الطلب" : "Error deleting order")
      }
    }
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: { ar: "قيد الانتظار", en: "Pending" },
      confirmed: { ar: "مؤكد", en: "Confirmed" },
      shipped: { ar: "تم الشحن", en: "Shipped" },
      delivered: { ar: "تم التسليم", en: "Delivered" },
      cancelled: { ar: "ملغي", en: "Cancelled" },
    }
    return statusMap[status as keyof typeof statusMap]?.[lang] || status
  }

  if (loading) {
    return (
      <AdminGate>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="size-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">{lang === "ar" ? "جاري تحميل الطلبات..." : "Loading orders..."}</p>
          </div>
        </div>
      </AdminGate>
    )
  }

  return (
    <AdminGate>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{lang === "ar" ? "إدارة الطلبات" : "Orders Management"}</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={refetch} className="gap-2 bg-transparent">
              <RefreshCw className="size-4" />
              {lang === "ar" ? "تحديث" : "Refresh"}
            </Button>
            <div className="text-sm text-muted-foreground">
              {lang === "ar" ? `إجمالي الطلبات: ${orders.length}` : `Total Orders: ${orders.length}`}
            </div>
          </div>
        </div>

        {/* Sorting and filtering tools */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={lang === "ar" ? "فرز حسب الحالة" : "Filter by Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === "ar" ? "جميع الحالات" : "All Status"}</SelectItem>
                <SelectItem value="pending">{lang === "ar" ? "قيد الانتظار" : "Pending"}</SelectItem>
                <SelectItem value="confirmed">{lang === "ar" ? "مؤكد" : "Confirmed"}</SelectItem>
                <SelectItem value="shipped">{lang === "ar" ? "تم الشحن" : "Shipped"}</SelectItem>
                <SelectItem value="delivered">{lang === "ar" ? "تم التسليم" : "Delivered"}</SelectItem>
                <SelectItem value="cancelled">{lang === "ar" ? "ملغي" : "Cancelled"}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={lang === "ar" ? "ترتيب حسب" : "Sort by"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">{lang === "ar" ? "الأحدث أولاً" : "Newest First"}</SelectItem>
                <SelectItem value="date_asc">{lang === "ar" ? "الأقدم أولاً" : "Oldest First"}</SelectItem>
                <SelectItem value="status">{lang === "ar" ? "الحالة" : "Status"}</SelectItem>
                <SelectItem value="amount_desc">{lang === "ar" ? "المبلغ (الأعلى)" : "Amount (High)"}</SelectItem>
                <SelectItem value="amount_asc">{lang === "ar" ? "المبلغ (الأقل)" : "Amount (Low)"}</SelectItem>
                <SelectItem value="customer">{lang === "ar" ? "اسم العميل" : "Customer Name"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground flex items-center">
            {lang === "ar"
              ? `عرض ${filteredAndSortedOrders.length} من ${orders.length} طلب`
              : `Showing ${filteredAndSortedOrders.length} of ${orders.length} orders`}
          </div>
        </div>

        {filteredAndSortedOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground">
                {statusFilter === "all"
                  ? lang === "ar"
                    ? "لا توجد طلبات بعد"
                    : "No orders yet"
                  : lang === "ar"
                    ? "لا توجد طلبات بهذه الحالة"
                    : "No orders with this status"}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-lg">
                      {lang === "ar" ? `طلب #${order.id.slice(-6)}` : `Order #${order.id.slice(-6)}`}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}>
                        {getStatusText(order.status)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {order.orderDate} {order.orderTime.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium mb-1">{lang === "ar" ? "المنتج:" : "Product:"}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.productName[lang] || order.productName.en || order.productName.ar}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {lang === "ar" ? "رقم:" : "SKU:"} {order.productSku}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">{lang === "ar" ? "العميل:" : "Customer:"}</div>
                      <div className="text-sm text-muted-foreground">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">{lang === "ar" ? "المجموع:" : "Total:"}</div>
                      <div className="text-sm font-semibold">
                        {order.totalAmount.toFixed(2)} {lang === "ar" ? "ر.س" : "SAR"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {lang === "ar" ? "الكمية:" : "Qty:"} {order.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 justify-between">
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Eye className="size-4" />
                            {lang === "ar" ? "عرض" : "View"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {lang === "ar"
                                ? `تفاصيل الطلب #${order.id.slice(-6)}`
                                : `Order Details #${order.id.slice(-6)}`}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">
                                  {lang === "ar" ? "معلومات المنتج" : "Product Information"}
                                </h4>
                                <div className="text-sm space-y-1">
                                  <div>
                                    <strong>{lang === "ar" ? "الاسم:" : "Name:"}</strong>{" "}
                                    {order.productName[lang] || order.productName.en || order.productName.ar}
                                  </div>
                                  <div>
                                    <strong>{lang === "ar" ? "رقم المنتج:" : "SKU:"}</strong> {order.productSku}
                                  </div>
                                  <div>
                                    <strong>{lang === "ar" ? "السعر:" : "Price:"}</strong>{" "}
                                    {order.productPrice.toFixed(2)} {lang === "ar" ? "ر.س" : "SAR"}
                                  </div>
                                  <div>
                                    <strong>{lang === "ar" ? "الكمية:" : "Quantity:"}</strong> {order.quantity}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">
                                  {lang === "ar" ? "معلومات العميل" : "Customer Information"}
                                </h4>
                                <div className="text-sm space-y-1">
                                  <div>
                                    <strong>{lang === "ar" ? "الاسم:" : "Name:"}</strong> {order.customerName}
                                  </div>
                                  <div>
                                    <strong>{lang === "ar" ? "الجوال:" : "Phone:"}</strong> {order.customerPhone}
                                  </div>
                                  <div>
                                    <strong>{lang === "ar" ? "الدولة:" : "Country:"}</strong>{" "}
                                    {order.country[lang] || order.country.en || order.country.ar}
                                  </div>
                                  <div>
                                    <strong>{lang === "ar" ? "المدينة:" : "City:"}</strong> {order.city}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">{lang === "ar" ? "العنوان" : "Address"}</h4>
                              <div className="text-sm p-3 bg-muted rounded-md">{order.address}</div>
                            </div>
                            {order.notes && (
                              <div>
                                <h4 className="font-medium mb-2">{lang === "ar" ? "ملاحظات" : "Notes"}</h4>
                                <div className="text-sm p-3 bg-muted rounded-md">{order.notes}</div>
                              </div>
                            )}
                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  {lang === "ar" ? "المجموع الكلي:" : "Total Amount:"}
                                </span>
                                <span className="text-lg font-bold">
                                  {order.totalAmount.toFixed(2)} {lang === "ar" ? "ر.س" : "SAR"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(order.id)} className="gap-2">
                        <Trash2 className="size-4" />
                        {lang === "ar" ? "حذف" : "Delete"}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{lang === "ar" ? "الحالة:" : "Status:"}</span>
                      <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">{lang === "ar" ? "قيد الانتظار" : "Pending"}</SelectItem>
                          <SelectItem value="confirmed">{lang === "ar" ? "مؤكد" : "Confirmed"}</SelectItem>
                          <SelectItem value="shipped">{lang === "ar" ? "تم الشحن" : "Shipped"}</SelectItem>
                          <SelectItem value="delivered">{lang === "ar" ? "تم التسليم" : "Delivered"}</SelectItem>
                          <SelectItem value="cancelled">{lang === "ar" ? "ملغي" : "Cancelled"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminGate>
  )
}

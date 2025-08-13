"use client"

import { AdminGate } from "@/components/admin/admin-gate"
import { getAllOrders, updateOrderStatus, deleteOrder } from "@/lib/store"
import { useLanguage } from "@/components/language-provider"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Eye, RefreshCw } from "lucide-react"
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
  const [orders, setOrders] = useState(getAllOrders())
  const [loading, setLoading] = useState(false)

  // Function to fetch orders from server
  const fetchOrdersFromServer = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/orders", { cache: "no-store" })
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data.orders)) {
          // Convert server format to local format
          const serverOrders = data.orders.map((order: any) => ({
            id: order.id,
            productId: order.product_id,
            productName: {
              ar: order.product_name_ar,
              en: order.product_name_en,
            },
            productSku: order.product_sku,
            productPrice: Number(order.product_price),
            customerName: order.customer_name,
            customerPhone: order.customer_phone,
            country: {
              ar: order.country_ar || "",
              en: order.country_en || "",
            },
            city: order.city,
            address: order.address,
            quantity: Number(order.quantity),
            notes: order.notes || "",
            totalAmount: Number(order.total_amount),
            status: order.status,
            createdAt: new Date(order.created_at).getTime(),
            orderDate: order.order_date,
            orderTime: order.order_time,
          }))

          // Merge with local orders
          const localOrders = getAllOrders()
          const allOrders = [...serverOrders, ...localOrders]

          // Remove duplicates based on ID
          const uniqueOrders = allOrders.filter(
            (order, index, self) => index === self.findIndex((o) => o.id === order.id),
          )

          // Sort by creation date (newest first)
          uniqueOrders.sort((a, b) => b.createdAt - a.createdAt)

          setOrders(uniqueOrders)
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      // Fallback to local orders only
      setOrders(getAllOrders())
    } finally {
      setLoading(false)
    }
  }

  // Load orders on component mount
  useEffect(() => {
    fetchOrdersFromServer()
  }, [])

  const handleStatusChange = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus)
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const handleDelete = (orderId: string) => {
    if (confirm(lang === "ar" ? "هل أنت متأكد من حذف هذا الطلب؟" : "Are you sure you want to delete this order?")) {
      deleteOrder(orderId)
      setOrders((prev) => prev.filter((order) => order.id !== orderId))
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

  return (
    <AdminGate>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{lang === "ar" ? "إدارة الطلبات" : "Orders Management"}</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchOrdersFromServer}
              disabled={loading}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              {lang === "ar" ? "تحديث" : "Refresh"}
            </Button>
            <div className="text-sm text-muted-foreground">
              {lang === "ar" ? `إجمالي الطلبات: ${orders.length}` : `Total Orders: ${orders.length}`}
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="text-muted-foreground">{lang === "ar" ? "جاري تحميل الطلبات..." : "Loading orders..."}</div>
          </div>
        )}

        {orders.length === 0 && !loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground">{lang === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}</div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
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

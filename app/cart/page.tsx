"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useCart } from "@/components/cart-store"
import { useLanguage } from "@/components/language-provider"
import { getSettings } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const COUNTRIES = [
  { code: "SA", name: { ar: "السعودية", en: "Saudi Arabia" }, prefix: "+966" },
  { code: "AE", name: { ar: "الإمارات", en: "UAE" }, prefix: "+971" },
  { code: "KW", name: { ar: "الكويت", en: "Kuwait" }, prefix: "+965" },
  { code: "QA", name: { ar: "قطر", en: "Qatar" }, prefix: "+974" },
  { code: "BH", name: { ar: "البحرين", en: "Bahrain" }, prefix: "+973" },
  { code: "OM", name: { ar: "عمان", en: "Oman" }, prefix: "+968" },
  { code: "JO", name: { ar: "الأردن", en: "Jordan" }, prefix: "+962" },
  { code: "LB", name: { ar: "لبنان", en: "Lebanon" }, prefix: "+961" },
  { code: "EG", name: { ar: "مصر", en: "Egypt" }, prefix: "+20" },
]

export default function CartPage() {
  const { lang } = useLanguage()
  const { items, updateQuantity, removeItem, clear, total } = useCart()
  const settings = getSettings()
  const currency = settings.currency[lang] || settings.currency.en || settings.currency.ar

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }, [lang])

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="container px-4 py-12 flex-1">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="size-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">{lang === "ar" ? "السلة فارغة" : "Cart is Empty"}</h1>
            <p className="text-muted-foreground mb-6">
              {lang === "ar"
                ? "لم تقم بإضافة أي منتجات إلى السلة بعد"
                : "You haven't added any products to your cart yet"}
            </p>
            <Link href="/">
              <Button className="gap-2">
                <ShoppingBag className="size-4" />
                {lang === "ar" ? "تسوق الآن" : "Start Shopping"}
              </Button>
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container px-4 py-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{lang === "ar" ? "سلة التسوق" : "Shopping Cart"}</h1>
            <Button variant="outline" onClick={clear} className="gap-2 bg-transparent">
              <Trash2 className="size-4" />
              {lang === "ar" ? "إفراغ السلة" : "Clear Cart"}
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {lang === "ar" ? "رقم:" : "SKU:"} {item.sku}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            >
                              <Minus className="size-3" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {currency} {(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {currency} {item.price.toFixed(2)} {lang === "ar" ? "للقطعة" : "each"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>{lang === "ar" ? "ملخص الطلب" : "Order Summary"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{lang === "ar" ? "المجموع الفرعي:" : "Subtotal:"}</span>
                    <span>
                      {currency} {total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{lang === "ar" ? "عدد القطع:" : "Items:"}</span>
                    <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{lang === "ar" ? "المجموع:" : "Total:"}</span>
                    <span>
                      {currency} {total.toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <CheckoutDialog items={items} total={total} currency={currency} />
                    <Link href="/" className="block">
                      <Button variant="outline" className="w-full bg-transparent">
                        {lang === "ar" ? "متابعة التسوق" : "Continue Shopping"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function CheckoutDialog({ items, total, currency }: { items: any[]; total: number; currency: string }) {
  const { lang } = useLanguage()
  const { clear } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    countryCode: "SA",
    phonePrefix: "+966",
    city: "",
    address: "",
    notes: "",
  })

  const handleCountryChange = (countryCode: string) => {
    const country = COUNTRIES.find((c) => c.code === countryCode)
    if (country) {
      setFormData((prev) => ({
        ...prev,
        countryCode,
        phonePrefix: country.prefix,
      }))
    }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert(lang === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields")
      return
    }

    setLoading(true)
    try {
      // Create order for each item in cart
      for (const item of items) {
        const orderData = {
          id: `${Date.now()}-${item.id}`,
          productId: item.id,
          productName: { ar: item.name, en: item.name },
          productSku: item.sku,
          productPrice: item.price,
          customerName: formData.name,
          customerPhone: `${formData.phonePrefix}${formData.phone}`,
          country: COUNTRIES.find((c) => c.code === formData.countryCode)?.name || { ar: "", en: "" },
          city: formData.city,
          address: formData.address,
          quantity: item.quantity,
          notes: formData.notes,
          totalAmount: item.price * item.quantity,
          status: "pending",
          createdAt: Date.now(),
          orderDate: new Date().toISOString().split("T")[0],
          orderTime: new Date().toTimeString().split(" ")[0],
        }

        // Save order (you can import saveOrder from lib/store)
        // saveOrder(orderData)
      }

      alert(lang === "ar" ? "تم إرسال طلبك بنجاح!" : "Your order has been submitted successfully!")
      clear() // Clear cart
      setIsOpen(false)
      setFormData({
        name: "",
        phone: "",
        countryCode: "SA",
        phonePrefix: "+966",
        city: "",
        address: "",
        notes: "",
      })
    } catch (error) {
      alert(lang === "ar" ? "حدث خطأ في إرسال الطلب" : "Error submitting order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2" size="lg">
          <CreditCard className="size-4" />
          {lang === "ar" ? "إتمام الطلب" : "Checkout"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lang === "ar" ? "إتمام الطلب" : "Checkout"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{lang === "ar" ? "الاسم الكامل *" : "Full Name *"}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder={lang === "ar" ? "اسمك الكامل" : "Your full name"}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>{lang === "ar" ? "الدولة" : "Country"}</Label>
            <Select value={formData.countryCode} onValueChange={handleCountryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name[lang]} ({country.prefix})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">{lang === "ar" ? "رقم الجوال *" : "Mobile Number *"}</Label>
            <div className="flex gap-2">
              <div className="w-20 px-3 py-2 border rounded-md bg-muted text-sm">{formData.phonePrefix}</div>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder={lang === "ar" ? "5xxxxxxxx" : "5xxxxxxxx"}
                required
                className="flex-1"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="city">{lang === "ar" ? "المحافظة/المدينة" : "Province/City"}</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
              placeholder={lang === "ar" ? "الرياض، جدة، الدمام..." : "Riyadh, Jeddah, Dammam..."}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">{lang === "ar" ? "تفاصيل العنوان *" : "Address Details *"}</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder={lang === "ar" ? "الحي، الشارع، رقم المبنى..." : "District, Street, Building number..."}
              required
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">{lang === "ar" ? "ملاحظات" : "Notes"}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder={lang === "ar" ? "ملاحظات إضافية..." : "Additional notes..."}
              rows={2}
            />
          </div>

          <div className="p-3 bg-muted rounded-md text-sm">
            <div className="font-medium mb-2">{lang === "ar" ? "ملخص الطلب:" : "Order Summary:"}</div>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between mb-1">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  {currency} {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex justify-between font-medium">
              <span>{lang === "ar" ? "المجموع:" : "Total:"}</span>
              <span>
                {currency} {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? lang === "ar"
                ? "جاري الإرسال..."
                : "Submitting..."
              : lang === "ar"
                ? "تأكيد الطلب"
                : "Confirm Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { notFound, useParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getProductBySlug, getSettings, saveOrder } from "@/lib/store"
import { ProductGallery } from "@/components/product-gallery"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, MessageSquare, Star, Play } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { WhatsappButton } from "@/components/whatsapp-button"
import { useCart } from "@/components/cart-store"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateId } from "@/lib/utils"

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

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const product = getProductBySlug(params?.slug || "")
  const settings = getSettings()
  const { lang } = useLanguage()
  const { addItem } = useCart()

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }, [lang])

  if (!product) return notFound()

  const currency = settings.currency[lang] || settings.currency.en || settings.currency.ar

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url: string) => {
    if (!url) return ""

    // YouTube watch URL to embed
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    // YouTube short URL to embed
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    // Already embed URL
    if (url.includes("youtube.com/embed/")) {
      return url
    }

    // Other video platforms or direct embed URLs
    return url
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container px-4 py-6 flex-1">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <ProductGallery product={product} />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex-1">
                {product.name[lang] || product.name.en || product.name.ar}
              </h1>
              {product.size ? (
                <Badge variant="secondary" className="w-fit">
                  {product.size}
                </Badge>
              ) : null}
            </div>
            <div className="text-sm text-muted-foreground">
              {lang === "ar" ? "رقم المنتج" : "SKU"}: {product.sku}
            </div>
            <div className="text-2xl sm:text-3xl font-bold">
              {currency} {product.price.toFixed(2)}
            </div>
            {settings.showStock ? (
              <div className="text-sm">
                {lang === "ar" ? "الكمية المتاحة:" : "In stock:"} <span className="font-medium">{product.stock}</span>
                {product.dozenQty ? (
                  <span className="ms-3 text-muted-foreground">
                    {lang === "ar" ? "كمية الدستة" : "Dozen qty"}: {product.dozenQty}
                  </span>
                ) : null}
              </div>
            ) : null}
            <p className="text-sm sm:text-base leading-relaxed">
              {product.shortDescription[lang] || product.shortDescription.en || product.shortDescription.ar}
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              {settings.whatsapp.enabled ? <WhatsappButton product={product} /> : null}
              {settings.showCartButton ? (
                <Button onClick={() => addItem(product)} className="gap-2">
                  <ShoppingCart className="size-4" />
                  {lang === "ar" ? "أضف إلى السلة" : "Add to cart"}
                </Button>
              ) : null}
              {settings.showDirectOrderButton ? <DirectOrderDialog product={product} /> : null}
            </div>

            <section className="mt-6">
              <h2 className="font-semibold mb-2">{lang === "ar" ? "الوصف" : "Description"}</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                {product.description[lang] || product.description.en || product.description.ar}
              </p>
            </section>

            {product.videoUrl ? (
              <section className="mt-6">
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  <Play className="size-4" />
                  {lang === "ar" ? "فيديو المنتج" : "Product Video"}
                </h2>
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black border">
                  <iframe
                    src={getEmbedUrl(product.videoUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={product.name[lang] || product.name.en || product.name.ar}
                    loading="lazy"
                  />
                </div>
              </section>
            ) : null}

            {settings.enableComments ? (
              <section className="mt-6">
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="size-4 text-yellow-500" />
                  {lang === "ar" ? "مراجعات العملاء" : "Customer Reviews"}
                </h2>
                <div className="text-muted-foreground text-sm">
                  {lang === "ar" ? "لا توجد مراجعات بعد." : "No reviews yet."}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function DirectOrderDialog({ product }: { product: any }) {
  const { lang } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    countryCode: "SA",
    phonePrefix: "+966",
    city: "",
    address: "",
    quantity: 1,
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
      const orderData = {
        id: generateId(),
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        productPrice: product.price,
        customerName: formData.name,
        customerPhone: `${formData.phonePrefix}${formData.phone}`,
        country: COUNTRIES.find((c) => c.code === formData.countryCode)?.name || { ar: "", en: "" },
        city: formData.city,
        address: formData.address,
        quantity: formData.quantity,
        notes: formData.notes,
        totalAmount: product.price * formData.quantity,
        status: "pending",
        createdAt: Date.now(),
        orderDate: new Date().toISOString().split("T")[0],
        orderTime: new Date().toTimeString().split(" ")[0], // Use 24-hour format HH:MM:SS
      }

      saveOrder(orderData)

      alert(lang === "ar" ? "تم إرسال طلبك بنجاح!" : "Your order has been submitted successfully!")
      setIsOpen(false)
      setFormData({
        name: "",
        phone: "",
        countryCode: "SA",
        phonePrefix: "+966",
        city: "",
        address: "",
        quantity: 1,
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
        <Button variant="outline" className="gap-2 bg-transparent">
          <MessageSquare className="size-4" />
          {lang === "ar" ? "طلب مباشر" : "Direct Order"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lang === "ar" ? "طلب مباشر" : "Direct Order"}</DialogTitle>
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
            <Label htmlFor="quantity">{lang === "ar" ? "الكمية" : "Quantity"}</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))}
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
            <div className="font-medium mb-1">{lang === "ar" ? "تفاصيل الطلب:" : "Order Details:"}</div>
            <div>{product.name[lang] || product.name.en || product.name.ar}</div>
            <div className="text-muted-foreground">
              {lang === "ar" ? "رقم المنتج:" : "SKU:"} {product.sku}
            </div>
            <div className="font-medium mt-2">
              {lang === "ar" ? "المجموع:" : "Total:"} {(product.price * formData.quantity).toFixed(2)}{" "}
              {lang === "ar" ? "ر.س" : "SAR"}
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
                ? "إرسال الطلب"
                : "Submit Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

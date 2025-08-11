"use client"

import { notFound, useParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getProductBySlug, getSettings } from "@/lib/store"
import { ProductGallery } from "@/components/product-gallery"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, MessageSquare, Star } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { WhatsappButton } from "@/components/whatsapp-button"
import { useCart } from "@/components/cart-store"
import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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

  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main className="container px-4 py-6 flex-1">
        <div className="grid lg:grid-cols-2 gap-8">
          <ProductGallery product={product} />
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <h1 className="text-2xl md:text-3xl font-bold">
                {product.name[lang] || product.name.en || product.name.ar}
              </h1>
              {product.size ? (
                <Badge variant="secondary" className="ms-auto">
                  {product.size}
                </Badge>
              ) : null}
            </div>
            <div className="text-muted-foreground">
              {lang === "ar" ? "رقم المنتج" : "SKU"}: {product.sku}
            </div>
            <div className="text-3xl font-bold">
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
            <p className="text-sm md:text-base leading-relaxed">
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
              {settings.showDirectOrderButton ? (
                <DirectOrderDialog productName={product.name[lang] || product.name.en || product.name.ar} />
              ) : null}
            </div>

            <section className="mt-6">
              <h2 className="font-semibold mb-2">{lang === "ar" ? "الوصف" : "Description"}</h2>
              <p className="text-muted-foreground">
                {product.description[lang] || product.description.en || product.description.ar}
              </p>
            </section>

            {product.videoUrl ? (
              <section className="mt-6">
                <h2 className="font-semibold mb-2">{lang === "ar" ? "فيديو المنتج" : "Product Video"}</h2>
                <div className="aspect-video w-full rounded-md overflow-hidden bg-black">
                  <iframe
                    src={product.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={product.name[lang] || product.name.en || product.name.ar}
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

function DirectOrderDialog({ productName }: { productName: string }) {
  const { lang } = useLanguage()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <MessageSquare className="size-4" />
          {lang === "ar" ? "طلب مباشر" : "Direct Order"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{lang === "ar" ? "طلب مباشر" : "Direct Order"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="name">{lang === "ar" ? "الاسم" : "Name"}</Label>
            <Input id="name" placeholder={lang === "ar" ? "اسمك" : "Your name"} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">{lang === "ar" ? "الهاتف" : "Phone"}</Label>
            <Input id="phone" placeholder="+966..." />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="note">{lang === "ar" ? "ملاحظات" : "Notes"}</Label>
            <Textarea id="note" placeholder={lang === "ar" ? "ملاحظات إضافية" : "Additional notes"} />
          </div>
          <div className="text-sm text-muted-foreground">
            {lang === "ar" ? "المنتج" : "Product"}: {productName}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">{lang === "ar" ? "إرسال" : "Send"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useLanguage } from "./language-provider"
import { getSettings, type Product } from "@/lib/store"
import { cn } from "@/lib/utils"

export function WhatsappButton({
  product,
  size = "default",
}: {
  product: Product
  size?: "sm" | "default" | "lg"
}) {
  const { lang } = useLanguage()
  const settings = getSettings()
  const phone = settings.whatsapp.phone.replace(/\D/g, "")

  const handleWhatsAppClick = async () => {
    const textMessage =
      (settings.whatsapp.defaultMessage[lang] ||
        settings.whatsapp.defaultMessage.en ||
        settings.whatsapp.defaultMessage.ar ||
        "") +
      " - " +
      (product.name[lang] || product.name.en || product.name.ar) +
      " (" +
      product.sku +
      ")"

    // إذا كان هناك صورة، حاول إرفاقها
    const mainImage = product.images[0]?.src

    if (mainImage && mainImage.startsWith("data:image/")) {
      // للصور المحفوظة كـ base64، نحتاج لتحويلها لرابط مؤقت
      try {
        const response = await fetch(mainImage)
        const blob = await response.blob()
        const file = new File([blob], `${product.sku}.jpg`, { type: "image/jpeg" })

        // استخدام Web Share API إذا كان متاحاً
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: product.name[lang] || product.name.en || product.name.ar,
            text: textMessage,
            files: [file],
          })
          return
        }
      } catch (error) {
        console.log("Could not share image, falling back to text only")
      }
    }

    // الطريقة التقليدية - نص فقط
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(textMessage)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Button size={size} variant="outline" className={cn("gap-2")} onClick={handleWhatsAppClick}>
      <MessageCircle className="size-4 text-green-600" />
      {lang === "ar" ? "واتساب" : "WhatsApp"}
    </Button>
  )
}

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

  const textDefault =
    (settings.whatsapp.defaultMessage[lang] ||
      settings.whatsapp.defaultMessage.en ||
      settings.whatsapp.defaultMessage.ar ||
      "") +
    " - " +
    (product.name[lang] || product.name.en || product.name.ar) +
    " (" +
    product.sku +
    ")"

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(textDefault)}`

  return (
    <Button asChild size={size} variant="outline" className={cn("gap-2")}>
      <a href={url} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <MessageCircle className="size-4 text-green-600" />
        {lang === "ar" ? "واتساب" : "WhatsApp"}
      </a>
    </Button>
  )
}

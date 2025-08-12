"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useLanguage } from "./language-provider"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const { lang } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={lang === "ar" ? "تبديل الثيم" : "Toggle theme"}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{lang === "ar" ? "تبديل الثيم" : "Toggle theme"}</span>
    </Button>
  )
}

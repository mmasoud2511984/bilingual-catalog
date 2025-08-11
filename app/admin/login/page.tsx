"use client"

import { useAdminAuth } from "@/components/admin/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const { login } = useAdminAuth()
  const { lang } = useLanguage()

  return (
    <div className="container px-4 py-10 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>{lang === "ar" ? "تسجيل الدخول للوحة التحكم" : "Admin Login"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              const data = new FormData(e.currentTarget)
              login(String(data.get("pin") || ""))
            }}
          >
            <Label htmlFor="pin">{lang === "ar" ? "الرقم السري" : "PIN"}</Label>
            <Input id="pin" name="pin" type="password" placeholder="••••" />
            <Button type="submit">{lang === "ar" ? "دخول" : "Login"}</Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">
            {lang === "ar" ? "الافتراضي: 1234 (لأغراض العرض فقط)" : "Default: 1234 (demo only)"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

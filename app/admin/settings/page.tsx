"use client"

import { AdminGate } from "@/components/admin/admin-gate"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeaderSettingsForm } from "@/components/admin/header-settings-form"
import { SiteSettingsForm } from "@/components/admin/site-settings-form"
import { FooterSettingsForm } from "@/components/admin/footer-settings-form"
import { SliderSettings } from "@/components/admin/slider-settings"
import { useLanguage } from "@/components/language-provider"

export default function SettingsPage() {
  const { lang } = useLanguage()
  return (
    <AdminGate>
      <Tabs defaultValue="site" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="site">{lang === "ar" ? "الموقع" : "Site"}</TabsTrigger>
          <TabsTrigger value="header">{lang === "ar" ? "الهيدر" : "Header"}</TabsTrigger>
          <TabsTrigger value="slider">{lang === "ar" ? "السلايدر" : "Slider"}</TabsTrigger>
          <TabsTrigger value="footer">{lang === "ar" ? "التذييل" : "Footer"}</TabsTrigger>
        </TabsList>
        <TabsContent value="site">
          <SiteSettingsForm />
        </TabsContent>
        <TabsContent value="header">
          <HeaderSettingsForm />
        </TabsContent>
        <TabsContent value="slider">
          <SliderSettings />
        </TabsContent>
        <TabsContent value="footer">
          <FooterSettingsForm />
        </TabsContent>
      </Tabs>
    </AdminGate>
  )
}

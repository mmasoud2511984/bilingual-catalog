"use client"

import React from "react"

import { useState } from "react"
import { useAllProducts, useCategories } from "@/lib/hooks/use-api-data"
import type { Product } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash, Edit, Loader2, AlertCircle } from "lucide-react"
import { generateId } from "@/lib/utils"
import { cn } from "@/lib/utils"

type ValidationErrors = {
  sku?: string
  nameAr?: string
  nameEn?: string
  shortDescAr?: string
  shortDescEn?: string
  price?: string
  images?: string
}

export function ProductsManager() {
  const { lang } = useLanguage()
  const { products, loading: productsLoading, refetch: refetchProducts } = useAllProducts()
  const { categories, loading: categoriesLoading } = useCategories()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const handleSave = async (product: Product) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          images: product.images.map((img, i) => ({ ...img, position: i })),
        }),
      })

      if (response.ok) {
        await refetchProducts()
        setEditingProduct(null)
        alert(lang === "ar" ? "تم حفظ المنتج بنجاح" : "Product saved successfully")
      } else {
        throw new Error("Failed to save product")
      }
    } catch (error) {
      alert(lang === "ar" ? "حدث خطأ في حفظ المنتج" : "Error saving product")
    }
  }

  const handleReorder = async (newOrder: Product[]) => {
    try {
      const ids = newOrder.map((p) => p.id)

      const response = await fetch("/api/products/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })

      if (response.ok) {
        await refetchProducts()
      } else {
        throw new Error("Failed to reorder products")
      }
    } catch (error) {
      alert(lang === "ar" ? "حدث خطأ في إعادة ترتيب المنتجات" : "Error reordering products")
    }
  }

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{lang === "ar" ? "جاري تحميل المنتجات..." : "Loading products..."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{lang === "ar" ? "المنتجات" : "Products"}</CardTitle>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => {
              const { active, over } = e
              if (over && active.id !== over.id) {
                const oldIndex = products.findIndex((i) => i.id === active.id)
                const newIndex = products.findIndex((i) => i.id === over.id)
                const newOrder = arrayMove(products, oldIndex, newIndex)
                handleReorder(newOrder)
              }
            }}
          >
            <SortableContext items={products.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <ul className="grid gap-2">
                {products.map((p) => (
                  <SortableRow key={p.id} product={p} onEdit={handleEdit} onRefetch={refetchProducts} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      <Editor
        cats={categories}
        editingProduct={editingProduct}
        onSaved={handleSave}
        onCancel={() => setEditingProduct(null)}
      />
    </div>
  )
}

function SortableRow({
  product,
  onEdit,
  onRefetch,
}: {
  product: Product
  onEdit: (product: Product) => void
  onRefetch: () => void
}) {
  const { lang } = useLanguage()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <li ref={setNodeRef} style={style} className="border rounded-md p-2 flex items-center gap-3">
      <button className="cursor-grab" {...attributes} {...listeners} aria-label="drag handle">
        <GripVertical className="size-4 text-muted-foreground" />
      </button>
      <img
        src={product.images[0]?.src || "/placeholder.svg?height=60&width=80&query=product"}
        alt="thumb"
        className="h-12 w-16 object-cover rounded"
      />
      <div className="flex-1">
        <div className="font-medium flex items-center gap-2">
          {product.name[lang] || product.name.en || product.name.ar}
          {product.active === false && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              {lang === "ar" ? "معطل" : "Inactive"}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">{product.sku}</div>
      </div>
      <div className="flex gap-1">
        <Button variant="outline" size="icon" onClick={() => onEdit(product)}>
          <Edit className="size-4" />
        </Button>
        <DeleteButton id={product.id} onRefetch={onRefetch} />
      </div>
    </li>
  )
}

function DeleteButton({ id, onRefetch }: { id: string; onRefetch: () => void }) {
  const { lang } = useLanguage()

  const handleDelete = async () => {
    if (confirm(lang === "ar" ? "حذف المنتج؟" : "Delete product?")) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await onRefetch()
          alert(lang === "ar" ? "تم حذف المنتج بنجاح" : "Product deleted successfully")
        } else {
          throw new Error("Failed to delete product")
        }
      } catch (error) {
        alert(lang === "ar" ? "حدث خطأ في حذف المنتج" : "Error deleting product")
      }
    }
  }

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete}>
      <Trash className="size-4" />
    </Button>
  )
}

function Editor({
  cats,
  editingProduct,
  onSaved,
  onCancel,
}: {
  cats: { id: string; name: { ar: string; en: string } }[]
  editingProduct: Product | null
  onSaved: (product: Product) => void
  onCancel: () => void
}) {
  const { lang } = useLanguage()
  const [f, setF] = useState<Product>(editingProduct || blankProduct())
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [priceInput, setPriceInput] = useState<string>("")

  // Update form when editingProduct changes
  React.useEffect(() => {
    if (editingProduct) {
      setF(editingProduct)
      setPriceInput(editingProduct.price.toString())
    } else {
      setF(blankProduct())
      setPriceInput("0")
    }
    setErrors({})
  }, [editingProduct])

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // SKU validation
    if (!f.sku.trim()) {
      newErrors.sku = lang === "ar" ? "رقم المنتج مطلوب" : "SKU is required"
    }

    // Name validation
    if (!f.name.ar.trim()) {
      newErrors.nameAr = lang === "ar" ? "الاسم بالعربية مطلوب" : "Arabic name is required"
    }
    if (!f.name.en.trim()) {
      newErrors.nameEn = lang === "ar" ? "الاسم بالإنجليزية مطلوب" : "English name is required"
    }

    // Short description validation
    if (!f.shortDescription.ar.trim()) {
      newErrors.shortDescAr = lang === "ar" ? "الوصف المختصر بالعربية مطلوب" : "Arabic short description is required"
    }
    if (!f.shortDescription.en.trim()) {
      newErrors.shortDescEn =
        lang === "ar" ? "الوصف المختصر بالإنجليزية مطلوب" : "English short description is required"
    }

    // Price validation
    const price = Number.parseFloat(priceInput)
    if (isNaN(price) || price <= 0) {
      newErrors.price = lang === "ar" ? "السعر يجب أن يكون رقم أكبر من صفر" : "Price must be a number greater than 0"
    }

    // Images validation
    if (f.images.length === 0) {
      newErrors.images = lang === "ar" ? "يجب إضافة صورة واحدة على الأقل" : "At least one image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      alert(lang === "ar" ? "يرجى تصحيح الأخطاء قبل الحفظ" : "Please fix errors before saving")
      return
    }

    // Update price from input
    const price = Number.parseFloat(priceInput)
    const updatedProduct = { ...f, price }

    // Generate slug from name if not editing
    if (!editingProduct) {
      const slug = (updatedProduct.name.en || updatedProduct.name.ar)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      updatedProduct.slug = slug
    }

    onSaved(updatedProduct)
    if (!editingProduct) {
      setF(blankProduct())
      setPriceInput("0")
      setErrors({})
    }
  }

  const handleCancel = () => {
    onCancel()
    if (!editingProduct) {
      setF(blankProduct())
      setPriceInput("0")
      setErrors({})
    }
  }

  const handlePriceChange = (value: string) => {
    // Allow only numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, "")

    // Prevent multiple decimal points
    const parts = cleanValue.split(".")
    if (parts.length > 2) {
      return
    }

    setPriceInput(cleanValue)

    // Clear price error when user starts typing
    if (errors.price) {
      setErrors({ ...errors, price: undefined })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingProduct
            ? lang === "ar"
              ? "تعديل منتج"
              : "Edit Product"
            : lang === "ar"
              ? "إضافة منتج"
              : "Add Product"}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Tabs defaultValue="general">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="general">{lang === "ar" ? "عام" : "General"}</TabsTrigger>
            <TabsTrigger value="media">{lang === "ar" ? "الصور/الفيديو" : "Media"}</TabsTrigger>
            <TabsTrigger value="content">{lang === "ar" ? "النصوص" : "Texts"}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="grid gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="flex items-center gap-1">
                  SKU <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={f.sku}
                  onChange={(e) => {
                    setF({ ...f, sku: e.target.value })
                    if (errors.sku) setErrors({ ...errors, sku: undefined })
                  }}
                  className={cn(errors.sku && "border-red-500")}
                />
                {errors.sku && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="size-3" />
                    {errors.sku}
                  </div>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1">
                  {lang === "ar" ? "السعر" : "Price"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={priceInput}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className={cn(errors.price && "border-red-500", "no-spinner")}
                  style={{
                    MozAppearance: "textfield",
                  }}
                />
                {errors.price && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="size-3" />
                    {errors.price}
                  </div>
                )}
              </div>

              <div>
                <Label>{lang === "ar" ? "المقاس" : "Size"}</Label>
                <Input value={f.size || ""} onChange={(e) => setF({ ...f, size: e.target.value })} />
              </div>

              <div>
                <Label>{lang === "ar" ? "المخزون" : "Stock"}</Label>
                <Input
                  type="number"
                  value={String(f.stock)}
                  onChange={(e) => setF({ ...f, stock: Number(e.target.value || 0) })}
                />
              </div>

              <div>
                <Label>{lang === "ar" ? "كمية الدستة" : "Dozen Quantity"}</Label>
                <Input
                  type="number"
                  value={String(f.dozenQty || 0)}
                  onChange={(e) => setF({ ...f, dozenQty: Number(e.target.value || 0) })}
                />
              </div>

              <div>
                <Label>{lang === "ar" ? "الفئة" : "Category"}</Label>
                <Select
                  value={f.categoryId || "none"}
                  onValueChange={(v) => setF({ ...f, categoryId: v === "none" ? undefined : v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{lang === "ar" ? "بدون" : "None"}</SelectItem>
                    {cats.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name[lang] || c.name.en || c.name.ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  id="featured"
                  type="checkbox"
                  checked={!!f.featured}
                  onChange={(e) => setF({ ...f, featured: e.target.checked })}
                />
                <Label htmlFor="featured">{lang === "ar" ? "مميز" : "Featured"}</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="active"
                  type="checkbox"
                  checked={f.active !== false}
                  onChange={(e) => setF({ ...f, active: e.target.checked })}
                />
                <Label htmlFor="active">{lang === "ar" ? "مفعل" : "Active"}</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="grid gap-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label className="flex items-center gap-1">
                  {lang === "ar" ? "صور المنتج" : "Product Images"} <span className="text-red-500">*</span>
                </Label>
                <div className="grid gap-2">
                  {f.images.map((img, i) => (
                    <div key={img.id} className="flex items-center gap-2">
                      <img
                        src={img.src || "/placeholder.svg"}
                        alt={"img " + (i + 1)}
                        className="h-16 w-16 object-cover rounded border"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder={lang === "ar" ? "وصف (ع)" : "Caption (AR)"}
                          value={img.caption.ar}
                          onChange={(e) => {
                            const arr = f.images.slice()
                            arr[i] = { ...img, caption: { ...img.caption, ar: e.target.value } }
                            setF({ ...f, images: arr })
                          }}
                        />
                        <Input
                          placeholder="Caption (EN)"
                          value={img.caption.en}
                          onChange={(e) => {
                            const arr = f.images.slice()
                            arr[i] = { ...img, caption: { ...img.caption, en: e.target.value } }
                            setF({ ...f, images: arr })
                          }}
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const arr = f.images.slice()
                          if (i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]
                          setF({ ...f, images: arr })
                        }}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const arr = f.images.slice()
                          if (i < arr.length - 1) [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]
                          setF({ ...f, images: arr })
                        }}
                      >
                        ↓
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          const arr = f.images.slice()
                          arr.splice(i, 1)
                          setF({ ...f, images: arr })
                          if (errors.images && arr.length > 0) {
                            setErrors({ ...errors, images: undefined })
                          }
                        }}
                      >
                        {lang === "ar" ? "حذف" : "Remove"}
                      </Button>
                    </div>
                  ))}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const dataUrl = await fileToDataUrl(file)
                      setF({
                        ...f,
                        images: [...f.images, { id: generateId(), src: dataUrl, caption: { ar: "", en: "" } }],
                      })
                      if (errors.images) {
                        setErrors({ ...errors, images: undefined })
                      }
                    }}
                  />
                </div>
                {errors.images && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="size-3" />
                    {errors.images}
                  </div>
                )}
              </div>

              <div>
                <Label>{lang === "ar" ? "رابط الفيديو (اختياري)" : "Video URL (optional)"}</Label>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={f.videoUrl || ""}
                  onChange={(e) => setF({ ...f, videoUrl: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="grid gap-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label className="flex items-center gap-1">
                  {lang === "ar" ? "اسم (ع)" : "Name (AR)"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={f.name.ar}
                  onChange={(e) => {
                    setF({ ...f, name: { ...f.name, ar: e.target.value } })
                    if (errors.nameAr) setErrors({ ...errors, nameAr: undefined })
                  }}
                  className={cn(errors.nameAr && "border-red-500")}
                />
                {errors.nameAr && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="size-3" />
                    {errors.nameAr}
                  </div>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1">
                  {lang === "ar" ? "اسم (EN)" : "Name (EN)"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={f.name.en}
                  onChange={(e) => {
                    setF({ ...f, name: { ...f.name, en: e.target.value } })
                    if (errors.nameEn) setErrors({ ...errors, nameEn: undefined })
                  }}
                  className={cn(errors.nameEn && "border-red-500")}
                />
                {errors.nameEn && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="size-3" />
                    {errors.nameEn}
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label className="flex items-center gap-1">
                  {lang === "ar" ? "وصف مختصر (ع)" : "Short Desc (AR)"} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={f.shortDescription.ar}
                  onChange={(e) => {
                    setF({ ...f, shortDescription: { ...f.shortDescription, ar: e.target.value } })
                    if (errors.shortDescAr) setErrors({ ...errors, shortDescAr: undefined })
                  }}
                  className={cn(errors.shortDescAr && "border-red-500")}
                />
                {errors.shortDescAr && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="size-3" />
                    {errors.shortDescAr}
                  </div>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1">
                  {lang === "ar" ? "وصف مختصر (EN)" : "Short Desc (EN)"} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={f.shortDescription.en}
                  onChange={(e) => {
                    setF({ ...f, shortDescription: { ...f.shortDescription, en: e.target.value } })
                    if (errors.shortDescEn) setErrors({ ...errors, shortDescEn: undefined })
                  }}
                  className={cn(errors.shortDescEn && "border-red-500")}
                />
                {errors.shortDescEn && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="size-3" />
                    {errors.shortDescEn}
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>{lang === "ar" ? "الوصف (ع)" : "Description (AR)"}</Label>
                <Textarea
                  value={f.description.ar}
                  onChange={(e) => setF({ ...f, description: { ...f.description, ar: e.target.value } })}
                />
              </div>
              <div>
                <Label>{lang === "ar" ? "الوصف (EN)" : "Description (EN)"}</Label>
                <Textarea
                  value={f.description.en}
                  onChange={(e) => setF({ ...f, description: { ...f.description, en: e.target.value } })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button onClick={handleSave}>
            {editingProduct
              ? lang === "ar"
                ? "حفظ التعديلات"
                : "Save Changes"
              : lang === "ar"
                ? "حفظ المنتج"
                : "Save Product"}
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function blankProduct(): Product {
  return {
    id: generateId(),
    slug: "",
    sku: "",
    name: { ar: "", en: "" },
    shortDescription: { ar: "", en: "" },
    description: { ar: "", en: "" },
    images: [],
    videoUrl: "",
    price: 0,
    stock: 0,
    dozenQty: 0,
    size: "",
    featured: false,
    active: true,
    categoryId: undefined,
    createdAt: Date.now(),
    order: 0,
  }
}

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

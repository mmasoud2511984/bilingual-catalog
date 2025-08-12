"use client"

import React from "react"

import { useState } from "react"
import {
  getAllProducts,
  getAllCategories,
  type Product,
  saveProduct,
  deleteProduct,
  reorderProducts,
} from "@/lib/store"
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
import { GripVertical, Trash, Edit } from "lucide-react"

export function ProductsManager() {
  const { lang } = useLanguage()
  const [items, setItems] = useState(getAllProducts())
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const cats = getAllCategories()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const handleSave = (product: Product) => {
    saveProduct(product)
    setItems(getAllProducts())
    setEditingProduct(null)
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
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over.id)
                const arr = arrayMove(items, oldIndex, newIndex)
                setItems(arr)
                reorderProducts(arr.map((p) => p.id))
              }
            }}
          >
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <ul className="grid gap-2">
                {items.map((p) => (
                  <SortableRow key={p.id} product={p} onEdit={handleEdit} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      <Editor
        cats={cats}
        editingProduct={editingProduct}
        onSaved={(product) => {
          handleSave(product)
        }}
        onCancel={() => setEditingProduct(null)}
      />
    </div>
  )
}

function SortableRow({ product, onEdit }: { product: Product; onEdit: (product: Product) => void }) {
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
        <div className="font-medium">{product.name[lang] || product.name.en || product.name.ar}</div>
        <div className="text-xs text-muted-foreground">{product.sku}</div>
      </div>
      <div className="flex gap-1">
        <Button variant="outline" size="icon" onClick={() => onEdit(product)}>
          <Edit className="size-4" />
        </Button>
        <DeleteButton id={product.id} />
      </div>
    </li>
  )
}

function DeleteButton({ id }: { id: string }) {
  const { lang } = useLanguage()
  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={() => {
        if (confirm(lang === "ar" ? "حذف المنتج؟" : "Delete product?")) {
          deleteProduct(id)
          window.location.reload()
        }
      }}
    >
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

  // Update form when editingProduct changes
  React.useEffect(() => {
    if (editingProduct) {
      setF(editingProduct)
    } else {
      setF(blankProduct())
    }
  }, [editingProduct])

  const handleSave = () => {
    onSaved(f)
    if (!editingProduct) {
      setF(blankProduct()) // Reset form only for new products
    }
  }

  const handleCancel = () => {
    onCancel()
    if (!editingProduct) {
      setF(blankProduct())
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
                <Label>SKU</Label>
                <Input value={f.sku} onChange={(e) => setF({ ...f, sku: e.target.value })} />
              </div>
              <div>
                <Label>{lang === "ar" ? "السعر" : "Price"}</Label>
                <Input
                  type="number"
                  value={String(f.price)}
                  onChange={(e) => setF({ ...f, price: Number(e.target.value || 0) })}
                />
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
            <div className="flex items-center gap-2">
              <input
                id="featured"
                type="checkbox"
                checked={!!f.featured}
                onChange={(e) => setF({ ...f, featured: e.target.checked })}
              />
              <Label htmlFor="featured">{lang === "ar" ? "مميز" : "Featured"}</Label>
            </div>
          </TabsContent>
          <TabsContent value="media" className="grid gap-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>{lang === "ar" ? "صور المنتج" : "Product Images"}</Label>
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
                        images: [...f.images, { id: crypto.randomUUID(), src: dataUrl, caption: { ar: "", en: "" } }],
                      })
                    }}
                  />
                </div>
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
                <Label>{lang === "ar" ? "اسم (ع)" : "Name (AR)"} </Label>
                <Input value={f.name.ar} onChange={(e) => setF({ ...f, name: { ...f.name, ar: e.target.value } })} />
              </div>
              <div>
                <Label>{lang === "ar" ? "اسم (EN)" : "Name (EN)"} </Label>
                <Input value={f.name.en} onChange={(e) => setF({ ...f, name: { ...f.name, en: e.target.value } })} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>{lang === "ar" ? "وصف مختصر (ع)" : "Short Desc (AR)"} </Label>
                <Textarea
                  value={f.shortDescription.ar}
                  onChange={(e) => setF({ ...f, shortDescription: { ...f.shortDescription, ar: e.target.value } })}
                />
              </div>
              <div>
                <Label>{lang === "ar" ? "وصف مختصر (EN)" : "Short Desc (EN)"} </Label>
                <Textarea
                  value={f.shortDescription.en}
                  onChange={(e) => setF({ ...f, shortDescription: { ...f.shortDescription, en: e.target.value } })}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>{lang === "ar" ? "الوصف (ع)" : "Description (AR)"} </Label>
                <Textarea
                  value={f.description.ar}
                  onChange={(e) => setF({ ...f, description: { ...f.description, ar: e.target.value } })}
                />
              </div>
              <div>
                <Label>{lang === "ar" ? "الوصف (EN)" : "Description (EN)"} </Label>
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
    id: crypto.randomUUID(),
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

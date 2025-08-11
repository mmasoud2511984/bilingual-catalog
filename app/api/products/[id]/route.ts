import { NextResponse } from "next/server"
import { sql } from "@/lib/server/db"

// PUT /api/products/:id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const id = params.id

  await sql /* sql */`
    update products set
      slug = ${body.slug},
      sku = ${body.sku},
      name = ${body.name as any},
      short_description = ${body.shortDescription as any},
      description = ${body.description as any},
      price = ${body.price ?? 0},
      stock = ${body.stock ?? 0},
      dozen_qty = ${body.dozenQty ?? null},
      size = ${body.size ?? null},
      featured = ${body.featured ?? false},
      category_id = ${body.categoryId ?? null},
      "order" = ${body.order ?? 0}
    where id = ${id};
  `

  if (Array.isArray(body.images)) {
    await sql /* sql */`delete from product_images where product_id = ${id};`
    for (let i = 0; i < body.images.length; i++) {
      const img = body.images[i]
      await sql /* sql */`
        insert into product_images (id, product_id, src, caption, position)
        values (${img.id}, ${id}, ${img.src}, ${img.caption as any}, ${img.position ?? i})
      `
    }
  }

  return NextResponse.json({ ok: true })
}

// DELETE /api/products/:id
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await sql /* sql */`delete from products where id = ${params.id};`
  return NextResponse.json({ ok: true })
}

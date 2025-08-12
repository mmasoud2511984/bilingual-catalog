import { NextResponse } from "next/server"
import { sql } from "@/lib/server/db"
import type { Product } from "@/lib/server/types"

// GET /api/products
export async function GET() {
  const rows = await sql /* sql */`
    select 
      p.id,
      p.slug,
      p.sku,
      p.name,
      p.short_description as "shortDescription",
      p.description,
      p.price::float as price,
      p.stock,
      p.dozen_qty as "dozenQty",
      p.size,
      p.featured,
      p.category_id as "categoryId",
      p.created_at as "createdAt",
      p."order",
      coalesce(
        json_agg(
          json_build_object(
            'id', i.id,
            'src', i.src,
            'caption', i.caption,
            'position', i.position
          ) 
          order by i.position
        ) filter (where i.id is not null),
        '[]'
      ) as images
    from products p
    left join product_images i on i.product_id = p.id
    group by p.id
    order by p."order" asc, p.created_at desc;
  `
  return NextResponse.json(rows as Product[])
}

// POST /api/products (create or update with images)
export async function POST(req: Request) {
  const body = await req.json()
  const {
    id,
    slug,
    sku,
    name,
    shortDescription,
    description,
    price,
    stock,
    dozenQty,
    size,
    featured,
    categoryId,
    order,
    images = [],
  } = body as Partial<Product>

  // upsert product
  const [product] = await sql /* sql */`
    insert into products (
      id, slug, sku, name, short_description, description, price, stock, dozen_qty, size, featured, category_id, "order"
    )
    values (
      ${id ?? null},
      ${slug},
      ${sku},
      ${name as any},
      ${shortDescription as any},
      ${description as any},
      ${price ?? 0},
      ${stock ?? 0},
      ${dozenQty ?? null},
      ${size ?? null},
      ${featured ?? false},
      ${categoryId ?? null},
      ${order ?? 0}
    )
    on conflict (id)
    do update set
      slug = excluded.slug,
      sku = excluded.sku,
      name = excluded.name,
      short_description = excluded.short_description,
      description = excluded.description,
      price = excluded.price,
      stock = excluded.stock,
      dozen_qty = excluded.dozen_qty,
      size = excluded.size,
      featured = excluded.featured,
      category_id = excluded.category_id,
      "order" = excluded."order"
    returning id;
  `

  // replace images
  await sql /* sql */`delete from product_images where product_id = ${product.id};`

  if (Array.isArray(images) && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      await sql /* sql */`
        insert into product_images (id, product_id, src, caption, position)
        values (${img.id}, ${product.id}, ${img.src}, ${img.caption as any}, ${img.position ?? i})
      `
    }
  }

  return NextResponse.json({ ok: true, id: product.id })
}

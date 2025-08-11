// app/api/products/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";
import type { Product } from "@/lib/server/types";

// GET /api/products
export async function GET() {
  const rows = await query(`
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
    order by p."order" asc, p.created_at desc
  `);
  return NextResponse.json(rows as Product[]);
}

// POST /api/products (create or update with images)
export async function POST(req: Request) {
  const body = await req.json();
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
  } = body as Partial<Product>;

  // لو فيه id نعمل upsert، لو ما فيه نعمل insert عادي
  let productId: string;

  if (id) {
    const upsert = await query<{ id: string }>(
      `
      insert into products (
        id, slug, sku, name, short_description, description, price, stock, dozen_qty, size, featured, category_id, "order"
      ) values (
        $1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7, $8, $9, $10, $11, $12, $13
      )
      on conflict (id) do update set
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
      returning id
    `,
      [
        id,
        slug,
        sku,
        JSON.stringify(name),
        JSON.stringify(shortDescription),
        JSON.stringify(description),
        price ?? 0,
        stock ?? 0,
        dozenQty ?? null,
        size ?? null,
        featured ?? false,
        categoryId ?? null,
        order ?? 0,
      ]
    );
    productId = upsert[0].id;
  } else {
    const ins = await query<{ id: string }>(
      `
      insert into products (
        slug, sku, name, short_description, description, price, stock, dozen_qty, size, featured, category_id, "order"
      ) values (
        $1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6, $7, $8, $9, $10, $11, $12
      )
      returning id
    `,
      [
        slug,
        sku,
        JSON.stringify(name),
        JSON.stringify(shortDescription),
        JSON.stringify(description),
        price ?? 0,
        stock ?? 0,
        dozenQty ?? null,
        size ?? null,
        featured ?? false,
        categoryId ?? null,
        order ?? 0,
      ]
    );
    productId = ins[0].id;
  }

  // replace images
  await query(`delete from product_images where product_id = $1`, [productId]);

  if (Array.isArray(images) && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await query(
        `
        insert into product_images (id, product_id, src, caption, position)
        values ($1, $2, $3, $4, $5)
      `,
        [img.id ?? null, productId, img.src, JSON.stringify(img.caption ?? null), img.position ?? i]
      );
    }
  }

  return NextResponse.json({ ok: true, id: productId });
}

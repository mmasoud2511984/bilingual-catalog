import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";
import type { Product } from "@/lib/server/types";

// ✅ GET /api/products
export async function GET() {
  try {
    const rows = await query<Product>(/* sql */`
      SELECT 
        p.id,
        p.slug,
        p.sku,
        p.name,
        p.short_description AS "shortDescription",
        p.description,
        p.price::float AS price,
        p.stock,
        p.dozen_qty AS "dozenQty",
        p.size,
        p.featured,
        p.category_id AS "categoryId",
        p.created_at AS "createdAt",
        p."order",
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'url', pi.url
            )
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) AS images
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ✅ POST /api/products
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await query<Product>(/* sql */`
      INSERT INTO products (
        slug, sku, name, short_description, description,
        price, stock, dozen_qty, size, featured,
        category_id, "order"
      )
      VALUES (
        $1, $2, $3::jsonb, $4::jsonb, $5::jsonb,
        $6, $7, $8, $9, $10,
        $11, $12
      )
      RETURNING *
    `, [
      body.slug,
      body.sku,
      JSON.stringify(body.name),
      JSON.stringify(body.shortDescription),
      JSON.stringify(body.description),
      body.price,
      body.stock,
      body.dozenQty,
      body.size,
      body.featured,
      body.categoryId,
      body.order
    ]);

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

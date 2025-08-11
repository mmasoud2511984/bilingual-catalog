import { NextResponse } from "next/server"
import { sql } from "@/lib/server/db"
import type { Category } from "@/lib/server/types"

// GET /api/categories
export async function GET() {
  const rows = await sql /* sql */`
    select id, name, "order"
    from categories
    order by "order" asc;
  `
  return NextResponse.json(rows as Category[])
}

// POST /api/categories (create or update)
export async function POST(req: Request) {
  const body = await req.json()
  const { id, name, order } = body as Partial<Category>

  const [row] = await sql /* sql */`
    insert into categories (id, name, "order")
    values (${id ?? null}, ${name as any}, ${order ?? 0})
    on conflict (id) do update set
      name = excluded.name,
      "order" = excluded."order"
    returning id;
  `
  return NextResponse.json({ ok: true, id: row.id })
}

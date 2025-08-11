import { NextResponse } from "next/server"
import { sql } from "@/lib/server/db"

// PUT /api/categories/:id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  await sql /* sql */`update categories set name = ${body.name as any}, "order" = ${body.order ?? 0} where id = ${params.id};`
  return NextResponse.json({ ok: true })
}

// DELETE /api/categories/:id
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await sql /* sql */`delete from categories where id = ${params.id};`
  return NextResponse.json({ ok: true })
}

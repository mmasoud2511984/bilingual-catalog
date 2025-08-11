import { NextResponse } from "next/server"
import { sql } from "@/lib/server/db"

export async function POST(req: Request) {
  const { ids } = (await req.json()) as { ids: string[] }
  if (!Array.isArray(ids)) return NextResponse.json({ ok: false }, { status: 400 })

  for (let i = 0; i < ids.length; i++) {
    await sql /* sql */`update categories set "order" = ${i} where id = ${ids[i]};`
  }
  return NextResponse.json({ ok: true })
}

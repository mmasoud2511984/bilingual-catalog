import { NextResponse } from "next/server"
import { sql } from "@/lib/server/db"

// GET /api/settings
export async function GET() {
  const [row] = await sql /* sql */`select data from settings where id = 1;`
  return NextResponse.json(row?.data ?? {})
}

// PUT /api/settings
export async function PUT(req: Request) {
  const data = await req.json()
  await sql /* sql */`insert into settings (id, data) values (1, ${data as any})
                      on conflict (id) do update set data = excluded.data;`
  return NextResponse.json({ ok: true })
}

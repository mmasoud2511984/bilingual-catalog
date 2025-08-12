import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/server/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()

    await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
    `

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM orders WHERE id = ${params.id}`
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}

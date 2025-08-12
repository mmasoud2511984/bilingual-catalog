import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/server/db"

export async function GET() {
  try {
    const orders = await sql`
      SELECT 
        id,
        product_id,
        product_name_ar,
        product_name_en,
        product_sku,
        product_price,
        customer_name,
        customer_phone,
        country_ar,
        country_en,
        city,
        address,
        quantity,
        notes,
        total_amount,
        status,
        order_date,
        order_time,
        created_at,
        updated_at
      FROM orders 
      ORDER BY created_at DESC
    `

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Ensure proper time format (24-hour HH:MM:SS)
    let orderTime = data.orderTime
    if (typeof orderTime === "string" && (orderTime.includes("م") || orderTime.includes("ص"))) {
      // If Arabic time format, convert to 24-hour format
      orderTime = new Date().toTimeString().split(" ")[0]
    }

    const result = await sql`
      INSERT INTO orders (
        id, product_id, product_name_ar, product_name_en, product_sku,
        product_price, customer_name, customer_phone, country_ar, country_en,
        city, address, quantity, notes, total_amount, status, order_date, order_time
      ) VALUES (
        ${data.id}, ${data.productId}, ${data.productName.ar}, ${data.productName.en},
        ${data.productSku}, ${data.productPrice}, ${data.customerName}, ${data.customerPhone},
        ${data.country.ar}, ${data.country.en}, ${data.city}, ${data.address},
        ${data.quantity}, ${data.notes}, ${data.totalAmount}, ${data.status},
        ${data.orderDate}, ${orderTime}
      )
      RETURNING id
    `

    return NextResponse.json({ ok: true, id: result[0].id })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

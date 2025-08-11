import { NextResponse } from "next/server";
import pkg from "pg";

const { Client } = pkg;

export async function GET() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL, // نستخدم المتغير من .env
  });

  try {
    await client.connect();
    const res = await client.query("SELECT NOW()");
    await client.end();
    return NextResponse.json({ success: true, time: res.rows[0].now });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// lib/server/db.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // فعّل SSL فقط إن كنت تتصل بسيرفر خارجي يفرض SSL
  ssl: false,
});

export async function query<T = any>(text: string, params?: any[]) {
  const res = await pool.query<T>(text, params);
  return res.rows;
}

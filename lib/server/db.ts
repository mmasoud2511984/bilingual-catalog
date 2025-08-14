import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // قاعدة محلية
});

// تنفيذ استعلام نصي عادي
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}

/**
 * sql` ... ${val} ... `
 * يحول القالب إلى استعلام مُعلّم بـ $1, $2 ... ويستدعي query
 */
export function sql(strings: TemplateStringsArray, ...values: any[]) {
  const text = strings.reduce(
    (acc, str, i) => acc + str + (i < values.length ? `$${i + 1}` : ""),
    ""
  );
  return query(text, values);
}

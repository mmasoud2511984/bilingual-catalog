Bilingual Catalog — Deployment and Database Integration

Overview
This project currently stores data in localStorage for demo purposes. To deploy on your hosting with a real database, follow these steps:
- Choose hosting (Vercel or your Node server)
- Provision a Postgres database (Neon, RDS, or your own)
- Run the SQL migrations
- Configure environment variables
- Deploy
- Optional: Move images from base64 to object storage (S3/Supabase Storage)

1) Hosting Options

Option A: Vercel (recommended)
- Push code to GitHub
- Click “Deploy” on Vercel
- Add environment variables:
  - DATABASE_URL = postgresql://user:pass@host/db?sslmode=require
  - SESSION_SECRET = a long random string (for future auth)
- Build command: next build (default)
- Start command: next start (default)

Option B: Your own Node hosting (VPS/cPanel with Node)
- Requirements: Node >= 18, pnpm or npm
- Install: npm i
- Build: npm run build
- Start: npm run start
  - Ensure port is open and reverse proxy (Nginx) forwards traffic
- Add environment variables to your process manager (pm2, systemd):
  - DATABASE_URL
  - SESSION_SECRET

2) Database
- Create a Postgres DB (Neon, RDS, on-prem).
- Run scripts/sql/001_init.sql in your DB (psql, DBeaver, PgAdmin).
- Optional: Run scripts/sql/002_seed.sql to add demo records.

3) Environment Variables
- DATABASE_URL: Full Postgres URL, e.g.:
  postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
- SESSION_SECRET: random long string (64+ chars) for future secure cookies/sessions.

4) API Endpoints
This project adds RESTful endpoints under /api that read/write to Postgres:
- GET /api/products, POST /api/products
- PUT/DELETE /api/products/:id
- POST /api/products/reorder
- GET/POST /api/categories
- PUT/DELETE /api/categories/:id
- GET/PUT /api/settings

Note: The current UI still reads from localStorage (lib/store.ts). After deployment, ask me to:
- Replace lib/store.ts with async data hooks that call these endpoints, or
- Migrate to Supabase (DB + Storage + Auth) if you prefer managed services.

5) Images / Uploads
- Today uploads are base64 (FileReader) saved in local storage. In production:
  - Use S3-compatible storage (AWS S3/Cloudflare R2/MinIO) or Supabase Storage.
  - Save only the public URL in the database.
  - I can add a signed-upload route and a media manager in Admin on request.

6) Admin Auth
- Demo uses a PIN in localStorage. In production:
  - Use Supabase Auth (easiest) or
  - Add admin_users table + bcrypt password + httpOnly cookie sessions.
  - I can add this for you next.

7) SEO & Performance
- Once data is server-side, we can render product/category pages as SSR/SSG and add structured data for SEO.

Need me to wire the UI to these APIs or add Supabase? Ask me and I’ll implement it.

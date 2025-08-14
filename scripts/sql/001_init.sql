-- Bilingual Catalog Schema (Postgres)

create extension if not exists "uuid-ossp";

-- Categories
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name jsonb not null,              -- { ar: string, en: string }
  "order" int not null default 0
);

-- Products
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  sku text not null,
  name jsonb not null,              -- { ar, en }
  short_description jsonb not null, -- { ar, en }
  description jsonb not null,       -- { ar, en }
  price numeric(12,2) not null default 0,
  stock int not null default 0,
  dozen_qty int,
  size text,
  featured boolean not null default false,
  active boolean not null default true,  -- إضافة جديدة
  category_id uuid references categories(id) on delete set null,
  created_at timestamptz not null default now(),
  "order" int not null default 0
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_order on products("order");
create index if not exists idx_products_slug on products(slug);

-- Product Images
create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  src text not null,                -- ideally external object storage URL
  caption jsonb not null,           -- { ar, en }
  position int not null default 0
);

create index if not exists idx_product_images_product on product_images(product_id);
create index if not exists idx_product_images_position on product_images(position);

-- Settings (single row id=1)
create table if not exists settings (
  id int primary key default 1,
  data jsonb not null               -- whole settings object stored in JSONB
);

insert into settings (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- Admin Users (for future server-side auth)
create table if not exists admin_users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

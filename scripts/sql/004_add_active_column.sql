-- Add active column to existing products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

-- Update all existing products to be active by default
UPDATE products SET active = true WHERE active IS NULL;

-- Create index for better performance when filtering active products
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  product_id VARCHAR(255) NOT NULL,
  product_name_ar TEXT NOT NULL,
  product_name_en TEXT NOT NULL,
  product_sku VARCHAR(255) NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  country_ar VARCHAR(255),
  country_en VARCHAR(255),
  city VARCHAR(255),
  address TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  order_date DATE NOT NULL,
  order_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);

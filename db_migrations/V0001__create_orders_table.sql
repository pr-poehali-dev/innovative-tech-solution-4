CREATE TABLE t_p19205078_innovative_tech_solu.orders (
  id SERIAL PRIMARY KEY,
  inv_id INTEGER UNIQUE NOT NULL,
  email VARCHAR(255),
  amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP
);
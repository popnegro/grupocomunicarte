-- Featured inventory shown in the public Landing.
-- Idempotent so it is safe to apply to databases that already contain these columns.
ALTER TABLE screens
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

ALTER TABLE screens
  ADD COLUMN IF NOT EXISTS featured_order integer;

CREATE INDEX IF NOT EXISTS screens_featured_order_idx
  ON screens (tenant_id, is_featured, featured_order);

-- The application API enforces the product rule of a maximum of 9 featured
-- screens per tenant and keeps featured_order within 1..9.

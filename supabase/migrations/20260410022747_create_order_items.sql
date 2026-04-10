-- Migration: Relational schema orders + order_items (multi-plisa V2)
-- R49: "czyścimy tabelę i tworzymy schemat od zera"
-- Drops old orders table (with its trigger, policies, indexes) and recreates
-- orders + order_items with RPC functions for transactional submit and lookup.

-- =============================================================================
-- 1. Cleanup: drop old objects
-- =============================================================================

-- Drop old RPC functions
DROP FUNCTION IF EXISTS lookup_order(TEXT);

-- Drop old trigger
DROP TRIGGER IF EXISTS trg_set_order_number ON orders;
DROP FUNCTION IF EXISTS set_order_number();

-- Drop old table (CASCADE drops policies, indexes)
DROP TABLE IF EXISTS orders CASCADE;

-- Drop old sequence
DROP SEQUENCE IF EXISTS orders_seq;

-- =============================================================================
-- 2. Sequence for order numbers
-- =============================================================================

CREATE SEQUENCE orders_seq START WITH 1 INCREMENT BY 1;

-- =============================================================================
-- 3. Create orders table (new schema)
-- =============================================================================

CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL DEFAULT '',
  total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  allegro_units INT NOT NULL DEFAULT 0,
  allegro_tx_id TEXT,
  utm_source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger function to set order_number from sequence
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'RE-' || LPAD(nextval('orders_seq')::text, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on INSERT
CREATE TRIGGER trg_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- B-tree index on order_number for fast lookups
CREATE INDEX idx_orders_order_number ON orders (order_number);

-- =============================================================================
-- 4. Create order_items table
-- =============================================================================

CREATE TABLE order_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  position INT NOT NULL,
  fabric_id TEXT NOT NULL,
  fabric_name TEXT NOT NULL,
  color_id TEXT NOT NULL,
  color_name TEXT NOT NULL,
  mounting_id TEXT NOT NULL,
  mounting_name TEXT NOT NULL,
  mounting_type TEXT NOT NULL,
  width_mm INT NOT NULL,
  height_mm INT NOT NULL,
  rail_id TEXT NOT NULL,
  rail_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0
);

-- Index for fast join by order_id
CREATE INDEX idx_order_items_order_id ON order_items (order_id);

-- =============================================================================
-- 5. RLS policies
-- =============================================================================

-- Enable RLS on both tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- orders: SELECT allowed (needed for submit_order RPC RETURNING + lookup)
CREATE POLICY "Allow select orders"
  ON orders FOR SELECT TO anon
  USING (true);

-- orders: INSERT not allowed directly (use submit_order RPC)
-- The RPC is SECURITY DEFINER so it bypasses RLS.

-- order_items: SELECT allowed (for lookup joins)
CREATE POLICY "Allow select order_items"
  ON order_items FOR SELECT TO anon
  USING (true);

-- order_items: INSERT not allowed directly (use submit_order RPC)

-- =============================================================================
-- 6. RPC: submit_order (transactional insert)
-- =============================================================================

CREATE OR REPLACE FUNCTION submit_order(
  p_items JSONB,
  p_total_price DECIMAL,
  p_allegro_units INT,
  p_utm_source TEXT DEFAULT NULL
) RETURNS TEXT AS $$
DECLARE
  v_order_id BIGINT;
  v_order_number TEXT;
  v_item JSONB;
  v_position INT := 0;
BEGIN
  INSERT INTO orders (total_price, allegro_units, utm_source)
  VALUES (p_total_price, p_allegro_units, p_utm_source)
  RETURNING id, order_number INTO v_order_id, v_order_number;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_position := v_position + 1;
    INSERT INTO order_items (
      order_id, position,
      fabric_id, fabric_name,
      color_id, color_name,
      mounting_id, mounting_name, mounting_type,
      width_mm, height_mm,
      rail_id, rail_name,
      quantity, unit_price
    ) VALUES (
      v_order_id, v_position,
      v_item->>'fabric_id', v_item->>'fabric_name',
      v_item->>'color_id', v_item->>'color_name',
      v_item->>'mounting_id', v_item->>'mounting_name',
      v_item->>'mounting_type',
      (v_item->>'width_mm')::INT, (v_item->>'height_mm')::INT,
      v_item->>'rail_id', v_item->>'rail_name',
      (v_item->>'quantity')::INT, (v_item->>'unit_price')::DECIMAL
    );
  END LOOP;

  RETURN v_order_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anon role
GRANT EXECUTE ON FUNCTION submit_order(JSONB, DECIMAL, INT, TEXT) TO anon;

-- =============================================================================
-- 7. RPC: lookup_order (order + items as JSON)
-- =============================================================================

CREATE OR REPLACE FUNCTION lookup_order(p_order_number TEXT)
RETURNS JSONB AS $$
DECLARE
  v_order orders%ROWTYPE;
  v_items JSONB;
BEGIN
  SELECT * INTO v_order FROM orders WHERE order_number = p_order_number LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', oi.id,
      'position', oi.position,
      'fabric_id', oi.fabric_id,
      'fabric_name', oi.fabric_name,
      'color_id', oi.color_id,
      'color_name', oi.color_name,
      'mounting_id', oi.mounting_id,
      'mounting_name', oi.mounting_name,
      'mounting_type', oi.mounting_type,
      'width_mm', oi.width_mm,
      'height_mm', oi.height_mm,
      'rail_id', oi.rail_id,
      'rail_name', oi.rail_name,
      'quantity', oi.quantity,
      'unit_price', oi.unit_price
    ) ORDER BY oi.position
  ), '[]'::JSONB)
  INTO v_items
  FROM order_items oi
  WHERE oi.order_id = v_order.id;

  RETURN jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'total_price', v_order.total_price,
    'allegro_units', v_order.allegro_units,
    'allegro_tx_id', v_order.allegro_tx_id,
    'utm_source', v_order.utm_source,
    'created_at', v_order.created_at,
    'items', v_items
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute to anon role
GRANT EXECUTE ON FUNCTION lookup_order(TEXT) TO anon;

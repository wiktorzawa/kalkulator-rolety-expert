-- Migration: Fix submit_order — add SET search_path + input validation
-- P2-1: SECURITY — search_path hijacking prevention
-- P2-2: SECURITY — input validation (empty items, negative price/units, item limit)

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
  -- Input validation
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must have at least one item';
  END IF;
  IF p_total_price <= 0 THEN
    RAISE EXCEPTION 'Total price must be positive';
  END IF;
  IF p_allegro_units <= 0 THEN
    RAISE EXCEPTION 'Allegro units must be positive';
  END IF;
  IF jsonb_array_length(p_items) > 50 THEN
    RAISE EXCEPTION 'Too many items (max 50)';
  END IF;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

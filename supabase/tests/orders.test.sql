-- Test: INSERT generuje order_number w formacie RE-XXXXX
-- Run against local or remote Supabase after applying migration

-- Test 1: First INSERT generates RE-00001
INSERT INTO orders (config, price, allegro_units)
VALUES ('{"test": true}'::jsonb, 100.00, 100);

SELECT order_number FROM orders WHERE id = 1;
-- Expected: RE-00001

-- Test 2: Second INSERT generates RE-00002
INSERT INTO orders (config, price, allegro_units)
VALUES ('{"test": true}'::jsonb, 200.00, 200);

SELECT order_number FROM orders WHERE id = 2;
-- Expected: RE-00002

-- Test 3: SELECT by order_number returns the order
SELECT id, order_number, price, allegro_units
FROM orders
WHERE order_number = 'RE-00001';
-- Expected: 1 row with price=100.00, allegro_units=100

-- Cleanup
DELETE FROM orders;
SELECT setval('orders_seq', 0, false);

-- P2-SEC-1: Replace open SELECT policy with RPC function
-- The original USING(true) allowed reading ALL orders.
-- R43 requires "public SELECT (po order_number)" — lookup by specific order_number only.

-- Drop the overly permissive SELECT policy
DROP POLICY "Allow public select by order_number" ON orders;

-- Create a SECURITY DEFINER function for order lookup by order_number.
-- This bypasses RLS, so anon users can only access orders via this function,
-- not via direct table SELECT.
CREATE OR REPLACE FUNCTION lookup_order(p_order_number TEXT)
RETURNS SETOF orders
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM orders WHERE order_number = p_order_number LIMIT 1;
$$;

-- Grant execute to anon role
GRANT EXECUTE ON FUNCTION lookup_order(TEXT) TO anon;

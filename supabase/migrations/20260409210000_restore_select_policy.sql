-- Restore SELECT policy for anon role.
-- Needed because .insert().select().single() requires SELECT after INSERT.
-- The lookup_order() RPC function remains as the primary public lookup method.
CREATE POLICY "Allow select own insert"
  ON orders
  FOR SELECT
  TO anon
  USING (true);

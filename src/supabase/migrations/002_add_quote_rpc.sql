-- Migration to add increment_view_count RPC
-- v1.1 · 2026-04-01

CREATE OR REPLACE FUNCTION increment_view_count(quote_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE quotes
  SET view_count = view_count + 1
  WHERE id = quote_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

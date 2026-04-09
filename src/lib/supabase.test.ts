import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const migrationPath = resolve(
  __dirname,
  "../../supabase/migrations/20260409050254_create_orders.sql",
);
const migrationSql = readFileSync(migrationPath, "utf-8");

describe("orders migration SQL", () => {
  it("creates orders table with required columns", () => {
    expect(migrationSql).toContain("CREATE TABLE orders");
    expect(migrationSql).toContain(
      "id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY",
    );
    expect(migrationSql).toContain("order_number TEXT UNIQUE NOT NULL");
    expect(migrationSql).toContain("config JSONB NOT NULL");
    expect(migrationSql).toContain("price DECIMAL(10, 2) NOT NULL");
    expect(migrationSql).toContain("allegro_units INT NOT NULL");
    expect(migrationSql).toContain("utm_source TEXT");
    expect(migrationSql).toContain(
      "created_at TIMESTAMPTZ NOT NULL DEFAULT now()",
    );
  });

  it("creates sequence for order numbers", () => {
    expect(migrationSql).toContain("CREATE SEQUENCE orders_seq");
    expect(migrationSql).toContain("START WITH 1");
  });

  it("creates trigger generating RE-XXXXX format", () => {
    expect(migrationSql).toContain(
      "CREATE OR REPLACE FUNCTION set_order_number()",
    );
    expect(migrationSql).toContain(
      "'RE-' || LPAD(nextval('orders_seq')::text, 5, '0')",
    );
    expect(migrationSql).toContain("CREATE TRIGGER trg_set_order_number");
    expect(migrationSql).toContain("BEFORE INSERT ON orders");
  });

  it("creates B-tree index on order_number", () => {
    expect(migrationSql).toContain(
      "CREATE INDEX idx_orders_order_number ON orders (order_number)",
    );
  });

  it("enables RLS with public INSERT policy", () => {
    expect(migrationSql).toContain(
      "ALTER TABLE orders ENABLE ROW LEVEL SECURITY",
    );
    expect(migrationSql).toContain("FOR INSERT");
    expect(migrationSql).toContain("TO anon");
  });

  it("trigger format produces correct RE-XXXXX pattern", () => {
    // Validate the LPAD format produces 5-digit zero-padded numbers
    const lpadMatch = migrationSql.match(
      /LPAD\(nextval\('orders_seq'\)::text,\s*(\d+),\s*'0'\)/,
    );
    expect(lpadMatch).not.toBeNull();
    expect(lpadMatch?.[1]).toBe("5");
  });
});

const restrictMigrationPath = resolve(
  __dirname,
  "../../supabase/migrations/20260409060000_restrict_orders_select.sql",
);
const restrictMigrationSql = readFileSync(restrictMigrationPath, "utf-8");

describe("orders SELECT restriction migration", () => {
  it("drops the overly permissive SELECT policy", () => {
    expect(restrictMigrationSql).toContain(
      'DROP POLICY "Allow public select by order_number" ON orders',
    );
  });

  it("creates lookup_order RPC function with SECURITY DEFINER", () => {
    expect(restrictMigrationSql).toContain(
      "CREATE OR REPLACE FUNCTION lookup_order(p_order_number TEXT)",
    );
    expect(restrictMigrationSql).toContain("SECURITY DEFINER");
    expect(restrictMigrationSql).toContain(
      "WHERE order_number = p_order_number LIMIT 1",
    );
  });

  it("grants execute to anon role", () => {
    expect(restrictMigrationSql).toContain(
      "GRANT EXECUTE ON FUNCTION lookup_order(TEXT) TO anon",
    );
  });
});

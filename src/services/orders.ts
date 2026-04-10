import { getSupabase } from "@/lib/supabase";
import { analytics } from "@/lib/analytics";

// ─── Types: order items ───────────────────────────────────────────────────────

/** Data for a single item when submitting an order (sent to RPC as JSONB). */
export interface OrderItemInsert {
  readonly fabric_id: string;
  readonly fabric_name: string;
  readonly color_id: string;
  readonly color_name: string;
  readonly mounting_id: string;
  readonly mounting_name: string;
  readonly mounting_type: string;
  readonly width_mm: number;
  readonly height_mm: number;
  readonly rail_id: string;
  readonly rail_name: string;
  readonly quantity: number;
  readonly unit_price: number;
}

/** A single item as returned from the database (lookup). */
export interface OrderItemRecord {
  readonly id: number;
  readonly position: number;
  readonly fabric_id: string;
  readonly fabric_name: string;
  readonly color_id: string;
  readonly color_name: string;
  readonly mounting_id: string;
  readonly mounting_name: string;
  readonly mounting_type: string;
  readonly width_mm: number;
  readonly height_mm: number;
  readonly rail_id: string;
  readonly rail_name: string;
  readonly quantity: number;
  readonly unit_price: number;
}

// ─── Types: order ─────────────────────────────────────────────────────────────

/** Order record returned from the database (lookup). */
export interface OrderRecord {
  readonly id: number;
  readonly order_number: string;
  readonly total_price: number;
  readonly allegro_units: number;
  readonly allegro_tx_id: string | null;
  readonly utm_source: string | null;
  readonly created_at: string;
  readonly items: readonly OrderItemRecord[];
}

// ─── Submit ───────────────────────────────────────────────────────────────────

export interface SubmitOrderParams {
  readonly items: readonly OrderItemInsert[];
  readonly totalPrice: number;
  readonly allegroUnits: number;
  readonly utmSource: string | null;
}

export interface SubmitOrderResult {
  readonly orderNumber: string;
}

/**
 * Submit a multi-item order via the `submit_order` RPC function.
 * The DB trigger generates the order_number (RE-XXXXX).
 * The RPC runs as a single transaction — if any item fails, everything rolls back.
 */
export async function submitOrder(
  params: SubmitOrderParams,
): Promise<SubmitOrderResult> {
  const { data, error } = await getSupabase().rpc("submit_order", {
    p_items: JSON.parse(JSON.stringify(params.items)),
    p_total_price: params.totalPrice,
    p_allegro_units: params.allegroUnits,
    p_utm_source: params.utmSource,
  });

  if (error) {
    throw new Error(`Failed to submit order: ${error.message}`);
  }

  const orderNumber = data as string;

  analytics.trackOrder({
    orderNumber,
    price: params.totalPrice,
    units: params.allegroUnits,
    itemsCount: params.items.length,
  });

  return { orderNumber };
}

// ─── Lookup ───────────────────────────────────────────────────────────────────

/**
 * Look up an existing order by order_number via the `lookup_order` RPC.
 * Returns the order with its items, or null if not found.
 */
export async function lookupOrder(
  orderNumber: string,
): Promise<OrderRecord | null> {
  const { data, error } = await getSupabase().rpc("lookup_order", {
    p_order_number: orderNumber,
  });

  if (error) {
    throw new Error(`Failed to lookup order: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  // RPC returns JSONB — Supabase client parses it as an object
  const record = data as {
    id: number;
    order_number: string;
    total_price: number;
    allegro_units: number;
    allegro_tx_id: string | null;
    utm_source: string | null;
    created_at: string;
    items: OrderItemRecord[];
  };

  return {
    id: record.id,
    order_number: record.order_number,
    total_price: record.total_price,
    allegro_units: record.allegro_units,
    allegro_tx_id: record.allegro_tx_id,
    utm_source: record.utm_source,
    created_at: record.created_at,
    items: record.items ?? [],
  };
}

import { getSupabase } from "@/lib/supabase";
import { analytics } from "@/lib/analytics";
import type { WizardState } from "@/context/wizard-types";
import type { PriceBreakdown } from "@/data/types";

export interface OrderConfig {
  readonly fabricId: string;
  readonly colorId: string;
  readonly mountingId: string;
  readonly mountingType: string;
  readonly widthMm: number;
  readonly heightMm: number;
  readonly railId: string;
}

export interface OrderInsert {
  readonly config: OrderConfig;
  readonly price: number;
  readonly allegro_units: number;
  readonly utm_source: string | null;
}

export interface OrderRecord {
  readonly id: number;
  readonly order_number: string;
  readonly config: OrderConfig;
  readonly price: number;
  readonly allegro_units: number;
  readonly utm_source: string | null;
  readonly created_at: string;
}

function buildOrderConfig(state: WizardState): OrderConfig {
  return {
    fabricId: state.fabricId!,
    colorId: state.colorId!,
    mountingId: state.mountingId!,
    mountingType: state.mountingType!,
    widthMm: state.widthMm,
    heightMm: state.heightMm,
    railId: state.railId!,
  };
}

export interface SubmitOrderParams {
  readonly state: WizardState;
  readonly price: PriceBreakdown;
  readonly allegro_units: number;
  readonly utm_source: string | null;
}

export interface SubmitOrderResult {
  readonly orderNumber: string;
  readonly order: OrderRecord;
}

/**
 * Submit an order to Supabase. DB trigger generates the order_number.
 * Returns the created order with its generated order_number.
 */
export async function submitOrder(
  params: SubmitOrderParams,
): Promise<SubmitOrderResult> {
  const config = buildOrderConfig(params.state);

  const { data, error } = await getSupabase()
    .from("orders")
    .insert({
      config,
      price: params.price.total,
      allegro_units: params.allegro_units,
      utm_source: params.utm_source,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to submit order: ${error.message}`);
  }

  const order = data as OrderRecord;

  analytics.trackOrder({
    orderNumber: order.order_number,
    price: order.price,
    units: order.allegro_units,
    fabricId: config.fabricId,
    mountingId: config.mountingId,
  });

  return {
    orderNumber: order.order_number,
    order,
  };
}

/**
 * Look up an existing order by order_number via RPC function.
 * Uses SECURITY DEFINER function to avoid exposing all orders via SELECT policy.
 * Returns null if not found.
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

  const rows = data as OrderRecord[] | null;
  if (!rows || rows.length === 0) {
    return null;
  }

  return rows[0] ?? null;
}

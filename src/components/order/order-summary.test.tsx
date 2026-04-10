import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { OrderSummary } from "./order-summary";
import type { OrderRecord, OrderItemRecord } from "@/services/orders";

function makeItem(overrides: Partial<OrderItemRecord> = {}): OrderItemRecord {
  return {
    id: 1,
    position: 1,
    fabric_id: "standard",
    fabric_name: "Standard",
    color_id: "biel",
    color_name: "Biel",
    mounting_id: "wzmocniony",
    mounting_name: "Wzmocniony",
    mounting_type: "bezinwazyjny",
    width_mm: 600,
    height_mm: 1500,
    rail_id: "bialy",
    rail_name: "Bialy",
    quantity: 1,
    unit_price: 156.75,
    ...overrides,
  };
}

function makeOrder(overrides: Partial<OrderRecord> = {}): OrderRecord {
  return {
    id: 1,
    order_number: "RE-00142",
    total_price: 156.75,
    allegro_units: 157,
    allegro_tx_id: null,
    utm_source: null,
    created_at: "2026-04-10T12:00:00Z",
    items: [makeItem()],
    ...overrides,
  };
}

describe("OrderSummary", () => {
  it("renders order number with hash prefix", () => {
    render(<OrderSummary order={makeOrder()} />);

    const orderNumber = screen.getByTestId("order-number");
    expect(orderNumber).toHaveTextContent("#RE-00142");
  });

  it("renders all item rows for multi-item order", () => {
    const order = makeOrder({
      total_price: 384.75,
      allegro_units: 385,
      items: [
        makeItem({ position: 1, fabric_name: "Standard", color_name: "Biel" }),
        makeItem({
          id: 2,
          position: 2,
          fabric_name: "Blackout",
          color_name: "Czarny",
          unit_price: 228.0,
        }),
      ],
    });

    render(<OrderSummary order={order} />);

    expect(screen.getByText("Pozycja 1")).toBeInTheDocument();
    expect(screen.getByText("Pozycja 2")).toBeInTheDocument();
    expect(screen.getByText(`Pozycje zamowienia (2)`)).toBeInTheDocument();
  });

  it("shows total price and Allegro units", () => {
    render(
      <OrderSummary
        order={makeOrder({ total_price: 175.75, allegro_units: 176 })}
      />,
    );

    expect(screen.getByText("175,75 zl")).toBeInTheDocument();

    const unitsEl = screen.getByTestId("allegro-units");
    expect(unitsEl).toHaveTextContent("176 jednostek");
  });

  it("renders Allegro instruction steps", () => {
    render(<OrderSummary order={makeOrder()} />);

    expect(screen.getByText(/Kliknij przycisk ponizej/)).toBeInTheDocument();
    expect(screen.getByText(/Wpisz ilosc/)).toBeInTheDocument();
    expect(screen.getByText(/Uwagi do zakupu/)).toBeInTheDocument();
    expect(
      screen.getByText(/Oplac zamowienie przez Allegro/),
    ).toBeInTheDocument();
  });

  it("renders Allegro link button", () => {
    render(<OrderSummary order={makeOrder()} />);

    const button = screen.getByRole("button", {
      name: /przejdz do aukcji allegro/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("shows per-item quantity breakdown when quantity > 1", () => {
    const order = makeOrder({
      total_price: 313.5,
      items: [makeItem({ quantity: 2, unit_price: 156.75 })],
    });

    render(<OrderSummary order={order} />);

    expect(screen.getByText(/x 2 = 313,50 zl/)).toBeInTheDocument();
  });
});

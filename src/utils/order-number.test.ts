import { describe, it, expect } from "vitest";

import {
  formatOrderNumber,
  parseOrderParam,
  parseUtmSource,
} from "./order-number";

describe("formatOrderNumber", () => {
  it("prepends # to order number", () => {
    expect(formatOrderNumber("RE-00142")).toBe("#RE-00142");
  });

  it("handles RE-00001", () => {
    expect(formatOrderNumber("RE-00001")).toBe("#RE-00001");
  });
});

describe("parseOrderParam", () => {
  it("extracts order number from search string", () => {
    expect(parseOrderParam("?order=RE-00142")).toBe("RE-00142");
  });

  it("extracts order number with other params", () => {
    expect(parseOrderParam("?ref=allegro&order=RE-00001")).toBe("RE-00001");
  });

  it("returns null when no order param", () => {
    expect(parseOrderParam("?ref=allegro")).toBeNull();
  });

  it("returns null for empty search string", () => {
    expect(parseOrderParam("")).toBeNull();
  });

  it("returns null for empty order value", () => {
    expect(parseOrderParam("?order=")).toBeNull();
  });

  it("returns null for whitespace-only order value", () => {
    expect(parseOrderParam("?order=  ")).toBeNull();
  });
});

describe("parseUtmSource", () => {
  it("extracts ref param", () => {
    expect(parseUtmSource("?ref=allegro")).toBe("allegro");
  });

  it("extracts utm_source param", () => {
    expect(parseUtmSource("?utm_source=google")).toBe("google");
  });

  it("prefers ref over utm_source", () => {
    expect(parseUtmSource("?ref=allegro&utm_source=google")).toBe("allegro");
  });

  it("returns null when no source params", () => {
    expect(parseUtmSource("?order=RE-00001")).toBeNull();
  });
});

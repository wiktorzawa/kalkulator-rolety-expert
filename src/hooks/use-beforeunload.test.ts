import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useBeforeunload } from "./use-beforeunload";

describe("useBeforeunload", () => {
  let addSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addSpy = vi.spyOn(window, "addEventListener");
    removeSpy = vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("adds beforeunload listener when active (items > 0)", () => {
    renderHook(() => useBeforeunload(true));

    expect(addSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));
  });

  it("does not add listener when inactive (items === 0)", () => {
    renderHook(() => useBeforeunload(false));

    const beforeunloadCalls = addSpy.mock.calls.filter(
      (call) => call[0] === "beforeunload",
    );
    expect(beforeunloadCalls).toHaveLength(0);
  });

  it("removes listener when becoming inactive (after order submitted)", () => {
    const { rerender } = renderHook(
      ({ active }: { active: boolean }) => useBeforeunload(active),
      { initialProps: { active: true } },
    );

    expect(addSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));

    rerender({ active: false });

    expect(removeSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function),
    );
  });

  it("handler calls preventDefault on the event", () => {
    renderHook(() => useBeforeunload(true));

    // Get the handler that was registered
    const handlerCall = addSpy.mock.calls.find(
      (call) => call[0] === "beforeunload",
    );
    expect(handlerCall).toBeDefined();

    const handler = handlerCall![1] as (e: BeforeUnloadEvent) => void;
    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as BeforeUnloadEvent;
    handler(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});

import { useEffect } from "react";

/**
 * Shows a browser confirmation dialog when the user tries to leave/refresh the page.
 * Active when `isActive` is true (e.g. cart has items and order not yet submitted).
 */
export function useBeforeunload(isActive: boolean): void {
  useEffect(() => {
    if (!isActive) return;

    function handler(e: BeforeUnloadEvent): void {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isActive]);
}

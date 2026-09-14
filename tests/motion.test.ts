import { describe, it, expect } from "vitest";
import { lerp, prefersReducedMotion, isTouchDevice, useReveal } from "../src/lib/motion";
import { renderHook } from "@testing-library/react";

describe("motion lib", () => {
  it("lerps toward the target", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(4, 4, 0.9)).toBe(4);
  });

  it("reports reduced-motion and touch capability without crashing in jsdom", () => {
    expect(typeof prefersReducedMotion()).toBe("boolean");
    expect(typeof isTouchDevice()).toBe("boolean");
  });

  it("useReveal returns a ref usable on an element", () => {
    const { result } = renderHook(() => useReveal<HTMLDivElement>());
    expect(result.current.current).toBeNull();
  });
});

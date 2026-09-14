import { useEffect, useRef } from "react";
import { isTouchDevice, lerp, prefersReducedMotion } from "../lib/motion";

/**
 * Custom interpolated cursor. Default: small dot. Elements with
 * `data-cursor="VIEW"` etc. morph the cursor into a labeled disc.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;

    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2,
      rx = mx,
      ry = my,
      raf = 0,
      hovering = false;

    document.body.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const t = (e.target as HTMLElement).closest?.("[data-cursor]") as HTMLElement | null;
      const next = t?.dataset.cursor ?? null;
      if (next !== (hovering ? label.textContent : null)) {
        hovering = !!next;
        label.textContent = next ?? "";
        ring.dataset.state = hovering ? "active" : "idle";
      }
    };

    const tick = () => {
      rx = lerp(rx, mx, 0.16);
      ry = lerp(ry, my, 0.16);
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (typeof window !== "undefined" && (isTouchDevice() || prefersReducedMotion()))
    return null;

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={dotRef} className="cursor__dot" />
      <div ref={ringRef} className="cursor__ring" data-state="idle">
        <span ref={labelRef} className="cursor__label" />
      </div>
    </div>
  );
}

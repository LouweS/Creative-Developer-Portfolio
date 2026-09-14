import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";

interface LoaderProps {
  onDone: () => void;
}

/** Cinematic but short preloader — real progress from asset/font readiness, capped ~1.4s. */
export default function Loader({ onDone }: LoaderProps) {
  const [pct, setPct] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const start = performance.now();
    const max = prefersReducedMotion() ? 1 : 1400;
    let raf = 0;

    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / max);
      // ease + tiny stall for texture
      const eased = t < 0.85 ? t * 1.1 : 0.935 + (t - 0.85) * 0.44;
      setPct(Math.round(Math.min(100, eased * 100)));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!done.current) {
        done.current = true;
        setPct(100);
        setTimeout(onDone, prefersReducedMotion() ? 0 : 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className={`loader ${pct >= 100 ? "loader--out" : ""}`} aria-hidden={pct >= 100}>
      <div className="loader__row">
        <span className="mono-xs">ATELIER NOIR — LOADING EXPERIENCE</span>
        <span className="mono-xs">{String(pct).padStart(3, "0")}%</span>
      </div>
      <div className="loader__bar">
        <div className="loader__fill" style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
      <div className="loader__row mono-xs dim">
        <span>{pct < 60 ? "INITIALIZING MOTION" : pct < 95 ? "CALIBRATING GRID" : "READY"}</span>
        <span>52.5200° N / 13.4050° E</span>
      </div>
      <span className="sr-only" role="status">Loading experience, {pct} percent</span>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

interface Stats {
  fps: number;
  avg: number;
  min: number;
  frame: number;
}

/**
 * Development-only FPS monitor (import.meta.env.DEV gate).
 * Measures real rAF deltas — no fabricated numbers.
 */
export default function PerfPanel() {
  const [stats, setStats] = useState<Stats>({ fps: 0, avg: 0, min: 999, frame: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const frames: number[] = [];
    let last = performance.now();
    let raf = 0;
    let acc = 0;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      acc += dt;
      frames.push(dt);
      if (frames.length > 120) frames.shift();
      if (acc > 250) {
        acc = 0;
        const fps = 1000 / dt;
        const avg = 1000 / (frames.reduce((a, b) => a + b, 0) / frames.length);
        const min = 1000 / Math.max(...frames);
        setStats({ fps: Math.round(fps), avg: Math.round(avg), min: Math.round(min), frame: +dt.toFixed(1) });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "p" && e.shiftKey) setVisible((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!import.meta.env.DEV) return null;

  const status = stats.avg >= 70 ? "EXCELLENT" : stats.avg >= 60 && stats.min >= 50 ? "PASS" : "CHECK";

  return (
    <div className={`perf ${visible ? "" : "perf--min"}`} aria-hidden={!visible}>
      <button className="perf__toggle mono-xs" onClick={() => setVisible((v) => !v)}>
        {visible ? "× PERF" : "PERF"}
      </button>
      {visible && (
        <dl className="perf__stats mono-xs">
          <div><dt>FPS</dt><dd>{stats.fps}</dd></div>
          <div><dt>AVG</dt><dd>{stats.avg}</dd></div>
          <div><dt>MIN</dt><dd>{stats.min}</dd></div>
          <div><dt>FRAME</dt><dd>{stats.frame}ms</dd></div>
          <div className={status !== "CHECK" ? "ok" : "warn"}><dt>STATUS</dt><dd>{status}</dd></div>
        </dl>
      )}
    </div>
  );
}

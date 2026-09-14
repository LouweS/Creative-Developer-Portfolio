import { useEffect, useRef, useState } from "react";
import { Artwork } from "./Artwork";
import { isTouchDevice, prefersReducedMotion } from "../lib/motion";

const EXPERIMENTS = [
  { id: "EXP.01", name: "REPELLENT FIELD", desc: "Cursor as magnetic force. Particles flee the pointer, then relax home." },
  { id: "EXP.02", name: "SIGNAL DRIFT", desc: "A waveform that never repeats. Mouse X bends amplitude, Y bends frequency." },
  { id: "EXP.03", name: "ORBITAL TYPE", desc: "Letters locked in orbit — velocity of the pointer spins the system." },
];

/** Digital laboratory — three live canvas micro-experiments, lazily activated when visible. */
export default function Experiments() {
  return (
    <section id="experiments" className="experiments" aria-label="Experiments">
      <p className="mono-xs dim section-tag">— EXPERIMENTS / DIGITAL LABORATORY</p>
      <h2 className="display-m">PROOF OF PLAY</h2>
      <div className="experiments__grid">
        {EXPERIMENTS.map((e, i) => (
          <ExpCard key={e.id} {...e} index={i} />
        ))}
      </div>
    </section>
  );
}

function ExpCard({ id, name, desc, index }: { id: string; name: string; desc: string; index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = prefersReducedMotion() || isTouchDevice();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, t = 0;
    const pointer = { x: 0.5, y: 0.5, vx: 0 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (ev: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = (ev.clientX - r.left) / r.width;
      const ny = (ev.clientY - r.top) / r.height;
      pointer.vx = nx - pointer.x;
      pointer.x = Math.min(1, Math.max(0, nx));
      pointer.y = Math.min(1, Math.max(0, ny));
    };
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "#e8e4dc";
      ctx.fillStyle = "#ff4d00";

      if (index === 0) {
        // Repellent field — dot grid flees the cursor
        for (let gx = 0; gx < 12; gx++) {
          for (let gy = 0; gy < 8; gy++) {
            const x = (gx + 0.5) * (w / 12), y = (gy + 0.5) * (h / 8);
            const px = pointer.x * w, py = pointer.y * h;
            const dx = x - px, dy = y - py;
            const d = Math.hypot(dx, dy);
            const f = Math.max(0, 1 - d / 120);
            const ox = d > 0 ? (dx / d) * f * 46 : 0;
            const oy = d > 0 ? (dy / d) * f * 46 : 0;
            ctx.globalAlpha = 0.3 + f * 0.7;
            ctx.beginPath();
            ctx.arc(x + ox, y + oy, 1.6 + f * 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (index === 1) {
        // Signal drift — pointer-bent waveform
        ctx.globalAlpha = 1;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const nx = x / w;
          const amp = 18 + pointer.y * 60;
          const freq = 2 + pointer.x * 6;
          const y = h / 2 + Math.sin(nx * Math.PI * freq + t * 2.2) * amp * Math.sin(nx * Math.PI);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const nx = x / w;
          const y = h / 2 + Math.sin(nx * Math.PI * (3 + pointer.x * 4) - t * 1.4) * (10 + pointer.y * 30) * Math.sin(nx * Math.PI);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        // Orbital type — letters orbit, pointer velocity spins
        const cx = w / 2, cy = h / 2;
        const speed = 0.4 + Math.abs(pointer.vx) * 12;
        const chars = "NOIR—";
        ctx.font = "700 22px 'Space Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        chars.split("").forEach((ch, i) => {
          const a = t * speed + (i * Math.PI * 2) / chars.length;
          const r = Math.min(w, h) * 0.3;
          ctx.globalAlpha = 0.9;
          ctx.save();
          ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.5);
          ctx.rotate(a + Math.PI / 2);
          ctx.fillText(ch, 0, 0);
          ctx.restore();
        });
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.min(w, h) * 0.3, Math.min(w, h) * 0.15, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [active, index]);

  return (
    <article className="exp-card" aria-label={`Experiment: ${name}`}>
      <div className="exp-card__frame">
        <canvas ref={canvasRef} className="exp-card__canvas" aria-hidden="true" />
        {!active && (
          <button className="exp-card__activate mono-xs" onClick={() => setActive(true)} data-cursor="RUN">
            ACTIVATE {id} ▶
          </button>
        )}
      </div>
      <header className="exp-card__head">
        <span className="mono-xs dim">{id}</span>
        <h3 className="display-s">{name}</h3>
      </header>
      <p className="exp-card__desc">{desc}</p>
    </article>
  );
}

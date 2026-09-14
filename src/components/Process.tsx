import { useEffect, useRef } from "react";
import { Artwork } from "./Artwork";

const STEPS = [
  { n: "01", t: "DESIGN", d: "Art direction, systems thinking and typographic obsession.", art: "grid" as const, img: "/img/process-design.jpg" },
  { n: "02", t: "MOTION", d: "Choreography with weight — nothing moves without a reason.", art: "signal" as const, img: "/img/process-motion.jpg" },
  { n: "03", t: "DEVELOPMENT", d: "Typed, tested, tuned code that ships at sixty frames.", art: "prism" as const, img: "/img/process-development.jpg" },
  { n: "04", t: "EXPERIMENTATION", d: "Shaders, physics and interfaces that shouldn't exist yet.", art: "echo" as const, img: "/img/process-experimentation.jpg" },
];

/** Vertical scroll drives a horizontal storytelling rail. */
export default function Process() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const rail = railRef.current!;
    let raf = 0;
    let currentX = 0;

    const tick = () => {
      const r = wrap.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      const targetX = -progress * (rail.scrollWidth - window.innerWidth);
      currentX += (targetX - currentX) * 0.12;
      rail.style.transform = `translate3d(${currentX}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="process" ref={wrapRef} aria-label="Process">
      <div className="process__sticky">
        <p className="mono-xs dim section-tag">— HOW I WORK</p>
        <div className="process__rail" ref={railRef}>
          {STEPS.map((s) => (
            <article key={s.n} className="process__panel">
              <span className="process__num display-l dim">{s.n}</span>
              <div className="process__art">
                <Artwork variant={s.art} palette="mono" seed={Number(s.n) * 5} />
                <img className="frame-img" src={s.img} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              </div>
              <h3 className="display-m">{s.t}</h3>
              <p className="process__desc">{s.d}</p>
            </article>
          ))}
          <div className="process__endcap mono-xs dim" aria-hidden="true">
            ↖ BACK TO<br />VERTICAL
          </div>
        </div>
      </div>
    </section>
  );
}

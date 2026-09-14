import { useEffect, useRef } from "react";
import { Artwork } from "./Artwork";
import { isTouchDevice, lerp, prefersReducedMotion } from "../lib/motion";

const HEADLINE = ["I BUILD DIGITAL", "EXPERIENCES", "THAT MOVE."];

interface HeroProps {
  entered: boolean;
}

export default function Hero({ entered }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const sculptureRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return;
    const section = sectionRef.current!;

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      target.current.x = (e.clientX - r.left) / r.width - 0.5;
      target.current.y = (e.clientY - r.top) / r.height - 0.5;
      // letters react to cursor proximity
      const chars = section.querySelectorAll<HTMLElement>(".hero-char");
      chars.forEach((c) => {
        const cr = c.getBoundingClientRect();
        const dx = e.clientX - (cr.left + cr.width / 2);
        const dy = e.clientY - (cr.top + cr.height / 2);
        const d = Math.hypot(dx, dy);
        const f = Math.max(0, 1 - d / 260);
        c.style.transform = `translate(${dx * f * 0.08}px, ${dy * f * 0.08}px)`;
      });
    };

    let raf = 0;
    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.06);
      current.current.y = lerp(current.current.y, target.current.y, 0.06);
      const { x, y } = current.current;
      if (sculptureRef.current) {
        sculptureRef.current.style.transform = `rotate3d(${y * -120}, ${x * 120}, 0, 14deg) rotate(${x * 10}deg)`;
      }
      const bg = section.querySelector<HTMLElement>(".hero__layer--bg");
      const fg = section.querySelector<HTMLElement>(".hero__layer--fg");
      if (bg) bg.style.transform = `translate3d(${x * -18}px, ${y * -12}px, 0)`;
      if (fg) fg.style.transform = `translate3d(${x * -42}px, ${y * -28}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      section.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} id="top" className={`hero ${entered ? "hero--in" : ""}`}>
      <div className="hero__layer hero__layer--bg" aria-hidden="true">
        <Artwork variant="field" palette="slate" seed={3} className="hero__wash" />
      </div>

      <p className="hero__label mono-xs reveal">
        <span className="tick" aria-hidden="true" /> CREATIVE DEVELOPER / DESIGNER
      </p>

      <h1 className="hero__title display-xl" aria-label={HEADLINE.join(" ")}>
        {HEADLINE.map((line, li) => (
          <span className="hero__line" key={li} aria-hidden="true">
            {line.split("").map((ch, ci) => (
              <span
                key={ci}
                className="hero-char"
                style={{ transitionDelay: `${entered ? 500 + li * 140 + ci * 22 : 0}ms` }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </span>
        ))}
      </h1>

      <div className="hero__layer hero__layer--fg" aria-hidden="true">
        <div ref={sculptureRef} className="hero__sculpture" data-cursor="◇">
          <div className="hero__sculpture-ring" />
          <div className="hero__sculpture-core">
            <Artwork variant="monolith" palette="ember" seed={11} label="" />
          </div>
        </div>
      </div>

      <div className="hero__meta">
        <span className="mono-xs dim">SCROLL TO EXPLORE ↓</span>
        <span className="mono-xs dim">SELECTED WORK 2024—2026</span>
        <span className="mono-xs dim">52.5200° N / 13.4050° E</span>
      </div>
    </section>
  );
}

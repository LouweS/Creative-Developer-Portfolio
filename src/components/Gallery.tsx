import { useEffect, useRef } from "react";
import { Artwork, type ArtVariant } from "./Artwork";

const SLIDES: { art: ArtVariant; palette: "mono" | "ember" | "moss" | "slate"; cap: string; meta: string; img: string }[] = [
  { art: "monolith", palette: "ember", cap: "HALO STUDY", meta: "35MM / SYNTH", img: "/img/gallery-halo.jpg" },
  { art: "orbit", palette: "slate", cap: "CONSTELLATION 04", meta: "GENERATIVE", img: "/img/gallery-constellation.jpg" },
  { art: "strata", palette: "moss", cap: "STRATA FIELD", meta: "PLOTTER / INK", img: "/img/gallery-strata.jpg" },
  { art: "signal", palette: "mono", cap: "WAVEFORM", meta: "LIVE AUDIO", img: "/img/gallery-waveform.jpg" },
  { art: "prism", palette: "ember", cap: "PRISM BREAK", meta: "GLSL / NOISE", img: "/img/gallery-prism.jpg" },
  { art: "echo", palette: "slate", cap: "ECHO CHAMBER", meta: "RAYMARCH", img: "/img/gallery-echo.jpg" },
  { art: "grid", palette: "moss", cap: "PLOT GRID", meta: "SILKSCREEN", img: "/img/gallery-plot.jpg" },
  { art: "field", palette: "mono", cap: "DOT MATRIX", meta: "ALGORITHM", img: "/img/gallery-dots.jpg" },
];

/**
 * Option B — infinite image rail. Continuous drift, cursor modulates
 * speed/direction, hover distorts and grows the hovered tile.
 */
export default function Gallery() {
  const railRef = useRef<HTMLDivElement>(null);
  const state = useRef({ pos: 0, velocity: 0.35, targetV: 0.35 });

  useEffect(() => {
    const rail = railRef.current!;
    const section = rail.closest("section")!;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      state.current.targetV = 0.35 + nx * 1.6; // left slows/reverses, right speeds up
    };
    section.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      const s = state.current;
      s.velocity += (s.targetV - s.velocity) * 0.05;
      s.pos -= s.velocity;
      const half = rail.scrollWidth / 2;
      if (-s.pos >= half) s.pos += half;
      if (s.pos > 0) s.pos -= half;
      rail.style.transform = `translate3d(${s.pos}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      section.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const doubled = [...SLIDES, ...SLIDES];

  return (
    <section className="gallery" aria-label="Rotating image gallery">
      <div className="gallery__head">
        <p className="mono-xs dim section-tag">— VISUAL ARCHIVE</p>
        <p className="mono-xs dim">CURSOR LEFT / RIGHT TO STEER</p>
      </div>
      <div className="gallery__viewport">
        <div className="gallery__rail" ref={railRef}>
          {doubled.map((s, i) => (
            <figure className="gallery__item" key={i} data-cursor="DRAG">
              <div className="gallery__img">
                <Artwork variant={s.art} palette={s.palette} seed={i * 13 + 3} label={`Archive image: ${s.cap}`} />
                <img className="frame-img" src={s.img} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              </div>
              <figcaption className="mono-xs">
                <span>{s.cap}</span>
                <span className="dim">{s.meta} — {String((i % 8) + 1).padStart(2, "0")}/08</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

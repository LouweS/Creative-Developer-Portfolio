import { Artwork } from "./Artwork";
import { useReveal } from "../lib/motion";

const LINES = ["A DIGITAL", "CREATOR", "INTERESTED IN", "MOTION, CODE", "AND CULTURE."];

export default function About() {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="about" ref={ref} className="about reveal-section" aria-label="About">
      <p className="mono-xs dim section-tag">— ABOUT / 01</p>

      <div className="about__grid">
        <h2 className="display-xl about__title" aria-label={LINES.join(" ")}>
          {LINES.map((l, i) => (
            <span className="about__line" key={i} style={{ transitionDelay: `${i * 90}ms` }}>
              {l}
            </span>
          ))}
        </h2>

        <figure className="about__frag">
          <div className="about__frag-img">
            <Artwork variant="strata" palette="moss" seed={8} label="Studio fragment, layered strata composition" />
            <img className="frame-img" src="/img/about-layers.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          </div>
          <figcaption className="mono-xs dim">FIG. 02 — LAYERED PRACTICE</figcaption>
        </figure>

        <div className="about__meta">
          <p>
            Ten years between design studios and engineering teams taught me one thing:
            the gap between an idea and an interface is where the work lives. I close it.
          </p>
          <dl className="about__facts mono-xs">
            <div><dt>BASE</dt><dd>BERLIN, DE</dd></div>
            <div><dt>FOCUS</dt><dd>INTERACTIVE / WEBGL</dd></div>
            <div><dt>STATUS</dt><dd className="ok"><span className="tick" aria-hidden="true" /> OPEN Q1 2027</dd></div>
          </dl>
        </div>
      </div>

      <div className="about__strip mono-xs dim" aria-hidden="true">
        <span>2016 — FIRST COMMERCIAL SITE</span>
        <span>2019 — AWWWARDS SOTD ×3</span>
        <span>2022 — FWA OF THE DAY</span>
        <span>2026 — INDEPENDENT STUDIO</span>
      </div>
    </section>
  );
}

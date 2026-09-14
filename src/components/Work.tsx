import { useState } from "react";
import { Artwork, type ArtVariant } from "./Artwork";
import { useReveal } from "../lib/motion";

export interface Project {
  id: string;
  num: string;
  name: string;
  role: string;
  year: string;
  art: ArtVariant;
  palette: "mono" | "ember" | "moss" | "slate";
  seed: number;
  img: string;
  detail: string;
  tags: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "nova",
    num: "01",
    name: "NOVA / DIGITAL IDENTITY",
    role: "Creative Development / Art Direction",
    year: "2026",
    art: "monolith",
    palette: "ember",
    seed: 11,
    img: "/img/work-nova.jpg",
    detail:
      "A launch platform for a generative identity studio. Scroll-bound type, shader-dipped portraiture and a case-study engine the client edits themselves.",
    tags: ["Creative Development", "Motion Design", "Interactive Experience"],
  },
  {
    id: "signal",
    num: "02",
    name: "SIGNAL / AUDIO REACTIVE",
    role: "Interaction Design / WebGL",
    year: "2025",
    art: "signal",
    palette: "slate",
    seed: 23,
    img: "/img/work-signal.jpg",
    detail:
      "Real-time audio visualization engine turning live sound into typographic architecture. Built for a Berlin label's streaming-first release format.",
    tags: ["WebGL", "GLSL", "Sound Design"],
  },
  {
    id: "strata",
    num: "03",
    name: "STRATA / EDITORIAL ENGINE",
    role: "Design Engineering",
    year: "2025",
    art: "strata",
    palette: "moss",
    seed: 5,
    img: "/img/work-strata.jpg",
    detail:
      "A publishing system where layout is composed, not templated. Editors drag layers; the engine guarantees typographic rhythm at every breakpoint.",
    tags: ["Design Systems", "Editorial", "React"],
  },
  {
    id: "orbit",
    num: "04",
    name: "ORBIT / SPATIAL GALLERY",
    role: "Creative Development",
    year: "2024",
    art: "orbit",
    palette: "mono",
    seed: 17,
    img: "/img/work-orbit.jpg",
    detail:
      "A photographic archive navigated as a 3D constellation. Drag to orbit, scroll to descend — two hundred images, one continuous space.",
    tags: ["Three.js", "Spatial UI", "Archive"],
  },
];

interface WorkProps {
  onOpen: (p: Project) => void;
}

export default function Work({ onOpen }: WorkProps) {
  const ref = useReveal<HTMLElement>();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="work" ref={ref} className="work reveal-section" aria-label="Selected work">
      <header className="work__head">
        <p className="mono-xs dim section-tag">— SELECTED WORK / 2024—2026</p>
        <h2 className="display-m dim">
          {active !== null ? PROJECTS[active].num : "04"} <span className="dim">/ PROJECTS</span>
        </h2>
      </header>

      {PROJECTS.map((p, i) => (
        <article
          key={p.id}
          className={`work__row work__row--${i % 2 === 0 ? "left" : "right"} ${active === i ? "work__row--active" : ""}`}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
        >
          <button
            className="work__hit"
            onClick={() => onOpen(p)}
            data-cursor="OPEN"
            aria-label={`Open case study: ${p.name}`}
          >
            <div className="work__visual">
              <Artwork variant={p.art} palette={p.palette} seed={p.seed} label={`${p.name} — abstract project artwork`} />
              <img className="frame-img" src={p.img} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <span className="work__view mono-xs" aria-hidden="true">VIEW CASE STUDY →</span>
            </div>
            <div className="work__info">
              <span className="mono-xs dim">{p.num}</span>
              <h3 className="display-m">{p.name}</h3>
              <p className="mono-xs dim">{p.role} — {p.year}</p>
              <p className="work__detail">{p.detail}</p>
              <ul className="work__tags mono-xs" aria-label="Project tags">
                {p.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          </button>
        </article>
      ))}
    </section>
  );
}

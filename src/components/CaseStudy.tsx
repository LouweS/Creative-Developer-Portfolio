import { useEffect } from "react";
import { Artwork } from "./Artwork";
import type { Project } from "./Work";

interface CaseStudyProps {
  project: Project;
  onClose: () => void;
}

/** Full-screen case study overlay — the project's artwork expands into the hero. */
export default function CaseStudy({ project, onClose }: CaseStudyProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.classList.add("case-open");
    history.pushState({ case: project.id }, "", `?case=${project.id}`);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("case-open");
    };
  }, [project.id, onClose]);

  useEffect(() => {
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [onClose]);

  return (
    <div className="case" role="dialog" aria-modal="true" aria-label={`Case study: ${project.name}`}>
      <button className="case__back mono-xs" onClick={onClose} data-cursor="CLOSE">
        ← BACK
      </button>

      <div className="case__hero">
        <Artwork variant={project.art} palette={project.palette} seed={project.seed} label="" />
        <img className="frame-img" src={project.img} alt="" aria-hidden="true" decoding="async" />
        <div className="case__hero-meta">
          <span className="mono-xs">PROJECT {project.num}</span>
          <span className="mono-xs dim">{project.year}</span>
        </div>
      </div>

      <div className="case__body">
        <p className="mono-xs dim section-tag">— CASE STUDY</p>
        <h1 className="display-xl">{project.name}</h1>
        <p className="case__lead">{project.detail}</p>
        <ul className="case__tags mono-xs" aria-label="Disciplines">
          {project.tags.map((t) => <li key={t}>{t}</li>)}
        </ul>

        <div className="case__columns">
          <div>
            <h2 className="display-s">APPROACH</h2>
            <p>
              The brief asked for presence without noise. We built the identity around a
              single kinetic gesture, then let typography and imagery do the shouting.
              Every interaction was prototyped at full fidelity before a line shipped.
            </p>
          </div>
          <div>
            <h2 className="display-s">RESULT</h2>
            <p>
              Site of the Day, a 3× lift in case-study completion, and an editor the
              client actually uses. The system now templates their quarterly releases
              without a developer in the loop.
            </p>
          </div>
        </div>

        <div className="case__strip" aria-hidden="true">
          <Artwork variant="echo" palette={project.palette} seed={project.seed + 40} />
          <Artwork variant="field" palette={project.palette} seed={project.seed + 80} />
          <Artwork variant="prism" palette={project.palette} seed={project.seed + 120} />
        </div>
      </div>
    </div>
  );
}

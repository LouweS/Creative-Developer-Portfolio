import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Process from "./components/Process";
import About from "./components/About";
import Work, { type Project } from "./components/Work";
import CaseStudy from "./components/CaseStudy";
import Gallery from "./components/Gallery";
import Experiments from "./components/Experiments";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PerfPanel from "./components/PerfPanel";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [entered, setEntered] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    setEntered(true);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.fromTo(
          section.querySelectorAll(".about__line, .display-m, .display-s, p, dl, ul, figure, .exp-card, .work__row, .contact__title span, .contact__cta, .contact__mail"),
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.06,
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
          }
        );
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [loaded]);

  const navigate = useCallback((id: string) => {
    if (id === "top") {
      lenisRef.current?.scrollTo(0, { duration: 1.2 }) ?? window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <a className="skip-link" href="#work">Skip to content</a>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Cursor />
      <Nav onNavigate={navigate} />
      <main className={loaded ? "" : "pre-load"}>
        <Hero entered={entered} />
        <Process />
        <Work onOpen={setProject} />
        <Gallery />
        <About />
        <Experiments />
        <Contact />
      </main>
      <Footer />
      {project && <CaseStudy project={project} onClose={() => setProject(null)} />}
      <PerfPanel />
    </>
  );
}

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { id: "work", label: "WORK" },
  { id: "about", label: "ABOUT" },
  { id: "experiments", label: "EXPERIMENTS" },
  { id: "contact", label: "CONTACT" },
];

interface NavProps {
  onNavigate: (id: string) => void;
}

export default function Nav({ onNavigate }: NavProps) {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCondensed(y > 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header className={`nav ${condensed ? "nav--condensed" : ""}`}>
        <button className="nav__brand display-s" onClick={() => go("top")} data-cursor="→">
          ATELIER&nbsp;NOIR<sup>®</sup>
        </button>
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <button key={l.id} className="mono-xs" onClick={() => go(l.id)} data-cursor="→">
              {l.label}
            </button>
          ))}
        </nav>
        <button
          className="nav__menu mono-xs"
          aria-expanded={open}
          aria-controls="fullscreen-menu"
          onClick={() => setOpen((o) => !o)}
          data-cursor={open ? "CLOSE" : "MENU"}
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </header>

      <div id="fullscreen-menu" className={`menu ${open ? "menu--open" : ""}`} aria-hidden={!open}>
        <nav className="menu__inner" aria-label="Fullscreen">
          {LINKS.map((l, i) => (
            <button
              key={l.id}
              className="menu__item display-l"
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
              onClick={() => go(l.id)}
              tabIndex={open ? 0 : -1}
            >
              <span className="mono-xs dim">0{i + 1}</span>
              {l.label}
            </button>
          ))}
        </nav>
        <div className="menu__meta mono-xs dim">
          <span>BERLIN — {new Date().getFullYear()}</span>
          <span>STUDIO@ATELIERNOIR.DEV</span>
        </div>
      </div>
    </>
  );
}

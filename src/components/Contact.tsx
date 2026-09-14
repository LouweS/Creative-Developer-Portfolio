import { useRef, useState } from "react";
import { useReveal } from "../lib/motion";

export default function Contact() {
  const ref = useReveal<HTMLElement>();
  const [copied, setCopied] = useState(false);
  const email = "STUDIO@ATELIERNOIR.DEV";
  const timer = useRef<number>(0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email.toLowerCase());
    } catch {
      // Clipboard unavailable (permissions/insecure context) — mailto fallback still fires.
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" ref={ref} className="contact reveal-section" aria-label="Contact">
      <p className="mono-xs dim section-tag">— CONTACT / NEW BUSINESS</p>
      <h2 className="display-xl contact__title">
        <span>LET'S</span>
        <span>MAKE</span>
        <span>SOMETHING</span>
        <span className="accent">UNEXPECTED.</span>
      </h2>

      <div className="contact__row">
        <button
          className={`contact__cta ${copied ? "contact__cta--copied" : ""}`}
          onClick={copy}
          data-cursor={copied ? "✓" : "COPY"}
          aria-live="polite"
        >
          <span className="contact__cta-label">{copied ? "MESSAGE COPIED" : "SEND A MESSAGE"}</span>
          <span className="contact__cta-arrow" aria-hidden="true">{copied ? "✓" : "→"}</span>
        </button>

        <a className="contact__mail mono-xs" href={`mailto:${email.toLowerCase()}`} data-cursor="→">
          {email}
        </a>
      </div>

      <dl className="contact__meta mono-xs">
        <div><dt>AVAILABILITY</dt><dd className="ok"><span className="tick" aria-hidden="true" /> OPEN Q1 2027</dd></div>
        <div><dt>LOCATION</dt><dd>BERLIN — CET</dd></div>
        <div><dt>SOCIAL</dt><dd>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" data-cursor="↗">INSTAGRAM</a>{" / "}
          <a href="https://github.com" target="_blank" rel="noreferrer" data-cursor="↗">GITHUB</a>{" / "}
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" data-cursor="↗">LINKEDIN</a>
        </dd></div>
      </dl>
    </section>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" aria-label="Footer">
      <div className="footer__status mono-xs">
        <span className="ok"><span className="tick" aria-hidden="true" /> AVAILABLE FOR SELECT PROJECTS</span>
        <span className="dim" aria-hidden="true">52.5200° N / 13.4050° E</span>
      </div>
      <div className="footer__brand display-s" aria-hidden="true">
        ATELIER&nbsp;NOIR<sup>®</sup>
      </div>
      <div className="footer__base mono-xs">
        <span className="dim">© {year} ATELIER NOIR — ALL RIGHTS RESERVED</span>
        <nav aria-label="Social">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" data-cursor="↗">INSTAGRAM</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" data-cursor="↗">GITHUB</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" data-cursor="↗">LINKEDIN</a>
          <a href="mailto:studio@ateliernoir.dev" data-cursor="↗">EMAIL</a>
        </nav>
        <span className="dim">DESIGNED & BUILT IN BERLIN</span>
      </div>
    </footer>
  );
}

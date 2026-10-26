import { useState } from "react";

// start.ng's header and footer (the live site's markup), with its light/dark switch. Links point at the real start.ng.

function ThemeToggle({ row = false }: { row?: boolean }) {
  const [dark, setDark] = useState(() => document.documentElement.getAttribute("data-theme") === "dark");
  const flip = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch { /* private mode */ }
    setDark(!dark);
  };
  const label = dark ? "Light mode" : "Dark mode";
  return (
    <button type="button" className={`theme-toggle${row ? " theme-row" : ""}`} aria-label={`Switch to ${label.toLowerCase()}`} title={label} onClick={flip}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {dark ? <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m0-11.4L4.9 4.9m14.2 14.2-1.4-1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
          : <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />}
      </svg>
      {row && label}
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <p className="mock-ribbon">Motion prototype for start.ng · sample data · <a href="/motion">Open the motion lab</a> · <a href="/">Home</a></p>
      <header className={`container nav${open ? " menu-open" : ""}`}>
        <a className="logo" href="/"><b>start<span>.ng</span></b></a>
        <nav id="pages-menu" aria-label="Pages">
          <a href="https://start.ng/games">Games</a>
          <a href="https://start.ng/tournament">Tournament</a>
          <a href="https://start.ng/creators">Creators</a>
          <a href="https://start.ng/docs">Docs</a>
          <ThemeToggle row />
        </nav>
        <div className="nav-account">
          <button type="button" className="nav-menu-btn" aria-label={open ? "Close menu" : "Menu"} aria-expanded={open} aria-controls="pages-menu" onClick={() => setOpen((o) => !o)}>
            <span aria-hidden="true" className="nav-menu-icon" /><span className="nav-menu-text">Menu</span>
          </button>
          <ThemeToggle />
          <a className="nav-signin btn" href="https://start.ng">Sign in</a>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="container site-footer">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <a className="logo" href="/"><b>start<span>.ng</span></b></a>
          <p>Nigeria&apos;s home for browser games, made by the community and by creators across Africa.</p>
        </div>
        <nav aria-label="Play"><h2>Play</h2><ul><li><a href="https://start.ng/games">All games</a></li><li><a href="https://start.ng/tournament">Daily tournament</a></li><li><a href="https://start.ng/hangout">The Hangout</a></li></ul></nav>
        <nav aria-label="This prototype"><h2>This prototype</h2><ul><li><a href="/motion">Motion lab</a></li><li><a href="https://github.com/Blackburn0/startng-motion">Source on GitHub</a></li></ul></nav>
      </div>
      <p className="site-footer-base"><span>© 2026 start.ng</span><span>A mock-up with sample data. The real site is start.ng.</span></p>
    </footer>
  );
}

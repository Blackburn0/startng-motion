import { useState } from "react";
import { games, playUrl } from "./data";
import SketchLogo from "./motion/SketchLogo";
import { celebrate } from "./motion/motion";
import ArcadeButton from "./whimsy/ArcadeButton";
import CardPreview from "./whimsy/CardPreview";
import JellyTitle from "./whimsy/JellyTitle";

// start.ng's homepage (the live markup), with sample data and the motion prototype switched on.

const Heart = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 5 6.1 5c2.1 0 3.6 1.2 4.4 2.5h3C14.3 6.2 15.8 5 17.9 5c3.4 0 5.2 3.4 3.7 6.8C19.5 16.4 12 21 12 21z" /></svg>
);

export default function Home() {
  const [favs, setFavs] = useState<string[]>([]);

  // Saving a favourite gets a small burst of confetti from the heart: a tiny reward for a tiny action.
  function toggleFav(slug: string, e: React.MouseEvent<HTMLButtonElement>) {
    const on = !favs.includes(slug);
    setFavs(on ? [...favs, slug] : favs.filter((f) => f !== slug));
    if (on) {
      const r = e.currentTarget.getBoundingClientRect();
      celebrate({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, 36);
    }
  }

  return (
    <main>
      <section className="container hero">
        <SketchLogo className="hero-sketch" />
        <p className="eyebrow">Big imagination. Played everywhere.</p>
        <JellyTitle />
        <p className="lead">Games made by builders in the community.<br />Pick one and play right in your browser.</p>
        <div className="actions"><ArcadeButton href="#games">Play now</ArcadeButton><a className="ghost btn" href="/motion">See the motion lab</a></div>
      </section>

      <section className="container">
        <a className="tournament-banner" href="https://start.ng/tournament">
          <div>
            <p className="eyebrow">Today&apos;s tournament · 4h 6m left</p>
            <h2>5 games. 24 hours. One winner.</h2>
            <p className="tournament-banner-sub">Share to enter, then play. 128 players have entered.</p>
          </div>
          <div className="tournament-banner-games" aria-hidden="true">
            {games.slice(1, 6).map((g) => (
              <span key={g.slug} className="art" style={{ background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})` }}><img src={g.cover} alt="" /></span>
            ))}
          </div>
          <span className="btn">See the tournament →</span>
        </a>
      </section>

      <section className="container" id="games">
        <div className="section-head">
          <div>
            <h2>Games from the community</h2>
            <p className="most-played"><span className="tag">Most played</span> What everyone&apos;s playing this week</p>
          </div>
        </div>
        <div className="grid">
          {games.map((g) => (
            <article key={g.slug} className={`game${g.legendary ? " legendary" : ""}`}>
              <a className="game-link" href={playUrl(g)}>
                <div className="art" style={{ background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})` }}><img src={g.cover} alt="" loading="lazy" decoding="async" /><CardPreview slug={g.slug} /></div>
                <div className="info"><h3>{g.name}</h3><p>{g.slug === "hangout" ? "start.ng/hangout" : `${g.slug}.start.ng`}</p><span className="by">by {g.by} · <span className="plays">{g.plays} plays</span></span></div>
              </a>
              <div className="meta">
                <button type="button" className="fav-btn" aria-pressed={favs.includes(g.slug)} aria-label={`${favs.includes(g.slug) ? "Remove" : "Add"} ${g.name} ${favs.includes(g.slug) ? "from" : "to"} favorites`} onClick={(e) => toggleFav(g.slug, e)}><Heart /></button>
                <a className="play" href={playUrl(g)}>Play</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

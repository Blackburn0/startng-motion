import { useEffect, useRef, useState } from "react";
import SketchLogo from "./SketchLogo";
import { celebrate, countUp } from "./motion";
import { games, playUrl } from "../data";
import CardPreview from "../whimsy/CardPreview";
import { NAIJA } from "../whimsy/Whimsy";

const SAMPLES = games.slice(1, 7);

/** /motion: the prototype's three moments in one place, with Replay buttons. Not linked from anywhere. */
export default function MotionLab() {
  const [hero, setHero] = useState(0);
  const [unlock, setUnlock] = useState(0);
  const xp = useRef<HTMLSpanElement>(null);
  const rank = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!unlock) return;
    if (xp.current) countUp(xp.current, 250, 1100);
    if (rank.current) countUp(rank.current, 3, 1100, 12);
  }, [unlock]);

  return (
    <main className="container mo-lab">
      <p className="eyebrow">Motion prototype</p>
      <h1>Three moments</h1>
      <p className="lead-sm">A first look at how start.ng could feel. Plain CSS and a little code, no new libraries, and everything switches off for people who ask their device for less motion.</p>

      <section>
        <h2>1. The homepage hero</h2>
        <p className="note">The lines rise in, the lime highlight sweeps in, and the sketch of our logo draws itself, then floats.</p>
        <div className="bar"><button type="button" onClick={() => setHero((n) => n + 1)}>Replay</button></div>
        <div className="container hero" key={hero}>
          <SketchLogo className="hero-sketch" />
          <p className="eyebrow">Big imagination. Played everywhere.</p>
          <h1>Good vibes.<br /><mark>Good games.</mark></h1>
          <p className="lead">Games made by builders in the community.<br />Pick one and play right in your browser.</p>
          <div className="actions"><a className="btn" href="/#games">Play now</a><a className="ghost btn" href="/">Back home</a></div>
        </div>
        <p className="note">The sketch sits in the top right corner on screens wider than about 760px.</p>
      </section>

      <section>
        <h2>2. Cards that react</h2>
        <p className="note">Move your mouse over a card: it leans towards you, glows where the pointer is, and the picture zooms. Press it to squeeze. They also rise in as you scroll to them.</p>
        <div className="cards">
          {SAMPLES.map((g) => (
            <article className="game" key={g.slug}>
              <a className="game-link" href={playUrl(g)}>
                <div className="art" style={{ background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})` }}><img src={g.cover} alt="" /><CardPreview slug={g.slug} /></div>
                <div className="info"><h3>{g.name}</h3><span className="by">by start.ng</span></div>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>3. A celebration</h2>
        <p className="note">For a win, an unlocked item or a new best: confetti in the site's own colours, a card that pops in, and numbers that count up.</p>
        <div className="bar">
          <button type="button" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); celebrate({ x: r.left + r.width / 2, y: r.top }); }}>Confetti from here</button>
          <button type="button" className="ghost" onClick={() => { setUnlock((n) => n + 1); celebrate(); }}>Unlock something</button>
        </div>
        {unlock > 0 && (
          <div className="mo-unlock pop" key={unlock}>
            <span className="tag">New personal best</span>
            <span className="big">+<span ref={xp}>0</span> XP</span>
            <span className="rank">You're now #<span ref={rank}>12</span></span>
          </div>
        )}
      </section>
      <section>
        <h2>4. Whimsy</h2>
        <p className="note">Small touches with some personality. Try each one here, or find it where it lives.</p>
        <ul className="whimsy-list">
          <li><b>The logo watches you<span>Move your mouse anywhere: its eyes follow. Shake the mouse hard and it gets dizzy. Click it on the homepage and it hops.</span></b></li>
          <li><b>Someone peeks in<span>Scroll to the very bottom of a page: a player peeks up and waves. Bring your mouse close and they duck.</span></b></li>
          <li><b>Cards play their game<span>Hover the cards in section 2: each plays one move from its own game.</span></b></li>
          <li><b>Jelly letters<span>On the homepage, touch the big heading with your mouse, or click a letter.</span></b><a className="ghost btn" href="/">Go home</a></li>
          <li><b>Sunset and fireflies<span>Switching to dark mode, the sun sets and fireflies drift by. Switching back, it rises.</span></b>
            <button type="button" onClick={() => dispatchEvent(new CustomEvent("startng:theme", { detail: { dark: true } }))}>Play the sunset</button>
            <button type="button" className="ghost" onClick={() => dispatchEvent(new CustomEvent("startng:theme", { detail: { dark: false } }))}>Sunrise</button></li>
          <li><b>A danfo drives by<span>Every so often along the bottom of the page. Click it to make it honk and speed off.</span></b>
            <button type="button" onClick={() => dispatchEvent(new Event("startng:danfo"))}>Send the danfo</button></li>
          <li><b>The arcade Play button<span>On the homepage, press &ldquo;Play now&rdquo;: a coin drops in with a clink.</span></b><a className="ghost btn" href="/">Go home</a></li>
          <li><b>A hidden treat<span>Type <code>naija</code> anywhere on the page.</span></b>
            <button type="button" onClick={() => celebrate(undefined, 220, NAIJA)}>Show me</button></li>
        </ul>
      </section>
    </main>
  );
}

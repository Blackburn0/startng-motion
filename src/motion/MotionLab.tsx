import { useEffect, useRef, useState } from "react";
import { celebrate, countUp } from "./motion";
import { games, playUrl } from "../data";
import JellyTitle from "../whimsy/JellyTitle";

const SAMPLES = games.slice(1, 7);

const TOC = [
  ["principles", "The rules it follows"],
  ["hero", "1. The hero arrives"],
  ["cards", "2. Cards that react"],
  ["reveal", "3. Things rise in as you scroll"],
  ["jelly", "4. Jelly letters"],
  ["celebrate", "5. Celebrations"],
  ["add", "Add it to start.ng"],
  ["files", "Files"],
] as const;

function Code({ children }: { children: string }) {
  return <pre className="doc-code"><code>{children.trim()}</code></pre>;
}

/** /motion: the documentation for start.ng's motion, with a demo video and a live example of every effect. */
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
    <main className="container mo-lab mo-docs">
      <p className="eyebrow">Docs · motion prototype</p>
      <h1>How start.ng moves</h1>
      <p className="lead-sm">A small layer of motion and play for start.ng: the homepage arrives, cards react to you, the heading is made of jelly, and wins get a celebration. Plain CSS and about 150 lines of TypeScript, no animation library.</p>

      <figure className="doc-video">
        <video controls preload="metadata" poster="/video/demo-poster.jpg" playsInline>
          <source src="/video/demo.mp4" type="video/mp4" />
        </video>
        <figcaption>A 40-second tour: the hero, cards reacting to the mouse, jelly letters, saving a favourite, and a celebration.</figcaption>
      </figure>

      <nav className="doc-toc" aria-label="On this page">
        <p>On this page</p>
        <ol>{TOC.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ol>
      </nav>

      <section id="principles">
        <h2>The rules it follows</h2>
        <ul className="doc-list">
          <li><b>No new libraries.</b> CSS animations, a little TypeScript, and a canvas only for confetti. It stays inside start.ng&apos;s design rules.</li>
          <li><b>start.ng&apos;s own colours.</b> Every colour comes from the site&apos;s variables (<code>--lime</code>, <code>--ink</code>…), so light and dark mode both work.</li>
          <li><b>&ldquo;Reduce motion&rdquo; is respected.</b> If the device asks for less motion, <code>startMotion()</code> does nothing and every animation is off. The page reads exactly the same.</li>
          <li><b>Content first.</b> Effects only start after the page has loaded, and only add classes. Search engines and slow phones get the full page without them.</li>
          <li><b>Mouse effects stay on mouse.</b> Tilt and glow only run for a real mouse, never on touch screens.</li>
        </ul>
      </section>

      <section id="hero">
        <h2>1. The hero arrives</h2>
        <p><b>What it does:</b> the homepage lines rise in one after another, then the lime highlight sweeps under &ldquo;Good games.&rdquo;</p>
        <div className="doc-demo">
          <div className="bar"><button type="button" onClick={() => setHero((n) => n + 1)}>Replay</button></div>
          <div className="container hero" key={hero}>
            <p className="eyebrow">Big imagination. Played everywhere.</p>
            <h1>Good vibes.<br /><mark>Good games.</mark></h1>
            <p className="lead">Games made by builders in the community.<br />Pick one and play right in your browser.</p>
          </div>
        </div>
        <p><b>How it works:</b> pure CSS in <code>motion.css</code>. Each child of <code>.hero</code> runs <code>mo-rise</code> with a growing delay, and <code>mark</code> runs <code>mo-sweep</code> by growing its background from 0% to 100%.</p>
        <Code>{`
.mo .hero > h1 { animation: mo-rise .75s .15s cubic-bezier(.2, .8, .2, 1) both; }
.mo .hero mark { background-size: 0% 100%; animation: mo-sweep .9s .65s forwards; }`}</Code>
      </section>

      <section id="cards">
        <h2>2. Cards that react</h2>
        <p><b>What it does:</b> with a mouse, a game card leans towards the pointer, a lime glow follows it, the cover zooms, and pressing squeezes the card.</p>
        <div className="doc-demo">
          <p className="note">Move your mouse over a card, then press it.</p>
          <div className="cards">
            {SAMPLES.map((g) => (
              <article className="game" key={g.slug}>
                <a className="game-link" href={playUrl(g)}>
                  <div className="art" style={{ background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})` }}><img src={g.cover} alt="" /></div>
                  <div className="info"><h3>{g.name}</h3><span className="by">by start.ng</span></div>
                </a>
              </article>
            ))}
          </div>
        </div>
        <p><b>How it works:</b> one <code>pointermove</code> listener for the whole page finds the <code>.game</code> under the mouse and sets four CSS variables on it: <code>--tx</code> and <code>--ty</code> (where the pointer is, from -1 to 1) for the lean, and <code>--px</code> and <code>--py</code> (0 to 1) for the glow. The CSS does the rest.</p>
        <Code>{`
.mo .game:hover {
  transform: perspective(820px) rotateX(calc(var(--ty) * -5deg)) rotateY(calc(var(--tx) * 6deg)) translateY(-5px);
  background-image: radial-gradient(260px circle at calc(var(--px) * 100%) calc(var(--py) * 100%), …);
}`}</Code>
        <p><b>Switched off:</b> on touch screens (only <code>pointerType === &quot;mouse&quot;</code> counts, and the hover styles sit inside <code>@media (hover: hover) and (pointer: fine)</code>).</p>
      </section>

      <section id="reveal">
        <h2>3. Things rise in as you scroll</h2>
        <p><b>What it does:</b> cards and sections below the fold fade up as they come into view, one after another. Anything already on screen when the page loads is left alone, so nothing flashes.</p>
        <p><b>How it works:</b> an <code>IntersectionObserver</code> watches the matching elements (<code>.game</code>, <code>.shelf</code>, <code>.tournament-banner</code>…). It adds <code>mo-hide</code> before they arrive, then <code>mo-in</code> when they do, with a small stagger (<code>--mo-d</code>) between siblings. A <code>MutationObserver</code> picks up cards React adds later.</p>
        <p className="note">See it on the <a href="/">homepage</a>: scroll down to the games.</p>
      </section>

      <section id="jelly">
        <h2>4. Jelly letters</h2>
        <p><b>What it does:</b> the big heading is made of soft pieces. Touch a letter with your mouse and it wobbles like jelly; click it and it bounces like a ball.</p>
        <div className="doc-demo"><div className="hero"><JellyTitle /></div></div>
        <p><b>How it works:</b> <code>JellyTitle</code> splits each word into one <code>span</code> per letter, and keeps words together so they never break mid-word. <code>:hover</code> plays <code>jl-jelly</code> (a squash and stretch); a click adds <code>jl-bounce</code>, keyed so it can play again. Screen readers get the plain heading from <code>aria-label</code>, and the letters are hidden from them.</p>
        <Code>{`
<h1 aria-label="Good vibes. Good games.">…one <span class="jl"> per letter…</h1>
.jl:hover { animation: jl-jelly .7s; }   /* scale(1.18, .82) → (.88, 1.14) → back */`}</Code>
      </section>

      <section id="celebrate">
        <h2>5. Celebrations</h2>
        <p><b>What it does:</b> for a win, an unlocked item or a new best: confetti in start.ng&apos;s colours, a card that pops in, and numbers that count up. Saving a favourite on the homepage gets a small burst from the heart.</p>
        <div className="doc-demo">
          <div className="bar">
            <button type="button" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); celebrate({ x: r.left + r.width / 2, y: r.top }); }}>Confetti from here</button>
            <button type="button" className="ghost" onClick={() => { setUnlock((n) => n + 1); celebrate(); }}>Unlock something</button>
          </div>
          {unlock > 0 && (
            <div className="mo-unlock pop" key={unlock}>
              <span className="tag">New personal best</span>
              <span className="big">+<span ref={xp}>0</span> XP</span>
              <span className="rank">You&apos;re now #<span ref={rank}>12</span></span>
            </div>
          )}
        </div>
        <p><b>How to use it:</b></p>
        <Code>{`
import { celebrate, countUp } from "./motion/motion";

celebrate();                                  // a burst from the upper middle of the screen
celebrate({ x, y }, 36);                      // a small burst from a point (the favourite heart)
celebrate(undefined, 150, ["#008751", "#fff"]); // your own colours
countUp(element, 250, 1100);                  // count from 0 to 250 in 1.1 seconds`}</Code>
        <p><b>Switched off:</b> with &ldquo;reduce motion&rdquo; on, <code>celebrate()</code> does nothing and <code>countUp()</code> shows the final number straight away.</p>
      </section>

      <section id="add">
        <h2>Add it to start.ng</h2>
        <ol className="doc-list">
          <li>Copy <code>src/motion/</code> and <code>src/whimsy/</code> into <code>startng-fe/src/</code>.</li>
          <li>In <code>main.tsx</code>, import the styles and switch the motion on once, before React renders:
            <Code>{`
import "./motion/motion.css";
import "./whimsy/whimsy.css";
import { startMotion } from "./motion/motion";

startMotion();`}</Code>
          </li>
          <li>In the homepage hero (<code>App.tsx</code>), replace the heading with <code>&lt;JellyTitle /&gt;</code>.</li>
          <li>Call <code>celebrate()</code> where something good happens: the unlock popup, a new best score, a tournament win.</li>
        </ol>
      </section>

      <section id="files">
        <h2>Files</h2>
        <table className="doc-table">
          <thead><tr><th>File</th><th>What it holds</th></tr></thead>
          <tbody>
            <tr><td><code>src/motion/motion.ts</code></td><td><code>startMotion()</code> (the scroll reveal and card tilt), <code>celebrate()</code>, <code>countUp()</code>, <code>reducedMotion()</code></td></tr>
            <tr><td><code>src/motion/motion.css</code></td><td>The hero, the cards, the scroll reveal and the celebration card</td></tr>
            <tr><td><code>src/whimsy/JellyTitle.tsx</code></td><td>The heading made of jelly letters</td></tr>
            <tr><td><code>src/whimsy/whimsy.css</code></td><td>The jelly and bounce animations</td></tr>
          </tbody>
        </table>
        <p className="note">Source: <a href="https://github.com/Blackburn0/startng-motion">github.com/Blackburn0/startng-motion</a></p>
      </section>
    </main>
  );
}

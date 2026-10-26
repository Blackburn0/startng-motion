import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "../motion/motion";

// 1. The logo's play button comes alive: two eyes that watch your pointer anywhere on the page, a blink now and then,
// dizzy spiral eyes if you shake the mouse hard, and a little hop when you click it. Same lime square and play shape as
// start.ng's favicon; with "reduce motion" on it's just the logo.

export default function LogoBuddy() {
  const ref = useRef<SVGSVGElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [dizzy, setDizzy] = useState(false);
  const [hop, setHop] = useState(0);
  const calm = reducedMotion();

  useEffect(() => {
    if (calm) return;
    // where the pointer is, relative to the logo: pupils move up to 2 units towards it
    let trail: { t: number; x: number; y: number }[] = [];
    const move = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 120);
      setLook({ x: (dx / d) * 2 * k, y: (dy / d) * 2 * k });
      // shaking: lots of distance in a short time makes it dizzy
      const now = performance.now();
      trail = [...trail.filter((p) => now - p.t < 500), { t: now, x: e.clientX, y: e.clientY }];
      let dist = 0;
      for (let i = 1; i < trail.length; i++) dist += Math.hypot(trail[i].x - trail[i - 1].x, trail[i].y - trail[i - 1].y);
      if (dist > 3200) { setDizzy(true); trail = []; }
    };
    addEventListener("pointermove", move, { passive: true });
    let timer: number;
    const blinkSoon = () => { timer = window.setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 130); blinkSoon(); }, 2500 + Math.random() * 3500); };
    blinkSoon();
    return () => { removeEventListener("pointermove", move); clearTimeout(timer); };
  }, [calm]);

  useEffect(() => {
    if (!dizzy) return;
    const t = setTimeout(() => setDizzy(false), 1800);
    return () => clearTimeout(t);
  }, [dizzy]);

  const eye = (cx: number) => (
    <g key={cx} className={blink ? "lb-blink" : ""} style={{ transformOrigin: `${cx}px 30px` }}>
      <circle cx={cx} cy={30} r={4.2} fill="#fff" />
      {dizzy ? <path className="lb-spiral" style={{ transformOrigin: `${cx}px 30px` }} d={`M${cx} 30m0-.1a.9.9 0 1 1-.9.9 1.8 1.8 0 1 1 1.8-1.8 2.7 2.7 0 1 1-2.7 2.7`} fill="none" stroke="#292a23" strokeWidth=".9" strokeLinecap="round" />
        : <circle cx={cx + look.x} cy={30 + look.y} r={2} fill="#292a23" />}
    </g>
  );

  return (
    <svg ref={ref} viewBox="0 0 64 64" className={`logo-buddy${hop % 2 ? " hop-a" : hop ? " hop-b" : ""}`} aria-hidden="true"
      onClick={(e) => { if (!calm && location.pathname === "/") { e.preventDefault(); setHop((h) => h + 1); } }}>
      <rect width="64" height="64" rx="14" fill="#d8fd71" />
      <path className="lb-play" d="M26 19.5v25c0 1.6 1.7 2.5 3 1.7l19.5-12.5c1.2-.8 1.2-2.6 0-3.4L29 17.8c-1.3-.8-3 .1-3 1.7z" fill="#292a23" />
      {!calm && [31.5, 40].map(eye)}
    </svg>
  );
}

import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "../motion/motion";
import { games } from "../data";
import { honk } from "./sound";

// 6. Now and then a yellow danfo bus drives along the bottom of the page, with start.ng's games as passengers.
// Click it: it honks and speeds off. First trip after a few seconds, then about every 45 seconds; also on demand from the
// motion lab ("startng:danfo" event). Only the bus itself takes clicks; the rest of the page is untouched.

const PASSENGERS = games.slice(1, 5);

export default function Danfo() {
  const [trip, setTrip] = useState(0); // 0 = parked offscreen
  const [fast, setFast] = useState(false);
  const bus = useRef<HTMLButtonElement>(null);
  const x = useRef(-260);

  useEffect(() => {
    if (reducedMotion()) return;
    const go = () => setTrip((t) => t + 1);
    const first = setTimeout(go, 6000);
    const every = setInterval(go, 45000);
    addEventListener("startng:danfo", go);
    return () => { clearTimeout(first); clearInterval(every); removeEventListener("startng:danfo", go); };
  }, []);

  useEffect(() => {
    if (!trip) return;
    x.current = -260;
    setFast(false);
    let last = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      x.current += dt * (bus.current?.dataset.fast === "1" ? 1.1 : 0.16);
      if (bus.current) bus.current.style.transform = `translateX(${x.current}px)`;
      if (x.current < innerWidth + 40) raf = requestAnimationFrame(step);
      else setTrip(0);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trip]);

  if (!trip) return null;
  return (
    <button ref={bus} type="button" className={`danfo${fast ? " danfo-fast" : ""}`} data-fast={fast ? "1" : "0"} aria-label="A danfo bus. Click to honk"
      onClick={() => { if (!fast) { honk(); setFast(true); } }}>
      <svg viewBox="0 0 220 96" aria-hidden="true">
        <g className="danfo-body">
          <path d="M12 26c0-8 6-14 14-14h138c10 0 18 6 22 15l14 30v18c0 4-3 7-7 7H19c-4 0-7-3-7-7z" fill="#f2c230" stroke="#292a23" strokeWidth="3" />
          <rect x="14" y="58" width="190" height="6" fill="#292a23" />
          <rect x="14" y="68" width="190" height="4" fill="#292a23" />
          {PASSENGERS.map((g, k) => (
            <g key={g.slug}>
              <rect x={26 + k * 36} y="22" width="30" height="26" rx="4" fill="#cfe9ff" stroke="#292a23" strokeWidth="2" />
              <clipPath id={`pw${k}`}><rect x={28 + k * 36} y="24" width="26" height="22" rx="3" /></clipPath>
              <image href={g.cover} x={22 + k * 36} y="24" width="38" height="24" preserveAspectRatio="xMidYMid slice" clipPath={`url(#pw${k})`} />
            </g>
          ))}
          <path d="M172 22h10c5 0 9 3 11 7l9 19h-30z" fill="#cfe9ff" stroke="#292a23" strokeWidth="2" />
          <text x="40" y="83" fontSize="9" fontWeight="800" fill="#292a23" fontFamily="Helvetica, Arial, sans-serif">NO WAHALA · start.ng</text>
          <circle cx="206" cy="66" r="4" fill="#fff3b0" stroke="#292a23" strokeWidth="1.5" />
        </g>
        {[48, 170].map((cx) => (
          <g key={cx} className="danfo-wheel" style={{ transformOrigin: `${cx}px 84px` }}>
            <circle cx={cx} cy="84" r="11" fill="#292a23" /><circle cx={cx} cy="84" r="4.5" fill="#bdbdb5" /><path d={`M${cx - 9} 84h18`} stroke="#bdbdb5" strokeWidth="2" />
          </g>
        ))}
      </svg>
      {fast && <span className="danfo-honk">Poo poo!</span>}
    </button>
  );
}

import { useEffect, useState } from "react";
import { reducedMotion } from "../motion/motion";

// 5. Switching to dark mode, the sun sets behind the header and a few fireflies drift by for a moment; switching back, the sun
// rises. Listens for the "startng:theme" event the theme button sends. Over in a few seconds, never in the way (no clicks).

type Show = { dark: boolean; key: number } | null;

const FLIES = Array.from({ length: 12 }, (_, i) => ({ left: 8 + ((i * 37) % 84), top: 18 + ((i * 53) % 64), delay: (i % 6) * 0.25, dx: ((i * 29) % 60) - 30, dy: ((i * 17) % 40) - 20 }));

export default function SkyShow() {
  const [show, setShow] = useState<Show>(null);

  useEffect(() => {
    const on = (e: Event) => {
      if (reducedMotion()) return;
      setShow({ dark: (e as CustomEvent<{ dark: boolean }>).detail.dark, key: Date.now() });
    };
    addEventListener("startng:theme", on);
    return () => removeEventListener("startng:theme", on);
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(null), show.dark ? 5200 : 2200);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;
  return (
    <div key={show.key} className={`sky ${show.dark ? "sky-set" : "sky-rise"}`} aria-hidden="true">
      <span className="sky-glow" />
      <span className="sky-sun" />
      {show.dark && FLIES.map((f, i) => (
        <span key={i} className="firefly" style={{ left: `${f.left}%`, top: `${f.top}%`, animationDelay: `${1.1 + f.delay}s`, ["--dx" as string]: `${f.dx}px`, ["--dy" as string]: `${f.dy}px` }} />
      ))}
    </div>
  );
}

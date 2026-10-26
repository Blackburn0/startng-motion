import { useState } from "react";
import { reducedMotion } from "../motion/motion";
import { clink } from "./sound";

// 7. "Play now" as an arcade button: pressing it pushes it down, a coin drops into the slot with a clink, then the page moves
// on to the games. With "reduce motion" on it's a normal link.

export default function ArcadeButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [coin, setCoin] = useState(0);
  return (
    <a className="btn arcade" href={href} onClick={(e) => {
      if (reducedMotion()) return;
      e.preventDefault();
      setCoin((c) => c + 1);
      setTimeout(clink, 330);
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 700);
    }}>
      {coin > 0 && <span key={coin} className="arcade-coin" aria-hidden="true" />}
      {children}
    </a>
  );
}

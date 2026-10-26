import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "../motion/motion";

// 2. A start.ng player character hides below the bottom-right edge. When you reach the end of the page it peeks up and waves;
// bring the mouse close and it ducks away, then peeks again a moment later. Decoration only (hidden from screen readers).

export default function Peeker() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"hidden" | "peek" | "duck">("hidden");
  const ducking = useRef(0);

  useEffect(() => {
    if (reducedMotion()) return;
    const atBottom = () => innerHeight + scrollY > document.documentElement.scrollHeight - 260;
    const update = () => setState((s) => (s === "duck" ? s : atBottom() ? "peek" : "hidden"));
    const near = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      if (Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 3)) < 150 && atBottom()) {
        setState("duck");
        clearTimeout(ducking.current);
        ducking.current = window.setTimeout(() => setState(atBottom() ? "peek" : "hidden"), 1600);
      }
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("pointermove", near, { passive: true });
    update();
    return () => { removeEventListener("scroll", update); removeEventListener("pointermove", near); clearTimeout(ducking.current); };
  }, []);

  if (reducedMotion()) return null;
  return (
    <div ref={ref} className={`peeker peeker-${state}`} aria-hidden="true">
      <svg viewBox="0 0 120 130">
        <g className="pk-arm"><path d="M92 86c10-6 16-18 14-30" stroke="#8d5524" strokeWidth="9" strokeLinecap="round" fill="none" /><circle cx="105" cy="52" r="8" fill="#8d5524" /></g>
        <rect x="26" y="78" width="68" height="60" rx="26" fill="var(--lime)" stroke="var(--ink)" strokeWidth="3" />
        <circle cx="60" cy="50" r="32" fill="#8d5524" />
        <path d="M28 46c0-22 14-32 32-32s32 10 32 32c-8-8-20-12-32-12s-24 4-32 12z" fill="#2a1a12" />
        <g className="pk-eyes"><circle cx="49" cy="52" r="4.5" fill="#fff" /><circle cx="71" cy="52" r="4.5" fill="#fff" /><circle cx="50" cy="53" r="2.4" fill="#2a1a12" /><circle cx="72" cy="53" r="2.4" fill="#2a1a12" /></g>
        <path d="M51 66c5 5 13 5 18 0" stroke="#2a1a12" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="40" cy="62" r="4" fill="#c46a4a" opacity=".7" /><circle cx="80" cy="62" r="4" fill="#c46a4a" opacity=".7" />
      </svg>
    </div>
  );
}

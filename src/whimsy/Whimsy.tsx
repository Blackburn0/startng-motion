import { useEffect } from "react";
import { celebrate, reducedMotion } from "../motion/motion";
import Danfo from "./Danfo";
import Peeker from "./Peeker";
import SkyShow from "./SkyShow";
import "./whimsy.css";

// The whole-page bits of whimsy, mounted once: the sky show (5), the danfo (6), the peeking character (2), and
// 8. a hidden treat: type "naija" anywhere (outside a text box) and green-white-green confetti falls.

export const NAIJA = ["#008751", "#ffffff", "#008751", "#00a862", "#e8f5ee"];

export default function Whimsy() {
  useEffect(() => {
    if (reducedMotion()) return;
    let typed = "";
    const key = (e: KeyboardEvent) => {
      if ((e.target as Element | null)?.closest?.("input, textarea, select, [contenteditable]") || e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-5);
      if (typed === "naija") { typed = ""; celebrate({ x: innerWidth / 2, y: innerHeight * 0.25 }, 220, NAIJA); }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);

  return (
    <>
      <SkyShow />
      <Danfo />
      <Peeker />
    </>
  );
}

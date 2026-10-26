import { useState } from "react";
import { reducedMotion } from "../motion/motion";

// 4. "Good vibes. Good games." made of soft pieces: each letter wobbles like jelly when the pointer touches it, and bounces
// like a ball when clicked. Screen readers get the plain heading (aria-label); the letters themselves are hidden from them.

function Letters({ text, offset }: { text: string; offset: number }) {
  const [bounced, setBounced] = useState<Record<number, number>>({});
  if (reducedMotion()) return <>{text}</>;
  return (
    <>
      {text.split(" ").map((word, w, words) => {
        const start = offset + words.slice(0, w).join(" ").length + (w ? 1 : 0);
        return (
          <span key={w} className="jl-word" aria-hidden="true">
            {[...word].map((ch, k) => {
              const i = start + k;
              return (
                <span key={`${k}-${bounced[i] ?? 0}`} className={`jl${bounced[i] ? " jl-bounce" : ""}`}
                  onClick={() => setBounced((b) => ({ ...b, [i]: (b[i] ?? 0) + 1 }))}>{ch}</span>
              );
            })}
            {w < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </>
  );
}

export default function JellyTitle() {
  return (
    <h1 aria-label="Good vibes. Good games.">
      <Letters text="Good vibes." offset={0} /><br /><mark><Letters text="Good games." offset={20} /></mark>
    </h1>
  );
}

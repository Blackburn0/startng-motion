// 3. Hover a game card (or tab to it) and it plays one tiny move from its own game, so you see what it is before you click:
// tic-tac-toe draws an X, a Connect 4 disc drops, Whot cards fan out, the Ludo die rolls, Ayo seeds hop, a draughts piece
// jumps, a quiz answer lights up, a bingo ball pops out. Drawn in SVG, moved by CSS (whimsy.css); off with "reduce motion".

const W = "#fffefa";
const INK = "#292a23";
const LIME = "#d8fd71";

function Preview({ slug }: { slug: string }) {
  switch (slug) {
    case "tic-tac-toe":
      return (
        <svg viewBox="0 0 90 90">
          <path d="M33 10v70M57 10v70M10 33h70M10 57h70" stroke={W} strokeWidth="3" strokeLinecap="round" opacity=".7" />
          <circle cx="21" cy="21" r="7" stroke={LIME} strokeWidth="4" fill="none" />
          <path className="pv-draw pv-d1" pathLength={1} d="M38 38l14 14" stroke={W} strokeWidth="5" strokeLinecap="round" />
          <path className="pv-draw pv-d2" pathLength={1} d="M52 38L38 52" stroke={W} strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
    case "connect-4":
      return (
        <svg viewBox="0 0 90 90">
          <rect x="12" y="26" width="66" height="58" rx="8" fill="#1f2a44" />
          {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <circle key={`${r}${c}`} cx={23 + c * 15} cy={39 + r * 16} r="5.5" fill={r === 2 && c < 2 ? "#7fd884" : r === 2 && c === 3 ? LIME : "#0e1424"} />))}
          <circle className="pv-drop" cx="53" cy="71" r="5.5" fill={LIME} />
        </svg>
      );
    case "whot":
      return (
        <svg viewBox="0 0 90 90">
          {[["#ff8a7d", -18, "circle"], ["#6aaaf0", 0, "tri"], ["#c3a0ee", 18, "star"]].map(([colour, angle, shape], k) => (
            <g key={k} className="pv-fan" style={{ ["--a" as string]: `${angle}deg`, transformOrigin: "45px 80px" }}>
              <rect x="30" y="20" width="30" height="44" rx="5" fill={W} stroke={INK} strokeWidth="1.5" />
              {shape === "circle" && <circle cx="45" cy="42" r="8" fill={colour as string} />}
              {shape === "tri" && <path d="M45 33l9 16H36z" fill={colour as string} />}
              {shape === "star" && <path d="M45 32l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" fill={colour as string} />}
            </g>
          ))}
        </svg>
      );
    case "ludo":
      return (
        <svg viewBox="0 0 90 90">
          <g className="pv-roll" style={{ transformOrigin: "45px 45px" }}>
            <rect x="25" y="25" width="40" height="40" rx="9" fill={W} stroke={INK} strokeWidth="2" />
            {[[35, 35], [55, 35], [35, 45], [55, 45], [35, 55], [55, 55]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="3.6" fill={INK} />)}
          </g>
        </svg>
      );
    case "ayo":
      return (
        <svg viewBox="0 0 90 90">
          <rect x="8" y="34" width="74" height="30" rx="15" fill="#6b4a28" />
          <circle cx="26" cy="49" r="10" fill="#3f2b17" /><circle cx="64" cy="49" r="10" fill="#3f2b17" />
          <circle cx="23" cy="50" r="3" fill="#e8c98f" /><circle cx="29" cy="48" r="3" fill="#e8c98f" />
          <circle className="pv-hop" cx="26" cy="49" r="3.4" fill="#e8c98f" />
        </svg>
      );
    case "draughts":
      return (
        <svg viewBox="0 0 90 90">
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={15 + c * 20} y={15 + r * 20} width="20" height="20" fill={(r + c) % 2 ? "#55453a" : "#c9cba8"} />))}
          <circle cx="45" cy="45" r="7" fill={INK} stroke="#c9cba8" strokeWidth="2" />
          <circle className="pv-jump" cx="25" cy="65" r="7" fill={W} stroke="#c9cba8" strokeWidth="2" />
        </svg>
      );
    case "quiz":
      return (
        <svg viewBox="0 0 90 90">
          <text className="pv-pop" x="45" y="30" textAnchor="middle" fontSize="22" fontWeight="900" fill={LIME}>?</text>
          {[0, 1, 2].map((k) => <rect key={k} className={k === 1 ? "pv-right" : ""} x="18" y={40 + k * 14} width="54" height="10" rx="5" fill={W} opacity={k === 1 ? 1 : 0.55} />)}
        </svg>
      );
    case "bingo":
      return (
        <svg viewBox="0 0 90 90">
          <g className="pv-ball" style={{ transformOrigin: "45px 50px" }}>
            <circle cx="45" cy="50" r="20" fill={LIME} stroke={INK} strokeWidth="2" />
            <circle cx="45" cy="50" r="12" fill={W} />
            <text x="45" y="55" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK}>B7</text>
          </g>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 90 90">
          {[[30, 40], [55, 30], [62, 58], [35, 62]].map(([x, y], k) => <path key={k} className="pv-twinkle" style={{ animationDelay: `${k * 0.15}s` }} d={`M${x} ${y - 7}l2 5 5 2-5 2-2 5-2-5-5-2 5-2z`} fill={LIME} />)}
        </svg>
      );
  }
}

export default function CardPreview({ slug }: { slug: string }) {
  return <span className="pv" aria-hidden="true"><Preview slug={slug} /></span>;
}

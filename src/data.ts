// Sample games for the mock-up: start.ng's own multiplayer games (their real covers), linked to the live games.
export type Game = { name: string; slug: string; by: string; cover: string; colors: [string, string]; plays: number; legendary?: boolean };

export const games: Game[] = [
  { name: "The Hangout", slug: "hangout", by: "start.ng", cover: "/covers/hangout.jpg", colors: ["#292a23", "#5b7d0d"], plays: 412, legendary: true },
  { name: "Tic-tac-toe", slug: "tic-tac-toe", by: "start.ng", cover: "/covers/tic-tac-toe.jpg", colors: ["#2e6fef", "#16356f"], plays: 236 },
  { name: "Connect 4", slug: "connect-4", by: "start.ng", cover: "/covers/connect-4.jpg", colors: ["#7fd884", "#146c43"], plays: 198 },
  { name: "Whot", slug: "whot", by: "start.ng", cover: "/covers/whot.jpg", colors: ["#ff8a7d", "#c0392b"], plays: 187 },
  { name: "Ludo", slug: "ludo", by: "start.ng", cover: "/covers/ludo.jpg", colors: ["#f2cf5b", "#e0425a"], plays: 164 },
  { name: "Ayo", slug: "ayo", by: "start.ng", cover: "/covers/ayo.jpg", colors: ["#b98a52", "#6b4a28"], plays: 141 },
  { name: "Draughts", slug: "draughts", by: "start.ng", cover: "/covers/draughts.jpg", colors: ["#c9cba8", "#55453a"], plays: 120 },
  { name: "Quiz", slug: "quiz", by: "start.ng", cover: "/covers/quiz.jpg", colors: ["#d8fd71", "#3e4a63"], plays: 98 },
  { name: "Bingo", slug: "bingo", by: "start.ng", cover: "/covers/bingo.jpg", colors: ["#d8fd71", "#146c43"], plays: 77 },
];

export const playUrl = (g: Game) => (g.slug === "hangout" ? "https://start.ng/hangout" : `https://${g.slug}.start.ng`);

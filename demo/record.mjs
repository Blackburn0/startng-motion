// Records the demo video for the docs page (public/video/demo.mp4): drives Chrome through each effect with a visible pointer
// and a caption, captures the screen with Chrome's screencast, and joins the frames with ffmpeg.
//
//   node demo/record.mjs BASE_URL WORK_DIR CHROME_PATH [FFMPEG]
//   e.g. node demo/record.mjs http://localhost:5180 C:/tmp/frames "C:/Program Files/Google/Chrome/Application/chrome.exe" ffmpeg
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const [BASE, WORK, CHROME, FFMPEG = "ffmpeg"] = process.argv.slice(2);
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..", "public", "video");
const W = 1280, H = 720;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, defaultViewport: { width: W, height: H, deviceScaleFactor: 1 }, args: [`--window-size=${W},${H}`] });
const page = await browser.newPage();

// A visible pointer (a headless browser has none) and a caption bar, added to every page
await page.evaluateOnNewDocument(() => {
  try { localStorage.setItem("theme", "light"); } catch {}
  addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style");
    style.textContent = `
      html { scroll-behavior: auto !important; } /* the script scrolls step by step and measures right after */`;
    style.textContent += `
      #demo-cursor { position: fixed; z-index: 2147483647; left: 0; top: 0; width: 22px; height: 22px; pointer-events: none; transform: translate(-100px, -100px); }
      #demo-cursor.down svg { transform: scale(.85); }
      #demo-caption { position: fixed; z-index: 2147483646; left: 50%; bottom: 26px; transform: translateX(-50%); max-width: 80%; padding: 10px 20px; border-radius: 999px;
        background: #292a23; color: #f6f5ee; font: 600 17px/1.3 "Helvetica Neue", Helvetica, Arial, sans-serif; box-shadow: 4px 4px 0 #d8fd71; text-align: center; transition: opacity .25s; }
      #demo-caption:empty { opacity: 0; }`;
    document.head.append(style);
    const cursor = document.createElement("div");
    cursor.id = "demo-cursor";
    cursor.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 2l15 12-7 1 4 7-3 1.5-4-7-5 5z" fill="#fff" stroke="#292a23" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    const caption = document.createElement("div");
    caption.id = "demo-caption";
    document.body.append(cursor, caption);
    addEventListener("pointermove", (e) => { cursor.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 2}px)`; }, true);
    addEventListener("pointerdown", () => cursor.classList.add("down"), true);
    addEventListener("pointerup", () => cursor.classList.remove("down"), true);
  });
});

const caption = (text) => page.evaluate((t) => { const c = document.getElementById("demo-caption"); if (c) c.textContent = t; }, text);
let mouse = { x: W / 2, y: H / 2 };
async function glide(x, y, ms = 700) {
  const steps = Math.max(8, Math.round(ms / 16));
  const from = { ...mouse };
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    await page.mouse.move(from.x + (x - from.x) * e, from.y + (y - from.y) * e);
    await sleep(16);
  }
  mouse = { x, y };
}
const centre = (sel, i = 0) => page.evaluate((s, k) => { const r = document.querySelectorAll(s)[k].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel, i);
async function scrollTo(y, ms = 1200) {
  const start = await page.evaluate(() => scrollY);
  const steps = Math.round(ms / 16);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, e = 1 - Math.pow(1 - t, 3);
    await page.evaluate((v) => scrollTo(0, v), start + (y - start) * e);
    await sleep(16);
  }
}

// Record: Chrome sends a frame whenever the screen changes; keep each frame's time for the video
const frames = [];
const cdp = await page.createCDPSession();
cdp.on("Page.screencastFrame", async ({ data, sessionId, metadata }) => {
  const file = path.join(WORK, `${String(frames.length).padStart(5, "0")}.jpg`);
  writeFileSync(file, Buffer.from(data, "base64"));
  frames.push({ file, t: metadata.timestamp });
  try { await cdp.send("Page.screencastFrameAck", { sessionId }); } catch {}
});

await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
await page.evaluate(() => scrollTo(0, 0));
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForSelector(".hero h1 .jl", { timeout: 15000 });
await sleep(200);

// 1. the hero arrives
await caption("The homepage arrives: the lines rise in, the highlight sweeps in");
await sleep(2600);

// 2. jelly letters
await caption("Touch the heading: the letters wobble like jelly");
const letters = await page.evaluate(() => [...document.querySelectorAll(".hero h1 .jl")].map((l) => { const r = l.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }));
await glide(letters[11].x - 40, letters[11].y + 80, 600);
for (const l of letters.slice(11)) await glide(l.x, l.y, 110);
await sleep(500);
await caption("Click a letter: it bounces like a ball");
for (const k of [13, 17]) { await glide(letters[k].x, letters[k].y, 400); await page.mouse.down(); await page.mouse.up(); await sleep(650); }
await sleep(400);

// 3. scroll: cards rise in
await caption("Scroll down: the cards rise in one after another");
await glide(W - 140, H - 160, 500);
const gamesTop = await page.evaluate(() => document.getElementById("games").getBoundingClientRect().top + scrollY - 70);
await scrollTo(gamesTop, 1500);
await sleep(900);

// 4. cards react
await caption("Cards lean towards the mouse and glow where it points");
const card = await page.evaluate(() => { const r = document.querySelectorAll(".game")[2].getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height }; });
await glide(card.l + card.w * 0.3, card.t + card.h * 0.3, 700);
await glide(card.l + card.w * 0.8, card.t + card.h * 0.25, 600);
await glide(card.l + card.w * 0.75, card.t + card.h * 0.75, 600);
await glide(card.l + card.w * 0.2, card.t + card.h * 0.7, 600);
await caption("Press a card: it squeezes");
await page.evaluate(() => document.addEventListener("click", (e) => { if (e.target.closest(".game a")) e.preventDefault(); }, true)); // stay on the page
await glide(card.l + card.w * 0.5, card.t + card.h * 0.4, 300);
await page.mouse.down(); await sleep(350); await page.mouse.up();
await sleep(500);

// 5. save a favourite
await caption("Save a favourite: a little burst of confetti from the heart");
const heart = await centre(".fav-btn", 3);
await glide(heart.x, heart.y, 800);
await page.mouse.down(); await page.mouse.up();
await sleep(1900);

// 6. a celebration (the docs page's demo)
await caption("For a win: confetti, a card that pops in, numbers that count up");
await page.goto(`${BASE}/motion#celebrate`, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => [...document.querySelectorAll("button")].some((x) => x.textContent.includes("Unlock something")), { timeout: 15000 });
await sleep(500);
mouse = { x: W / 2, y: H / 2 };
const unlock = await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => x.textContent.includes("Unlock something")); b.scrollIntoView({ block: "center" }); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
await caption("For a win: confetti, a card that pops in, numbers that count up");
await glide(unlock.x, unlock.y, 800);
await page.mouse.down(); await page.mouse.up();
await sleep(2800);

// 7. the end
await caption("Plain CSS and a little TypeScript. Off when your device asks for less motion.");
await glide(W / 2, H * 0.3, 600);
await sleep(2400);
await cdp.send("Page.stopScreencast");
await browser.close();

// Join the frames, each shown until the next one arrived, into a 30 fps MP4
const list = frames.map((f, i) => `file '${f.file.replace(/\\/g, "/")}'\nduration ${Math.max(0.001, ((frames[i + 1]?.t ?? f.t + 0.5) - f.t)).toFixed(4)}`).join("\n") + `\nfile '${frames.at(-1).file.replace(/\\/g, "/")}'\n`;
writeFileSync(path.join(WORK, "frames.txt"), list);
execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", path.join(WORK, "frames.txt"), "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-movflags", "+faststart", path.join(OUT, "demo.mp4")]);
execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-ss", "2.4", "-i", path.join(OUT, "demo.mp4"), "-frames:v", "1", "-q:v", "3", path.join(OUT, "demo-poster.jpg")]);
console.log(`frames: ${frames.length}, length: ${(frames.at(-1).t - frames[0].t).toFixed(1)}s`);

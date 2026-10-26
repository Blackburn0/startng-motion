# start.ng motion prototype

A whimsical motion layer for [start.ng](https://start.ng), shown on a front-end-only copy of its homepage with sample data. There's no backend: the games' Play buttons open the real games on start.ng.

**Live:** https://startng-motion.vercel.app (the motion lab is at `/motion`)

## What moves

- **The hero:** the lines rise in one after another, the lime highlight sweeps under "Good games.", and a pen sketch of the start.ng logo draws itself in the corner, then floats.
- **Game cards:** on a mouse, a card leans towards the pointer, a lime glow follows it, the picture zooms, and pressing squeezes it. Cards rise into view as you scroll to them.
- **Small rewards:** saving a favourite sends a little burst of confetti from the heart. On `/motion`, "Unlock something" shows the full celebration: confetti in the site's own colours, a card that pops in, and numbers that count up.

**How it's built:**
- Plain CSS animations and about 150 lines of TypeScript (`src/motion/`), with no animation library and no three.js.
- Every colour comes from start.ng's own variables, so light and dark mode both work (switch with the moon button).
- **Reduced motion is respected:** with "reduce motion" on in the device settings, every effect is off and the page reads the same.
- **The page is complete without the motion:** effects only start after the page has loaded.

## Run it

```bash
npm install
npm run dev
```

## About the files

| File | What it is |
| --- | --- |
| `src/motion/` | The motion code from start.ng's `proto/motion` branch (Cybertron-HNG/startng-fe#120) |
| `src/start.css` | start.ng's live stylesheet, so the copy looks like the real site |
| `src/Home.tsx`, `src/Layout.tsx` | The homepage, header and footer, in start.ng's own markup |
| `public/covers/` | Covers of start.ng's multiplayer games |

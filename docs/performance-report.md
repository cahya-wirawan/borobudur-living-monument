# Performance Report — v0.4.0

**Status: lab measurements only. No real phone, tablet or discrete/integrated GPU has been measured yet.** Task `M3-T01` stays blocked on that evidence.

## 1. Method

- Build: production (`pnpm build`, `next start`, gzip), commit of v0.4.0.
- Tool: `node scripts/measure-performance.mjs` (raw output: `docs/performance/lab-2026-11-13.json`).
- Browser: Chromium 158 (Playwright, headless). **WebGL is software rendered (SwiftShader).**
- Machine: Linux 6.8 x64, Intel Core i3-10100 (8 threads).
- Viewport for page loads: 390×844. Throttled runs: 1.6 Mbps down, 750 kbps up, 150 ms RTT, 4× CPU slowdown.
- Transfer sizes are compressed bytes on the wire, read from the DevTools protocol. They are exact and do not depend on the device.

## 2. Byte budgets (enforced in CI by `e2e/performance.spec.ts`)

| Route | Initial JavaScript | Budget | Result | All resources |
| --- | --- | --- | --- | --- |
| `/` | 143.9 KB | 250 KB | within budget | 259.4 KB |
| `/en/experience` | 183.3 KB | 250 KB | within budget | 305.9 KB |
| `/en/read` | 156.7 KB | 250 KB | within budget | 302.3 KB |
| `/en/sources` | 156.7 KB | 250 KB | within budget | 283.9 KB |

| 3D package | Size | Budget | Result |
| --- | --- | --- | --- |
| JavaScript requested after choosing "Begin" or "Explore" | 279.9 KB | 3 MB | within budget |
| Model, texture, audio and video files | 0 | — | none exist; geometry is generated in code |

Fonts account for 69.5 KB of every first load (two self-hosted typefaces). CSS is 7.8 KB.

Change made during this milestone: the content validation library was being shipped to browsers. Keeping it on the server reduced initial JavaScript on `/en/experience` from 195.6 KB to 183.3 KB and on `/en/read` from 178.8 KB to 156.7 KB.

## 3. Loading behaviour (verified by automated tests)

- No WebGL context is created and no 3D code is requested on `/`, Read, Sources, About, or on the experience before the visitor chooses to enter.
- While the 3D code loads, all text and controls work and loading can be cancelled.
- Navigating away and back 20 times in a row still initializes the scene, so WebGL contexts are released on unmount.
- A lost WebGL context falls back to the still diagram and can be retried without reloading.

## 4. Largest Contentful Paint (lab, throttled)

| Route | LCP | Target (p75, field) |
| --- | --- | --- |
| `/` | 1.21 s | ≤ 2.5 s |
| `/en/experience` | 0.60 s | ≤ 2.5 s |
| `/en/read` | 0.65 s | ≤ 2.5 s |
| `/en/sources` | 0.63 s | ≤ 2.5 s |

These are single lab runs against a local server, so they exclude real network distance and hosting. They indicate headroom; they are not field p75 values.

## 5. Frame rate

| Profile | Target | Measured on a real device |
| --- | --- | --- |
| Desktop, quality high | ≥ 45 FPS median over a 60 s scripted camera test | **not measured** |
| Mid-range Android phone, quality low | ≥ 30 FPS median | **not measured** |
| iPhone / Safari smoke test | runs without crash | **not measured** |

Software-rendered observations, recorded only to show the adaptation logic works:

- 1440×900: the scene started at quality `high` and stepped itself down to `low` during the scripted transitions (95th-percentile frame interval about 100 ms).
- 390×844: stayed at `high` (95th-percentile frame interval 17 ms).

No conclusion about real hardware should be drawn from these.

## 6. What the app does to protect slow devices

- Renders on demand: the GPU is idle unless the camera is moving or the visitor is orbiting.
- Starting quality is chosen from standard hints: no WebGL → diagrams only; data-saver, ≤ 4 GB memory, or a small touch screen → `low`; otherwise `medium` or `high` by CPU thread count.
- Quality presets cap device pixel ratio at 1, 1.5 and 2 and reduce curve segments.
- During motion, frame intervals are sampled; a median below 24 FPS over 45 frames steps the preset down once. It never steps back up in a visit and never switches 3D off by itself.
- No shadows, post-processing, textures or model downloads.

## 7. How to complete this report on real devices

1. Deploy or serve the production build on the local network.
2. On each device, open `/en/experience`, choose "Begin the journey", then step through all five chapters and the three realms.
3. Record device, OS, browser, viewport, network, and the build version shown on the About page.
4. Record median FPS from the browser's performance tools during the camera transitions, the final value of `data-quality` on the page's root element, and any crash or context loss.
5. Add the rows to section 5 and update `TASKS.yaml`.

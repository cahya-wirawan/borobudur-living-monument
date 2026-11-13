# Implementation Log

Add one entry per agent session, newest at bottom. Keep notes factual, max ~300 words each.

## 2026-11-13 — Session 1

- **Task IDs:** M0-T01, M0-T02, M0-T03, M0-T04, M1-T01, M1-T02, M1-T03, M1-T04, M1-T05 (all done). Early, partial groundwork for M2-T01/T04/T05 exists (era and realm selectors, Sources and About pages) but those tasks are **not** claimed.
- **Files changed:** new app under `src/`, `e2e/`, `scripts/`, config files, `.github/workflows/ci.yml`; updated `README.md`, `TASKS.yaml`, `docs/10_RISKS_AND_DECISIONS.md`.
- **Implemented and tested:** five-chapter experience with Guided/Explore/Read, typed reducer + allow-listed deep links + history, procedural 3D monument with waypoint camera and skippable intro, still-diagram fallback, source drawer, EN/ID, static Read/Sources/About, content + rights audit.
- **Commands and results:**
  - `pnpm validate:content` → 0 errors, 8 release blockers pending (exit 0)
  - `pnpm audit:release` → exit 1 (expected: all claims are unreviewed drafts)
  - `pnpm lint` → clean; `pnpm typecheck` → clean; `pnpm format:check` → clean
  - `pnpm test` → 59 passed (6 files)
  - `pnpm build` → success
  - `pnpm test:e2e` → 60 passed (desktop 1440×900 + mobile 390×844, headless Chromium)
- **Manual checks:** `node scripts/visual-inspect.mjs` screenshot set (18 views × 2 sizes) reviewed by eye; no console errors, failed/external requests or overflow. Found and fixed: fallback panel covering the still diagram on mobile, oversized mobile header, cropped camera framing, Back/Next accessible-name mismatch, banner outside a landmark, sticky chapter bar covering controls.
- **Truth-status and rights:** every claim is `documented` + `draft` with the UNESCO source; every visual is original, `artistic`, labeled. No third-party media, no model files, no audio.
- **Known issues and blockers:**
  - Not tested on physical phones, real GPUs, Firefox or Safari; no screen-reader pass; no FPS/LCP measurements (M3).
  - CI workflow has never run (directory is not a git repository).
  - Indonesian copy and all historical claims need human review; no correction contact designated.
  - Stupa ring distribution (32/24/16) is unverified (ADR-014).
  - Playwright MCP and Context7 tools were not available in this session; inspection used Playwright scripts and docs were read from `node_modules`.
- **Next task:** `M2-T01` (Time Machine).

## 2026-11-13 — Session 2

- **Task IDs:** M2-T01, M2-T02, M2-T03, M2-T04, M2-T05 (all done).
- **Files changed:** `src/features/{time-machine,architecture,reliefs,ascent}/`, `src/components/ui/ModalDialog.tsx`, scene files (highlighting, hotspots), content pack + schema 1.1.0 + `migrate.ts`, reducer/URL (`feature`), dictionaries, Read/Sources pages, `e2e/m2.spec.ts`, docs.
- **Implemented and tested:** era timeline with separate statement/picture labels; five source-backed architecture features with 3D/diagram toggle and callouts; two demo relief stories with catalog, 3D hotspots and modal detail; three-realm ascent with Up/Down, zone diagram and sourced recap; Sources and About complete in EN/ID; Read mode mirrors all of it.
- **Commands and results:**
  - `pnpm lint`, `pnpm typecheck`, `pnpm format:check` → clean
  - `pnpm test` → 80 passed
  - `pnpm build` → success
  - `pnpm test:e2e` → 88 passed (desktop + mobile)
  - `pnpm validate:content` → 0 errors, 8 release blockers; `pnpm audit:release` → exit 1 (expected)
- **Manual checks:** screenshot set (25 views × 2 sizes) reviewed. Found and fixed: one story hotspot out of frame (camera reframed); Back from Read mode dropped the selected era (ADR-018).
- **Truth-status and rights:** no new historical claims; features reuse existing UNESCO-sourced claims. Relief entries are demonstrations with no location (ADR-017). One new original illustration registered in the media list.
- **Known issues and blockers:** unchanged from session 1 (no real devices, other browsers, screen readers or performance measurements; CI never run; claims and Indonesian copy unreviewed; no correction contact; 32/24/16 stupa split unverified). The optional "exploded" architecture schematic and scroll-driven progress were not built.
- **Next task:** `M3-T01` (Scene performance).

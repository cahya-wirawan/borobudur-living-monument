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

## 2026-11-13 — Session 3

- **Task IDs:** none (process work requested by the owner): semantic versioning, changelog and release workflow.
- **Files changed:** `CHANGELOG.md`, `docs/13_VERSIONING_AND_RELEASES.md`, `scripts/release*.ts`, `scripts/check-version.ts`, `package.json` (0.3.0), CI workflow, About page version line, `CLAUDE.md`/`AGENTS.md` workflow notes.
- **Commands and results:** `pnpm version:check` OK; `pnpm lint`, `pnpm typecheck`, `pnpm format:check` clean; `pnpm test` 87 passed; `pnpm test:e2e` 88 passed.
- **Release:** v0.3.0 (Milestone M2) via `release/v0.3.0` → pull request → `main`, then tag.
- **Next task:** `M3-T01` (Scene performance); it will ship as v0.4.0 with the rest of M3.

## 2026-11-13 — Session 4

- **Task IDs:** M3-T03, M3-T05 done. M3-T01, M3-T02, M3-T04 blocked on human evidence or an owner decision (ADR-023), engineering parts complete. Also: README rewritten as a project description; the original moved to `docs/SPECIFICATION_KIT.md`.
- **Files changed:** `src/lib/performance.ts`, scene canvas (frame watch), content module split (`ids.ts`, `types.ts`, `select.ts`), `next.config.ts` (headers), `e2e/{performance,security,visual}.spec.ts` + baselines, `scripts/{measure-performance,generate-registers,registers-lib}`, reports under `docs/`.
- **Commands and results:** `pnpm lint`, `typecheck`, `format:check`, `version:check`, `registers:generate --check` clean; `pnpm test` 95 passed; `pnpm build` ok; `pnpm test:e2e` 124 passed, 14 skipped by design; `pnpm audit:release` exit 1 (expected).
- **Measurements (headless lab, software WebGL):** initial JS 144–183 KB (budget 250), 3D chunk 280 KB (budget 3 MB), throttled LCP 0.6–1.2 s. No real-device numbers.
- **Found and fixed:** validation library shipped to browsers (found through a CSP violation); e2e timing flakes under 7 parallel software-rendered browsers (workers capped).
- **Manual checks:** screenshot set reviewed after changes; no console errors, external requests or overflow.
- **Known issues and blockers:** see `docs/release-report-v0.4.0.md` section 5.
- **Next task:** unblock `M3-T01`/`M3-T02`/`M3-T04` with the owner; otherwise `M4-T01` needs partner assets and cannot start.

## 2026-11-14 — Session 5

- **Task IDs:** none (owner request: "make it a beautiful, artistic and spectacular website"). Visual redesign, ADR-024.
- **Files changed:** `src/styles/tokens.css`, `src/app/globals.css`, `src/app/fonts.ts`, landing page, shell components, `src/scene/{atmosphere.ts,SkyEnvironment.tsx,MonumentPlaceholder.tsx,ExperienceCanvas.tsx,CameraDirector.tsx}`, `src/lib/capabilities.ts`, captions in `src/i18n/dictionaries.ts`, 20 visual baselines, `docs/02` tokens, `docs/10` ADR-024, rights register (typefaces).
- **Commands and results:** `pnpm lint`, `typecheck`, `format:check` clean; `pnpm test` 97 passed; `pnpm build` ok; `pnpm test:e2e` 124 passed, 14 skipped by design.
- **Found and fixed:** prototype banner failed contrast on light pages; mode switcher parts were below the 44 px touch aim; the opening glide could overrun its 4 s cap when frames arrive slowly (GSAP lag smoothing, now off); the 20-visit GPU test needed a longer limit under software rendering.
- **Manual checks:** 25 views × 2 sizes captured with `scripts/visual-inspect.mjs` and reviewed; no console errors, external requests or overflow.
- **Truth-status and rights:** no new historical claims and no third-party media. Sky, sun, stars and ridge line are repo-authored and captioned as artistic; no architectural feature was added beyond the cited counts.
- **Known issues:** shadows and the larger sky have not been measured on real phones (`M3-T01` still blocked on devices). The overhead architecture view shows little sky and is the plainest of the scenes.
- **Next task:** unchanged — unblock `M3-T01`/`M3-T02`/`M3-T04` with the owner.

## 2026-11-14 — Session 6

- **Task IDs:** none (owner request: "integrate seamlessly 3D flying tour above Borobudur using Google Maps"). ADR-025.
- **Files changed:** new `src/features/flyover/{tour.ts,google-maps.ts,FlyoverStage.tsx,flyover.test.tsx}`, `e2e/flyover.spec.ts`; `controller.ts` (`flyoverOpen`), `SceneStage.tsx`, `ExperienceShell.tsx`, `dictionaries.ts`, `globals.css`, `next.config.ts` (conditional policy, `distDir`), `playwright.config.ts` (second keyed build), `.env.example`, `Dockerfile`, `compose.yaml`, README, rights register (services).
- **Commands and results:** `pnpm lint`, `typecheck`, `format:check`, `registers:generate --check` clean; `pnpm test` 105 passed; `pnpm test:e2e` 134 passed, 14 skipped by design (includes 10 flight tests against a stand-in for Google's script).
- **Manual checks:** consent, loading and failure states captured at 1440×900 and 390×844 against Google's real script with an invalid key: the script loads under the widened policy with no policy violations, the real `Map3DElement` accepts the options used, and the rejected key leads to the failure message.
- **Found and fixed:** on a phone the flight controls covered the Close button; the consent panel did not fit the short mobile stage; a rejected key left the controls over Google's error card.
- **Truth-status and rights:** no historical claim added. Imagery is Google's, streamed, labelled as third-party and not stored. Nothing is requested from Google before consent.
- **Known issues:** never run with a real key, so the rendered map, the camera target, the stop framing, billing and the need for `'unsafe-eval'` are unverified. Google lists 3D maps as unavailable for Indonesia.
- **Next task:** owner supplies a restricted key; then check the flight by eye, adjust `tour.ts`, and tighten the policy.

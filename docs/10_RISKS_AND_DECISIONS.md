# 10 — Risks, Decisions, and Assumptions

## Decision log (ADRs)

### ADR-001 — Static-first architecture
**Choice:** Next.js App Router and static content fixtures; no backend/API/DB in MVP.  
**Reason:** reliability, SEO, easier educational content audit, smaller attack surface.  
**Review:** add CMS only when multiple editors or large catalog demands it.

### ADR-002 — Procedural schematic before precise historical geometry
**Choice:** Build a simplified original terraced/stupa model, explicitly labeled illustrative.  
**Reason:** project has no confirmed licensed measured scan; functional and accessible interaction can be built now.  
**Review:** replace after rights and historical-fidelity audit.

### ADR-003 — One experience state
**Choice:** typed reducer owns semantic state; GSAP, Canvas and URL mirror it.  
**Reason:** avoids bugs when scroll, click, keyboard and deep-link navigation compete.  
**Review:** migrate to Zustand only if reducer grows unwieldy.

### ADR-004 — Read mode is a primary feature
**Choice:** Full HTML/accessible alternative, not a loading fallback only.  
**Reason:** accessibility, mobile performance, search indexing, constrained hardware.

### ADR-005 — English and Indonesian from day one
**Choice:** Dual-localized editorial strings and source contexts.  
**Reason:** international and Indonesian audiences, avoids retrofit.

### ADR-006 — No automated generative storytelling in MVP
**Choice:** Curated, cited descriptions and reviewed illustrations.  
**Reason:** protect historical accuracy and predictable educational content.

### ADR-007 — No autoplay sound and no enforced motion
**Choice:** optional audio, skippable animation, respects OS settings.  
**Reason:** accessibility, user agency and mobile constraints.

### ADR-008 — `/` is a static landing page, not a locale redirect (2026-11-13)
**Conflict:** `docs/03` §4 says `page.tsx` "redirects/resolves preferred locale"; `docs/01` §4 says `/` is a "landing, entry choices, 1-line disclaimer".  
**Choice:** PRD governs scope. `/` is a static bilingual landing with entry choices and the disclaimer; no `Accept-Language` sniffing, no middleware.  
**Reason:** lower risk, works without JS, no surprise redirects for assistive tech.

### ADR-009 — The experience route is server-rendered per request (2026-11-13)
**Choice:** `/{locale}/experience` reads allow-listed query params on the server; Read, Sources, About and landing are fully static.  
**Reason:** a deep link renders the right chapter in the first HTML (no flash, works without JS, chapter rail links work before hydration).  
**Trade-off:** this one route needs a Node/edge runtime, so a pure `output: 'export'` static host is not possible without moving parsing to the client. Revisit in `M3-T04`.

### ADR-010 — No ScrollTrigger or Lenis in M1 (2026-11-13)
**Choice:** chapters advance by explicit Back/Next/rail controls; GSAP core is used only for camera interpolation.  
**Reason:** both are marked optional; tap/keyboard-driven steps are the mobile and reduced-motion default and remove risk R-04 (scroll/state desync). Add scroll-driven progress later only as a presentation layer over the same reducer.

### ADR-011 — Toolchain pins (2026-11-13)
**Choice:** TypeScript 6.0 and ESLint 9 instead of the newest majors (7 / 10).  
**Reason:** `eslint-config-next` 16.4 and its plugins declare peer ranges that exclude them (risk R-10). Re-evaluate when those ranges widen.

### ADR-012 — Prototype builds are not indexed (2026-11-13)
**Choice:** every page sends `robots: noindex` unless `RELEASE_CHANNEL=public`, which also makes the content audit run in release mode and fail on unreviewed claims.  
**Reason:** PRD wants indexable Read pages, but unreviewed draft history should not be published to search engines (AGENTS.md priority 1).

### ADR-013 — Typefaces (2026-11-13)
**Choice:** Instrument Serif and Inter, self-hosted through the `@fontsource` npm packages (SIL OFL 1.1), with system fallbacks.  
**Reason:** no runtime or build-time font network requests. The final font choice remains an open owner decision; swapping is a one-file change (`src/app/fonts.ts`, `src/styles/tokens.css`).

### ADR-014 — Era and realm state are visual treatments only (2026-11-13)
**Choice:** the four eras map to drawing styles of the one illustrative model (`src/features/time-machine/era-mapping.ts`); no vegetation, damage, people or building sequence is depicted. The 72 small stupas are drawn 32/24/16 across the rings as a drawing choice that is **not source-verified** in this repo and is disclosed on the About page.  
**Review:** a heritage reviewer should confirm or correct the ring distribution before any public release.

### ADR-015 — Content schema 1.1.0: `features`, and a `feature` deep-link parameter (2026-11-13)
**Choice:** architectural annotations are content records (`features`, each citing a claim), not component strings. `schemaVersion` is now `1.1.0`; `src/content/migrate.ts` upgrades 1.0.0 packs and is unit-tested against `content/example-content.json`. The URL contract gains `feature=`, valid only with `chapter=architecture`. No existing ID changed.  
**Reason:** "no component should hardcode historical claims" (docs/11 §2) while M2-T02 needs source-backed annotations. Which drawing parts a feature highlights stays in scene config (`FEATURE_ANCHORS`), because that is wiring, not history.

### ADR-016 — 3D hotspots are real DOM buttons (2026-11-13)
**Choice:** relief hotspots are HTML `<button>`s positioned by the 3D scene and portalled into a layer outside the `role="img"` canvas; the canvas only emits an intent (`onHotspotActivate`).  
**Reason:** keyboard focus, 44px targets, screen-reader names and testability without ray-casting. The catalog list remains the canvas-free duplicate.

### ADR-017 — Relief entries are demonstrations with no location (2026-11-13)
**Choice:** both relief records are `demonstration: true`, use abstract original line art, cite no claims and state "does not correspond to any place on the monument". Hotspot positions on the model are layout only. The validator rejects any non-demonstration relief lacking `verifiedLocation`, claims and media.  
**Review:** replace in `M4-T03` with identified, licensed, reviewed panels.

### ADR-018 — The address bar outranks cached server props on return visits (2026-11-13)
**Choice:** when the experience mounts while the browser is already on its route (e.g. Back from Read mode), it reads its selection from the URL instead of the route's cached initial props.  
**Reason:** found by e2e: the cached props silently dropped the selected era. Forward navigations still use server props because the address bar updates only after mount.

### ADR-019 — Content Security Policy (2026-11-13)
**Choice:** a same-origin CSP on every response: no remote scripts, styles, fonts, frames or connections; `object-src 'none'`, `frame-ancestors 'none'`. `script-src` and `style-src` keep `'unsafe-inline'`; `'unsafe-eval'` is allowed in development only.  
**Reason:** statically prerendered Next.js pages bootstrap with inline scripts that cannot carry a per-request nonce, and the 3D overlay sets inline styles. A nonce-based policy would force every page to render per request.  
**Residual risk:** inline script injection is not blocked by the policy. It is mitigated by never rendering raw HTML (`dangerouslySetInnerHTML` is not used) and by rejecting markup in content at build time.  
**Review:** move to nonces or hashes if user-supplied content or third-party scripts are ever introduced.

### ADR-020 — Runtime quality adaptation (2026-11-13)
**Choice:** sample frame intervals while the scene is moving; a median under 24 FPS over 45 frames lowers the preset one step. Never raise it again during a visit and never switch 3D off automatically.  
**Reason:** one-way steps cannot oscillate; turning 3D off is left to real failures or the visitor. Thresholds are engineering guesses until real-device measurements exist.

### ADR-021 — Visual regression covers canvas-free rendering only (2026-11-13)
**Choice:** screenshot baselines are taken with WebGL blocked (HTML and SVG). The 3D canvas is covered by functional tests, not pixels.  
**Reason:** GPU and driver differences make canvas pixels unstable across machines; the canvas-free view is deterministic and is also what low-end visitors see.

### ADR-022 — Validation library stays out of the browser (2026-11-13)
**Choice:** browser code imports identifiers and types from `src/content/types.ts` and lookups from `src/content/select.ts`; Zod schemas and the audit run only on the server and in scripts.  
**Reason:** found via a CSP violation report: the library probes `eval` and added about 12–22 KB to first load for no visitor benefit.

### ADR-023 — M3 tasks that need people or an owner decision are marked blocked, not done (2026-11-13)
**Choice:** `M3-T01` (real-device measurements), `M3-T02` (manual screen-reader pass) and `M3-T04` (hosted preview) are `blocked` with their engineering evidence listed. Dependent engineering work (`M3-T03`, `M3-T05`) proceeded because it does not rely on the missing evidence. v0.4.0 is labelled "M3 engineering hardening".  
**Reason:** a coding agent cannot hold a phone, listen to a screen reader or choose a public host; claiming those would be false completeness.

## Risk register

| ID | Risk | Likelihood/Impact | Mitigation | Trigger / owner |
| --- | --- | --- | --- | --- |
| R-01 | No licensed accurate 3D or relief imagery | High / High for exhibition | Procedural demo now; asset audit and partner outreach later | M4 editor |
| R-02 | Visualized historical scenes presented as fact | High / High | Truth-status labels, source ledger, manual editorial release gate | All, content lead |
| R-03 | WebGL mobile crashes or overheats | Medium / High | Progressive load, DPR/LOD, quality presets, fallback | M1/M3 engineer |
| R-04 | Scroll/camera state desynchronization | Medium / Medium | Single reducer, stable waypoints and e2e history tests | M1 engineer |
| R-05 | Inaccessible interactive canvas | Medium / High | Parallel semantic controls and Read mode | M1/M3 accessibility |
| R-06 | Misinformation in relief narrative | Medium / High | Panel-specific curator approval, not invented IDs | M4 editor |
| R-07 | Unreviewed translations | Medium / Medium | UI parity tests; Indonesian reviewer for public | M5 editor |
| R-08 | Asset permissions ambiguous | High / High | Default-deny external asset rights; original placeholders | M0/content lead |
| R-09 | Scope creep (full virtual tour/VR/CMS) | High / Medium | MVP gate, tasks and deferred backlog | product owner |
| R-10 | Third-party tech package compatibility | Medium / Medium | Stable compatible version pins, install smoke tests | M0 engineer |
| R-11 | Fake polished demonstration hides deficits | Medium / High | Required functional acceptance evidence | QA |

## Open decisions for human owner
1. Target audience priority: museum exhibition vs school education vs independent artistic website.
2. Available asset sources, permitted use rights, and any curatorial partnership.
3. Preferred font license, final domain, hosting budget and public launch date.
4. Whether optional voice narration is commissioned, and by whom.

These decisions should **not** block initial functional prototype.

### ADR-024 — Visual identity: dawn over the monument (2026-11-14)
**Choice:** replace the grey-green palette, Instrument Serif and Inter with a night-to-dawn palette, Marcellus and Source Sans 3 (both SIL OFL 1.1, self-hosted; supersedes the typeface choice in ADR-013). The 3D scene gains a procedural sky, sun, stars, a generic ridge line, shadows and three lights (`night`, `dawn`, `day`) chosen from the experience state; the still diagram and landing page use the same tones in CSS. The low quality preset now renders at up to 1.5× pixel density with antialiasing, without shadows.  
**Reason:** the owner judged the first design unattractive and asked for a spectacular one; `docs/02` already called for an atmospheric landscape. Everything added is repo-authored code, so no rights question arises. The setting is art direction only: captions say so, the ridge line traces no named landform, and no architectural feature was added beyond the cited counts (a thin top course on each terrace is a drawing device, noted in code). The low preset was visibly jagged on phones; the frame watch still cannot go below it, so real-device measurement (`M3-T01`) matters more than before.

### ADR-025 — Optional aerial flight drawn by Google Maps (2026-11-14)
**Choice:** add an opt-in "Fly over the real site" view that replaces the stage with a Google Maps 3D map (`Map3DElement`, Maps JavaScript API) and moves its camera through five stops (`src/features/flyover`). It exists only when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set at build time; without the key the button, the Google hosts in the content security policy and every Google request are absent, and the site is unchanged.  
**Conflict recorded:** `AGENTS.md` says the MVP has no external runtime dependency, API key or map account, and lists "adding paid services" under stop-and-ask. The owner asked for this integration by name, so the service itself is the owner's decision. The lower-risk form was chosen: off by default, never primary content, never loaded without the visitor's consent.  
**Safeguards:**
- **Consent:** nothing is requested from Google until the visitor presses "Start the flight" on a panel that says their IP address goes to Google and links Google's privacy policy. Consent lasts for the browser session (`sessionStorage`). The flight is never opened from a link.
- **Labelling:** the stage label switches from "Illustrative geometry" to "Aerial imagery from Google Maps — not made or checked by this project". The camera path is captioned as a project choice, not a historical route. Stop captions give directions only and make no historical statement.
- **Rights:** imagery is streamed by Google under the Google Maps Platform terms and is not stored in the repository. Google's logo and data credits must stay visible, so the project's controls sit at the top of the stage and a test keeps them out of the lower edge.
- **Accessibility:** buttons for previous, next, play and pause; captions in a live region; under reduced motion the camera never moves by itself and steps are instant; closing returns focus to the opening control. The flight carries no information the chapters lack, so Read mode needs no equivalent.
- **Security:** the key is a browser key, public by design, and must be restricted by HTTP referrer and to the Maps JavaScript API. With a key, the policy adds Google's published allow-list, including `'unsafe-eval'` in `script-src`. That is weaker than the default policy and should be tightened once the real map has been tested.
- **Failure:** a blocked script, a timeout or a rejected key shows a message with "Try again" and "Close". Google signals a rejected key only inside the map, so a map whose camera never moves within 20 seconds is treated as failed (checked against the live API with an invalid key).

**Not verified:** no real key was available, so the rendered map has never been seen. Google's coverage table (read 2026-11-14) lists "Maps 3D" as not available for Indonesia; its overview says such areas show satellite imagery on terrain without a 3D mesh. The look-at point (-7.6079, 110.2038, 270 m) is an estimate near the coordinates UNESCO lists and must be adjusted by eye with a real key. Billing was not confirmed: Google's pricing page lists an "Immersive Maps" SKU but does not say which SKU 3D map loads use.  
**New risk R-12:** third-party service dependency — cost, terms, imagery date and availability are outside the project's control. Mitigation: optional, consent-gated, removable by unsetting one variable. Owner: product owner.

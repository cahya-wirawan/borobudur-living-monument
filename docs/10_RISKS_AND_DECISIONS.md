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

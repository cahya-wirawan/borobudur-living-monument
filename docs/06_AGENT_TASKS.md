# 06 — Agent Task Backlog with Definition of Done

Use task IDs in `TASKS.yaml` as machine-readable mirror. Here are implementation-level acceptance requirements and minimal verification evidence.

## M0 — Foundation

### M0-T01 — Scaffold and quality scripts
**Implement:** Next.js App Router, TypeScript strict, Tailwind, pnpm; scripts for `dev/build/lint/typecheck/test/test:e2e/format`; conventional folders; package lock.  
**Check:** `pnpm build`, `pnpm typecheck`, `pnpm lint` succeed. No secret env required. Include clear start instructions.

### M0-T02 — Design system, routes and i18n
**Implement:** tokens, typography, navigation shell, `/en` and `/id` routes, language switching and `aria` labels.  
**Check:** desktop 1440×900 and mobile 390×844 without overflow; locale switch persists chapter where relevant; read tab available.

### M0-T03 — Verified-content types
**Implement:** claim/source/media data types, localized data loading, schema validation, demo disclaimers.  
**Check:** intentional missing `sourceIds` for a documented claim fails validator; unknown external asset license fails release validation; draft demo survives development build only with banner.

### M0-T04 — Automated test foundation
**Implement:** Vitest and Playwright, baseline accessibility check, GitHub Actions or equivalent CI.  
**Check:** example unit + e2e test pass locally; no-WebGL fallback test runs.

## M1 — Vertical Slice

### M1-T01 — Experience state machine and deep links
**Implement:** typed reducer, strict allowlist URL parser/serializer, 5 chapters, modes, previous/next, history restoration.  
**Check:** unit tests for invalid state; e2e deep linking to chapter, reload, next/back, locale switch.

### M1-T02 — Schematic 3D monument
**Implement:** self-authored, low-poly, responsive model and credible spatial staging, lights and material; persistent `Illustrative geometry` attribution.  
**Check:** interactive desktop/phone on supported devices; model fails gracefully; no code path claims surveyed accuracy.

### M1-T03 — Camera director and hero
**Implement:** defined waypoint registry, GSAP transitions and optional ScrollTrigger/Lenis, intro skip, no auto-audio.  
**Check:** skip during animation lands in correct state; reduced-motion immediately stable; no double RAF ticker / listener leaks.

### M1-T04 — Five-chapter Read mode
**Implement:** text + semantic diagram of current educational material, references, local headings and navigation.  
**Check:** keyboard and no-WebGL visitor can complete all chapters; screen-reader landmark semantics.

### M1-T05 — Responsive and resilience pass
**Implement:** mobile-sized scene with non-overlapping labels, loading/failure states, focus visibility, touch action, source drawer.  
**Check:** test WebGL blocked, small viewport, slow network, navigation on back/forward.

## M2 — Interaction pillars

### M2-T01 — Time Machine
**Implement:** four discrete eras, timeline UI, documentary vs inference labels, layer fades, linked descriptions/citations, state URL.  
**Check:** pointer, keys, screen reader can select each era; intermediate blend not presented as factual period; screenshots for first and last state.

### M2-T02 — Architecture overlays
**Implement:** 3+ annotated feature selections, numbered accessible list, SVG schematic and scene anchor mapping.  
**Check:** all overlays accessible without canvas; citations for facts; hover not required.

### M2-T03 — Living Reliefs
**Implement:** demo relief selector, stylized original art, detail overlay, explanation, source, back/close and focus restore.  
**Check:** no fake ancient panel attribution; close on Escape; modal focus contained; deep link opens same content.

### M2-T04 — Journey to Enlightenment
**Implement:** 3 realm selections, upward waypoint transitions, HTML interpretation cards, sourced recap.  
**Check:** all realm states and labels correct; direct selection + buttons in reduced-motion; no source-free doctrine claims.

### M2-T05 — Sources and About
**Implement:** public source catalog, interpretation-method page, creators/licenses, EN/ID parity.  
**Check:** links present; missing asset license blocks release validator; links have descriptive text.

## M3 — Production hardening

### M3-T01 — Scene performance
**Implement:** lazy loading, dynamic DPR, material/geometry disposal, no 3D on initial Read path; document benchmark hardware.  
**Check:** record fps, LCP, scene bytes; compare with budgets; fix regressions or list measured exceptions.

### M3-T02 — A11y and language validation
**Implement:** keyboard checks, axe, visible focus, contrast, reduced motion, i18n completeness, manual VoiceOver/NVDA notes.  
**Check:** no blocker WCAG 2.2 AA issues; locale audits complete; semantic alternative for diagram.

### M3-T03 — E2E / visual regression suite
**Implement:** Playwright scenarios for primary paths, fallback, language and viewport; screenshot golden cases.  
**Check:** tests stable and can run in CI without networked media. Document update process.

### M3-T04 — Deploy and security
**Implement:** caching, CSP evaluation, security headers, static preview deployment, docs for deploy environment.  
**Check:** no secrets exposed, default analytics disabled, preview reproducible, headers and fallback validated.

### M3-T05 — Final MVP audit
**Implement:** evidence ledger, remaining assets/rights register, unresolved expert reviews and next-release roadmap.  
**Check:** all P0 engineering requirements ticked; honest "prototype" label if pending heritage review.

## M4/M5 (future)
- `M4-T01` source and license audit of authentic 3D assets.
- `M4-T02` optimize and integrate measured mesh/LOD with fidelity review.
- `M4-T03` build 3–5 researched relief stories, EN/ID reviewed.
- `M5-T01` optional audio, cultural editorial review, publication checklist and rollout.

## Recommended first vertical slice
After M0, implement a single chapter end-to-end: rendered illustration -> state change -> source link -> keyboard control -> Read fallback -> Playwright test. Only then expand cinematic effects and multiple interactions.

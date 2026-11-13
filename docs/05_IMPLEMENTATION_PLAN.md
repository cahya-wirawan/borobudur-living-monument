# 05 — Implementation Roadmap, Dependencies, Deliverables

## 1. Sequencing rule
Create a runnable vertical slice **before** adding expensive cinematic polish or external media. Ship and test each gate before starting tasks that depend on it. Phase durations below are planning ranges for human project management, **not a promise or coding-agent execution estimate**.

| Milestone | Objective | Typical human planning range | Gate |
| --- | --- | --- | --- |
| **M0 — Foundation** | Scaffold, design tokens, localization, content validation, CI and test harness | 1–2 weeks | App boots; `pnpm build` & test suite green |
| **M1 — Vertical Slice** | Cinematic hero, 3D illustrative silhouette, chapter nav, source and read mode, basic era / realm | 2–3 weeks | End-to-end visitor journey usable on desktop/mobile/no-WebGL |
| **M2 — Three Pillars** | Four era states, relief detail, 3 realm ascent, diagrams, state + URL sync | 2–4 weeks | All PR P0 interactions work, claims/rights labels visible |
| **M3 — Production Hardening** | Accessibility, device profiling, test coverage, error recovery, deployment, content audit | 1–3 weeks | MVP release checklist signed off (demo/test-only if editorial review pending) |
| **M4 — Historical Asset Production** | Obtain rights, vetted 3D scan, 3–5 authentic reliefs, model optimization | Independent, asset-driven | Media and heritage reviews passed |
| **M5 — Exhibition Release** | Curatorial review, optional voice, localization polish, public launch | Depends on partners | Content and access gates passed |

Parallel work is allowed after stable contracts; never bypass M0 source/rights architecture.

## 2. Milestone M0 — Foundation
**Inputs:** Documentation kit; no special credentials.  
**Deliverables:** Next.js app; responsive shell with 3 entry modes; tokenized theme; locale routes; typed static claim/media data with Zod + schema validation; test runners; README updated with actual commands.

**Tasks:**
1. `M0-T01` Scaffold framework and scripts, Pin versions and lockfile.
2. `M0-T02` Build shell, design tokens, locale paths, UI primitives.
3. `M0-T03` Create content loader, types, schema, seed citations; release-blocking audit script.
4. `M0-T04` Add unit/e2e/a11y baseline CI and basic no-WebGL test.

**Gate:** One responsive page renders in EN/ID; build, lint, typecheck, tests pass; all placeholders labeled.

## 3. Milestone M1 — Full journey skeleton
**Inputs:** M0 green.  
**Deliverables:** visitor can start, advance through all five chapters, switch mode, see source drawer; 3D geometric placeholder and Read parallel.

**Tasks:**
1. `M1-T01` Create chapter reducer/URL sync and robust navigation.
2. `M1-T02` Build original procedural monument model, static fallback and quality gating.
3. `M1-T03` Implement waypoint camera director, safe GSAP transitions, intro.
4. `M1-T04` Finish five-chapter Read flow and no-WebGL graceful fallback.
5. `M1-T05` Make responsive / keyboard / reduced-motion behavior testable.

**Gate:** 5 chapters playable by mouse, touch and keyboard; switching Read mode works without WebGL; browser history consistent.

## 4. Milestone M2 — Meaningful interaction
**Inputs:** M1 stable state contracts and 3D scene.  
**Deliverables:** era timeline; 3 architectural annotated areas; interactive relief detail; ascent and recap.

**Tasks:**
1. `M2-T01` Implement explicit 4-state era control and evidence labels.
2. `M2-T02` Build architecture diagram with feature annotations.
3. `M2-T03` Wire demo relief hotspot/catalog/details, accessible modal, source references.
4. `M2-T04` Build three-realm ascent, chapter camera animation, direct realm selection.
5. `M2-T05` Localize all paths and add Source and About pages.

**Gate:** Each pillar has one meaningful complete interaction and documented education; deep links into period/relief/realm work.

## 5. Milestone M3 — Hardening
**Inputs:** all P0 functionality.  
**Deliverables:** performance logs, screenshot set, accessibility evidence, media register report, deployment docs and CI config.

**Tasks:**
1. `M3-T01` Mobile performance audit, LOD adaptation, first-view budgets and failover.
2. `M3-T02` Keyboard and screen reader audits, reduced motion, contrast, translations.
3. `M3-T03` Automated e2e matrix and screenshot tests; fix regressions.
4. `M3-T04` Secure static deployment, content audit, license gate, monitoring.
5. `M3-T05` Document unresolved editorial issues and mark demo release appropriately.

**Gate:** All technical tests pass and no blocker accessibility defect; **not** authorized as a historically reviewed public museum exhibit until M4/M5 editorial approvals.

## 6. Milestone M4 — Assets and expertise
**Potential partner inputs:** permitted photogrammetry and relief scans, source books/catalog, authoritative panel identification, historical adviser, Indonesian editor.  
**Pipeline:** ingest -> verify licenses -> inspect coordinate system and panel mapping -> optimize glTF + textures -> quality LODs -> integrate -> compare with original -> curator review. Avoid adding historical realism that conceals source uncertainty.

## 7. Milestone M5 — Public educational release
**Deliverables:** 3–5 authentic sourced relief stories, reviewed translations and claims, any commissioned narration with captions, complete credits/rights, performance evidence, deployed app and correction process.

## 8. Critical path
`content schema -> experience reducer -> static shell + Read -> 3D placeholder/scene controller -> era/relief/ascent interactions -> e2e/a11y -> deployment`. Authentic 3D asset and historical review are **parallel dependencies for public-release status**, not for functional prototype.

## 9. Increment strategy for agents
Each change set should be one task or a small dependency group, preserve build green, contain tests, update status, and provide a concise implementation log. If a large feature cannot complete, land a functional slice without pretending remaining features are implemented. Never mark a task complete based on mockup/screenshot only.

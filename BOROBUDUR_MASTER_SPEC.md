# BOROBUDUR — The Living Monument | Consolidated Agent Specification

> This file combines the key repository documents for agents with limited attachment support. The individual source documents and machine-readable YAML/JSON remain authoritative.


---

# FILE: `AGENTS.md`

# AGENTS.md — Universal Coding-Agent Contract

Applies to Claude Code, Codex, and all repository contributors. Read README and documentation before coding. This is a greenfield specification package; scaffold the application yourself.

## Mission
Deliver a beautiful, runnable, historically responsible interactive heritage web experience. Optimize for a convincing complete **vertical slice** before peripheral polish. The three product pillars are **Time Machine, Living Reliefs, Journey to Enlightenment**.

## Priority and authority
1. Legal, safety, privacy, truthful attribution, accessibility, and content provenance always win.
2. `docs/01_PRD.md` governs product scope; `docs/05_IMPLEMENTATION_PLAN.md` governs order; `docs/03_ARCHITECTURE.md` governs design; `docs/07_TEST_AND_ACCEPTANCE.md` governs verification.
3. When docs conflict, write the conflict in a short decision record and choose the lower-risk, accessible, rights-compliant option.
4. Do **not** infer absent assets, API keys, accounts, historical facts, measured geometry, dates, or permissions.

## Non-negotiables
- **Historical integrity:** UNESCO-backed baseline facts are allowed. For any other substantive factual claim, create source records and review status. Every image, 3D reconstruction, and narration must be marked as `documented`, `inferred`, or `artistic` with human-readable legend. Never label procedural placeholders or animation of ancient daily life as documentary fact.
- **Media rights:** Do not scrape, download, or bundle external copyrighted media just because it is publicly viewable. A URL is not a reuse license. Use procedural geometry, self-created textures, gradients, inline SVG sketches, or repo-authored placeholder assets until usage rights are verified. Record creator, URL, license, obligations, and review before publishing.
- **Respect cultural context:** Include scholarly sourcing and Indonesian cultural context; avoid exoticizing imagery, fabricated quotes or invented rituals. Render Buddhist terminology respectfully, avoid framing the realms as a simplistic moral game.
- **Accessible first:** Every key chapter and fact usable without WebGL, sound, motion, pointer, or scroll animation. Honor `prefers-reduced-motion`, keyboard focus, captions/transcripts, visible skip links, semantic controls, WCAG 2.2 AA objective.
- **Mobile first:** Respect memory, thermal, and GPU constraints; degrade gracefully. Do not auto-start giant model downloads or autoplay audio.
- **No false completeness:** If content/scan/permission is missing, ship a clearly labeled demo state and list it as a blocker for publication; never silently replace with generated pseudo-history.
- **No external dependencies at runtime for MVP:** Render functional primary content from local fixtures; no API keys, paid SDKs, map accounts, or network fetches for learning content.
- **Security:** Avoid remote code execution, `dangerouslySetInnerHTML`, arbitrary user-supplied URLs, secrets in client bundles, and open redirects. Treat content metadata as untrusted input and validate on build.
- **Testing:** Build and tests must pass; no disabling lint, accessibility rules, or type errors to make progress. No failing test ignored without an explicit documented blocker.
- **Scope:** Do not build unnecessary admin panel, backend, auth, payments, multiplayer, generative AI, or WebXR in the MVP.

## Engineering rules
- TypeScript `strict: true`; modular feature folders; no god components. Prefer named domain types and pure state mapping functions.
- Use Next.js Server Components for static article content; WebGL Canvas and animation run in isolated Client Components using dynamic loading.
- A *single deterministic experience state* drives selected chapter, era, hotspot, realm, camera target, and UI. GSAP animates state transitions; it must not become a second hidden source of truth.
- React state should not update every rendered frame. Update camera/mesh via refs and Three's render lifecycle; synchronize at discrete chapter boundaries.
- Cleanup GSAP contexts, ScrollTrigger instances, listeners, R3F scene resources, timers, and observers on unmount.
- Respect desktop/motion/touch modality. On mobile, prioritize tap-driven chapter navigation; on reduced motion, use instant mode transitions.
- Localized strings in `en` and `id`; neither locale can be absent for MVP UI. Avoid string concatenation for grammar.
- Use design tokens; centralize scene waypoints and times in config, not magic numbers scattered across components.
- Cite sources as explicit clickable links in source drawer. Source records need editorial status and licenses for associated media.
- Test navigation when WebGL fails to initialize; no blocking preloader that can trap the visitor.
- Follow consistent scripts: `dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`, `format`.

## Workflow in every agent session
1. Read relevant docs and current repository state. Identify the next dependency-unblocked task from `TASKS.yaml`.
2. State a short task plan; implement a small, reviewable unit. Respect existing work; inspect before editing.
3. Run typecheck, lint, focused tests, and build when relevant; capture commands/outcomes. For UI work, run a browser test and check mobile + reduced-motion flows.
4. Update `TASKS.yaml` status, `docs/10_RISKS_AND_DECISIONS.md` for real decisions, and a concise session report in `IMPLEMENTATION_LOG.md` (create if missing).
5. Report: files changed, visible behavior, validation results, risks, what remains, and next task ID.

## Mandatory definition of done (per feature)
- Usable with mouse, keyboard, touch and without WebGL.
- Visible loading, failure, and empty states; content accessible to assistive tech.
- No uncited historical claims; reconstruction labels and media rights intact.
- Semantic controls, reduced-motion behavior, English/Indonesian parity, responsive layout.
- Unit/e2e tests added or updated; relevant scripts green; no secret or unlicensed asset.
- Documented assumptions, performance impact, and next dependencies.

## Stop and ask before these actions
- Acquiring or using third-party media with uncertain rights; claiming a reconstruction is authentic; adding paid services; adding analytics with personal data; purchasing access; deploying to a public domain; destructive git operations or replacing a user-provided asset; changing a major technology after M0.

## Default first task
Implement `M0-T01`, then `M0-T02`, then `M1-T01` in `TASKS.yaml`. Use a lightweight self-created architectural silhouette until a validated accurate asset exists. The demo label should read: **"Illustrative geometry — not a surveyed reconstruction"**.


---

# FILE: `CLAUDE.md`

# CLAUDE.md — Claude Code Entry Point

Start by reading `AGENTS.md`; treat it as the shared governing instruction. Then read, in order:

1. `docs/01_PRD.md`
2. `docs/02_EXPERIENCE_AND_DESIGN.md`
3. `docs/03_ARCHITECTURE.md`
4. `docs/05_IMPLEMENTATION_PLAN.md`
5. `TASKS.yaml`

Implement tasks in dependency order, keep the app runnable at every stage, and respect historical-source and licensing gates. If unblocked, begin with `M0-T01` without asking broad product questions.

Do not pretend that photorealistic or historically precise Borobudur source assets have been supplied. Begin with clean labeled procedural placeholders, then replace only with rights-verified assets.

At the end of each work session: list completed task IDs, executed verification commands and their outcomes, outstanding blockers, and a single next task.


---

# FILE: `README.md`

# BOROBUDUR — The Living Monument

**Agent-ready product and implementation specification**  
Version: 1.0 | Prepared: 2026-11-12 | Status: planning baseline, not implemented

> A cinematic, historically responsible, accessible educational experience combining **The Time Machine**, **Living Reliefs**, and **The Journey to Enlightenment**. The visitor transitions between aerial exploration, architectural storytelling, relief interpretation, and a symbolic ascent through Borobudur.

## 1. How to hand this project to an AI coding agent

1. Unzip this package into an empty project directory, keeping all files.
2. Launch Claude Code or Codex **from the project root**; they should read `AGENTS.md` (and `CLAUDE.md` for Claude).
3. Give the agent this exact instruction:

   > Implement BOROBUDUR — The Living Monument from the repository documentation. First read `AGENTS.md`, `docs/01_PRD.md`, `docs/03_ARCHITECTURE.md`, and `docs/05_IMPLEMENTATION_PLAN.md`. Start at milestone M0, then implement the first runnable vertical slice M1. Use honest procedural placeholders until licensed assets exist; never imply a placeholder is a measured reconstruction. Follow the task IDs, run checks, report what works and what is blocked, and do not skip accessibility or source attribution. Do not ask for clarification unless an external license, credential, or irreversible decision genuinely blocks progress.

4. For an **individual scoped task**, use `docs/06_AGENT_TASKS.md` and `docs/08_AGENT_PLAYBOOK.md`.
5. Work should remain deployable at each milestone; M1 must work without secrets, paid services, historical 3D scans, or proprietary content.

**The package is a specification and execution kit, not an already built application.** No licensed images or 3D monument models are bundled.

## 2. The experience in 30 seconds

Visitor arrives to an atmospheric introduction. A guided camera reveals Borobudur's stepped geometry. A chronology control visualizes documented states and **clearly labeled hypothetical construction scenes**. Clickable reliefs open interactive, source-backed stories. In the final chapter, the camera ascends through *Kamadhatu*, *Rupadhatu*, and *Arupadhatu*, with symbolic interpretations, a spatial floor selector, and a final summit reveal. A fully usable text-first alternative exists alongside the 3D experience.

## 3. Document map

| File | Why it exists |
| --- | --- |
| `AGENTS.md` | Non-negotiable coding-agent instructions and definition of done |
| `CLAUDE.md` | Claude Code entrypoint; defers to shared agent rules |
| `docs/00_VISION_AND_SCOPE.md` | Vision, outcomes, constraints, prioritized phases |
| `docs/01_PRD.md` | Audience, requirements, user stories, acceptance criteria |
| `docs/02_EXPERIENCE_AND_DESIGN.md` | Art direction, interactions, chapter storyboard, responsive UI |
| `docs/03_ARCHITECTURE.md` | System/component boundaries, 3D engine, data flow, types |
| `docs/04_CONTENT_PROVENANCE.md` | Historical accuracy, citations, media rights, editorial workflow |
| `docs/05_IMPLEMENTATION_PLAN.md` | Milestones, dependencies, deliverables, stop/go gates |
| `docs/06_AGENT_TASKS.md` | Executable task breakdown with completion evidence |
| `docs/07_TEST_AND_ACCEPTANCE.md` | Functional, visual, content, accessibility, performance QA |
| `docs/08_AGENT_PLAYBOOK.md` | Instructions and reusable prompts for Claude Code/Codex |
| `docs/09_DEPLOYMENT_OPERATIONS.md` | CI, deployment, monitoring, security, asset delivery |
| `docs/10_RISKS_AND_DECISIONS.md` | Architecture decision records, trade-offs, risks |
| `docs/11_CONTENT_MODEL_AND_API.md` | Entities, TypeScript contracts, routing and state persistence |
| `docs/12_ACCEPTANCE_DEMO_SCRIPT.md` | Stakeholder demo walkthrough and signoff criteria |
| `content/content.schema.json` | Machine-readable MVP dataset JSON Schema |
| `content/example-content.json` | Minimal clearly marked editorial/demo fixture |
| `TASKS.yaml` | Structured milestone/task queue for harnesses |
| `examples/ONE_SHOT_START_PROMPT.md` | Ready-to-paste first agent instruction |
| `examples/IMPLEMENTATION_LOG.template.md` | Consistent handoff between agent sessions |

## 4. Suggested build

- Node.js active LTS; pnpm with `corepack` (agent checks installed compatible versions).
- Next.js App Router + React + TypeScript (strict); Tailwind CSS.
- Three.js + `@react-three/fiber` + `@react-three/drei` with compatible package versions.
- GSAP + ScrollTrigger; Lenis when motion is permitted; no mandatory paid plugins.
- Zod for runtime content validation; Playwright, Vitest, React Testing Library, axe-core for QA.
- Static content JSON/MDX initially; no database, API server, authentication, or LLM in v1.
- glTF/GLB assets with optional Draco/meshopt geometry and KTX2 textures after rights verification.

## 5. MVP finish line

MVP = fully functional five-chapter narrative, working camera and mode transitions, era control, one or two demo relief hotspots/stories, three-realm ascent, sources and reconstruction labels, mobile and keyboard alternatives, tests, and deployment. Realistic monument scans and animated human scenes are **post-MVP**.

## 6. First commands after implementation is generated

```bash
corepack enable
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

The agent must add scripts matching these commands to `package.json`. Dependencies and install commands may change to suit current supported versions, but commands documented in this README must be kept working.

## 7. Authoritative starting references

- UNESCO World Heritage, Borobudur Temple Compounds: https://whc.unesco.org/en/list/592/
- UNESCO conservation decision (2025): https://whc.unesco.org/en/decisions/8798
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- React Three Fiber: https://r3f.docs.pmnd.rs/
- Khronos glTF specification: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.pdf

**Important:** References provide research context, not blanket permission to copy photographs, video, text, or 3D scans. Review individual license and attribution terms.


---

# FILE: `docs/00_VISION_AND_SCOPE.md`

# 00 — Vision, Scope, Principles

## Product thesis
Build a web experience that teaches historical facts **through spatial interaction**, not as disconnected captions pasted onto a 3D scene. Pair cinematic spectacle with verifiable sources, interpretive transparency, and multiple accessible pathways.

### Tagline
**A monument, a thousand years, countless stories.**

### Visitor promise
"I can discover Borobudur's architecture, travel through documented periods, inspect a relief story and understand the three symbolic realms—even if I use a phone or cannot run the 3D viewer."

## Goals
1. Create an emotional sense of place in the first 15–30 seconds *without mandatory long blocking animation*.
2. Teach at least three defensible learning outcomes about design, chronology, and symbolic realms.
3. Let visitors control the narrative: scroll to watch, click to inspect, scrub time, or use direct chapter navigation.
4. Make evidence and artistic interpretation transparent at the point of viewing.
5. Build a reusable monument engine with a Borobudur-specific content pack.

## Learning outcomes
By completing the experience, a visitor should be able to: (a) identify five square terraces, three circular platforms, and a central stupa in the architectural schema; (b) locate Kamadhatu, Rupadhatu and Arupadhatu in the interpretive vertical division; (c) distinguish present-day documentation, conservation states, and hypothetical earlier visualizations; and (d) explain how a sampled relief can be read alongside curator notes and sources.

## Scope tiers

| Tier | Features | Exclusions |
| --- | --- | --- |
| **MVP (M0–M3)** | Cinematic landing; 5 chapters; procedural 3D silhouette; three-mode experience; playable time travel; 1–2 relief demos; three-realm ascent; sources; EN/ID; accessibility & QA | Precise surveyed model, detailed vegetation reconstruction, full relief catalog, account system |
| **Public exhibition (M4–M5)** | Rights-verified detailed 3D asset, 3–5 curated authentic relief panels with expert review, localized narration with transcripts, richer era scenes and optimized LODs | Unverified ancient human reconstructions |
| **Future extensions** | Additional temples, teacher plans, curated quizzes, VR, map-linked trails, conservation comparisons | Not prerequisites for MVP |

## Measures of success (targets, not promises)
- Learning: 70% of recruited test participants can correctly place 3 symbolic realms after exploration (baseline to be measured).
- Completion: >= 35% of visitors who start chapter 1 reach chapter 5 in a pilot; report by performance tier.
- Trust: 100% of published historical claim records have at least one citation and `reviewed` status.
- Inclusion: critical educational content reachable in text-first mode, keyboard-only, and reduced motion; target WCAG 2.2 AA.
- Technical: no WebGL fatal blank screen, no autoplay audio, no modal traps, stable navigation on constrained mobile.

## Non-goals
- Replace archaeological scholarship or provide museum-certified reconstructions without partner review.
- Claim to depict actual 8th-century workers, construction methods, clothing or colors without expert evidence.
- Present full 2,672 relief panels or precisely reconstruct all relief sequences in initial scope.
- Create a server-side AI narrator, chat companion, or user-generated annotation platform in v1.

## Constraints/assumptions
- No 3D scans, licensed relief images, translation funding or curatorial partnership supplied today.
- Initial product must work with assets created by the implementation team. Anything historically specific needs sourced review.
- EN and ID are first-class locales; human review needed before public historical release.
- Public URLs, exhibition use, and partner branding require a separate rights and editorial clearance stage.


---

# FILE: `docs/01_PRD.md`

# 01 — Product Requirements Document (PRD)

**Product:** BOROBUDUR — The Living Monument  
**Owner:** Project team  
**Status:** Approved planning baseline for coding agents; content/publication reviews pending  
**MVP target:** M0–M3 in `docs/05_IMPLEMENTATION_PLAN.md`

## 1. Product summary
A responsive, immersive educational experience about Borobudur Temple, combining: **Time Machine** (era transformations), **Living Reliefs** (storytelling based on identifiable panels), and **Journey to Enlightenment** (guided ascent through three symbolic realms). Guided mode is cinematic; Explore mode is visitor-controlled; Read mode is fully accessible and SEO-friendly.

## 2. Personas and jobs to be done
- **Curious international visitor (desktop):** Wants emotionally memorable introduction and interpretable historical context within 5–10 minutes.
- **Indonesian student/teacher (phone):** Wants clear language, short segments, navigable diagrams and accurate terminology; low bandwidth.
- **Heritage enthusiast:** Wants references, provenance, comparison of evidence versus conjecture and high-detail inspect controls.
- **Visitor with access needs:** Wants the full learning narrative with keyboard, screen reader, reduced motion, or no WebGL.

## 3. User journeys
- **Guided:** Landing -> Start journey -> chapter 1 intro -> era timeline -> architecture -> relief detail -> ascent -> recap/sources.
- **Explore:** Landing -> Explore -> aerial model -> select hotspot / realm / era -> source drawer -> resume chapter.
- **Read:** Landing -> Read the story -> jump to any section -> diagrams and curated stills + citations -> quiz/recap optional later.

## 4. Information architecture
```
/                         landing, entry choices, 1-line disclaimer
/en/experience            interactive experience default EN
/id/experience            localized experience ID
/{locale}/read            complete editorial narrative and citations
/{locale}/sources         research references and media acknowledgements
/{locale}/about           project, reconstruction method, acknowledgements
```
Deep links via query params, e.g. `/en/experience?chapter=stories&relief=demo-panel-01`; validate allow-listed IDs. History navigation must restore the same view.

## 5. Functional requirements (P0 = must for MVP)

| ID | Priority | Requirement | Acceptance criterion |
| --- | --- | --- | --- |
| PR-01 | P0 | Five-chapter narrative: Awakening, Across Centuries, Inside Monument, Stories in Stone, The Ascent | Each opens directly, has header, progress, narrative, next/back, non-WebGL alternate |
| PR-02 | P0 | Guided / Explore / Read modes | Any mode accessible in 2 actions; switching retains chapter when possible |
| PR-03 | P0 | Cinematic landing and opening reveal | Includes skip button; must not block interaction > 1 second for reduced motion |
| PR-04 | P0 | Interactive monument visualization | Drag/orbit on Explore, discrete controlled camera waypoints Guided; clearly marked illustrative model |
| PR-05 | P0 | Era Timeline | Change 4 named states with visual transformations, text/source metadata and evidence badges |
| PR-06 | P0 | Living Relief panels | Select at least 1 demo panel, open detail with source, text transcript, close/return focus |
| PR-07 | P0 | Three-realm ascent | Traverse Kamadhatu -> Rupadhatu -> Arupadhatu in guided or direct selection, with explanatory content |
| PR-08 | P0 | Cite facts and media provenance | Historical claims link to source record; media have rights status; incomplete assets cannot be published as authentic |
| PR-09 | P0 | Languages | Switch EN/ID; correct routing, equivalent information; locale preserved in deep links |
| PR-10 | P0 | Responsive / low-bandwidth | Text or illustrated fallback works without WebGL; mobile touch controls; lazy-load heavy assets |
| PR-11 | P0 | Accessible controls | WCAG 2.2 AA target; keyboard, reduced motion, captions/transcripts, focus management |
| PR-12 | P0 | Recovery and error handling | WebGL fail/timeout shows content + retry/read mode; no hard crash |
| PR-13 | P0 | Source library & legal notices | Display provenance, license/creator for published media, interpretive legend and correction contact |
| PR-14 | P1 | Audio narration | Opt-in, replay, speed/volume, transcript; only after rights-cleared recording exists |
| PR-15 | P1 | Real detailed monument model and quality levels | Geometry, LODs, texture compression, media cleared and curated |
| PR-16 | P1 | Relief character interpretation animation | Artistic animation explicitly labeled, source-linked and reviewed |
| PR-17 | P2 | Optional quiz/learning reflection | Answer 3–5 sourced questions; no tracking required |
| PR-18 | P2 | Teacher lesson plan | Printable materials after editorial validation |

### PR-05 specific rules — historical timeline
Named scene states:
1. **8th–9th-century construction — hypothetical visualization.** Simplified schematic build animation; no invented identifiable people, attire, transport processes, or exact chronology.
2. **19th-century documentation / renewed scholarly attention.** Use defensible broad period wording until curator supplies verified photographs and dates. Visual treatments are illustrative unless dated source photography is cleared.
3. **20th-century conservation and restoration.** Interpretive wireframe comparison; link UNESCO description of 1970s efforts, avoid claiming exact per-stone restoration geometry without data.
4. **Present-day monument.** Use a stylized architectural model until validated as geometrically accurate. Present-day facts and visual depiction are separately labeled.

Visitors can scrub between states, but mixed or intermediate morph states are **visual transitions**, not historical dates. Timeline must never imply a continuous photographic record.

### PR-06 specific rules — reliefs
- 1–2 sample relief entries permitted for MVP but visibly tagged **demonstration content**, not a depiction of a specific documented carved panel unless authenticated imagery and panel IDs are available.
- Detail view: title, where located (if verified), educational summary, why it matters, panel image/illustration, claim sources, certainty/rights status, close and previous/next.
- Future animation layered above photo is an artistic interpretation; if original art cannot be licensed, use newly authored line-art as a placeholder.
- Clicking from 3D or text/diagram must open same record. No hover-only navigation.

### PR-07 specific rules — symbolic ascent
- Base -> five square terraces -> three circular terraces plus central stupa; distinguish actual geometry from symbolic interpretation.
- Clearly present `Kamadhatu`, `Rupadhatu`, `Arupadhatu`, their locations, and meaning per UNESCO.
- Provide chapter transitions, optional direct jump to any realm, text parallel, and backtracking.
- Do not imply an actual physically accessible route or a particular historical pilgrim walking route unless sourced.

## 6. Non-functional requirements
- **Performance:** Target mobile p75 LCP <= 2.5 s for static landing at representative simulated 4G, and a usable initial static scene without waiting for 3D; see test plan for device/method. Do not gate editorial content on scene load.
- **Frame rate:** Target >= 45 FPS desktop at quality=high, >= 30 FPS at mobile low quality on documented reference devices; measure rather than assert.
- **Asset budgets (initial):** critical path JS <= 250 KB gzip target, no 3D requested before intentional entry; MVP first 3D package <= 3 MB compressed target; per-scene measured budgets in architecture. These are engineering targets, not guarantees.
- **Availability:** static-first hosting; no API dependency for critical journey.
- **SEO:** indexable localized Read pages with canonical and `hreflang`; do not rely on canvas to expose learning content.
- **Security/privacy:** no account, no user tracking by default; optional privacy-friendly aggregate analytics only after consent decision and policy review.
- **Maintainability:** typed content, documented sources, Playwright tests, reusable monument adapter.
- **Localization:** EN/ID; ensure paragraph and screen-reader labels are translated, not just menu items.

## 7. Visual quality requirements
- Mood: contemplative, monumental, cinematic, editorial, respectful, never theme-park sensationalism.
- Palette: volcanic charcoal, basalt green-grey, weathered stone, warm alabaster, subtle bronze highlights.
- Typography: display serif for major chapter titles; highly readable humanist/geometric sans for body and controls; font files licensed and self-hosted where practical.
- Art: hero atmospheric but accurate/interpretive state labeled. No stock photo passing as temple evidence. Motion elegant but subordinate to comprehension.

## 8. Success metrics/events (optional, privacy-aware)
Track anonymized aggregate events only when explicitly configured: `experience_started`, `chapter_viewed`, `era_selected`, `relief_opened`, `source_opened`, `experience_completed`, `fallback_used`; no user IDs or location. If analytics disabled, app must behave identically.

## 9. Release gates
- **Engineering gate:** green checks, no major mobile performance regression, fallback works.
- **Heritage gate:** all public claims reviewed and sourced; labels align with materials; all historical images/media have documented rights.
- **Accessibility gate:** keyboard, screen-reader audit, reduced motion; no blocker severity A or AA failure.
- **Editorial gate:** English and Indonesian copy reviewed for factual and translation accuracy.

## 10. Open questions that do not block M0–M3
Will a partner supply surveyed 3D scans? Which specific relief panel(s) are cleared? Is there an Indonesian heritage adviser? Which host/domain? Will voiceover be commissioned? Is this for personal portfolio, classroom, or public museum exhibition? Do not halt procedural MVP for these decisions.


---

# FILE: `docs/02_EXPERIENCE_AND_DESIGN.md`

# 02 — Experience Architecture, Storyboard, Visual Design

## 1. Experience design thesis
Cinematic storytelling should function like an interactive documentary: the visitor remains in control, every scene teaches a point, and visual claims distinguish evidence from interpretation. Target a rich but focused journey of ~6–10 minutes, or self-guided exploration of any length.

## 2. Visual identity and design tokens

| Token | Hex / approach | Use |
| --- | --- | --- |
| `--color-ink` | `#171B1B` | main dark canvas |
| `--color-basalt` | `#303732` | panels / secondary dark |
| `--color-stone` | `#A6A195` | tertiary type / wireframe |
| `--color-bronze` | `#C4A57B` | CTA, active indicators, diagram lines |
| `--color-parchment` | `#E9DCC7` | warm light surfaces |
| `--color-paper` | `#F4F0E7` | reading page background |
| `--color-white` | `#F9F7F1` | primary type on dark |

Use generous whitespace, a narrow editorial reading measure (60–75 characters), restrained gradients, 1px golden architectural lines, and soft shadows. Aim for AA text contrast. Typography: source a licensed display serif (e.g., Instrument Serif if its current license permits) and a geometric sans (e.g., Inter); create resilient system fallbacks.

## 3. Five-chapter interactive storyboard

### Chapter 1 — The Awakening (`awakening`)
**Learning goal:** Recognize the form/location and understand this is a documented monument with interpretive visuals.

**Visual:** Full-bleed atmospheric landscape inspired by Java; mist/volumetric effects optional. Monument silhouette emerges as fine bronze contour lines. Camera glides from distant 3/4 aerial to elevated front oblique.

**Interaction:** `Begin the journey` / `Explore freely` / `Read instead`. A visible `Skip introduction` control and no automatic audio. Scene captions identify any synthetic/illustrative setting.

**Motion cues:** 0–1.5s text reveal; ≤4s optional cinematic transition, immediately skippable; reduced motion cuts directly to stable still.

**Completion:** Buttons work on touch/keyboard; scene scales; preloader never prevents content access.

### Chapter 2 — Across Centuries (`centuries`)
**Learning goal:** Distinguish period evidence from modern reconstruction.

**Visual:** Fixed camera framing allows period-state comparison. Large label and mini historiography rail. Four period cards; bronze line draws through dates *as navigation*, not continuous evidence.

**Interaction:** Range-like era control with explicit buttons/ticks; arrows; textual summary plus `documented`/`inferred`/`artistic` badge. Change in layered vegetation, condition, drawn lines, construction blocks; stable camera keeps it legible.

**Motion:** Camera does not arbitrarily jump between timeline states; use crossfade, thresholded opacity, and schematic block placement. Morphing is conceptual—not depiction of the literal historical process.

**Completion:** Era change updates overlay, URL, source list and fallback; each state works without 3D.

### Chapter 3 — Inside the Monument (`architecture`)
**Learning goal:** Identify five square terraces, three circular platforms, main stupa, and 72 openwork stupas.

**Visual:** Camera eases to axonometric overhead; thin diagram strokes trace terraces, then an optional exploded schematic (not an archaeological measurement).

**Interaction:** Toggle `3D / Diagram`; click architectural feature labels; direct height/level selector. Return to narrative without losing chapter.

**Completion:** At least 3 architecture hotspots with source-backed description; diagram operable via buttons.

### Chapter 4 — Stories in Stone (`stories`)
**Learning goal:** Learn how a relief can convey narrative and how curators identify and interpret panels.

**Visual:** A stone-texture panel transitions into carefully authored illustration. Keep a persistent `Original / Interpretation` compare handle *only when original source exists and rights clear*. MVP uses illustrative demonstration artwork with banner.

**Interaction:** Tap/highlight gallery hotspot or catalog card -> overlay/detail panel. `Read transcript`, `Read sources`, `Return to gallery`. Modal handles Escape and restores focus.

**Motion:** Light catches grooves; optional strokes animate along illustrated contours. Do not anthropomorphize unverified reliefs or invent inscriptions. Narration opt-in in P1.

**Completion:** One fully working demo story with source panel and correct disclaimers; enhanced release replaces it with curated identified panel(s).

### Chapter 5 — The Ascent (`ascent`)
**Learning goal:** Map the three realms to temple's architectural zones and understand the UNESCO interpretation.

**Visual:** Spatial ascent from base to square galleries to circular platforms and central stupa. Scene palette becomes lighter and composition opens; do not imply literally attaining enlightenment via site interaction.

**Interaction:** Three selectable realm markers with a brief interpretive description, floor diagram, and citation. Scroll or next/back progresses; `Jump to realm` supported; final recap shows learned facts and references.

**Motion:** Camera vertical spline with gentle easing. Distinct pause and readable section; no high-speed spiral or forced vestibular animation.

**Completion:** All three realms reached with keyboard and text mode; names correctly placed; recap functional.

## 4. Global UI structure

**Desktop (>= 1024 px)**
```
┌────────────────────────────────────────────────────────────────┐
│ Wordmark        01 / 05             Language   Mode  Sound Off │
│                                                                │
│ 3D / art canvas                 Chapter title + learning text  │
│                                Evidence / interpretation tag │
│                                                                │
│ Chapters rail ────────────────────────────── Next / Back       │
│ Sources drawer / model disclaimer / accessibility controls    │
└────────────────────────────────────────────────────────────────┘
```

**Mobile (< 768 px):** top header, constrained scene viewport, title + body *below or over a stable contrasting panel*, bottom navigation controls, compact source accordion. Disable heavy full-screen scroll capture; tap-friendly chapter steps take precedence. Keep controls above browser safe-area inset.

**Read mode:** semantic `<main>` with headings, diagrams as accessible SVG plus descriptive captions, citations and source list. No canvas required.

## 5. Design interactions
- **Camera:** Guided uses canonical camera waypoints; Explore allows orbit/pan/zoom within safe bounds; returning to Guided restores previous chapter waypoint.
- **Progress:** 5 labeled steps with `aria-current="step"`. `Next` and `Back` always work; browser back restores URL state.
- **Information panel:** shows max 120 words per primary scroll segment with `More context` for extended analysis.
- **Evidence legend:** `Documented fact`, `Scholarly inference`, `Artistic illustration`; always visible near relevant visual, explained in a global legend.
- **Sources:** click to open panel listing title, author/institution, date, external URL, `accessedAt`, confidence and what claim it supports.
- **Hotspots:** pointer target >= 24 CSS px minimum per WCAG 2.2; aim >= 44 CSS px for touch when feasible. Keyboard-reachable duplicate list outside canvas.
- **Feedback:** state changes acknowledged in accessible live region; do not continuously narrate scroll progress.
- **Audio:** off by default, localizable captions/transcripts, explicit play. Background ambiences are optional and can be disabled.

## 6. Motion grammar
- Scroll progress drives a pure `chapterProgress` value; use GSAP to interpolate camera and scene transformations.
- Preferred timing: 600–1400 ms transitions, max 4 s for optional cinematic intro, long holds for reading.
- Easing: `power2.inOut` / `sine.inOut`; no elastic bounces on monument.
- Lenis optional; turn off for touch or when `prefers-reduced-motion` true. Keep native scrolling as valid mode.
- Disabled motion path: no parallax, no smooth scroll hijacking, no animation in view change, static accessible diagram.

## 7. Layout and localization constraints
- Explicit EN + ID copy; cross-check terminology and glossary. Allow 30–50% text expansion and responsive wrapping.
- Prefer icon + text labels, never color-only meaning or symbols without a legend.
- Videos have caption and transcript; if unavailable, omit videos from MVP.
- All interaction affordances visible on first use; no hidden knowledge of 3D gestures.

## 8. Art direction acceptance screenshots
Screenshots to capture in both desktop (1440×900) and mobile (390×844): hero, timeline at 2 endpoints, relief detail open, realm base, realm top, Read mode, reduced-motion mode, no-WebGL fallback. Human reviewer checks composition and typography against mock references, avoiding mockups presented as achieved implementation.


---

# FILE: `docs/03_ARCHITECTURE.md`

# 03 — Technical Architecture

## 1. Design principles
Static-first, evidence-driven, modular, typed, progressive, and resilient. The browser's 3D scene is a visualization layer, **not** the content or navigation source of truth. Learning content always renders as HTML. Build the first milestone without licensed media, an account system, a backend, or environment secrets.

## 2. Stack
- **Foundation:** Next.js App Router, React, strict TypeScript, pnpm, Tailwind.
- **3D:** Three.js, React Three Fiber (`@react-three/fiber`), Drei; use versions compatible with the selected React release. Prefer stable versions at time of install, pin lockfile.
- **Animation:** GSAP (free features only) + ScrollTrigger; Lenis opt-in smooth scroll for supported desktop mode.
- **State:** Zustand *or* small typed reducer for shared visitor state; choose reducer first for MVP unless complexity requires Zustand. Keep URL sync separate.
- **Data:** committed JSON and MDX reviewed at build; Zod validation; no production CMS in v1.
- **Tests:** Vitest + React Testing Library + jest-axe/axe-core + Playwright; optional visual diff.
- **Ops:** static/edge-friendly deployment, media CDN, cache immutability for fingerprinted assets, simple CSP.

## 3. Layer diagram

```
          ┌───────────────────────────────┐
          │ Next.js pages (SSR/static)    │
          │ SEO, localized Read, sources  │
          └──────────────┬────────────────┘
                         │ validated content
          ┌──────────────▼────────────────┐
          │ Content repository             │
          │ chapters, claims, assets       │
          │ license and review metadata   │
          └──────────────┬────────────────┘
                         │
          ┌──────────────▼────────────────┐
          │ Experience controller          │
          │ mode, chapter, era, realm,     │
          │ relief, motion preference      │
          └───────┬───────────────┬───────┘
                  │               │
     ┌────────────▼─────┐ ┌──────▼────────────┐
     │ HTML UI/a11y     │ │ Scene adapter     │
     │ controls + text  │ │ Three.js R3F      │
     └──────────────────┘ │ GSAP camera/scene  │
                          └───────────────────┘
```

## 4. Proposed directory tree (implementation repo)

```
src/
  app/
    layout.tsx
    page.tsx                       # redirects/resolves preferred locale
    [locale]/
      layout.tsx
      experience/page.tsx
      read/page.tsx
      sources/page.tsx
      about/page.tsx
  components/
    shell/ExperienceShell.tsx
    shell/ChapterNav.tsx
    shell/ModeSwitcher.tsx
    shell/EvidenceBadge.tsx
    shell/SourceDrawer.tsx
    shell/FallbackPanel.tsx
    ui/...
  features/
    experience/controller.ts       # pure reducer/state model
    experience/url-state.ts        # parse/serialize allow-listed IDs
    experience/chapters.ts
    time-machine/Timeline.tsx
    time-machine/era-mapping.ts
    reliefs/ReliefCatalog.tsx
    reliefs/ReliefDetail.tsx
    ascent/RealmNavigation.tsx
  scene/
    ExperienceCanvas.tsx           # client-only, lazy loaded
    MonumentPlaceholder.tsx       # original procedural geometry
    SceneController.tsx
    CameraDirector.tsx
    lighting.ts
    waypoints.ts
    effects/...
  content/
    schema.ts
    loader.ts
    en.json
    id.json
    references.json
    media-manifest.json
  i18n/
    dictionaries.ts
  lib/
    capabilities.ts                # WebGL/reduced-motion checks
    telemetry.ts                   # no-op by default
    asset-preflight.ts
  styles/tokens.css
public/
  images/illustrative/             # original generated or hand-authored only
  models/                           # empty until licensed/reviewed
  previews/                         # static authored SVG/JPEG/WebP fallback
scripts/
  validate-content.ts
  audit-media.ts
  check-budgets.ts
  optimize-models.mjs              # add when assets arrive
 tests/                              # adapt path to chosen tooling
```

Agent can choose minor structural details if contracts and constraints remain intact. Keep the docs in repo.

## 5. Experience state and transitions

```ts
type Mode = 'guided' | 'explore' | 'read';
type ChapterId = 'awakening' | 'centuries' | 'architecture' | 'stories' | 'ascent';
type EraId = 'construction' | 'nineteenth-century' | 'restoration' | 'present';
type RealmId = 'kamadhatu' | 'rupadhatu' | 'arupadhatu';
type MotionPolicy = 'full' | 'reduced';

type ExperienceState = {
  locale: 'en' | 'id';
  mode: Mode;
  chapter: ChapterId;
  era: EraId;
  realm: RealmId;
  activeReliefId: string | null;
  motion: MotionPolicy;
  sceneQuality: 'low' | 'medium' | 'high' | 'none';
  sourceDrawerOpen: boolean;
};

type ExperienceAction =
  | { type: 'NAVIGATE_CHAPTER'; chapter: ChapterId }
  | { type: 'CHANGE_ERA'; era: EraId }
  | { type: 'SELECT_REALM'; realm: RealmId }
  | { type: 'OPEN_RELIEF'; id: string }
  | { type: 'CLOSE_RELIEF' }
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'SET_MOTION'; motion: MotionPolicy }
  | { type: 'SET_QUALITY'; quality: ExperienceState['sceneQuality'] };
```

`reducer(state, action)` is deterministic and side-effect-free. It validates IDs. A separate effect serializes allowed state into URL; browser `popstate` restores it. Do not record cursor, frame number, camera quaternion or transient animation in URL. Deep links should reproduce content and jump to a **stable camera waypoint**, not a half-completed tween.

## 6. 3D rendering / motion ownership

**Three/R3F owns:** graphics resources, scene graph, camera transforms, raycasting, level-of-detail, material transitions, model loading.  
**GSAP owns:** orchestrated interpolation between known camera pose/scene parameters.  
**ScrollTrigger owns:** the mapping from reading/scroll segments to chapter progress, never factual domain state directly.  
**Lenis owns:** optional scroll presentation only. Disable on reduced motion / unsupported devices. Do not sync two independent `requestAnimationFrame` loops; one root ticker should drive Lenis and ScrollTrigger when active. Cleanup properly.  
**React owns:** discrete visitor state, HTML labels, controls, UI, localization and accessibility.

All cinematics use a `CameraDirector` with waypoints defined in scene space:

```ts
type CameraWaypoint = {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
  near?: number;
  far?: number;
  durationSeconds: number;
};
```

Camera numerics are **art-direction parameters for the illustrative model**, not surveyed geospatial coordinates. Recalibrate only after new model ingestion. Optionally use a Catmull–Rom curve; avoid camera flips and clipping through architectural meshes. Use bounding volumes and controls limits.

## 7. Asset strategy and honest placeholders

### Phase A: procedural MVP
- Create one stylized square terraced base with five visible squared levels, three abstract circular upper platforms and one central stupa, all **illustrative**.
- Use simple gray stone materials and lighting; 72 precise perforated stupas optional in M2 if performance allows, and label geometry as schematic regardless.
- For architecture hotspots, annotate known conceptual features; do not claim dimensional exactness.
- Relief demo uses self-authored stylized 2D line art and an obvious `DEMO ARTWORK — NOT ORIGINAL RELIEF` notice.

### Phase B: researched model
- Ingest rights-cleared photogrammetry / architect-produced 3D models with creator approval and documented scale/orientation.
- Export Blender source file plus GLB; maintain mapping of component groups to hotspot IDs.
- Generate quality levels (`low`, `medium`, `high`) and capture screenshots of silhouette/hotspot alignment.
- Use glTF 2.0 and evaluate meshopt/Draco; KTX2 for GPU compressed textures where supported. Keep original unoptimized master outside public delivery path.
- Confirm dataset license covers derivative textures, rehosting, public display, and any commercial use; record required attribution.

### Example media manifest fields
`id`, `type`, `src`, `creator`, `sourceUrl`, `licenseId`, `licenseUrl`, `attribution`, `rightsReviewed`, `editorialReviewed`, `factualStatus`, `alt.en`, `alt.id`, `approxBytes`, `qualityTier`, `sha256`.

**Deployment rule:** `rightsReviewed=false` for a real external asset => CI fails public build; illustrative original internal assets can use an explicit internal creator/license entry.

## 8. Performance budgets and degradation

| Context | Proposed budget / policy |
| --- | --- |
| Landing initial | Static HTML + CSS available before WebGL; <= 250 KB initial JS gzip target; 3D loads only when selected/nearby |
| First interactive scene | compressed transfer <= 3 MB MVP; show progress + fallback at every loading stage |
| Desktop high | Aim >= 45 FPS median in 60-second scripted camera test on reference GPU |
| Mobile low | Aim >= 30 FPS median in 60-second test on representative mid-range phone |
| Shader / postprocessing | Post-processing disabled by default on low, conservative on medium, opt-in on high |
| Network | Preload only next chapter's asset; don't preload all era/relief files |
| DPR | cap 1–2; adaptive reduction based on performance monitor |
| Memory | dispose meshes/textures after scenes replaced; avoid multiple full-size asset copies |
| WebGL failure | render Read/schematic alternative immediately with one-click retry |

Profile on actual target hardware; the budgets are targets, not measured guarantees. `prefers-reduced-data`, mobile device and low memory hints should influence quality selection where available, without depending on proprietary APIs.

## 9. Progressive failure modes
- Server/SSR failure of interactive module: static Read page still available.
- `WebGLRenderingContext` absent or context lost: informative fallback, restore/retry once user chooses.
- Failed GLB/image: replace with authored silhouette, toast non-blocking, continue chapters.
- GSAP/Lenis issue: native scroll and direct chapter buttons continue working.
- Audio missing: transcript and written content remain usable.
- Missing locale entry: build fails rather than silently publishing a mixed-language UI.

## 10. Testing boundaries
Unit tests for reducer, timeline mapping, URL parser, claims/provenance validation; component tests for overlays/navigation/accessibility; Playwright for mode changes, touch viewport, reduced motion, WebGL mocked error and successful scene, no external network. Visual screenshots per `docs/07_TEST_AND_ACCEPTANCE.md`.

## 11. Optional migration to monuments engine
After successful Borobudur launch, move `features/experience`, `scene/CameraDirector`, `content/schema` to reusable packages. Borobudur-specific geography, eras, learning maps, claims and artwork stay in a content pack; avoid premature monorepo architecture in MVP.


---

# FILE: `docs/04_CONTENT_PROVENANCE.md`

# 04 — Content Provenance, Historical Accuracy, and Rights

## 1. Central editorial rule
A beautiful animation is **not evidence**. Every educational claim and media object must carry provenance and interpretation status so a visitor can tell observed, sourced fact from a scholarly inference or an artistic depiction.

## 2. Three truth-status categories
- **Documented:** Verifiable from cited institution, publication, conservation record, measured photograph, or clearly credited survey.
- **Inferred:** Reasoned scholarly reconstruction based on cited evidence; show assumptions and uncertainty.
- **Artistic:** An intentionally imaginative or generalized illustration with no claim to specific historic authenticity. Label conspicuously.

For each visual: maintain two independently reviewable dimensions: (a) the **historical statement** it illustrates and (b) its **visual fidelity**. A UNESCO-backed claim about five square terraces does **not** make an agent-built schematic an accurate model.

## 3. UNESCO-verified seed facts (editorial paraphrases)
1. Borobudur was built in the **8th and 9th centuries** in central Java under the Syailendra Dynasty.
2. Its main structure comprises a pyramidal base with **five concentric square terraces**, then **three circular platforms**, and a central monumental stupa.
3. The circular platforms contain **72 openwork stupas**, each with a Buddha statue in UNESCO's description.
4. The cosmological interpretation links the base to *kamadhatu* (sphere of desires), the five square terraces to *rupadhatu* (sphere of forms), and the circular terraces and main stupa to *arupadhatu* (sphere of formlessness).
5. UNESCO documents restoration assistance in the **1970s** and nineteenth-century renewed recognition of the monument.
6. The inscription describes the broader World Heritage site **Borobudur Temple Compounds**, which also includes Mendut and Pawon temples. Distinguish the main monument from the World Heritage property.

Primary source: UNESCO World Heritage Centre, https://whc.unesco.org/en/list/592/ (accessed 2026-11-12).

Do not add exact 1814 event details, panel numbering, ancient paint color, stone-by-stone construction sequence, workers, chanting, invented quotes, detailed pilgrimage route, or symbolic interpretations beyond the source without new references and review.

## 4. Claim schema / attribution policy
Every nontrivial educational statement references `claimIds`. Claim object should include:

```ts
type EvidenceStatus = 'documented' | 'inferred' | 'artistic';
type ReviewStatus = 'draft' | 'needs-review' | 'reviewed';

type HistoricalClaim = {
  id: string;
  statements: { en: string; id: string };
  status: EvidenceStatus;
  sourceIds: string[];                // required for documented/inferred
  review: ReviewStatus;
  reviewer?: string;
  reviewedAt?: string;                // ISO date
  qualification?: { en: string; id: string };
};
```

Agents may scaffold records as `draft`; they must not silently mark AI-generated narratives as reviewed. For public release, factual content must be human-reviewed. Avoid long unattributed quotations and unlicensed translations; summarize using original writing.

## 5. Media license registry
Each photo, video, scan, sound, texture, font, and illustration should record:

- original creator, title, source URL, date retrieved, file checksum;
- reuse license/version, attribution, derivative and redistribution conditions;
- whether permissions include public website, rehosting, modification, commercial use if applicable;
- responsible rights reviewer and decision date;
- provenance/fidelity status and audience-facing disclaimer;
- alternative-text translations (EN, ID).

`unknown`, blank or `all rights reserved` are **not reusable** by default. Images appearing on UNESCO, Google Arts & Culture or virtual tour sites cannot be embedded or repackaged without checking their own media rights. UNESCO's narrative text and NHK video, for example, have potentially different rights; inspect each individually.

## 6. Sample relief workflow
1. Identify a specific panel **from a scholarly or museum catalog**, record location and canonical reference ID.
2. Obtain original photographic/scan rights or produce original, vetted illustration based on licensed references.
3. Ask content adviser to approve translation, narrative identification, interpretation, and uncertainty.
4. Write 80–140-word visitor explanation plus 250–450-word expanded context; cite sources and panel attribution.
5. If animation is added, separate exact relief-trace contours from invented movement. Add persistent `Artistic interpretation` label.
6. Verify every caption and spoken line matches the written evidence; provide transcript.
7. In MVP, if no actual panel is identified, use **sample concept** rather than asserting the demo maps to a specific Borobudur carving.

## 7. Era reconstruction workflow
Create a scene evidence ledger with columns: `object/feature`, `era`, `visible claim`, `supporting source`, `confidence`, `visual treatment`, `reviewer`, `decision`. Do not interpolate or invent dated scenes from different sources and imply they are literal snapshots. A slider can blend **rendered layers** while its labels remain anchored to discrete documented or hypothetical era categories.

## 8. Cultural and linguistic review
- Validate Indonesian terminology with a qualified reviewer; use `Candi Borobudur` in suitable local-language copy but avoid forcing untranslated terms into every sentence.
- Distinguish visitor-friendly simplification from doctrinal definition; attribute interpretations (e.g. "UNESCO describes..." when warranted).
- Avoid anachronistic depictions and casually appropriated ritual audio. Commission audio or use original unobtrusive ambient sound, with opt-in controls.
- Add a visitor-facing `How this reconstruction was made` page with methods and limitations.

## 9. Content acceptance gate
Publication permitted only if:
- all displayed factual records `review === 'reviewed'` and `sourceIds.length > 0`;
- all displayed third-party media rights reviewed and cleared;
- no unlabeled inferred/artistic scenes;
- EN/ID content reviewed or explicitly marked preview;
- verified panel location and attribution for any relief described as a named original;
- unresolved material disagreements are shown as uncertainty, not discarded.

For local demo environment only, allow `draft` content **with prominent banner**: "Research prototype — educational claims pending editorial review".

## 10. Reference register to extend
- U001 — UNESCO World Heritage Centre, "Borobudur Temple Compounds", https://whc.unesco.org/en/list/592/
- U002 — UNESCO World Heritage Committee Decision 47 COM 7B.74, https://whc.unesco.org/en/decisions/8798
- W001 — W3C WCAG 2.2, https://www.w3.org/TR/WCAG22/
- T001 — React Three Fiber documentation, https://r3f.docs.pmnd.rs/
- T002 — Khronos glTF 2.0 spec, https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.pdf

Check and store bibliographic metadata before public release. Research links are **not asset license grants**.


---

# FILE: `docs/05_IMPLEMENTATION_PLAN.md`

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


---

# FILE: `docs/06_AGENT_TASKS.md`

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


---

# FILE: `docs/07_TEST_AND_ACCEPTANCE.md`

# 07 — Test Plan, Quality Gates, Acceptance Evidence

## 1. Quality strategy
Mix deterministic automated tests with explicit visual, accessibility, historical/editorial and hardware review. A single beautiful desktop screenshot is not evidence of an accessible, functional product. Keep fixtures local so CI passes offline after package installation.

## 2. Test matrix

| Test layer | Tool | Critical cases | When |
| --- | --- | --- | --- |
| Unit | Vitest | reducer state transitions, source rule validation, locale completeness, URL parsing | each PR |
| Component | Testing Library / axe | timeline selection, source drawer, relief modal focus, navigation labels | each PR |
| E2E | Playwright | 5 chapters, 3 modes, browser history, locale, fallback, viewport | each milestone |
| Visual | Playwright screenshots + manual | hero, era states, relief detail, ascent, mobile, reduced motion | each design change |
| Performance | Lighthouse + browser trace | LCP, initial JS, GLB sizes, FPS, GPU memory heuristic | M1/M3 and assets |
| Accessibility | axe + manual screen reader | keyboard, headings, contrast, touch targets, motion, reading flow | M1/M3 |
| Historical | source ledger + curator | fact-source alignment, period labels, interpretation, panel identity | before public |
| Rights | media registry + human review | license, attribution, derivatives, fonts, sounds, scans | before any release |

## 3. Concrete e2e scenarios

1. **Journey:** open `/en/experience`, start, visit all five chapters, complete recap; headings and controls update.
2. **Mode continuity:** change to Explore in `centuries`, select era, change to Read, return to Guided and retain stable relevant state.
3. **Deep link:** open `/en/experience?chapter=ascent&realm=rupadhatu`; correct text, appropriate camera waypoint; reload and browser back consistent.
4. **Timeline:** use pointer and keyboard to visit all four periods; labels and interpretations change; assert active tick and source metadata.
5. **Relief detail:** select demo entry, open overlay, verify demo attribution, use Escape, focus restores; Next/Back no trap.
6. **Reduced motion:** emulate `prefers-reduced-motion: reduce`; intro not forced, Lenis disabled, no parallax, navigation works.
7. **WebGL unavailable:** simulate failed canvas/context; read card is available with a descriptive message and retry option; chapter completion remains possible.
8. **Mobile:** 390×844 and 360×740 viewports, tap controls, no horizontal overflow, focus accessible, no forced canvas scrolling.
9. **Localization:** navigate in `/id`, assert Indonesian content and valid routes, test cross-locale link retains relevant chapter.
10. **Source coverage:** deliberate missing source for `documented` record causes build validator failure; media rights mismatch blocks publish build.
11. **Slow network:** static body text renders before models, loading indicator has text alternative and cancellation/Read action.
12. **Audio policy:** no audio starts automatically; if narrator enabled later, user explicitly triggers playback and transcript is exposed.

## 4. Acceptance traceability

| Product feature | Task | Minimum automated evidence | Manual review |
| --- | --- | --- | --- |
| PR-01 Chapters | M1-T01 | E2E all five chapters | narrative continuity |
| PR-02 Modes | M1-T01 / T04 | mode-switch E2E | semantics and UX |
| PR-03 Cinematic hero | M1-T03 | skip/reduced-motion test | motion quality |
| PR-04 Model | M1-T02 | fallback test | visual coherence / performance |
| PR-05 Timeline | M2-T01 | state/unit/E2E | evidence badges |
| PR-06 Relief | M2-T03 | modal + data tests | no fictitious attribution |
| PR-07 Ascent | M2-T04 | realm selection E2E | UNESCO placement accuracy |
| PR-08/13 Claims | M0-T03 / M2-T05 | content audit | editorial gate |
| PR-09 Languages | M0-T02 / M2-T05 | locale parity | native editor review |
| PR-10/12 Resilience | M1-T05 / M3-T01 | blocked WebGL + slow net | phone test |
| PR-11 Accessibility | M3-T02 | axe + keyboard E2E | screen reader |

## 5. Benchmark environment and targets
Specify **the exact device, operating system, GPU, browser, viewport, network throttle, build version, and test route** alongside each result. Suggested test profiles:

- Desktop: mainstream laptop (integrated GPU), Chrome and Firefox, 1440×900.
- Mobile: representative 2–4-year-old mid-range Android phone on Chrome, 390×844; separate iPhone/Safari smoke test.
- Simulated slow network: Chrome DevTools 4G plus CPU throttle; also test real mobile network once available.

**Targets (not measured values):** initial landing LCP <=2.5 s p75 in synthetic lab; desktop 45+ median FPS, mobile 30+ median FPS while scene running; zero critical a11y violations; no unhandled WebGL crash. Performance budgets adjustable only with a measured, documented tradeoff.

## 6. Accessibility checklist
- Exactly one H1 on reading pages, logical heading hierarchy and landmarks.
- All actions keyboard reachable, no reliance on mouse hover, wheel, pinch, or audio.
- Modals focus trapped appropriately; Escape works and focus restores to trigger.
- Visible `Skip to content`, visible keyboard focus, source links with meaningful text.
- Color contrast >= 4.5:1 for normal text and >= 3:1 for large text/meaningful UI boundaries as applicable; test actual rendered values.
- Touch targets meet WCAG 2.2 minimum with spacing; design aims 44px.
- Animation honors reduced motion, without essential information conveyed only by animation.
- Canvas has accessible descriptive alternative; no screen-reader reading of hundreds of 3D objects.
- Images diagrams have localized alt/caption; meaningful figures have extended description; audio/video caption/transcript.
- User choice to pause/skip auto-changing content, no uncontrolled flashing or orientation lock.

## 7. Historical/content QA
Build-time validation is **necessary but insufficient**. A schema can prove that a claim has `sourceIds`, not that the linked source truly supports it. Manual reviewer signs off each `documented` claim's exact source passage, inference qualification, relief identity/location, and visual labels. Maintain `docs/evidence-ledger.csv` later if required.

## 8. Release checklist (agent must report each)
- [ ] All P0 flows implemented (or MVP scope explicitly amended)
- [ ] Build, lint, typecheck, unit and e2e tests green
- [ ] No critical a11y blockers; manual screen-reader test documented
- [ ] Static/read mode and WebGL fallback complete
- [ ] EN/ID parity and editorial review state accurate
- [ ] All embedded media owned or licensed, attribution displayed
- [ ] Every historical claim sourced; reviewer flags accurate
- [ ] No placeholder implied to be accurate heritage geometry
- [ ] Performance budgets checked with actual measurements
- [ ] Deployed preview tested and rollback path documented

If content / rights review is pending, release only as labeled research **prototype** and never claim to have museum certification.


---

# FILE: `docs/08_AGENT_PLAYBOOK.md`

# 08 — Agent Harness Playbook (Claude Code / Codex)

## 1. Recommended agent mode
Let the agent implement a bounded milestone autonomously while preserving inspectability. Use `AGENTS.md` as standing instructions, `TASKS.yaml` as task queue, `docs/07_TEST_AND_ACCEPTANCE.md` as evidence contract. Keep human decisions for licenses, museum partnership, budget, actual deployment, and historic editorial approval.

## 2. Copy/paste prompts

### A. Initialize the project (first session)
```text
You are the lead frontend and interactive 3D engineer for BOROBUDUR — The Living Monument.
Read AGENTS.md, CLAUDE.md (if applicable), README.md and docs/00–05. The repository currently contains specifications, not the implementation. Follow the official task queue in TASKS.yaml. Implement M0-T01 through M0-T04 in order. Use Next.js App Router, React, strict TypeScript, Tailwind, validated content, English/Indonesian routes, a useful static shell and tests. Do not depend on external media, credentials, or scans. Never make undocumented historical claims. At the end run lint, typecheck, tests, build, update task statuses, and give a concise report of what really works and any blocks.
```

### B. Build the cinematic vertical slice (second session)
```text
Read AGENTS.md, docs/01_PRD.md, docs/02_EXPERIENCE_AND_DESIGN.md, docs/03_ARCHITECTURE.md and latest IMPLEMENTATION_LOG.md. Implement the unblocked M1 tasks. Build one coherent five-chapter journey with procedural illustrative architecture, stable camera waypoints, a skippable cinematic opening, EN/ID copy, Read mode, keyboard navigation and WebGL fallback. Use free GSAP/ScrollTrigger and optional Lenis; do not add a second animation loop. Preserve historical and source labels. Test on 1440x900 and 390x844. Update TASKS.yaml and report measured validation rather than claiming finished from screenshots.
```

### C. Implement Time Machine
```text
Implement M2-T01 from the PRD. Build a 4-state accessible timeline and synchronized illustrative 3D presentation, with reconstruction status and citations at every state. The slider is not proof of a continuous timeline. Keep camera fixed enough for comparison, retain state in URL, and ensure keyboard/Read fallback. Write state unit tests and E2E journey tests. Do not add unlicensed historical images or invented precise visuals.
```

### D. Implement Living Reliefs
```text
Implement M2-T03. Build 1–2 functioning demo relief stories using self-authored SVG/vector illustrations with conspicuous demo labels. Include hotspot selector, localized dialog, explanatory narrative, source drawer, focus trap, Escape close and restoration, deep link, Read parallel, tests. Do not claim a specific Borobudur panel until researched/rights-cleared content is supplied. Structure content so real vetted panels can replace demo data later.
```

### E. Implement the three-realm ascent
```text
Implement M2-T04. Design beautiful camera transitions across base, square terraces, and circular platforms/central stupa, with a clearly explained three-realm interpretation cited to UNESCO. Include direct realm navigation, reduced-motion transitions, persistent readable HTML and recap. Tests should verify exact realm-to-architectural-zone mapping and accessibility. Do not add doctrinal or pilgrimage details not supported by sources.
```

### F. Audit and release candidate
```text
Read AGENTS.md and docs/07_TEST_AND_ACCEPTANCE.md. Audit every P0 requirement, open and inspect the implementation, repair blocking bugs, run unit/e2e/build/linters, test no-WebGL and reduced motion, collect browser screenshots and measured performance on declared hardware. Generate a file-by-file quality report. Treat historical/content approval and asset rights as separate gates: mark the build a PROTOTYPE if pending. Do not invent signoffs.
```

## 3. Iteration rubric
For every task, agent response should contain:

```text
Task(s): Mx-Tyy
Implemented: file paths + actual behavior
Screens / routes: which ones exercised
Verification: commands and test counts/results, browser/device/viewport
Content/rights: documented / inferred / artistic; what is draft
Known issues: severity and next action
Next task: exactly one recommended ID
```

## 4. Context reset protocol
If the agent starts with no previous context, it must read `AGENTS.md`, `TASKS.yaml`, latest `IMPLEMENTATION_LOG.md`, and the relevant PRD/architecture/test files. Do not rely on unstated conversational memory. Keep new `IMPLEMENTATION_LOG.md` entries under 300 words each.

## 5. Task orchestration and safe parallelization
- **Early sequence:** M0-T01 → M0-T02 → M0-T03 → M0-T04 → M1-T01 → M1-T02.
- After M1-T01/M1-T02, UI/Read mode work and camera integration may proceed in parallel if separate files with agreed contracts.
- In M2, era/architecture/relief/ascent components can be developed in parallel only after state schemas are stable; merges require full E2E and no duplicate state logic.
- Agent may self-resolve small UI choices; if a requirement conflicts with rights/accessibility, choose rights/accessibility, document decision.

## 6. Guardrails against common agent failures
1. Do not grab an attractive Borobudur image from search without permission.
2. Do not declare an architectural silhouette a surveyed model.
3. Do not invent named relief/panel stories or historical workers.
4. Do not build visually striking but nonfunctional buttons.
5. Do not put all text inside a canvas or WebGL overlay.
6. Do not use a CDN script for arbitrary dynamic code if a local dependency can do the job.
7. Do not autoplay audio or hijack mobile scroll.
8. Do not add unrequested AI agents/chatbots or custom backend to the visitor site.
9. Do not claim passed tests that were not run.
10. Do not silently expand MVP scope when core features or fallback remain incomplete.

## 7. Human review checkpoints
- Before publishing any third-party artwork/model/voice asset.
- Before relabeling a scene from illustrative to historically accurate.
- Before public deployment and analytics collection.
- Before spending money on services or external licensing.
- Before calling translations professionally vetted or relief interpretation scholarly approved.

## 8. Agent task queue semantics
`TASKS.yaml` entries have `status: todo | in_progress | blocked | done`, `depends_on`, `acceptance`, `evidence`. An agent sets `in_progress` when starting and `done` only with working implementation plus verifiable results; a partial feature remains `in_progress`. Never set `done` merely because a file is created.


---

# FILE: `docs/09_DEPLOYMENT_OPERATIONS.md`

# 09 — Deployment, Security, and Operations

## 1. Hosting model
Static-first web deployment on any platform supporting Next.js App Router static pages (Vercel, Netlify or containerized Next.js). For a no-server configuration, assess whether dynamic App Router features prevent full export; choose the simplest deployment that genuinely supports chosen rendering. No backend services are required for the public MVP. Large GLB/KTX2 media should be served through a CDN/object store with long immutable caching and correct Content-Type/CORS.

## 2. Environments
- **Local:** no credentials and offline educational fixtures.
- **Preview:** demo site, development assets, prominent `Research prototype` disclaimer; no search indexing if internal.
- **Production:** only after engineering, rights, editorial and cultural review gates pass.

Configuration variables must have safe defaults and be documented via `.env.example` with **no real secrets**. User-generated PII and cookies are absent by design.

## 3. Build pipeline (recommended)
1. `pnpm install --frozen-lockfile`
2. `pnpm format:check` (if available) and `pnpm lint`
3. `pnpm typecheck`
4. `pnpm validate:content` (schema, provenance, locale, rights flags)
5. `pnpm test --run`
6. `pnpm test:e2e`
7. `pnpm build`
8. `pnpm budget:check` (script may read output bundle and asset sizes)
9. Generate a preview, manually sign off if public.

Add these scripts in implementation. A failed rights/provenance gate should be conspicuous and block a **production release**, not force deletion of demo assets from local development.

## 4. Browser/security policy
- Content Security Policy compatible with actual Next.js scripts, WebGL canvas, CDN media and image assets; avoid `'unsafe-eval'` if possible. Determine practical nonces/hashes based on deployment mode.
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HTTPS, secure response headers as appropriate.
- Restrict source URLs to `https:` and review hosts; avoid `javascript:` and embedded arbitrary iframes.
- Sanitize/validate structured content before rendering; don't use raw HTML injected from untrusted metadata.
- Lockfile and automated dependency scanning; do not blindly upgrade Three/R3F major versions without testing.
- Defend against malicious third-party assets: validate file types, limits, provenance, and URLs before publishing to public CDN.

## 5. Performance operations
- Serve compressed Next.js assets via CDN, use Brotli/gzip where supported.
- Use `preload` only for immediate essentials; lazy-load 3D models, avoid prefetching unused huge images.
- Monitor Core Web Vitals separately for landing vs interactive experience; keep scene FPS diagnostics behind development flag.
- Keep low/medium/high quality presets; persist choice per session only if the visitor requests it (no tracking needed).
- WebGL context loss must be recoverable; avoid forcing reload.

## 6. User privacy
No sign-in, email collection or person-level telemetry. Optional aggregate analytics require an explicit product/privacy decision, with cookie banner only if legally and technically needed. Do not send visitor's selected camera/relief state to unnecessary third parties.

## 7. Monitoring and incidents
- Deployment checks: index/experience/read/source routes return correct content, direct link hydration works, static fallback available.
- Collect privacy-safe aggregated error metrics **only if approved**, without visitor identifiers.
- On broken external assets, fall back to illustrative originals rather than blank page.
- Rollback by redeploying prior immutable release; retain original verified content/asset manifest.

## 8. Public-release checklist
Engineering sign-off + accessibility sign-off + historical content review + rights clearance + localization sign-off; add visible author credits and correction request contact method before public launch.


---

# FILE: `docs/10_RISKS_AND_DECISIONS.md`

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


---

# FILE: `docs/11_CONTENT_MODEL_AND_API.md`

# 11 — Content Model, Contracts, URL / UI API

## 1. Content-first approach
`content/content.schema.json` is a starter cross-platform schema for document fixtures; implement equivalent strongly typed TypeScript/Zod schemas in application. Expand cautiously: guarantee parity and migration tests when adding fields. Treat data as display content, **not** proof the underlying source supports it.

## 2. Entities and relationships

```
Monument (1)
  ├─ Chapter (5) ──> Claim (*many-to-many*) ──> Source (*many-to-many*)
  ├─ Era (4) ──────> Claim
  ├─ Realm (3) ────> Claim
  ├─ Relief (1+ demo) ──> Claim, Media
  ├─ Hotspot (*) ─> Chapter / Era / Realm / Relief
  └─ Media (*) ───> Rights record + fidelity classification
```

Each educational entity has stable `id`; localized text is `{en, id}`; no component should hardcode historical claims. Sources have external HTTPS URL. A page computes cited sources from referenced claim IDs and media IDs. Build validator checks missing IDs and prohibited review states.

## 3. Suggested types

```ts
type Locale = 'en' | 'id';
type Localized = { en: string; id: string };
type Accuracy = 'documented' | 'inferred' | 'artistic';
type Review = 'draft' | 'needs-review' | 'reviewed';

type Source = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  accessedAt: string;
  type: 'official' | 'scholarly' | 'archival' | 'other';
};
type Claim = {
  id: string;
  text: Localized;
  evidenceStatus: Accuracy;
  reviewStatus: Review;
  sourceIds: string[];
  qualification?: Localized;
};
type Media = {
  id: string;
  src: string;
  alt: Localized;
  kind: 'image' | 'model' | 'audio' | 'video' | 'illustration';
  provenance: Accuracy;
  creator: string;
  licenseId: string;
  licenseUrl?: string;
  rightsReviewed: boolean;
  attribution: string;
  isOriginal: boolean;
};
type Chapter = { id: string; title: Localized; summary: Localized; claimIds: string[] };
type Era = { id: string; label: Localized; description: Localized; provenance: Accuracy; claimIds: string[] };
type Realm = { id: string; title: Localized; explanation: Localized; claimIds: string[] };
type Relief = {
  id: string;
  title: Localized;
  description: Localized;
  demonstration: boolean;
  claimIds: string[];
  mediaIds: string[];
  verifiedLocation?: string;
};
```

## 4. Validation policies
- All records have stable kebab-case IDs; no duplicate IDs.
- `en`/`id` non-empty; trims whitespace; no external HTML.
- `documented` / `inferred` claims require valid `sourceIds`, and `reviewStatus==='reviewed'` for public release.
- `artistic` educational content cannot impersonate historical evidence; source refs allowed for contextual claims.
- Third-party media must have `rightsReviewed===true`, license metadata and attribution before public deployment.
- `Relief.demonstration===true` must display `Demonstration artwork — not a specific original panel` in both languages, regardless of underlying claim sources.
- Source URL protocol `https`; include exact attribution if borrowed content.
- Content review is separate from schema checks; human review mandatory before public release.

## 5. Deep-link and state contract

`/{locale}/experience?chapter={id}&era={id}&realm={id}&relief={id}&mode={guided|explore}`

- Query strings optional; default chapter `awakening`, era `present`, realm `kamadhatu`, mode `guided`.
- `mode=read` redirects to localized `/read` with equivalent anchor, or uses Read layout without WebGL. Pick one and test consistently; prefer redirect.
- Invalid IDs drop to safe defaults, never arbitrary dynamic import paths.
- URL writes only after intentional navigation; avoid scroll-trigger history spam (`replaceState` for continuous UI, `pushState` for chapter/explicit selections).
- Locale switch preserves valid chapter/selection; relief modal state remains if ID exists in both languages.

## 6. Interface contracts
- `<ExperienceShell>` accepts validated content pack + initial server state.
- `<ChapterNav state dispatch>` renders next/back + progress; works without canvas.
- `<ExperienceCanvas sceneState onHotspotActivate>` lazy loads and emits **intent events only**, not direct modal state mutation.
- `<Timeline value onChange eras>` has buttons and a screen-reader accessible current era; **not** a single pointer-only drag affordance.
- `<ReliefDetail relief onClose>` traps focus and restores return target; shows source links.
- `<RealmNavigation value onChange>` displays all three realm names with labels from content.
- `<SourceDrawer claimIds mediaIds onClose>` produces human-readable references, URLs and provenance.
- `<ReadExperience chapters>` consumes the same records as animated mode; no manually duplicated facts.

## 7. Suggested CI contracts

```text
pnpm validate:content
  -> schema all records
  -> no dangling references
  -> locale parity
  -> legal/media allowlist for production release
  -> truth-status visual labeling check (static metadata test)

pnpm test:routes
  -> every deep link yields expected chapter+locale
  -> source links remain clickable when canvas disabled
```

## 8. Data migration principle
Introduce a `schemaVersion` at root. Write a migration and unit test before changing persisted IDs or shape. Identifiers referenced by shared URLs should remain stable or be redirected.


---

# FILE: `docs/12_ACCEPTANCE_DEMO_SCRIPT.md`

# 12 — Demo Walkthrough and Stakeholder Acceptance Script

## Objective
Demonstrate user learning, historical honesty, and technical robustness in under ten minutes. The presenter should not rely on untested features or a high-end-only desktop.

## Walkthrough
1. **Open landing** on a desktop. Show atmospheric hero with `Research prototype` / `Illustrative geometry` label and immediately demonstrate `Skip introduction`.
2. **Begin journey.** Move through Awakening; hover/tap only optional, as primary controls are visible buttons.
3. **Travel through time.** Switch four period buttons; explain the difference between sourced chronological facts and hypothetical scene layers. Open a cited source.
4. **Explore structure.** Select a square terrace feature and the circular platform; show matching SVG accessible diagram and source.
5. **Open Living Reliefs.** Select the demo relief and explicitly point out that it is demo art, not an authenticated panel. Open and close with keyboard, confirm focus restoration.
6. **Ascend realms.** Jump to base, square and circular zones; demonstrate exact UNESCO-supported realm relationships and final recap.
7. **Accessibility check.** Enable reduced-motion and disable WebGL; switch to Read mode without losing the learning path. Explain EN/ID language selection.
8. **Mobile check.** Repeat chapter navigation, source drawer and era selection at narrow viewport.
9. **Provenance page.** Show how researchers/creators, uncertainty, license and editorial review are represented.
10. **Technical evidence.** Show actual test results, performance measurements and declared editorial blockers.

## Pass conditions
- Each chapter teaches a documented insight and has a functional interaction or thoughtful read fallback.
- The content reads coherently even with graphics disabled.
- The Time Machine does not misrepresent a conceptual blend as a dated historical photograph.
- A viewer can tell demo artwork from authenticated relief evidence.
- A visitor can explore every realm without precise cursor control.
- Public-release status is accurately described (a prototype remains a prototype until rights and editorial signoff).

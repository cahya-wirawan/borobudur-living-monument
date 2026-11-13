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

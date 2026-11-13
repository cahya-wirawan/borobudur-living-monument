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

**The package began as a specification and execution kit; milestones M0–M2 are now implemented as a labeled research prototype (see §8).** No licensed images or 3D monument models are bundled.

## 2. The experience in 30 seconds

Visitor arrives to an atmospheric introduction. A guided camera reveals Borobudur's stepped geometry. A chronology control visualizes documented states and **clearly labeled hypothetical construction scenes**. Clickable reliefs open interactive, source-backed stories. In the final chapter, the camera ascends through _Kamadhatu_, _Rupadhatu_, and _Arupadhatu_, with symbolic interpretations, a spatial floor selector, and a final summit reveal. A fully usable text-first alternative exists alongside the 3D experience.

## 3. Document map

| File                                      | Why it exists                                                    |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `AGENTS.md`                               | Non-negotiable coding-agent instructions and definition of done  |
| `CLAUDE.md`                               | Claude Code entrypoint; defers to shared agent rules             |
| `docs/00_VISION_AND_SCOPE.md`             | Vision, outcomes, constraints, prioritized phases                |
| `docs/01_PRD.md`                          | Audience, requirements, user stories, acceptance criteria        |
| `docs/02_EXPERIENCE_AND_DESIGN.md`        | Art direction, interactions, chapter storyboard, responsive UI   |
| `docs/03_ARCHITECTURE.md`                 | System/component boundaries, 3D engine, data flow, types         |
| `docs/04_CONTENT_PROVENANCE.md`           | Historical accuracy, citations, media rights, editorial workflow |
| `docs/05_IMPLEMENTATION_PLAN.md`          | Milestones, dependencies, deliverables, stop/go gates            |
| `docs/06_AGENT_TASKS.md`                  | Executable task breakdown with completion evidence               |
| `docs/07_TEST_AND_ACCEPTANCE.md`          | Functional, visual, content, accessibility, performance QA       |
| `docs/08_AGENT_PLAYBOOK.md`               | Instructions and reusable prompts for Claude Code/Codex          |
| `docs/09_DEPLOYMENT_OPERATIONS.md`        | CI, deployment, monitoring, security, asset delivery             |
| `docs/10_RISKS_AND_DECISIONS.md`          | Architecture decision records, trade-offs, risks                 |
| `docs/11_CONTENT_MODEL_AND_API.md`        | Entities, TypeScript contracts, routing and state persistence    |
| `docs/12_ACCEPTANCE_DEMO_SCRIPT.md`       | Stakeholder demo walkthrough and signoff criteria                |
| `content/content.schema.json`             | Machine-readable MVP dataset JSON Schema                         |
| `content/example-content.json`            | Minimal clearly marked editorial/demo fixture                    |
| `TASKS.yaml`                              | Structured milestone/task queue for harnesses                    |
| `examples/ONE_SHOT_START_PROMPT.md`       | Ready-to-paste first agent instruction                           |
| `examples/IMPLEMENTATION_LOG.template.md` | Consistent handoff between agent sessions                        |

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

## 8. Implementation status (2026-11-13)

Milestones **M0**, **M1** and **M2** are implemented: a runnable research prototype, not a reviewed exhibit. See `IMPLEMENTATION_LOG.md` and `TASKS.yaml`.

```bash
pnpm install
pnpm exec playwright install chromium   # once, for e2e
pnpm dev                 # http://localhost:3000
pnpm validate:content    # content + rights audit (prototype mode)
pnpm audit:release       # same audit in release mode — currently FAILS by design (draft claims)
pnpm lint && pnpm typecheck && pnpm test
pnpm test:e2e            # builds, serves on :3100, runs desktop + mobile projects
pnpm build && pnpm start
node scripts/visual-inspect.mjs   # optional screenshot set; needs `pnpm start --port 3100`
```

- Routes: `/`, `/{en|id}/experience`, `/{en|id}/read`, `/{en|id}/sources`, `/{en|id}/about`.
- All visuals are original, procedural and labeled **"Illustrative geometry — not a surveyed reconstruction"**. `public/models/` is intentionally empty.
- Historical statements live only in `src/content/content.json` (derived from `content/example-content.json`), each with a source and a `draft` review status.
- Environment: none required. Optional `NEXT_PUBLIC_SITE_URL` (canonical URLs) and `RELEASE_CHANNEL=public` (enables indexing and makes the build fail on unreviewed content).

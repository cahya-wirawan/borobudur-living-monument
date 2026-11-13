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


## Agent workflow instructions

After implementing each visual feature, launch the development server and use Playwright MCP to inspect the rendered page at desktop and mobile resolutions.

Capture screenshots and check layout, navigation, interactions, and JavaScript errors. Verify that 3D scenes initialize correctly, and use visual inspection to identify rendering issues.

Use Context7 when working with unfamiliar or version-sensitive APIs.

Maintain automated Playwright tests for critical flows. Do not rely solely on MCP-driven manual testing.

Never claim a visual feature is complete without verifying it in a browser.

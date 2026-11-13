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

## Versioning and releases

Follow `docs/13_VERSIONING_AND_RELEASES.md`. Record user-visible changes under `## [Unreleased]` in `CHANGELOG.md` as you work. After every completed milestone, without being asked again: bump the version (`pnpm release:prepare minor "Milestone Mn: <name>"`), commit on `release/vX.Y.Z`, push, open a pull request to `main`, wait for CI to pass, squash-merge, then tag `vX.Y.Z` on `main` and push the tag. Never merge a failing pull request or force-push `main`.

## Agent workflow instructions

After implementing each visual feature, launch the development server and use Playwright MCP to inspect the rendered page at desktop and mobile resolutions.

Capture screenshots and check layout, navigation, interactions, and JavaScript errors. Verify that 3D scenes initialize correctly, and use visual inspection to identify rendering issues.

Use Context7 when working with unfamiliar or version-sensitive APIs.

Maintain automated Playwright tests for critical flows. Do not rely solely on MCP-driven manual testing.

Never claim a visual feature is complete without verifying it in a browser.

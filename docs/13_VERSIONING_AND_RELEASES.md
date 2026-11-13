# 13 — Versioning, Changelog and Release Workflow

## 1. Version scheme

The application version lives in `package.json` and follows Semantic Versioning (`MAJOR.MINOR.PATCH`).

| Change | Bump | Example |
| --- | --- | --- |
| A milestone from `docs/05_IMPLEMENTATION_PLAN.md` is completed | MINOR | M3 done: `0.3.0` → `0.4.0` |
| Fixes, copy or documentation between milestones | PATCH | `0.3.0` → `0.3.1` |
| First historically reviewed public release (M5 gates passed) | `1.0.0` | — |
| After 1.0.0: a shared URL, content ID or content schema breaks | MAJOR | `1.4.2` → `2.0.0` |
| After 1.0.0: new backward-compatible capability | MINOR | |
| After 1.0.0: backward-compatible fix | PATCH | |

Milestone map so far: M0 = `0.1.0`, M1 = `0.2.0`, M2 = `0.3.0`, M3 engineering = `0.4.0`. Planned: M4 = `0.5.0`, M5 = `1.0.0`.

When a milestone's engineering is finished but some tasks wait on people or owner decisions, release the engineering as the MINOR version, say so in the changelog heading, and add the remaining evidence later as PATCH releases.

Rules:

- Every `0.x` version is a research prototype. A version number is never evidence of editorial, rights or accessibility sign-off; `1.0.0` must not be cut while `pnpm audit:release` fails.
- The content pack has its own `schemaVersion` (`src/content/schema.ts`). It changes only when the content shape changes and always ships with a migration and a test.
- Git tags are `vMAJOR.MINOR.PATCH`, created on `main` after the release PR is merged.

## 2. Changelog

`CHANGELOG.md` follows Keep a Changelog. While working, add entries under `## [Unreleased]` using the headings `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`. Write for a reader who uses the product: say what changed for them, not which files moved. Do not list unreleased or unverified work as delivered.

## 3. Tooling

```bash
pnpm release:prepare <patch|minor|major> ["Milestone M3: Production Hardening"]
pnpm version:check
```

- `release:prepare` bumps `package.json`, moves the `Unreleased` entries under a dated version heading and updates the comparison links. It refuses to run when `Unreleased` is empty.
- `version:check` fails when `package.json` and the newest changelog version disagree, or when the changelog is malformed. CI runs it on every push and pull request.

## 4. Release workflow (after every completed milestone)

1. Confirm the milestone's tasks are `done` in `TASKS.yaml` with evidence, and that `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm test:e2e` pass locally.
2. `git checkout -b release/vX.Y.Z` from an up-to-date `main`.
3. Make sure `## [Unreleased]` describes the milestone, then run `pnpm release:prepare minor "Milestone Mn: <name>"`.
4. Commit: `release: vX.Y.Z — Milestone Mn`.
5. `git push -u origin release/vX.Y.Z` and open a pull request to `main` whose body is the new changelog section plus verification results and known blockers.
6. Wait for CI to pass. Do not merge a red pull request; fix forward on the branch.
7. Squash-merge the pull request and delete the branch.
8. Tag the merge commit on `main`: `git tag -a vX.Y.Z -m "vX.Y.Z — Milestone Mn"` and `git push origin vX.Y.Z`.

Patch releases use the same steps with `patch`. Never rewrite published tags or force-push `main`.

## 5. What a release is not

Merging and tagging records engineering progress. It does not deploy anything, does not make the site indexable (`RELEASE_CHANNEL=public` does, and it enforces the content audit), and does not replace the heritage, rights, accessibility and editorial gates in `docs/01_PRD.md` §9.

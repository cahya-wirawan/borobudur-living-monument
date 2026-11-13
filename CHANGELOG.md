# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog 1.1](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning 2.0](https://semver.org/spec/v2.0.0.html) as described in
`docs/13_VERSIONING_AND_RELEASES.md`.

Every version before 1.0.0 is a **research prototype**: visuals are illustrative,
historical statements are unreviewed drafts, and nothing is cleared for public
exhibition.

## [Unreleased]

### Changed

- `README.md` now describes the project, its requirements and how to use it. The original build instructions for coding agents moved to `docs/SPECIFICATION_KIT.md`.

## [0.3.0] - 2026-11-13 — Milestone M2: Three Pillars

### Added

- Time Machine: four eras selectable by buttons, previous/next and arrow keys, with the cited statement and the illustration labeled separately.
- Architecture: five source-backed features with a numbered list, 3D/diagram toggle and matching diagram callouts.
- Living Reliefs: two demonstration stories with a catalog, focusable hotspots on the 3D model and a modal detail view.
- Journey to Enlightenment: Up/Down steps and direct selection of the three realms, a zone diagram and a sourced recap.
- Sources page lists the statements each reference supports; Read mode mirrors eras, features, reliefs and realms.
- Content schema 1.1.0 with a `features` collection and an automatic upgrade for 1.0.0 packs.
- Deep-link parameter `feature=` (valid with `chapter=architecture`).
- Semantic versioning, this changelog, a release script and a version consistency check; the About page shows the running version.

### Fixed

- Returning from Read mode with the browser Back button no longer drops the selected era.
- Both story hotspots are now in frame in the Stories chapter.

## [0.2.0] - 2026-11-13 — Milestone M1: Vertical Slice

_Not tagged separately: delivered in the same initial commit as 0.1.0._

### Added

- Five-chapter experience with Guided, Explore and Read modes.
- Typed experience state with allow-listed deep links and browser history support.
- Procedural, clearly labeled illustrative 3D monument with a waypoint camera and a skippable opening glide.
- Still-diagram fallback with retry when WebGL is unavailable, plus loading and cancel states.
- Source drawer listing statements, references and media rights for the current view.
- Text-first Read mode that works without JavaScript.

## [0.1.0] - 2026-11-13 — Milestone M0: Foundation

_Not tagged separately: delivered in the same initial commit as 0.2.0._

### Added

- Next.js App Router scaffold with strict TypeScript, Tailwind and pnpm scripts.
- Design tokens, English and Indonesian routes and interface dictionaries.
- Validated content pack with claim, source and media-rights records, and a release audit that fails on unreviewed content.
- Vitest, Playwright and axe test foundations and a CI workflow.

[Unreleased]: https://github.com/cahya-wirawan/borobudur-living-monument/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/cahya-wirawan/borobudur-living-monument/releases/tag/v0.3.0

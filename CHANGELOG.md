# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog 1.1](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning 2.0](https://semver.org/spec/v2.0.0.html) as described in
`docs/13_VERSIONING_AND_RELEASES.md`.

Every version before 1.0.0 is a **research prototype**: visuals are illustrative,
historical statements are unreviewed drafts, and nothing is cleared for public
exhibition.

## [Unreleased]

## [0.6.0] - 2026-11-14 — Aerial flight with Google Maps (optional)

### Added

- Optional "Fly over the real site" view: a five-stop aerial flight drawn by Google Maps inside the stage, with previous, next, play and pause controls. It appears only when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set at build time, contacts Google only after the visitor agrees, and is labelled as third-party imagery. Not yet tested with a real key (ADR-025).

### Changed

- With a Google Maps key configured, the content security policy also allows Google's map hosts. Without a key it is unchanged.

## [0.5.0] - 2026-11-14 — Visual identity: dawn over the monument

### Changed

- New visual identity, "dawn over the monument": night-indigo and saffron palette, Marcellus and Source Sans 3 typefaces, rounded controls.
- The 3D scene has a procedural sky with sun, stars and a generic ridge line, cast shadows and three lights (night, dawn, day). The ascent brightens from zone to zone; the outline-only period card is shown at night.
- Landing page redrawn as a sunrise behind the monument silhouette.
- The still diagram and Read-mode figures use the same sky and shaded stone.
- Captions now state that sky, light and ridges are artistic and do not depict the real site.
- The low quality preset renders at up to 1.5× pixel density with antialiasing.

### Removed

- The duplicate "01 / 05" counter in the header.

## [0.4.2] - 2026-11-13 — Docker image and Compose file

### Added

- `Dockerfile` and `compose.yaml`: run the production build with `docker compose up --build`.
- `E2E_BASE_URL` runs the end-to-end tests against an already running instance.
- README section on running locally with Node.js or Docker.

## [0.4.1] - 2026-11-13 — MIT License and Vercel readiness

### Added

- MIT License for the code, documentation and original artwork.

### Changed

- Canonical and language links use the deployment's own address when hosted on Vercel.

## [0.4.0] - 2026-11-13 — Milestone M3: engineering hardening (device, screen-reader and hosting sign-offs pending)

### Added

- The 3D scene lowers its own quality when a device cannot keep up, and never switches 3D off by itself.
- A lost graphics context now falls back to the diagram with a working retry.
- Security headers on every response, including a same-origin content security policy.
- Automated checks for download-size budgets, security headers, privacy (no cookies or storage), page reflow at 320 px, and 20 screenshot baselines of the canvas-free rendering.
- Generated evidence ledger and asset rights register, with a check that they match the content.
- Performance report, accessibility audit, technical release report and deployment notes.
- `pnpm preview`, `pnpm registers:generate` and `.env.example`.

### Changed

- First-load JavaScript is 12–22 KB smaller: the content validation library no longer ships to browsers.

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

[Unreleased]: https://github.com/cahya-wirawan/borobudur-living-monument/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/cahya-wirawan/borobudur-living-monument/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/cahya-wirawan/borobudur-living-monument/compare/v0.4.2...v0.5.0
[0.4.2]: https://github.com/cahya-wirawan/borobudur-living-monument/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/cahya-wirawan/borobudur-living-monument/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/cahya-wirawan/borobudur-living-monument/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/cahya-wirawan/borobudur-living-monument/releases/tag/v0.3.0

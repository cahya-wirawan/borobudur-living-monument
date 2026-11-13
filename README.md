# Borobudur — The Living Monument

[![CI](https://github.com/cahya-wirawan/borobudur-living-monument/actions/workflows/ci.yml/badge.svg)](https://github.com/cahya-wirawan/borobudur-living-monument/actions/workflows/ci.yml)

An interactive, source-cited introduction to Borobudur, the 8th–9th-century Buddhist monument in Central Java, Indonesia. It runs in the browser in English and Indonesian and is built around three ideas:

- **Time Machine** — compare four period views of the monument.
- **Living Reliefs** — open relief stories from a catalog or from points on a 3D model.
- **Journey to Enlightenment** — ascend through the three symbolic realms: _Kamadhatu_, _Rupadhatu_ and _Arupadhatu_.

> **Research prototype.** This is not a reviewed exhibit. The current version is in [`CHANGELOG.md`](CHANGELOG.md).
>
> - The 3D monument and diagrams are **illustrative geometry — not a surveyed reconstruction**. They are drawn by code; no scans, photographs or measurements are used.
> - The relief stories are **demonstration artwork — not original panels**.
> - Historical statements come from one official source (UNESCO) and are **unreviewed drafts**. The Indonesian text has not been reviewed by a native editor.

## Features

- **Five chapters:** The Awakening, Across Centuries, Inside the Monument, Stories in Stone, The Ascent.
- **Three ways to view:** _Guided_ (camera moves for you), _Explore_ (orbit the model yourself), _Read_ (text and diagrams only).
- **Evidence labels everywhere:** each statement is marked _Documented fact_, _Scholarly inference_ or _Artistic illustration_, with its review status and a link to its source.
- **Works without 3D:** if WebGL is unavailable the same content is shown with a still diagram. Read mode works without JavaScript.
- **Accessible by design:** keyboard operable, screen-reader labels, reduced-motion support, no audio, no hover-only controls. Targets WCAG 2.2 AA.
- **Shareable links:** the address bar always reflects the current chapter and selection, and Back/Forward work.
- **No external services:** no accounts, API keys, analytics or third-party media. Fonts are self-hosted.

## Requirements

- [Node.js](https://nodejs.org/) 20.9 or newer (CI uses Node 22)
- [pnpm](https://pnpm.io/) 10 (`corepack enable` will provide it)
- For the 3D scene: a browser with WebGL. Without it the app falls back to diagrams.
- For end-to-end tests only: Playwright's Chromium (`pnpm exec playwright install chromium`)

No environment variables or credentials are needed.

## Quick start

```bash
git clone https://github.com/cahya-wirawan/borobudur-living-monument.git
cd borobudur-living-monument
corepack enable
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

For a production build:

```bash
pnpm build
pnpm start
```

## Using the app

| Address          | What it is                                                       |
| ---------------- | ---------------------------------------------------------------- |
| `/`              | Landing page with both languages                                 |
| `/en/experience` | The interactive experience (`/id/experience` for Indonesian)     |
| `/en/read`       | The full story as text with diagrams and citations               |
| `/en/sources`    | References, every statement with its evidence, and media rights  |
| `/en/about`      | How the visuals were made, their limits, credits and the version |

In the experience:

- **Begin the journey** loads the 3D scene and plays a short opening glide, which you can skip. **Explore freely** lets you drag to orbit and scroll or pinch to zoom. **Read instead** opens the text version.
- **Back / Next** and the numbered chapter bar move between chapters.
- **Across Centuries:** pick an era with the buttons, the arrow buttons, or the left/right arrow keys.
- **Inside the Monument:** select a numbered feature to highlight it, and switch between the 3D model and a diagram.
- **Stories in Stone:** open a story from the list or from a "Story" button on the model. Escape closes it.
- **The Ascent:** step Up or Down, or jump straight to a realm.
- **Sources and evidence** lists what the current view claims and where it comes from.

### Deep links

```
/{en|id}/experience?chapter=&era=&realm=&feature=&relief=&mode=
```

| Parameter | Values                                                                           |
| --------- | -------------------------------------------------------------------------------- |
| `chapter` | `awakening`, `centuries`, `architecture`, `stories`, `ascent`                    |
| `era`     | `construction`, `nineteenth-century`, `restoration`, `present`                   |
| `realm`   | `kamadhatu`, `rupadhatu`, `arupadhatu`                                           |
| `feature` | `base`, `square-terraces`, `circular-platforms`, `openwork-stupas`, `main-stupa` |
| `relief`  | `demo-panel-01`, `demo-panel-02`                                                 |
| `mode`    | `guided`, `explore`, `read` (`read` redirects to the Read page)                  |

Unknown values are ignored and fall back to safe defaults. Example: `/en/experience?chapter=ascent&realm=rupadhatu`.

## Commands

| Command                     | What it does                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `pnpm dev`                  | Development server on port 3000                                                      |
| `pnpm build` / `pnpm start` | Production build and server (the build runs the content audit first)                 |
| `pnpm lint`                 | ESLint                                                                               |
| `pnpm typecheck`            | TypeScript, strict mode                                                              |
| `pnpm test`                 | Unit and component tests (Vitest)                                                    |
| `pnpm test:e2e`             | End-to-end tests (Playwright, desktop and mobile); builds and serves on port 3100    |
| `pnpm format`               | Format with Prettier (`pnpm format:check` to verify only)                            |
| `pnpm validate:content`     | Content and rights audit in prototype mode                                           |
| `pnpm audit:release`        | The same audit in release mode. **Currently fails by design**: claims are unreviewed |
| `pnpm version:check`        | Checks that `package.json` and `CHANGELOG.md` agree                                  |
| `pnpm preview`              | Production build followed by a local server on port 3000                             |
| `pnpm registers:generate`   | Regenerates the evidence ledger and rights register (`--check` to verify only)       |
| `pnpm release:prepare`      | Bumps the version and cuts the changelog (see [Releases](#versioning-and-releases))  |

`node scripts/visual-inspect.mjs` captures a screenshot set at desktop and mobile sizes for manual review. It needs `pnpm start --port 3100` running.

## Configuration

Both variables are optional.

| Variable               | Purpose                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Base URL for canonical and language-alternate links. Defaults to `http://localhost:3000`.                 |
| `RELEASE_CHANNEL`      | Set to `public` to allow search indexing. This also makes the build fail while any content is unreviewed. |

Without `RELEASE_CHANNEL=public`, every page asks search engines not to index it.

## Security and privacy

The app sets no cookies, uses no browser storage, loads nothing from other sites and has no analytics. Every response carries security headers including a same-origin content security policy. Deployment notes are in [`docs/09_DEPLOYMENT_OPERATIONS.md`](docs/09_DEPLOYMENT_OPERATIONS.md).

## Content and provenance

All historical statements live in one file, [`src/content/content.json`](src/content/content.json). Components never hardcode facts.

- Each **claim** has text in both languages, an evidence status, a review status and at least one **source**.
- Each **media** record names its creator, license and rights status.
- The audit (`pnpm validate:content`) rejects broken references, documented claims without a source, non-HTTPS links, embedded markup and missing translations.
- In release mode it also rejects unreviewed claims and third-party media without cleared rights.

To change what the app says, edit that file and run `pnpm validate:content`. Do not mark a claim `reviewed` unless a qualified person has reviewed it. See [`docs/04_CONTENT_PROVENANCE.md`](docs/04_CONTENT_PROVENANCE.md).

## Project structure

```
src/
  app/            routes: landing, and /[locale]/experience, read, sources, about
  components/     shell (layout, navigation, scene stage, source drawer) and ui
  features/       experience state and URLs, time-machine, architecture, reliefs, ascent, read
  scene/          procedural 3D model, camera waypoints, WebGL canvas
  content/        content pack, schema, validation, migration
  i18n/           English and Indonesian interface text
  lib/            device capability checks, metadata, telemetry (no-op)
e2e/              Playwright tests
scripts/          content audit, release tooling, visual inspection
docs/             product, design, architecture, provenance, test and release documents
content/          original JSON Schema and example fixture from the specification
```

Built with Next.js (App Router), React, TypeScript, Tailwind CSS, three.js with React Three Fiber and drei, GSAP and Zod.

## Project status

| Milestone | Scope                                                       | Status                                                                          |
| --------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| M0        | Foundation                                                  | Done (v0.1.0)                                                                   |
| M1        | Vertical slice: five chapters, 3D placeholder, Read mode    | Done (v0.2.0)                                                                   |
| M2        | Three pillars: eras, architecture, reliefs, ascent, sources | Done (v0.3.0)                                                                   |
| M3        | Hardening: performance, accessibility audit, deployment     | Engineering done (v0.4.0); device tests, screen-reader test and hosting pending |
| M4        | Licensed 3D model and authentic relief stories              | Needs partners                                                                  |
| M5        | Reviewed public release (v1.0.0)                            | Needs review                                                                    |

Before any public release, these are still open:

- Human review of every historical statement and of the Indonesian text.
- A designated contact for corrections.
- Testing on real phones, in Firefox and Safari, and with screen readers; performance measurements.
- The drawing spreads the 72 small stupas 32/24/16 across the three rings. That split has not been checked against a source.

Reports for the current version: [release report](docs/release-report-v0.4.0.md), [performance](docs/performance-report.md), [accessibility](docs/accessibility-audit.md), [evidence ledger](docs/evidence-ledger.csv), [asset rights](docs/asset-rights-register.md).

Task-level detail is in [`TASKS.yaml`](TASKS.yaml), session notes in [`IMPLEMENTATION_LOG.md`](IMPLEMENTATION_LOG.md), and decisions in [`docs/10_RISKS_AND_DECISIONS.md`](docs/10_RISKS_AND_DECISIONS.md).

## Versioning and releases

The project uses [Semantic Versioning](https://semver.org/). Each completed milestone is a minor version; `1.0.0` is reserved for the reviewed public release. Changes are recorded in [`CHANGELOG.md`](CHANGELOG.md), and the workflow is described in [`docs/13_VERSIONING_AND_RELEASES.md`](docs/13_VERSIONING_AND_RELEASES.md).

## Documentation

| Document                                                               | Contents                                             |
| ---------------------------------------------------------------------- | ---------------------------------------------------- |
| [`docs/00_VISION_AND_SCOPE.md`](docs/00_VISION_AND_SCOPE.md)           | Vision, outcomes and constraints                     |
| [`docs/01_PRD.md`](docs/01_PRD.md)                                     | Product requirements and acceptance criteria         |
| [`docs/02_EXPERIENCE_AND_DESIGN.md`](docs/02_EXPERIENCE_AND_DESIGN.md) | Storyboard, visual design and interaction rules      |
| [`docs/03_ARCHITECTURE.md`](docs/03_ARCHITECTURE.md)                   | Technical architecture                               |
| [`docs/04_CONTENT_PROVENANCE.md`](docs/04_CONTENT_PROVENANCE.md)       | Historical accuracy, citations and media rights      |
| [`docs/05_IMPLEMENTATION_PLAN.md`](docs/05_IMPLEMENTATION_PLAN.md)     | Milestones and gates                                 |
| [`docs/07_TEST_AND_ACCEPTANCE.md`](docs/07_TEST_AND_ACCEPTANCE.md)     | Test plan and release checklist                      |
| [`docs/09_DEPLOYMENT_OPERATIONS.md`](docs/09_DEPLOYMENT_OPERATIONS.md) | Deployment and operations                            |
| [`docs/11_CONTENT_MODEL_AND_API.md`](docs/11_CONTENT_MODEL_AND_API.md) | Content model and URL contract                       |
| [`docs/SPECIFICATION_KIT.md`](docs/SPECIFICATION_KIT.md)               | The original hand-off instructions for coding agents |

Contributors and coding agents should start with [`AGENTS.md`](AGENTS.md).

## License and rights

- **Code and original artwork:** no license has been chosen yet. Until one is added, all rights are reserved by the project owner.
- **Typefaces:** Instrument Serif and Inter, bundled under the SIL Open Font License 1.1.
- **Third-party media:** none is included. Images, scans or recordings of Borobudur must not be added without documented reuse rights; a public URL is not a license.

## References

- UNESCO World Heritage Centre, [Borobudur Temple Compounds](https://whc.unesco.org/en/list/592/) — the source for every historical statement in the app.
- W3C, [Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/).

These references are research context. They do not grant permission to copy photographs, video, text or 3D scans.

# Technical Release Report — v0.4.0 (M3 engineering hardening)

**Release type:** research prototype. Not deployed, not indexable, not a reviewed exhibit.
**Date:** 2026-11-13

## 1. Verdict

The engineering work for the MVP is complete and verified by automated tests. The release is **not** ready for the public: three M3 tasks need people or an owner decision, and the heritage, rights-contact, accessibility and editorial gates in `docs/01_PRD.md` §9 are open.

## 2. P0 requirements

| ID | Requirement | State | Evidence |
| --- | --- | --- | --- |
| PR-01 | Five-chapter narrative | Implemented | `e2e/journey.spec.ts`, `e2e/navigation.spec.ts` |
| PR-02 | Guided / Explore / Read | Implemented | `e2e/journey.spec.ts`, `e2e/m2.spec.ts` (mode continuity) |
| PR-03 | Cinematic opening with skip | Implemented | skip and self-ending intro tests; reduced-motion test |
| PR-04 | Interactive monument, marked illustrative | Implemented with procedural geometry | persistent label asserted in every chapter |
| PR-05 | Era timeline, four states | Implemented | `e2e/m2.spec.ts` M2-T01 |
| PR-06 | Relief panels | Implemented with demonstration entries only | `e2e/m2.spec.ts` M2-T03 |
| PR-07 | Three-realm ascent | Implemented | `e2e/m2.spec.ts` M2-T04; zone mapping unit test |
| PR-08 | Claims cite sources; media have rights status | Implemented | content audit; `docs/evidence-ledger.csv` |
| PR-09 | English and Indonesian | Implemented; Indonesian wording unreviewed | parity tests |
| PR-10 | Responsive, low-bandwidth, no-WebGL | Implemented | fallback, slow-network, reflow and budget tests |
| PR-11 | Accessible controls | Automated checks pass; manual screen-reader pass missing | `docs/accessibility-audit.md` |
| PR-12 | Recovery and error handling | Implemented | WebGL blocked, context lost, loading cancelled |
| PR-13 | Source library and legal notices | Implemented; correction contact not designated | Sources and About pages |

P1 and P2 items (audio narration, measured model, relief animation, quiz, lesson plan) are out of scope and not started.

## 3. Release checklist (`docs/07_TEST_AND_ACCEPTANCE.md` §8)

| Item | State |
| --- | --- |
| All P0 flows implemented | Yes |
| Build, lint, typecheck, unit and e2e tests green | Yes (results below) |
| No critical accessibility blockers; manual screen-reader test documented | **Partly.** No automated violations; manual test not performed |
| Static/read mode and WebGL fallback complete | Yes |
| EN/ID parity and editorial review state accurate | Parity yes; every claim honestly marked `draft` |
| All embedded media owned or licensed, attribution displayed | Yes: four original illustrations, two OFL typefaces, no third-party media |
| Every historical claim sourced; reviewer flags accurate | Sourced yes; **no claim has been reviewed** |
| No placeholder implied to be accurate heritage geometry | Yes: labels asserted by tests |
| Performance budgets checked with actual measurements | **Partly.** Byte budgets and lab LCP measured; no real-device frame rates |
| Deployed preview tested and rollback path documented | **No deployment.** Rollback documented in `docs/09` §9 |

## 4. Verification results

| Command | Result |
| --- | --- |
| `pnpm version:check` | OK |
| `pnpm validate:content` | 0 errors, 8 release blockers (all claims `draft`) |
| `pnpm registers:generate --check` | up to date |
| `pnpm lint`, `pnpm typecheck`, `pnpm format:check` | clean |
| `pnpm test` | 95 passed |
| `pnpm build` | success |
| `pnpm test:e2e` | 124 passed, 14 skipped by design (desktop-only checks on the mobile profile) |
| `pnpm audit:release` | fails, as intended, until claims are reviewed |

## 5. Open items before any public release

| Item | Needs |
| --- | --- |
| Review of all 8 historical claims against the cited UNESCO page | Heritage reviewer |
| Review of Indonesian copy | Native editor |
| Confirm or correct the 32/24/16 small-stupa distribution in the drawing | Heritage reviewer |
| Designate a correction contact | Owner |
| Choose a license for the code and original artwork | Owner |
| Real-device performance measurements | Person with devices (`docs/performance-report.md` §7) |
| Screen-reader and Firefox/Safari testing | Accessibility tester (`docs/accessibility-audit.md` §5) |
| Host, domain and a tested preview deployment | Owner |
| Replace demonstration reliefs and the illustrative model with licensed, identified material | Partners (M4) |

## 6. Registers

- Evidence ledger: `docs/evidence-ledger.csv`
- Asset rights register: `docs/asset-rights-register.md`
- Performance: `docs/performance-report.md`
- Accessibility: `docs/accessibility-audit.md`
- Decisions and risks: `docs/10_RISKS_AND_DECISIONS.md`

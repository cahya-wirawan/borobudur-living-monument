# Accessibility Audit — v0.4.0

**Target:** WCAG 2.2 level AA.
**Status:** automated and scripted keyboard checks pass. **No manual screen-reader pass has been performed.** Task `M3-T02` stays blocked on that evidence. This document does not claim conformance.

## 1. Automated coverage

All checks run against the production build in Chromium at 1440×900 and 390×844 (`pnpm test:e2e`), plus component checks in jsdom (`pnpm test`).

| Check | Where | Result |
| --- | --- | --- |
| axe-core, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice` on `/`, Read (EN, ID), Sources, About | `e2e/accessibility.spec.ts` | 0 violations |
| axe-core on the idle hero and on every chapter with the 3D scene running | same | 0 violations |
| axe-core on the open source drawer and the open relief dialog | same, `e2e/m2.spec.ts` | 0 violations |
| axe-core on component markup (navigation, architecture list, Read mode in both languages) | `src/components/shell/components.test.tsx` | 0 violations |
| Colour contrast (part of axe, measured after entrance fades) | e2e | 0 violations |
| Exactly one `h1` on every page | e2e | pass |

Issues found by these checks during development and fixed: Back/Next accessible names did not contain their visible text (2.5.3); the prototype banner sat outside any landmark; a sticky chapter bar covered controls so their unobscured target was under 24 px (2.5.8).

## 2. Scripted behaviour checks

| WCAG topic | What is tested | Result |
| --- | --- | --- |
| 2.1.1 Keyboard | Whole journey by keyboard: skip link, Next ×4, chapter rail, eras (Enter and arrow keys), features, realms (Up/Down), relief stories from list and from 3D hotspots | pass |
| 2.1.2 No keyboard trap | Tab stays inside open dialogs; Escape closes; previous/next do not trap | pass |
| 2.4.1 Bypass blocks | "Skip to content" is first in tab order, becomes visible on focus, moves focus to main | pass |
| 2.4.3 / 3.2.x Focus | Focus returns to the opening control after a dialog closes; after a deep-linked dialog closes focus lands on the story list | pass |
| 2.4.7 Focus visible | Focus ring style present on interactive elements | pass (style check); visual confirmation in screenshots |
| 2.5.8 Target size | Buttons and chapter links at least 44 px high (project aim; AA minimum is 24 px) | pass |
| 1.4.10 Reflow | No horizontal scrolling at 320, 360 and 390 px wide on all routes | pass |
| 2.3.3 / 2.2.2 Motion | With `prefers-reduced-motion`: no intro, instant camera cuts, CSS animations effectively off | pass |
| 1.4.2 Audio control | No audio or video elements exist | pass |
| 1.1.1 Non-text content | Canvas has a text alternative; every statement, selection and control exists as HTML outside the canvas; diagrams have titles and descriptions | pass |
| 1.4.1 Use of colour | Evidence labels pair a distinct shape with text; selected states use `aria-pressed` and a border, not colour alone | pass (markup); needs human visual check |
| 4.1.3 Status messages | Chapter, era, realm, feature and story changes are announced through polite live regions | pass (text asserted); **announcement behaviour not verified in a screen reader** |
| 3.1.1 / 3.1.2 Language | `lang` is `en` or `id` per route; the language switch link carries `lang` and `hreflang` | pass |
| Robustness without scripts or WebGL | Read mode with JavaScript disabled; full journey with WebGL blocked | pass |

## 3. Language parity

- Interface dictionary: identical keys and placeholders in English and Indonesian, no empty strings (unit test).
- Content pack: every text field requires both languages; a missing or blank translation fails the build.
- Sources and About render the same number of records in both languages (e2e).
- **The Indonesian wording itself has not been reviewed by a native editor.**

## 4. Known gaps and risks

| Gap | Why it matters | Owner action |
| --- | --- | --- |
| No screen-reader testing (NVDA, JAWS, VoiceOver, TalkBack) | Live-region timing, dialog announcements, the reading order around the scene and SVG descriptions can only be judged by listening | Run the script in section 5 |
| Only Chromium tested | Firefox and Safari differ in `<dialog>` focus handling and WebGL | Repeat keyboard and dialog checks there |
| No testing by people with disabilities | Automated tools find a minority of real barriers | Plan before any public release |
| Forced-colours / high-contrast modes not checked | SVG fills use CSS variables that may be overridden | Check in Windows high contrast |
| 200% text-only zoom and custom text spacing (1.4.4, 1.4.12) not scripted | Reflow at 320 px is tested, text spacing is not | Manual check |
| Explore mode camera is pointer-only | All content it shows is available elsewhere, so no information is lost, but the free camera itself has no keyboard equivalent | Decide whether keyboard orbit is wanted |

## 5. Manual screen-reader script (NOT YET PERFORMED)

Fill one column per screen reader and browser.

| Step | Expected | Result |
| --- | --- | --- |
| Load `/en/experience` | Page title and "Research prototype" notice are announced; one `h1` "The Awakening" | |
| Navigate by landmarks | Banner note, header, main, chapter navigation are reachable and named | |
| Activate "Begin the journey" | Loading is announced once; focus is not lost | |
| Activate "Next" | "Chapter 2 of 5: Across Centuries" is announced once | |
| Choose each era | "Era: …" is announced; the statement and picture labels are read in a sensible order | |
| Chapter 3: select a feature | "Highlighted: …" is announced; the description and source link follow | |
| Chapter 4: open story 1 | Dialog title is announced; the demo notices are read; content behind is not reachable | |
| Press Escape | Focus returns to "Open story 1" | |
| Chapter 5: Up, Up, Down | "Realm: …" announced each time; recap list is readable with its links | |
| Open "Sources and evidence" | Dialog announced; each statement, its label, status and link are read | |
| Switch to Bahasa Indonesia | Page language changes; the synthesizer switches voice where supported | |
| Open `/en/read` | Headings form a logical outline; figures have useful descriptions | |
| Scene description | The canvas is announced as an image with a short description, not as many objects | |

Tester, date, screen reader and version, browser and version, findings:

_None recorded yet._

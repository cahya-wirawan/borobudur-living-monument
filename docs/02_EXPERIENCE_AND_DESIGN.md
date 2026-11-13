# 02 — Experience Architecture, Storyboard, Visual Design

## 1. Experience design thesis
Cinematic storytelling should function like an interactive documentary: the visitor remains in control, every scene teaches a point, and visual claims distinguish evidence from interpretation. Target a rich but focused journey of ~6–10 minutes, or self-guided exploration of any length.

## 2. Visual identity and design tokens

| Token | Hex / approach | Use |
| --- | --- | --- |
| `--color-ink` | `#171B1B` | main dark canvas |
| `--color-basalt` | `#303732` | panels / secondary dark |
| `--color-stone` | `#A6A195` | tertiary type / wireframe |
| `--color-bronze` | `#C4A57B` | CTA, active indicators, diagram lines |
| `--color-parchment` | `#E9DCC7` | warm light surfaces |
| `--color-paper` | `#F4F0E7` | reading page background |
| `--color-white` | `#F9F7F1` | primary type on dark |

Use generous whitespace, a narrow editorial reading measure (60–75 characters), restrained gradients, 1px golden architectural lines, and soft shadows. Aim for AA text contrast. Typography: source a licensed display serif (e.g., Instrument Serif if its current license permits) and a geometric sans (e.g., Inter); create resilient system fallbacks.

## 3. Five-chapter interactive storyboard

### Chapter 1 — The Awakening (`awakening`)
**Learning goal:** Recognize the form/location and understand this is a documented monument with interpretive visuals.

**Visual:** Full-bleed atmospheric landscape inspired by Java; mist/volumetric effects optional. Monument silhouette emerges as fine bronze contour lines. Camera glides from distant 3/4 aerial to elevated front oblique.

**Interaction:** `Begin the journey` / `Explore freely` / `Read instead`. A visible `Skip introduction` control and no automatic audio. Scene captions identify any synthetic/illustrative setting.

**Motion cues:** 0–1.5s text reveal; ≤4s optional cinematic transition, immediately skippable; reduced motion cuts directly to stable still.

**Completion:** Buttons work on touch/keyboard; scene scales; preloader never prevents content access.

### Chapter 2 — Across Centuries (`centuries`)
**Learning goal:** Distinguish period evidence from modern reconstruction.

**Visual:** Fixed camera framing allows period-state comparison. Large label and mini historiography rail. Four period cards; bronze line draws through dates *as navigation*, not continuous evidence.

**Interaction:** Range-like era control with explicit buttons/ticks; arrows; textual summary plus `documented`/`inferred`/`artistic` badge. Change in layered vegetation, condition, drawn lines, construction blocks; stable camera keeps it legible.

**Motion:** Camera does not arbitrarily jump between timeline states; use crossfade, thresholded opacity, and schematic block placement. Morphing is conceptual—not depiction of the literal historical process.

**Completion:** Era change updates overlay, URL, source list and fallback; each state works without 3D.

### Chapter 3 — Inside the Monument (`architecture`)
**Learning goal:** Identify five square terraces, three circular platforms, main stupa, and 72 openwork stupas.

**Visual:** Camera eases to axonometric overhead; thin diagram strokes trace terraces, then an optional exploded schematic (not an archaeological measurement).

**Interaction:** Toggle `3D / Diagram`; click architectural feature labels; direct height/level selector. Return to narrative without losing chapter.

**Completion:** At least 3 architecture hotspots with source-backed description; diagram operable via buttons.

### Chapter 4 — Stories in Stone (`stories`)
**Learning goal:** Learn how a relief can convey narrative and how curators identify and interpret panels.

**Visual:** A stone-texture panel transitions into carefully authored illustration. Keep a persistent `Original / Interpretation` compare handle *only when original source exists and rights clear*. MVP uses illustrative demonstration artwork with banner.

**Interaction:** Tap/highlight gallery hotspot or catalog card -> overlay/detail panel. `Read transcript`, `Read sources`, `Return to gallery`. Modal handles Escape and restores focus.

**Motion:** Light catches grooves; optional strokes animate along illustrated contours. Do not anthropomorphize unverified reliefs or invent inscriptions. Narration opt-in in P1.

**Completion:** One fully working demo story with source panel and correct disclaimers; enhanced release replaces it with curated identified panel(s).

### Chapter 5 — The Ascent (`ascent`)
**Learning goal:** Map the three realms to temple's architectural zones and understand the UNESCO interpretation.

**Visual:** Spatial ascent from base to square galleries to circular platforms and central stupa. Scene palette becomes lighter and composition opens; do not imply literally attaining enlightenment via site interaction.

**Interaction:** Three selectable realm markers with a brief interpretive description, floor diagram, and citation. Scroll or next/back progresses; `Jump to realm` supported; final recap shows learned facts and references.

**Motion:** Camera vertical spline with gentle easing. Distinct pause and readable section; no high-speed spiral or forced vestibular animation.

**Completion:** All three realms reached with keyboard and text mode; names correctly placed; recap functional.

## 4. Global UI structure

**Desktop (>= 1024 px)**
```
┌────────────────────────────────────────────────────────────────┐
│ Wordmark        01 / 05             Language   Mode  Sound Off │
│                                                                │
│ 3D / art canvas                 Chapter title + learning text  │
│                                Evidence / interpretation tag │
│                                                                │
│ Chapters rail ────────────────────────────── Next / Back       │
│ Sources drawer / model disclaimer / accessibility controls    │
└────────────────────────────────────────────────────────────────┘
```

**Mobile (< 768 px):** top header, constrained scene viewport, title + body *below or over a stable contrasting panel*, bottom navigation controls, compact source accordion. Disable heavy full-screen scroll capture; tap-friendly chapter steps take precedence. Keep controls above browser safe-area inset.

**Read mode:** semantic `<main>` with headings, diagrams as accessible SVG plus descriptive captions, citations and source list. No canvas required.

## 5. Design interactions
- **Camera:** Guided uses canonical camera waypoints; Explore allows orbit/pan/zoom within safe bounds; returning to Guided restores previous chapter waypoint.
- **Progress:** 5 labeled steps with `aria-current="step"`. `Next` and `Back` always work; browser back restores URL state.
- **Information panel:** shows max 120 words per primary scroll segment with `More context` for extended analysis.
- **Evidence legend:** `Documented fact`, `Scholarly inference`, `Artistic illustration`; always visible near relevant visual, explained in a global legend.
- **Sources:** click to open panel listing title, author/institution, date, external URL, `accessedAt`, confidence and what claim it supports.
- **Hotspots:** pointer target >= 24 CSS px minimum per WCAG 2.2; aim >= 44 CSS px for touch when feasible. Keyboard-reachable duplicate list outside canvas.
- **Feedback:** state changes acknowledged in accessible live region; do not continuously narrate scroll progress.
- **Audio:** off by default, localizable captions/transcripts, explicit play. Background ambiences are optional and can be disabled.

## 6. Motion grammar
- Scroll progress drives a pure `chapterProgress` value; use GSAP to interpolate camera and scene transformations.
- Preferred timing: 600–1400 ms transitions, max 4 s for optional cinematic intro, long holds for reading.
- Easing: `power2.inOut` / `sine.inOut`; no elastic bounces on monument.
- Lenis optional; turn off for touch or when `prefers-reduced-motion` true. Keep native scrolling as valid mode.
- Disabled motion path: no parallax, no smooth scroll hijacking, no animation in view change, static accessible diagram.

## 7. Layout and localization constraints
- Explicit EN + ID copy; cross-check terminology and glossary. Allow 30–50% text expansion and responsive wrapping.
- Prefer icon + text labels, never color-only meaning or symbols without a legend.
- Videos have caption and transcript; if unavailable, omit videos from MVP.
- All interaction affordances visible on first use; no hidden knowledge of 3D gestures.

## 8. Art direction acceptance screenshots
Screenshots to capture in both desktop (1440×900) and mobile (390×844): hero, timeline at 2 endpoints, relief detail open, realm base, realm top, Read mode, reduced-motion mode, no-WebGL fallback. Human reviewer checks composition and typography against mock references, avoiding mockups presented as achieved implementation.

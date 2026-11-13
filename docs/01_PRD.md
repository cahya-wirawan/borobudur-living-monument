# 01 — Product Requirements Document (PRD)

**Product:** BOROBUDUR — The Living Monument  
**Owner:** Project team  
**Status:** Approved planning baseline for coding agents; content/publication reviews pending  
**MVP target:** M0–M3 in `docs/05_IMPLEMENTATION_PLAN.md`

## 1. Product summary
A responsive, immersive educational experience about Borobudur Temple, combining: **Time Machine** (era transformations), **Living Reliefs** (storytelling based on identifiable panels), and **Journey to Enlightenment** (guided ascent through three symbolic realms). Guided mode is cinematic; Explore mode is visitor-controlled; Read mode is fully accessible and SEO-friendly.

## 2. Personas and jobs to be done
- **Curious international visitor (desktop):** Wants emotionally memorable introduction and interpretable historical context within 5–10 minutes.
- **Indonesian student/teacher (phone):** Wants clear language, short segments, navigable diagrams and accurate terminology; low bandwidth.
- **Heritage enthusiast:** Wants references, provenance, comparison of evidence versus conjecture and high-detail inspect controls.
- **Visitor with access needs:** Wants the full learning narrative with keyboard, screen reader, reduced motion, or no WebGL.

## 3. User journeys
- **Guided:** Landing -> Start journey -> chapter 1 intro -> era timeline -> architecture -> relief detail -> ascent -> recap/sources.
- **Explore:** Landing -> Explore -> aerial model -> select hotspot / realm / era -> source drawer -> resume chapter.
- **Read:** Landing -> Read the story -> jump to any section -> diagrams and curated stills + citations -> quiz/recap optional later.

## 4. Information architecture
```
/                         landing, entry choices, 1-line disclaimer
/en/experience            interactive experience default EN
/id/experience            localized experience ID
/{locale}/read            complete editorial narrative and citations
/{locale}/sources         research references and media acknowledgements
/{locale}/about           project, reconstruction method, acknowledgements
```
Deep links via query params, e.g. `/en/experience?chapter=stories&relief=demo-panel-01`; validate allow-listed IDs. History navigation must restore the same view.

## 5. Functional requirements (P0 = must for MVP)

| ID | Priority | Requirement | Acceptance criterion |
| --- | --- | --- | --- |
| PR-01 | P0 | Five-chapter narrative: Awakening, Across Centuries, Inside Monument, Stories in Stone, The Ascent | Each opens directly, has header, progress, narrative, next/back, non-WebGL alternate |
| PR-02 | P0 | Guided / Explore / Read modes | Any mode accessible in 2 actions; switching retains chapter when possible |
| PR-03 | P0 | Cinematic landing and opening reveal | Includes skip button; must not block interaction > 1 second for reduced motion |
| PR-04 | P0 | Interactive monument visualization | Drag/orbit on Explore, discrete controlled camera waypoints Guided; clearly marked illustrative model |
| PR-05 | P0 | Era Timeline | Change 4 named states with visual transformations, text/source metadata and evidence badges |
| PR-06 | P0 | Living Relief panels | Select at least 1 demo panel, open detail with source, text transcript, close/return focus |
| PR-07 | P0 | Three-realm ascent | Traverse Kamadhatu -> Rupadhatu -> Arupadhatu in guided or direct selection, with explanatory content |
| PR-08 | P0 | Cite facts and media provenance | Historical claims link to source record; media have rights status; incomplete assets cannot be published as authentic |
| PR-09 | P0 | Languages | Switch EN/ID; correct routing, equivalent information; locale preserved in deep links |
| PR-10 | P0 | Responsive / low-bandwidth | Text or illustrated fallback works without WebGL; mobile touch controls; lazy-load heavy assets |
| PR-11 | P0 | Accessible controls | WCAG 2.2 AA target; keyboard, reduced motion, captions/transcripts, focus management |
| PR-12 | P0 | Recovery and error handling | WebGL fail/timeout shows content + retry/read mode; no hard crash |
| PR-13 | P0 | Source library & legal notices | Display provenance, license/creator for published media, interpretive legend and correction contact |
| PR-14 | P1 | Audio narration | Opt-in, replay, speed/volume, transcript; only after rights-cleared recording exists |
| PR-15 | P1 | Real detailed monument model and quality levels | Geometry, LODs, texture compression, media cleared and curated |
| PR-16 | P1 | Relief character interpretation animation | Artistic animation explicitly labeled, source-linked and reviewed |
| PR-17 | P2 | Optional quiz/learning reflection | Answer 3–5 sourced questions; no tracking required |
| PR-18 | P2 | Teacher lesson plan | Printable materials after editorial validation |

### PR-05 specific rules — historical timeline
Named scene states:
1. **8th–9th-century construction — hypothetical visualization.** Simplified schematic build animation; no invented identifiable people, attire, transport processes, or exact chronology.
2. **19th-century documentation / renewed scholarly attention.** Use defensible broad period wording until curator supplies verified photographs and dates. Visual treatments are illustrative unless dated source photography is cleared.
3. **20th-century conservation and restoration.** Interpretive wireframe comparison; link UNESCO description of 1970s efforts, avoid claiming exact per-stone restoration geometry without data.
4. **Present-day monument.** Use a stylized architectural model until validated as geometrically accurate. Present-day facts and visual depiction are separately labeled.

Visitors can scrub between states, but mixed or intermediate morph states are **visual transitions**, not historical dates. Timeline must never imply a continuous photographic record.

### PR-06 specific rules — reliefs
- 1–2 sample relief entries permitted for MVP but visibly tagged **demonstration content**, not a depiction of a specific documented carved panel unless authenticated imagery and panel IDs are available.
- Detail view: title, where located (if verified), educational summary, why it matters, panel image/illustration, claim sources, certainty/rights status, close and previous/next.
- Future animation layered above photo is an artistic interpretation; if original art cannot be licensed, use newly authored line-art as a placeholder.
- Clicking from 3D or text/diagram must open same record. No hover-only navigation.

### PR-07 specific rules — symbolic ascent
- Base -> five square terraces -> three circular terraces plus central stupa; distinguish actual geometry from symbolic interpretation.
- Clearly present `Kamadhatu`, `Rupadhatu`, `Arupadhatu`, their locations, and meaning per UNESCO.
- Provide chapter transitions, optional direct jump to any realm, text parallel, and backtracking.
- Do not imply an actual physically accessible route or a particular historical pilgrim walking route unless sourced.

## 6. Non-functional requirements
- **Performance:** Target mobile p75 LCP <= 2.5 s for static landing at representative simulated 4G, and a usable initial static scene without waiting for 3D; see test plan for device/method. Do not gate editorial content on scene load.
- **Frame rate:** Target >= 45 FPS desktop at quality=high, >= 30 FPS at mobile low quality on documented reference devices; measure rather than assert.
- **Asset budgets (initial):** critical path JS <= 250 KB gzip target, no 3D requested before intentional entry; MVP first 3D package <= 3 MB compressed target; per-scene measured budgets in architecture. These are engineering targets, not guarantees.
- **Availability:** static-first hosting; no API dependency for critical journey.
- **SEO:** indexable localized Read pages with canonical and `hreflang`; do not rely on canvas to expose learning content.
- **Security/privacy:** no account, no user tracking by default; optional privacy-friendly aggregate analytics only after consent decision and policy review.
- **Maintainability:** typed content, documented sources, Playwright tests, reusable monument adapter.
- **Localization:** EN/ID; ensure paragraph and screen-reader labels are translated, not just menu items.

## 7. Visual quality requirements
- Mood: contemplative, monumental, cinematic, editorial, respectful, never theme-park sensationalism.
- Palette: volcanic charcoal, basalt green-grey, weathered stone, warm alabaster, subtle bronze highlights.
- Typography: display serif for major chapter titles; highly readable humanist/geometric sans for body and controls; font files licensed and self-hosted where practical.
- Art: hero atmospheric but accurate/interpretive state labeled. No stock photo passing as temple evidence. Motion elegant but subordinate to comprehension.

## 8. Success metrics/events (optional, privacy-aware)
Track anonymized aggregate events only when explicitly configured: `experience_started`, `chapter_viewed`, `era_selected`, `relief_opened`, `source_opened`, `experience_completed`, `fallback_used`; no user IDs or location. If analytics disabled, app must behave identically.

## 9. Release gates
- **Engineering gate:** green checks, no major mobile performance regression, fallback works.
- **Heritage gate:** all public claims reviewed and sourced; labels align with materials; all historical images/media have documented rights.
- **Accessibility gate:** keyboard, screen-reader audit, reduced motion; no blocker severity A or AA failure.
- **Editorial gate:** English and Indonesian copy reviewed for factual and translation accuracy.

## 10. Open questions that do not block M0–M3
Will a partner supply surveyed 3D scans? Which specific relief panel(s) are cleared? Is there an Indonesian heritage adviser? Which host/domain? Will voiceover be commissioned? Is this for personal portfolio, classroom, or public museum exhibition? Do not halt procedural MVP for these decisions.

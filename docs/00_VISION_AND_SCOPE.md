# 00 — Vision, Scope, Principles

## Product thesis
Build a web experience that teaches historical facts **through spatial interaction**, not as disconnected captions pasted onto a 3D scene. Pair cinematic spectacle with verifiable sources, interpretive transparency, and multiple accessible pathways.

### Tagline
**A monument, a thousand years, countless stories.**

### Visitor promise
"I can discover Borobudur's architecture, travel through documented periods, inspect a relief story and understand the three symbolic realms—even if I use a phone or cannot run the 3D viewer."

## Goals
1. Create an emotional sense of place in the first 15–30 seconds *without mandatory long blocking animation*.
2. Teach at least three defensible learning outcomes about design, chronology, and symbolic realms.
3. Let visitors control the narrative: scroll to watch, click to inspect, scrub time, or use direct chapter navigation.
4. Make evidence and artistic interpretation transparent at the point of viewing.
5. Build a reusable monument engine with a Borobudur-specific content pack.

## Learning outcomes
By completing the experience, a visitor should be able to: (a) identify five square terraces, three circular platforms, and a central stupa in the architectural schema; (b) locate Kamadhatu, Rupadhatu and Arupadhatu in the interpretive vertical division; (c) distinguish present-day documentation, conservation states, and hypothetical earlier visualizations; and (d) explain how a sampled relief can be read alongside curator notes and sources.

## Scope tiers

| Tier | Features | Exclusions |
| --- | --- | --- |
| **MVP (M0–M3)** | Cinematic landing; 5 chapters; procedural 3D silhouette; three-mode experience; playable time travel; 1–2 relief demos; three-realm ascent; sources; EN/ID; accessibility & QA | Precise surveyed model, detailed vegetation reconstruction, full relief catalog, account system |
| **Public exhibition (M4–M5)** | Rights-verified detailed 3D asset, 3–5 curated authentic relief panels with expert review, localized narration with transcripts, richer era scenes and optimized LODs | Unverified ancient human reconstructions |
| **Future extensions** | Additional temples, teacher plans, curated quizzes, VR, map-linked trails, conservation comparisons | Not prerequisites for MVP |

## Measures of success (targets, not promises)
- Learning: 70% of recruited test participants can correctly place 3 symbolic realms after exploration (baseline to be measured).
- Completion: >= 35% of visitors who start chapter 1 reach chapter 5 in a pilot; report by performance tier.
- Trust: 100% of published historical claim records have at least one citation and `reviewed` status.
- Inclusion: critical educational content reachable in text-first mode, keyboard-only, and reduced motion; target WCAG 2.2 AA.
- Technical: no WebGL fatal blank screen, no autoplay audio, no modal traps, stable navigation on constrained mobile.

## Non-goals
- Replace archaeological scholarship or provide museum-certified reconstructions without partner review.
- Claim to depict actual 8th-century workers, construction methods, clothing or colors without expert evidence.
- Present full 2,672 relief panels or precisely reconstruct all relief sequences in initial scope.
- Create a server-side AI narrator, chat companion, or user-generated annotation platform in v1.

## Constraints/assumptions
- No 3D scans, licensed relief images, translation funding or curatorial partnership supplied today.
- Initial product must work with assets created by the implementation team. Anything historically specific needs sourced review.
- EN and ID are first-class locales; human review needed before public historical release.
- Public URLs, exhibition use, and partner branding require a separate rights and editorial clearance stage.

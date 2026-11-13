# 07 — Test Plan, Quality Gates, Acceptance Evidence

## 1. Quality strategy
Mix deterministic automated tests with explicit visual, accessibility, historical/editorial and hardware review. A single beautiful desktop screenshot is not evidence of an accessible, functional product. Keep fixtures local so CI passes offline after package installation.

## 2. Test matrix

| Test layer | Tool | Critical cases | When |
| --- | --- | --- | --- |
| Unit | Vitest | reducer state transitions, source rule validation, locale completeness, URL parsing | each PR |
| Component | Testing Library / axe | timeline selection, source drawer, relief modal focus, navigation labels | each PR |
| E2E | Playwright | 5 chapters, 3 modes, browser history, locale, fallback, viewport | each milestone |
| Visual | Playwright screenshots + manual | hero, era states, relief detail, ascent, mobile, reduced motion | each design change |
| Performance | Lighthouse + browser trace | LCP, initial JS, GLB sizes, FPS, GPU memory heuristic | M1/M3 and assets |
| Accessibility | axe + manual screen reader | keyboard, headings, contrast, touch targets, motion, reading flow | M1/M3 |
| Historical | source ledger + curator | fact-source alignment, period labels, interpretation, panel identity | before public |
| Rights | media registry + human review | license, attribution, derivatives, fonts, sounds, scans | before any release |

## 3. Concrete e2e scenarios

1. **Journey:** open `/en/experience`, start, visit all five chapters, complete recap; headings and controls update.
2. **Mode continuity:** change to Explore in `centuries`, select era, change to Read, return to Guided and retain stable relevant state.
3. **Deep link:** open `/en/experience?chapter=ascent&realm=rupadhatu`; correct text, appropriate camera waypoint; reload and browser back consistent.
4. **Timeline:** use pointer and keyboard to visit all four periods; labels and interpretations change; assert active tick and source metadata.
5. **Relief detail:** select demo entry, open overlay, verify demo attribution, use Escape, focus restores; Next/Back no trap.
6. **Reduced motion:** emulate `prefers-reduced-motion: reduce`; intro not forced, Lenis disabled, no parallax, navigation works.
7. **WebGL unavailable:** simulate failed canvas/context; read card is available with a descriptive message and retry option; chapter completion remains possible.
8. **Mobile:** 390×844 and 360×740 viewports, tap controls, no horizontal overflow, focus accessible, no forced canvas scrolling.
9. **Localization:** navigate in `/id`, assert Indonesian content and valid routes, test cross-locale link retains relevant chapter.
10. **Source coverage:** deliberate missing source for `documented` record causes build validator failure; media rights mismatch blocks publish build.
11. **Slow network:** static body text renders before models, loading indicator has text alternative and cancellation/Read action.
12. **Audio policy:** no audio starts automatically; if narrator enabled later, user explicitly triggers playback and transcript is exposed.

## 4. Acceptance traceability

| Product feature | Task | Minimum automated evidence | Manual review |
| --- | --- | --- | --- |
| PR-01 Chapters | M1-T01 | E2E all five chapters | narrative continuity |
| PR-02 Modes | M1-T01 / T04 | mode-switch E2E | semantics and UX |
| PR-03 Cinematic hero | M1-T03 | skip/reduced-motion test | motion quality |
| PR-04 Model | M1-T02 | fallback test | visual coherence / performance |
| PR-05 Timeline | M2-T01 | state/unit/E2E | evidence badges |
| PR-06 Relief | M2-T03 | modal + data tests | no fictitious attribution |
| PR-07 Ascent | M2-T04 | realm selection E2E | UNESCO placement accuracy |
| PR-08/13 Claims | M0-T03 / M2-T05 | content audit | editorial gate |
| PR-09 Languages | M0-T02 / M2-T05 | locale parity | native editor review |
| PR-10/12 Resilience | M1-T05 / M3-T01 | blocked WebGL + slow net | phone test |
| PR-11 Accessibility | M3-T02 | axe + keyboard E2E | screen reader |

## 5. Benchmark environment and targets
Specify **the exact device, operating system, GPU, browser, viewport, network throttle, build version, and test route** alongside each result. Suggested test profiles:

- Desktop: mainstream laptop (integrated GPU), Chrome and Firefox, 1440×900.
- Mobile: representative 2–4-year-old mid-range Android phone on Chrome, 390×844; separate iPhone/Safari smoke test.
- Simulated slow network: Chrome DevTools 4G plus CPU throttle; also test real mobile network once available.

**Targets (not measured values):** initial landing LCP <=2.5 s p75 in synthetic lab; desktop 45+ median FPS, mobile 30+ median FPS while scene running; zero critical a11y violations; no unhandled WebGL crash. Performance budgets adjustable only with a measured, documented tradeoff.

## 6. Accessibility checklist
- Exactly one H1 on reading pages, logical heading hierarchy and landmarks.
- All actions keyboard reachable, no reliance on mouse hover, wheel, pinch, or audio.
- Modals focus trapped appropriately; Escape works and focus restores to trigger.
- Visible `Skip to content`, visible keyboard focus, source links with meaningful text.
- Color contrast >= 4.5:1 for normal text and >= 3:1 for large text/meaningful UI boundaries as applicable; test actual rendered values.
- Touch targets meet WCAG 2.2 minimum with spacing; design aims 44px.
- Animation honors reduced motion, without essential information conveyed only by animation.
- Canvas has accessible descriptive alternative; no screen-reader reading of hundreds of 3D objects.
- Images diagrams have localized alt/caption; meaningful figures have extended description; audio/video caption/transcript.
- User choice to pause/skip auto-changing content, no uncontrolled flashing or orientation lock.

## 7. Historical/content QA
Build-time validation is **necessary but insufficient**. A schema can prove that a claim has `sourceIds`, not that the linked source truly supports it. Manual reviewer signs off each `documented` claim's exact source passage, inference qualification, relief identity/location, and visual labels. Maintain `docs/evidence-ledger.csv` later if required.

## 8. Release checklist (agent must report each)
- [ ] All P0 flows implemented (or MVP scope explicitly amended)
- [ ] Build, lint, typecheck, unit and e2e tests green
- [ ] No critical a11y blockers; manual screen-reader test documented
- [ ] Static/read mode and WebGL fallback complete
- [ ] EN/ID parity and editorial review state accurate
- [ ] All embedded media owned or licensed, attribution displayed
- [ ] Every historical claim sourced; reviewer flags accurate
- [ ] No placeholder implied to be accurate heritage geometry
- [ ] Performance budgets checked with actual measurements
- [ ] Deployed preview tested and rollback path documented

If content / rights review is pending, release only as labeled research **prototype** and never claim to have museum certification.

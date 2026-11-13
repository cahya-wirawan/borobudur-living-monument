# 03 — Technical Architecture

## 1. Design principles
Static-first, evidence-driven, modular, typed, progressive, and resilient. The browser's 3D scene is a visualization layer, **not** the content or navigation source of truth. Learning content always renders as HTML. Build the first milestone without licensed media, an account system, a backend, or environment secrets.

## 2. Stack
- **Foundation:** Next.js App Router, React, strict TypeScript, pnpm, Tailwind.
- **3D:** Three.js, React Three Fiber (`@react-three/fiber`), Drei; use versions compatible with the selected React release. Prefer stable versions at time of install, pin lockfile.
- **Animation:** GSAP (free features only) + ScrollTrigger; Lenis opt-in smooth scroll for supported desktop mode.
- **State:** Zustand *or* small typed reducer for shared visitor state; choose reducer first for MVP unless complexity requires Zustand. Keep URL sync separate.
- **Data:** committed JSON and MDX reviewed at build; Zod validation; no production CMS in v1.
- **Tests:** Vitest + React Testing Library + jest-axe/axe-core + Playwright; optional visual diff.
- **Ops:** static/edge-friendly deployment, media CDN, cache immutability for fingerprinted assets, simple CSP.

## 3. Layer diagram

```
          ┌───────────────────────────────┐
          │ Next.js pages (SSR/static)    │
          │ SEO, localized Read, sources  │
          └──────────────┬────────────────┘
                         │ validated content
          ┌──────────────▼────────────────┐
          │ Content repository             │
          │ chapters, claims, assets       │
          │ license and review metadata   │
          └──────────────┬────────────────┘
                         │
          ┌──────────────▼────────────────┐
          │ Experience controller          │
          │ mode, chapter, era, realm,     │
          │ relief, motion preference      │
          └───────┬───────────────┬───────┘
                  │               │
     ┌────────────▼─────┐ ┌──────▼────────────┐
     │ HTML UI/a11y     │ │ Scene adapter     │
     │ controls + text  │ │ Three.js R3F      │
     └──────────────────┘ │ GSAP camera/scene  │
                          └───────────────────┘
```

## 4. Proposed directory tree (implementation repo)

```
src/
  app/
    layout.tsx
    page.tsx                       # redirects/resolves preferred locale
    [locale]/
      layout.tsx
      experience/page.tsx
      read/page.tsx
      sources/page.tsx
      about/page.tsx
  components/
    shell/ExperienceShell.tsx
    shell/ChapterNav.tsx
    shell/ModeSwitcher.tsx
    shell/EvidenceBadge.tsx
    shell/SourceDrawer.tsx
    shell/FallbackPanel.tsx
    ui/...
  features/
    experience/controller.ts       # pure reducer/state model
    experience/url-state.ts        # parse/serialize allow-listed IDs
    experience/chapters.ts
    time-machine/Timeline.tsx
    time-machine/era-mapping.ts
    reliefs/ReliefCatalog.tsx
    reliefs/ReliefDetail.tsx
    ascent/RealmNavigation.tsx
  scene/
    ExperienceCanvas.tsx           # client-only, lazy loaded
    MonumentPlaceholder.tsx       # original procedural geometry
    SceneController.tsx
    CameraDirector.tsx
    lighting.ts
    waypoints.ts
    effects/...
  content/
    schema.ts
    loader.ts
    en.json
    id.json
    references.json
    media-manifest.json
  i18n/
    dictionaries.ts
  lib/
    capabilities.ts                # WebGL/reduced-motion checks
    telemetry.ts                   # no-op by default
    asset-preflight.ts
  styles/tokens.css
public/
  images/illustrative/             # original generated or hand-authored only
  models/                           # empty until licensed/reviewed
  previews/                         # static authored SVG/JPEG/WebP fallback
scripts/
  validate-content.ts
  audit-media.ts
  check-budgets.ts
  optimize-models.mjs              # add when assets arrive
 tests/                              # adapt path to chosen tooling
```

Agent can choose minor structural details if contracts and constraints remain intact. Keep the docs in repo.

## 5. Experience state and transitions

```ts
type Mode = 'guided' | 'explore' | 'read';
type ChapterId = 'awakening' | 'centuries' | 'architecture' | 'stories' | 'ascent';
type EraId = 'construction' | 'nineteenth-century' | 'restoration' | 'present';
type RealmId = 'kamadhatu' | 'rupadhatu' | 'arupadhatu';
type MotionPolicy = 'full' | 'reduced';

type ExperienceState = {
  locale: 'en' | 'id';
  mode: Mode;
  chapter: ChapterId;
  era: EraId;
  realm: RealmId;
  activeReliefId: string | null;
  motion: MotionPolicy;
  sceneQuality: 'low' | 'medium' | 'high' | 'none';
  sourceDrawerOpen: boolean;
};

type ExperienceAction =
  | { type: 'NAVIGATE_CHAPTER'; chapter: ChapterId }
  | { type: 'CHANGE_ERA'; era: EraId }
  | { type: 'SELECT_REALM'; realm: RealmId }
  | { type: 'OPEN_RELIEF'; id: string }
  | { type: 'CLOSE_RELIEF' }
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'SET_MOTION'; motion: MotionPolicy }
  | { type: 'SET_QUALITY'; quality: ExperienceState['sceneQuality'] };
```

`reducer(state, action)` is deterministic and side-effect-free. It validates IDs. A separate effect serializes allowed state into URL; browser `popstate` restores it. Do not record cursor, frame number, camera quaternion or transient animation in URL. Deep links should reproduce content and jump to a **stable camera waypoint**, not a half-completed tween.

## 6. 3D rendering / motion ownership

**Three/R3F owns:** graphics resources, scene graph, camera transforms, raycasting, level-of-detail, material transitions, model loading.  
**GSAP owns:** orchestrated interpolation between known camera pose/scene parameters.  
**ScrollTrigger owns:** the mapping from reading/scroll segments to chapter progress, never factual domain state directly.  
**Lenis owns:** optional scroll presentation only. Disable on reduced motion / unsupported devices. Do not sync two independent `requestAnimationFrame` loops; one root ticker should drive Lenis and ScrollTrigger when active. Cleanup properly.  
**React owns:** discrete visitor state, HTML labels, controls, UI, localization and accessibility.

All cinematics use a `CameraDirector` with waypoints defined in scene space:

```ts
type CameraWaypoint = {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
  near?: number;
  far?: number;
  durationSeconds: number;
};
```

Camera numerics are **art-direction parameters for the illustrative model**, not surveyed geospatial coordinates. Recalibrate only after new model ingestion. Optionally use a Catmull–Rom curve; avoid camera flips and clipping through architectural meshes. Use bounding volumes and controls limits.

## 7. Asset strategy and honest placeholders

### Phase A: procedural MVP
- Create one stylized square terraced base with five visible squared levels, three abstract circular upper platforms and one central stupa, all **illustrative**.
- Use simple gray stone materials and lighting; 72 precise perforated stupas optional in M2 if performance allows, and label geometry as schematic regardless.
- For architecture hotspots, annotate known conceptual features; do not claim dimensional exactness.
- Relief demo uses self-authored stylized 2D line art and an obvious `DEMO ARTWORK — NOT ORIGINAL RELIEF` notice.

### Phase B: researched model
- Ingest rights-cleared photogrammetry / architect-produced 3D models with creator approval and documented scale/orientation.
- Export Blender source file plus GLB; maintain mapping of component groups to hotspot IDs.
- Generate quality levels (`low`, `medium`, `high`) and capture screenshots of silhouette/hotspot alignment.
- Use glTF 2.0 and evaluate meshopt/Draco; KTX2 for GPU compressed textures where supported. Keep original unoptimized master outside public delivery path.
- Confirm dataset license covers derivative textures, rehosting, public display, and any commercial use; record required attribution.

### Example media manifest fields
`id`, `type`, `src`, `creator`, `sourceUrl`, `licenseId`, `licenseUrl`, `attribution`, `rightsReviewed`, `editorialReviewed`, `factualStatus`, `alt.en`, `alt.id`, `approxBytes`, `qualityTier`, `sha256`.

**Deployment rule:** `rightsReviewed=false` for a real external asset => CI fails public build; illustrative original internal assets can use an explicit internal creator/license entry.

## 8. Performance budgets and degradation

| Context | Proposed budget / policy |
| --- | --- |
| Landing initial | Static HTML + CSS available before WebGL; <= 250 KB initial JS gzip target; 3D loads only when selected/nearby |
| First interactive scene | compressed transfer <= 3 MB MVP; show progress + fallback at every loading stage |
| Desktop high | Aim >= 45 FPS median in 60-second scripted camera test on reference GPU |
| Mobile low | Aim >= 30 FPS median in 60-second test on representative mid-range phone |
| Shader / postprocessing | Post-processing disabled by default on low, conservative on medium, opt-in on high |
| Network | Preload only next chapter's asset; don't preload all era/relief files |
| DPR | cap 1–2; adaptive reduction based on performance monitor |
| Memory | dispose meshes/textures after scenes replaced; avoid multiple full-size asset copies |
| WebGL failure | render Read/schematic alternative immediately with one-click retry |

Profile on actual target hardware; the budgets are targets, not measured guarantees. `prefers-reduced-data`, mobile device and low memory hints should influence quality selection where available, without depending on proprietary APIs.

## 9. Progressive failure modes
- Server/SSR failure of interactive module: static Read page still available.
- `WebGLRenderingContext` absent or context lost: informative fallback, restore/retry once user chooses.
- Failed GLB/image: replace with authored silhouette, toast non-blocking, continue chapters.
- GSAP/Lenis issue: native scroll and direct chapter buttons continue working.
- Audio missing: transcript and written content remain usable.
- Missing locale entry: build fails rather than silently publishing a mixed-language UI.

## 10. Testing boundaries
Unit tests for reducer, timeline mapping, URL parser, claims/provenance validation; component tests for overlays/navigation/accessibility; Playwright for mode changes, touch viewport, reduced motion, WebGL mocked error and successful scene, no external network. Visual screenshots per `docs/07_TEST_AND_ACCEPTANCE.md`.

## 11. Optional migration to monuments engine
After successful Borobudur launch, move `features/experience`, `scene/CameraDirector`, `content/schema` to reusable packages. Borobudur-specific geography, eras, learning maps, claims and artwork stay in a content pack; avoid premature monorepo architecture in MVP.

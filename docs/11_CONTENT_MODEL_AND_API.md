# 11 — Content Model, Contracts, URL / UI API

## 1. Content-first approach
`content/content.schema.json` is a starter cross-platform schema for document fixtures; implement equivalent strongly typed TypeScript/Zod schemas in application. Expand cautiously: guarantee parity and migration tests when adding fields. Treat data as display content, **not** proof the underlying source supports it.

## 2. Entities and relationships

```
Monument (1)
  ├─ Chapter (5) ──> Claim (*many-to-many*) ──> Source (*many-to-many*)
  ├─ Era (4) ──────> Claim
  ├─ Realm (3) ────> Claim
  ├─ Relief (1+ demo) ──> Claim, Media
  ├─ Hotspot (*) ─> Chapter / Era / Realm / Relief
  └─ Media (*) ───> Rights record + fidelity classification
```

Each educational entity has stable `id`; localized text is `{en, id}`; no component should hardcode historical claims. Sources have external HTTPS URL. A page computes cited sources from referenced claim IDs and media IDs. Build validator checks missing IDs and prohibited review states.

## 3. Suggested types

```ts
type Locale = 'en' | 'id';
type Localized = { en: string; id: string };
type Accuracy = 'documented' | 'inferred' | 'artistic';
type Review = 'draft' | 'needs-review' | 'reviewed';

type Source = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  accessedAt: string;
  type: 'official' | 'scholarly' | 'archival' | 'other';
};
type Claim = {
  id: string;
  text: Localized;
  evidenceStatus: Accuracy;
  reviewStatus: Review;
  sourceIds: string[];
  qualification?: Localized;
};
type Media = {
  id: string;
  src: string;
  alt: Localized;
  kind: 'image' | 'model' | 'audio' | 'video' | 'illustration';
  provenance: Accuracy;
  creator: string;
  licenseId: string;
  licenseUrl?: string;
  rightsReviewed: boolean;
  attribution: string;
  isOriginal: boolean;
};
type Chapter = { id: string; title: Localized; summary: Localized; claimIds: string[] };
type Era = { id: string; label: Localized; description: Localized; provenance: Accuracy; claimIds: string[] };
type Realm = { id: string; title: Localized; explanation: Localized; claimIds: string[] };
type Relief = {
  id: string;
  title: Localized;
  description: Localized;
  demonstration: boolean;
  claimIds: string[];
  mediaIds: string[];
  verifiedLocation?: string;
};
```

## 4. Validation policies
- All records have stable kebab-case IDs; no duplicate IDs.
- `en`/`id` non-empty; trims whitespace; no external HTML.
- `documented` / `inferred` claims require valid `sourceIds`, and `reviewStatus==='reviewed'` for public release.
- `artistic` educational content cannot impersonate historical evidence; source refs allowed for contextual claims.
- Third-party media must have `rightsReviewed===true`, license metadata and attribution before public deployment.
- `Relief.demonstration===true` must display `Demonstration artwork — not a specific original panel` in both languages, regardless of underlying claim sources.
- Source URL protocol `https`; include exact attribution if borrowed content.
- Content review is separate from schema checks; human review mandatory before public release.

## 5. Deep-link and state contract

`/{locale}/experience?chapter={id}&era={id}&realm={id}&relief={id}&mode={guided|explore}`

- Query strings optional; default chapter `awakening`, era `present`, realm `kamadhatu`, mode `guided`.
- `mode=read` redirects to localized `/read` with equivalent anchor, or uses Read layout without WebGL. Pick one and test consistently; prefer redirect.
- Invalid IDs drop to safe defaults, never arbitrary dynamic import paths.
- URL writes only after intentional navigation; avoid scroll-trigger history spam (`replaceState` for continuous UI, `pushState` for chapter/explicit selections).
- Locale switch preserves valid chapter/selection; relief modal state remains if ID exists in both languages.

## 6. Interface contracts
- `<ExperienceShell>` accepts validated content pack + initial server state.
- `<ChapterNav state dispatch>` renders next/back + progress; works without canvas.
- `<ExperienceCanvas sceneState onHotspotActivate>` lazy loads and emits **intent events only**, not direct modal state mutation.
- `<Timeline value onChange eras>` has buttons and a screen-reader accessible current era; **not** a single pointer-only drag affordance.
- `<ReliefDetail relief onClose>` traps focus and restores return target; shows source links.
- `<RealmNavigation value onChange>` displays all three realm names with labels from content.
- `<SourceDrawer claimIds mediaIds onClose>` produces human-readable references, URLs and provenance.
- `<ReadExperience chapters>` consumes the same records as animated mode; no manually duplicated facts.

## 7. Suggested CI contracts

```text
pnpm validate:content
  -> schema all records
  -> no dangling references
  -> locale parity
  -> legal/media allowlist for production release
  -> truth-status visual labeling check (static metadata test)

pnpm test:routes
  -> every deep link yields expected chapter+locale
  -> source links remain clickable when canvas disabled
```

## 8. Data migration principle
Introduce a `schemaVersion` at root. Write a migration and unit test before changing persisted IDs or shape. Identifiers referenced by shared URLs should remain stable or be redirected.

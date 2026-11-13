# 04 — Content Provenance, Historical Accuracy, and Rights

## 1. Central editorial rule
A beautiful animation is **not evidence**. Every educational claim and media object must carry provenance and interpretation status so a visitor can tell observed, sourced fact from a scholarly inference or an artistic depiction.

## 2. Three truth-status categories
- **Documented:** Verifiable from cited institution, publication, conservation record, measured photograph, or clearly credited survey.
- **Inferred:** Reasoned scholarly reconstruction based on cited evidence; show assumptions and uncertainty.
- **Artistic:** An intentionally imaginative or generalized illustration with no claim to specific historic authenticity. Label conspicuously.

For each visual: maintain two independently reviewable dimensions: (a) the **historical statement** it illustrates and (b) its **visual fidelity**. A UNESCO-backed claim about five square terraces does **not** make an agent-built schematic an accurate model.

## 3. UNESCO-verified seed facts (editorial paraphrases)
1. Borobudur was built in the **8th and 9th centuries** in central Java under the Syailendra Dynasty.
2. Its main structure comprises a pyramidal base with **five concentric square terraces**, then **three circular platforms**, and a central monumental stupa.
3. The circular platforms contain **72 openwork stupas**, each with a Buddha statue in UNESCO's description.
4. The cosmological interpretation links the base to *kamadhatu* (sphere of desires), the five square terraces to *rupadhatu* (sphere of forms), and the circular terraces and main stupa to *arupadhatu* (sphere of formlessness).
5. UNESCO documents restoration assistance in the **1970s** and nineteenth-century renewed recognition of the monument.
6. The inscription describes the broader World Heritage site **Borobudur Temple Compounds**, which also includes Mendut and Pawon temples. Distinguish the main monument from the World Heritage property.

Primary source: UNESCO World Heritage Centre, https://whc.unesco.org/en/list/592/ (accessed 2026-11-12).

Do not add exact 1814 event details, panel numbering, ancient paint color, stone-by-stone construction sequence, workers, chanting, invented quotes, detailed pilgrimage route, or symbolic interpretations beyond the source without new references and review.

## 4. Claim schema / attribution policy
Every nontrivial educational statement references `claimIds`. Claim object should include:

```ts
type EvidenceStatus = 'documented' | 'inferred' | 'artistic';
type ReviewStatus = 'draft' | 'needs-review' | 'reviewed';

type HistoricalClaim = {
  id: string;
  statements: { en: string; id: string };
  status: EvidenceStatus;
  sourceIds: string[];                // required for documented/inferred
  review: ReviewStatus;
  reviewer?: string;
  reviewedAt?: string;                // ISO date
  qualification?: { en: string; id: string };
};
```

Agents may scaffold records as `draft`; they must not silently mark AI-generated narratives as reviewed. For public release, factual content must be human-reviewed. Avoid long unattributed quotations and unlicensed translations; summarize using original writing.

## 5. Media license registry
Each photo, video, scan, sound, texture, font, and illustration should record:

- original creator, title, source URL, date retrieved, file checksum;
- reuse license/version, attribution, derivative and redistribution conditions;
- whether permissions include public website, rehosting, modification, commercial use if applicable;
- responsible rights reviewer and decision date;
- provenance/fidelity status and audience-facing disclaimer;
- alternative-text translations (EN, ID).

`unknown`, blank or `all rights reserved` are **not reusable** by default. Images appearing on UNESCO, Google Arts & Culture or virtual tour sites cannot be embedded or repackaged without checking their own media rights. UNESCO's narrative text and NHK video, for example, have potentially different rights; inspect each individually.

## 6. Sample relief workflow
1. Identify a specific panel **from a scholarly or museum catalog**, record location and canonical reference ID.
2. Obtain original photographic/scan rights or produce original, vetted illustration based on licensed references.
3. Ask content adviser to approve translation, narrative identification, interpretation, and uncertainty.
4. Write 80–140-word visitor explanation plus 250–450-word expanded context; cite sources and panel attribution.
5. If animation is added, separate exact relief-trace contours from invented movement. Add persistent `Artistic interpretation` label.
6. Verify every caption and spoken line matches the written evidence; provide transcript.
7. In MVP, if no actual panel is identified, use **sample concept** rather than asserting the demo maps to a specific Borobudur carving.

## 7. Era reconstruction workflow
Create a scene evidence ledger with columns: `object/feature`, `era`, `visible claim`, `supporting source`, `confidence`, `visual treatment`, `reviewer`, `decision`. Do not interpolate or invent dated scenes from different sources and imply they are literal snapshots. A slider can blend **rendered layers** while its labels remain anchored to discrete documented or hypothetical era categories.

## 8. Cultural and linguistic review
- Validate Indonesian terminology with a qualified reviewer; use `Candi Borobudur` in suitable local-language copy but avoid forcing untranslated terms into every sentence.
- Distinguish visitor-friendly simplification from doctrinal definition; attribute interpretations (e.g. "UNESCO describes..." when warranted).
- Avoid anachronistic depictions and casually appropriated ritual audio. Commission audio or use original unobtrusive ambient sound, with opt-in controls.
- Add a visitor-facing `How this reconstruction was made` page with methods and limitations.

## 9. Content acceptance gate
Publication permitted only if:
- all displayed factual records `review === 'reviewed'` and `sourceIds.length > 0`;
- all displayed third-party media rights reviewed and cleared;
- no unlabeled inferred/artistic scenes;
- EN/ID content reviewed or explicitly marked preview;
- verified panel location and attribution for any relief described as a named original;
- unresolved material disagreements are shown as uncertainty, not discarded.

For local demo environment only, allow `draft` content **with prominent banner**: "Research prototype — educational claims pending editorial review".

## 10. Reference register to extend
- U001 — UNESCO World Heritage Centre, "Borobudur Temple Compounds", https://whc.unesco.org/en/list/592/
- U002 — UNESCO World Heritage Committee Decision 47 COM 7B.74, https://whc.unesco.org/en/decisions/8798
- W001 — W3C WCAG 2.2, https://www.w3.org/TR/WCAG22/
- T001 — React Three Fiber documentation, https://r3f.docs.pmnd.rs/
- T002 — Khronos glTF 2.0 spec, https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.pdf

Check and store bibliographic metadata before public release. Research links are **not asset license grants**.

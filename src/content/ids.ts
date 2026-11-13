/**
 * Allow-listed identifiers. This module has no dependencies so browser code
 * can use it without pulling in the validation library.
 */

export const CHAPTER_IDS = ['awakening', 'centuries', 'architecture', 'stories', 'ascent'] as const;
export const ERA_IDS = ['construction', 'nineteenth-century', 'restoration', 'present'] as const;
export const REALM_IDS = ['kamadhatu', 'rupadhatu', 'arupadhatu'] as const;
export const LOCALES = ['en', 'id'] as const;
export const EVIDENCE_STATUSES = ['documented', 'inferred', 'artistic'] as const;
export const REVIEW_STATUSES = ['draft', 'needs-review', 'reviewed'] as const;

export type ChapterId = (typeof CHAPTER_IDS)[number];
export type EraId = (typeof ERA_IDS)[number];
export type RealmId = (typeof REALM_IDS)[number];
export type Locale = (typeof LOCALES)[number];
export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

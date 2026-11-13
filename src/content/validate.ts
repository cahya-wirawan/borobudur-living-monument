import { migrateContent } from './migrate';
import {
  CHAPTER_IDS,
  ERA_IDS,
  REALM_IDS,
  contentPackSchema,
  type ContentPack,
} from './schema';

/**
 * Build-time content audit.
 *
 * - `error` issues always fail (broken structure, dangling references, a
 *   documented/inferred claim without a source).
 * - `release-blocker` issues are tolerated in the labeled research prototype
 *   but fail any public release build (`--release`).
 *
 * Passing this audit proves the records are well formed. It does NOT prove a
 * cited source supports a claim; that needs human editorial review.
 */

export type IssueSeverity = 'error' | 'release-blocker';
export type ContentIssue = { severity: IssueSeverity; code: string; message: string };
export type ValidationResult = {
  pack: ContentPack | null;
  issues: ContentIssue[];
};

const NON_REUSABLE_LICENSES = new Set(['unknown', 'all-rights-reserved', 'all rights reserved', 'none']);

function sameMembers(actual: readonly string[], expected: readonly string[]): boolean {
  return actual.length === expected.length && expected.every((id, index) => actual[index] === id);
}

export function validateContent(input: unknown): ValidationResult {
  const parsed = contentPackSchema.safeParse(migrateContent(input));
  if (!parsed.success) {
    return {
      pack: null,
      issues: parsed.error.issues.map((issue) => ({
        severity: 'error',
        code: 'schema',
        message: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
      })),
    };
  }

  const pack = parsed.data;
  const issues: ContentIssue[] = [];
  const error = (code: string, message: string) => issues.push({ severity: 'error', code, message });
  const blocker = (code: string, message: string) =>
    issues.push({ severity: 'release-blocker', code, message });

  const collections = {
    sources: pack.sources,
    claims: pack.claims,
    chapters: pack.chapters,
    eras: pack.eras,
    realms: pack.realms,
    features: pack.features,
    reliefs: pack.reliefs,
    media: pack.media,
  };
  for (const [name, records] of Object.entries(collections)) {
    const seen = new Set<string>();
    for (const record of records) {
      if (seen.has(record.id)) error('duplicate-id', `${name}: duplicate id "${record.id}"`);
      seen.add(record.id);
    }
  }

  if (!sameMembers(pack.chapters.map((c) => c.id), CHAPTER_IDS))
    error('chapter-set', `chapters must be exactly, in order: ${CHAPTER_IDS.join(', ')}`);
  if (!sameMembers(pack.eras.map((e) => e.id), ERA_IDS))
    error('era-set', `eras must be exactly, in order: ${ERA_IDS.join(', ')}`);
  if (!sameMembers(pack.realms.map((r) => r.id), REALM_IDS))
    error('realm-set', `realms must be exactly, in order: ${REALM_IDS.join(', ')}`);

  const sourceIds = new Set(pack.sources.map((s) => s.id));
  const claimIds = new Set(pack.claims.map((c) => c.id));
  const mediaIds = new Set(pack.media.map((m) => m.id));

  for (const claim of pack.claims) {
    for (const sourceId of claim.sourceIds) {
      if (!sourceIds.has(sourceId))
        error('dangling-source', `claim "${claim.id}" references unknown source "${sourceId}"`);
    }
    if (claim.evidenceStatus !== 'artistic' && claim.sourceIds.length === 0)
      error(
        'missing-source',
        `claim "${claim.id}" is "${claim.evidenceStatus}" but has no sourceIds`,
      );
    if (claim.reviewStatus !== 'reviewed')
      blocker(
        'unreviewed-claim',
        `claim "${claim.id}" has reviewStatus "${claim.reviewStatus}"; human editorial review is required before publication`,
      );
  }

  const claimHolders = [
    ...pack.chapters.map((r) => ({ kind: 'chapter', ...r })),
    ...pack.eras.map((r) => ({ kind: 'era', ...r })),
    ...pack.realms.map((r) => ({ kind: 'realm', ...r })),
    ...pack.features.map((r) => ({ kind: 'feature', ...r })),
    ...pack.reliefs.map((r) => ({ kind: 'relief', ...r })),
  ];
  for (const holder of claimHolders) {
    for (const claimId of holder.claimIds) {
      if (!claimIds.has(claimId))
        error('dangling-claim', `${holder.kind} "${holder.id}" references unknown claim "${claimId}"`);
    }
  }

  // Eras, realms and architectural features describe the monument, so each must cite a claim.
  for (const holder of claimHolders) {
    if (holder.kind !== 'chapter' && holder.kind !== 'relief' && holder.claimIds.length === 0)
      error('unsourced-record', `${holder.kind} "${holder.id}" has no claimIds`);
  }

  for (const relief of pack.reliefs) {
    for (const mediaId of relief.mediaIds) {
      if (!mediaIds.has(mediaId))
        error('dangling-media', `relief "${relief.id}" references unknown media "${mediaId}"`);
    }
    if (!relief.demonstration) {
      if (!relief.verifiedLocation)
        error(
          'relief-unverified',
          `relief "${relief.id}" is presented as an original panel but has no verifiedLocation`,
        );
      if (relief.claimIds.length === 0 || relief.mediaIds.length === 0)
        error(
          'relief-unsourced',
          `relief "${relief.id}" is presented as an original panel but lacks claims or media`,
        );
    }
  }

  for (const media of pack.media) {
    const license = media.licenseId.trim().toLowerCase();
    if (media.isOriginal) continue;
    if (NON_REUSABLE_LICENSES.has(license))
      blocker(
        'media-license',
        `third-party media "${media.id}" has non-reusable license "${media.licenseId}"`,
      );
    if (!media.rightsReviewed)
      blocker(
        'media-rights',
        `third-party media "${media.id}" has not passed a rights review (rightsReviewed=false)`,
      );
    if (!media.licenseUrl)
      blocker('media-license-url', `third-party media "${media.id}" has no licenseUrl`);
  }

  if (!pack.monument.illustrativeGeometry) {
    const hasReviewedModel = pack.media.some(
      (m) => m.kind === 'model' && !m.isOriginal && m.rightsReviewed && m.provenance === 'documented',
    );
    if (!hasReviewedModel)
      error(
        'geometry-claim',
        'monument.illustrativeGeometry is false but no rights-reviewed documented model exists; the geometry must stay labeled illustrative',
      );
  }

  return { pack, issues };
}

export function hasFailures(issues: ContentIssue[], release: boolean): boolean {
  return issues.some((issue) => issue.severity === 'error' || release);
}

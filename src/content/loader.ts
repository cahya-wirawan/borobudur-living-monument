import raw from './content.json';
import type { Claim, ContentPack, Media, Source } from './schema';
import { validateContent } from './validate';

let cached: ContentPack | null = null;

/** Returns the validated content pack; throws if the committed fixture is structurally invalid. */
export function getContent(): ContentPack {
  if (cached) return cached;
  const { pack, issues } = validateContent(raw);
  const errors = issues.filter((issue) => issue.severity === 'error');
  if (!pack || errors.length > 0) {
    throw new Error(
      `Invalid content pack:\n${errors.map((issue) => `- [${issue.code}] ${issue.message}`).join('\n')}`,
    );
  }
  cached = pack;
  return pack;
}

export function selectClaims(pack: ContentPack, claimIds: readonly string[]): Claim[] {
  return claimIds.flatMap((id) => pack.claims.find((claim) => claim.id === id) ?? []);
}

export function selectSources(pack: ContentPack, claims: readonly Claim[]): Source[] {
  const wanted = new Set(claims.flatMap((claim) => claim.sourceIds));
  return pack.sources.filter((source) => wanted.has(source.id));
}

export function selectMedia(pack: ContentPack, mediaIds: readonly string[]): Media[] {
  return mediaIds.flatMap((id) => pack.media.find((media) => media.id === id) ?? []);
}

/**
 * True while any displayed claim lacks human review. Drives the persistent
 * "research prototype" banner; it cannot be switched off by configuration.
 */
export function isPrototype(pack: ContentPack): boolean {
  return (
    pack.monument.illustrativeGeometry ||
    pack.claims.some((claim) => claim.reviewStatus !== 'reviewed') ||
    pack.reliefs.some((relief) => relief.demonstration)
  );
}

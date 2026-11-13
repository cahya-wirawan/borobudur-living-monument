import type { ChapterId, ContentPack, Locale } from '@/content/types';
import { chapterAnchor } from './chapters';
import {
  DEFAULT_LINKABLE,
  normalizeLinkable,
  type ContentIds,
  type LinkableState,
} from './controller';

/**
 * Deep-link contract (docs/11 §5, extended with `feature` in M2):
 *   /{locale}/experience?chapter=&era=&realm=&feature=&relief=&mode=
 * Every value is checked against an allow-list. Anything else falls back to a
 * safe default and is never used to build import paths or markup.
 */

type RawParams =
  URLSearchParams | Record<string, string | string[] | undefined> | string | null | undefined;

function read(params: RawParams, key: string): string | null {
  if (!params) return null;
  if (typeof params === 'string') return new URLSearchParams(params).get(key);
  if (params instanceof URLSearchParams) return params.get(key);
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value) ?? null;
}

export function contentIds(pack: ContentPack): ContentIds {
  return {
    reliefIds: pack.reliefs.map((relief) => relief.id),
    featureIds: pack.features.map((feature) => feature.id),
  };
}

export function parseLinkableState(params: RawParams, ids: ContentIds): LinkableState {
  // Raw strings are untrusted; normalizeLinkable replaces anything not allow-listed.
  return normalizeLinkable(
    {
      mode: (read(params, 'mode') ?? DEFAULT_LINKABLE.mode) as LinkableState['mode'],
      chapter: (read(params, 'chapter') ?? DEFAULT_LINKABLE.chapter) as LinkableState['chapter'],
      era: (read(params, 'era') ?? DEFAULT_LINKABLE.era) as LinkableState['era'],
      realm: (read(params, 'realm') ?? DEFAULT_LINKABLE.realm) as LinkableState['realm'],
      activeFeatureId: read(params, 'feature'),
      activeReliefId: read(params, 'relief'),
    },
    ids,
  );
}

/** Canonical query string: fixed key order, defaults omitted. */
export function serializeLinkableState(state: LinkableState): string {
  const params = new URLSearchParams();
  if (state.chapter !== DEFAULT_LINKABLE.chapter) params.set('chapter', state.chapter);
  if (state.era !== DEFAULT_LINKABLE.era) params.set('era', state.era);
  if (state.realm !== DEFAULT_LINKABLE.realm) params.set('realm', state.realm);
  if (state.activeFeatureId) params.set('feature', state.activeFeatureId);
  if (state.activeReliefId) params.set('relief', state.activeReliefId);
  if (state.mode !== DEFAULT_LINKABLE.mode) params.set('mode', state.mode);
  return params.toString();
}

export function experienceHref(locale: Locale, state: Partial<LinkableState> = {}): string {
  const query = serializeLinkableState({ ...DEFAULT_LINKABLE, ...state });
  return `/${locale}/experience${query ? `?${query}` : ''}`;
}

export function readHref(locale: Locale, chapter?: ChapterId): string {
  return `/${locale}/read${chapter ? `#${chapterAnchor(chapter)}` : ''}`;
}

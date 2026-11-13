import { selectClaims, selectMedia, selectSources } from '@/content/select';
import type { Claim, ContentPack, Media, Source } from '@/content/types';
import type { ExperienceState } from './controller';

export type ViewEvidence = { claims: Claim[]; sources: Source[]; media: Media[] };

/** Everything the current view asserts or shows, for the source drawer. */
export function viewEvidence(
  pack: ContentPack,
  state: Pick<ExperienceState, 'chapter' | 'era' | 'realm'>,
): ViewEvidence {
  const chapter = pack.chapters.find((c) => c.id === state.chapter);
  const claimIds = new Set(chapter?.claimIds ?? []);
  const mediaIds = new Set(['monument-procedural-model', 'monument-schematic-diagram']);

  if (state.chapter === 'centuries')
    pack.eras.find((e) => e.id === state.era)?.claimIds.forEach((id) => claimIds.add(id));
  if (state.chapter === 'ascent')
    pack.realms.find((r) => r.id === state.realm)?.claimIds.forEach((id) => claimIds.add(id));
  if (state.chapter === 'architecture')
    for (const feature of pack.features) feature.claimIds.forEach((id) => claimIds.add(id));
  if (state.chapter === 'stories')
    for (const relief of pack.reliefs) {
      relief.claimIds.forEach((id) => claimIds.add(id));
      relief.mediaIds.forEach((id) => mediaIds.add(id));
    }

  const claims = selectClaims(pack, [...claimIds]);
  return { claims, sources: selectSources(pack, claims), media: selectMedia(pack, [...mediaIds]) };
}

import { describe, expect, it } from 'vitest';
import { CHAPTER_IDS, ERA_IDS, REALM_IDS } from '@/content/schema';
import { DEFAULT_LINKABLE, type LinkableState } from './controller';
import { experienceHref, parseLinkableState, readHref, serializeLinkableState } from './url-state';

const RELIEFS = { reliefIds: ['demo-panel-01'], featureIds: ['base', 'main-stupa'] };

describe('deep-link parsing', () => {
  it('falls back to defaults for empty input', () => {
    for (const input of [undefined, null, '', {}, new URLSearchParams()])
      expect(parseLinkableState(input, RELIEFS)).toEqual(DEFAULT_LINKABLE);
  });

  it('accepts every allow-listed id', () => {
    for (const chapter of CHAPTER_IDS)
      expect(parseLinkableState({ chapter }, RELIEFS).chapter).toBe(chapter);
    for (const era of ERA_IDS) expect(parseLinkableState(`era=${era}`, RELIEFS).era).toBe(era);
    for (const realm of REALM_IDS)
      expect(parseLinkableState(new URLSearchParams({ realm }), RELIEFS).realm).toBe(realm);
  });

  it('drops anything that is not allow-listed', () => {
    const parsed = parseLinkableState(
      {
        chapter: '../../secret',
        era: '<script>alert(1)</script>',
        realm: 'https://evil.example',
        relief: 'javascript:alert(1)',
        feature: '<svg onload=alert(1)>',
        mode: '__proto__',
      },
      RELIEFS,
    );
    expect(parsed).toEqual(DEFAULT_LINKABLE);
  });

  it('uses the first value of a repeated parameter', () => {
    expect(parseLinkableState({ chapter: ['ascent', 'stories'] }, RELIEFS).chapter).toBe('ascent');
  });

  it('a valid relief forces the stories chapter', () => {
    expect(parseLinkableState('chapter=ascent&relief=demo-panel-01', RELIEFS)).toMatchObject({
      chapter: 'stories',
      activeReliefId: 'demo-panel-01',
    });
  });
});

describe('deep-link serialising', () => {
  it('omits defaults', () => {
    expect(serializeLinkableState(DEFAULT_LINKABLE)).toBe('');
    expect(experienceHref('id')).toBe('/id/experience');
  });

  it('round-trips every combination of chapter, era, realm and mode', () => {
    for (const chapter of CHAPTER_IDS)
      for (const era of ERA_IDS)
        for (const realm of REALM_IDS)
          for (const mode of ['guided', 'explore'] as const) {
            const state: LinkableState = {
              chapter,
              era,
              realm,
              mode,
              activeFeatureId: null,
              activeReliefId: null,
            };
            expect(parseLinkableState(serializeLinkableState(state), RELIEFS)).toEqual(state);
          }
  });

  it('keeps locale and selection in generated links', () => {
    expect(experienceHref('en', { chapter: 'ascent', realm: 'rupadhatu' })).toBe(
      '/en/experience?chapter=ascent&realm=rupadhatu',
    );
    expect(readHref('id', 'centuries')).toBe('/id/read#chapter-centuries');
  });
});

describe('feature deep links', () => {
  it('keeps a known feature only in the architecture chapter', () => {
    expect(parseLinkableState('chapter=architecture&feature=main-stupa', RELIEFS)).toMatchObject({
      chapter: 'architecture',
      activeFeatureId: 'main-stupa',
    });
    expect(
      parseLinkableState('chapter=ascent&feature=main-stupa', RELIEFS).activeFeatureId,
    ).toBeNull();
    expect(parseLinkableState('feature=main-stupa', RELIEFS).activeFeatureId).toBeNull();
    expect(
      parseLinkableState('chapter=architecture&feature=nope', RELIEFS).activeFeatureId,
    ).toBeNull();
  });

  it('serialises feature and relief in a fixed order and round-trips them', () => {
    const feature = experienceHref('en', { chapter: 'architecture', activeFeatureId: 'base' });
    expect(feature).toBe('/en/experience?chapter=architecture&feature=base');
    expect(parseLinkableState(feature.split('?')[1], RELIEFS).activeFeatureId).toBe('base');
    expect(experienceHref('id', { chapter: 'stories', activeReliefId: 'demo-panel-01' })).toBe(
      '/id/experience?chapter=stories&relief=demo-panel-01',
    );
  });
});

import { ATMOSPHERES, ridgeHeight, seededSequence, skyToneFor } from './atmosphere';
import { describe, expect, it } from 'vitest';
import { CHAPTER_IDS, ERA_IDS, REALM_IDS } from '@/content/types';
import { TOTAL_LEVELS, eraTreatment, sceneTreatment } from '@/features/time-machine/era-mapping';
import { getContent } from '@/content/loader';
import {
  FEATURE_ANCHORS,
  MONUMENT_LEVELS,
  RING_STUPA_COUNTS,
  highlightForFeature,
  highlightForRealm,
  reliefHotspotPosition,
  smallStupaPlacements,
} from './monument-spec';
import {
  DEFAULT_FOV,
  EXPLORE_LIMITS,
  INTRO_GLIDE_SECONDS,
  MAX_INTRO_SECONDS,
  WAYPOINTS,
  fovForAspect,
  waypointKeyFor,
} from './waypoints';

describe('illustrative monument spec (counts follow the cited UNESCO description)', () => {
  const count = (shape: string) => MONUMENT_LEVELS.filter((l) => l.shape === shape).length;

  it('has a base, five square terraces, three circular platforms and one main stupa', () => {
    expect(MONUMENT_LEVELS).toHaveLength(TOTAL_LEVELS);
    expect(MONUMENT_LEVELS[0]).toMatchObject({ id: 'base', realm: 'kamadhatu' });
    expect(count('square')).toBe(6);
    expect(count('circle')).toBe(3);
    expect(count('stupa')).toBe(1);
  });

  it('maps realms to zones: base, square terraces, circular platforms + stupa', () => {
    const realmOf = (id: string) => MONUMENT_LEVELS.find((l) => l.id === id)?.realm;
    expect(realmOf('base')).toBe('kamadhatu');
    for (let i = 1; i <= 5; i++) expect(realmOf(`square-${i}`)).toBe('rupadhatu');
    for (let i = 1; i <= 3; i++) expect(realmOf(`circle-${i}`)).toBe('arupadhatu');
    expect(realmOf('main-stupa')).toBe('arupadhatu');
  });

  it('draws exactly 72 small stupas, all on circular platforms', () => {
    expect(Object.values(RING_STUPA_COUNTS).reduce((a, b) => a + b, 0)).toBe(72);
    const placements = smallStupaPlacements();
    expect(placements).toHaveLength(72);
    expect(placements.every((p) => p.levelId.startsWith('circle-'))).toBe(true);
  });

  it('stacks levels without gaps and steps inward', () => {
    MONUMENT_LEVELS.slice(1).forEach((level, i) => {
      const below = MONUMENT_LEVELS[i]!;
      expect(level.y).toBeCloseTo(below.y + below.height);
      expect(level.extent).toBeLessThan(below.extent);
    });
  });
});

describe('camera waypoints', () => {
  it('registers a stable waypoint for every chapter and realm', () => {
    for (const chapter of CHAPTER_IDS)
      for (const realm of REALM_IDS)
        expect(WAYPOINTS[waypointKeyFor(chapter, realm)]).toBeDefined();
  });

  it('keeps every waypoint above ground, inside explore limits and short', () => {
    for (const [key, wp] of Object.entries(WAYPOINTS)) {
      const [x, y, z] = wp.position;
      const [tx, ty, tz] = wp.target;
      const distance = Math.hypot(x - tx, y - ty, z - tz);
      expect(y, key).toBeGreaterThan(0.5);
      expect(wp.durationSeconds, key).toBeLessThanOrEqual(1.4);
      if (key !== 'intro') expect(distance, key).toBeLessThanOrEqual(EXPLORE_LIMITS.maxDistance);
      expect(distance, key).toBeGreaterThanOrEqual(EXPLORE_LIMITS.minDistance);
    }
    expect(INTRO_GLIDE_SECONDS).toBeLessThanOrEqual(MAX_INTRO_SECONDS);
  });

  it('the ascent rises realm by realm', () => {
    const heights = REALM_IDS.map((realm) => WAYPOINTS[`ascent:${realm}`].target[1]);
    expect(heights).toEqual([...heights].sort((a, b) => a - b));
  });

  it('widens the field of view only for narrow viewports', () => {
    expect(fovForAspect(DEFAULT_FOV, 16 / 9)).toBe(DEFAULT_FOV);
    expect(fovForAspect(DEFAULT_FOV, 0.5)).toBeGreaterThan(DEFAULT_FOV);
    expect(fovForAspect(DEFAULT_FOV, 0.05)).toBeLessThanOrEqual(78);
    expect(fovForAspect(DEFAULT_FOV, 0)).toBe(DEFAULT_FOV);
  });
});

describe('era treatments', () => {
  it('defines a distinct visual treatment for each of the four eras', () => {
    const seen = new Set(ERA_IDS.map((era) => JSON.stringify(eraTreatment(era))));
    expect(seen.size).toBe(4);
  });

  it('shows the complete form for every era except the schematic construction view', () => {
    expect(eraTreatment('construction').solidLevels).toBeLessThan(TOTAL_LEVELS);
    expect(eraTreatment('construction').ghostRemaining).toBe(true);
    for (const era of ['nineteenth-century', 'restoration', 'present'] as const)
      expect(eraTreatment(era).solidLevels).toBe(TOTAL_LEVELS);
  });

  it('applies era treatments only inside the centuries chapter', () => {
    expect(sceneTreatment('centuries', 'construction')).toEqual(eraTreatment('construction'));
    expect(sceneTreatment('ascent', 'construction')).toEqual(eraTreatment('present'));
  });
});

describe('scene wiring for M2', () => {
  const levelIds = new Set(MONUMENT_LEVELS.map((level) => level.id));

  it('anchors every content feature to existing parts of the drawing', () => {
    for (const feature of getContent().features) {
      const anchor = highlightForFeature(feature.id);
      expect(anchor, feature.id).not.toBeNull();
      expect(anchor!.levelIds.length > 0 || anchor!.smallStupas, feature.id).toBe(true);
      for (const id of anchor!.levelIds) expect(levelIds.has(id), id).toBe(true);
    }
    expect(highlightForFeature('unknown')).toBeNull();
    expect(highlightForFeature(null)).toBeNull();
    expect(FEATURE_ANCHORS['square-terraces']!.levelIds).toHaveLength(5);
    expect(FEATURE_ANCHORS['circular-platforms']!.levelIds).toHaveLength(3);
  });

  it('highlights the right zone for each realm', () => {
    expect(highlightForRealm('kamadhatu')).toEqual({ levelIds: ['base'], smallStupas: false });
    expect(highlightForRealm('rupadhatu')!.levelIds).toHaveLength(5);
    expect(highlightForRealm('arupadhatu')).toMatchObject({ smallStupas: true });
    expect(highlightForRealm('arupadhatu')!.levelIds).toHaveLength(4);
  });

  it('chooses the artistic light from the selection only', () => {
    expect(skyToneFor('awakening', 'present', 'kamadhatu')).toBe('dawn');
    expect(skyToneFor('centuries', 'nineteenth-century', 'kamadhatu')).toBe('night');
    expect(skyToneFor('centuries', 'restoration', 'kamadhatu')).toBe('dawn');
    expect(
      (['kamadhatu', 'rupadhatu', 'arupadhatu'] as const).map((realm) =>
        skyToneFor('ascent', 'present', realm),
      ),
    ).toEqual(['night', 'dawn', 'day']);
    for (const tone of ['night', 'dawn', 'day'] as const)
      expect(ATMOSPHERES[tone].fogFar).toBeGreaterThan(ATMOSPHERES[tone].fogNear);
  });

  it('draws the same sky on every visit', () => {
    const first = seededSequence(72);
    const second = seededSequence(72);
    const values = Array.from({ length: 50 }, () => first());
    expect(Array.from({ length: 50 }, () => second())).toEqual(values);
    expect(values.every((value) => value >= 0 && value < 1)).toBe(true);
    for (let step = 0; step < 64; step += 1)
      expect(ridgeHeight((step / 64) * Math.PI * 2, 0)).toBeGreaterThan(0);
  });

  it('spreads relief hotspots along one wall without overlap', () => {
    const xs = [0, 1, 2].map((i) => reliefHotspotPosition(i, 3)[0]);
    expect(xs[1]).toBe(0);
    expect(xs[1]! - xs[0]!).toBeGreaterThanOrEqual(2.5);
    expect(reliefHotspotPosition(0, 1)[0]).toBe(0);
  });
});

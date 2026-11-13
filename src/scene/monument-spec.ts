import type { RealmId } from '@/content/schema';

/**
 * ILLUSTRATIVE GEOMETRY — NOT A SURVEYED RECONSTRUCTION.
 *
 * Every number in this file is an art-direction parameter chosen so the
 * schematic reads clearly on screen. None of them is a measurement of
 * Borobudur. Only the *counts* follow the cited UNESCO description: a base,
 * five square terraces, three circular platforms, a central stupa and 72 small
 * stupas. The split of the 72 across the three rings is a drawing choice that
 * has NOT been source-verified in this repository.
 */

export type LevelShape = 'square' | 'circle' | 'stupa';

export type MonumentLevel = {
  id: string;
  realm: RealmId;
  shape: LevelShape;
  /** Half-width for squares, radius for circles and the stupa (scene units). */
  extent: number;
  height: number;
  /** Bottom of the level above the ground plane (derived). */
  y: number;
};

const RAW_LEVELS: Omit<MonumentLevel, 'y'>[] = [
  { id: 'base', realm: 'kamadhatu', shape: 'square', extent: 6.4, height: 0.5 },
  { id: 'square-1', realm: 'rupadhatu', shape: 'square', extent: 5.6, height: 0.55 },
  { id: 'square-2', realm: 'rupadhatu', shape: 'square', extent: 5.0, height: 0.55 },
  { id: 'square-3', realm: 'rupadhatu', shape: 'square', extent: 4.4, height: 0.55 },
  { id: 'square-4', realm: 'rupadhatu', shape: 'square', extent: 3.8, height: 0.55 },
  { id: 'square-5', realm: 'rupadhatu', shape: 'square', extent: 3.2, height: 0.55 },
  { id: 'circle-1', realm: 'arupadhatu', shape: 'circle', extent: 2.7, height: 0.3 },
  { id: 'circle-2', realm: 'arupadhatu', shape: 'circle', extent: 2.1, height: 0.3 },
  { id: 'circle-3', realm: 'arupadhatu', shape: 'circle', extent: 1.5, height: 0.3 },
  { id: 'main-stupa', realm: 'arupadhatu', shape: 'stupa', extent: 0.8, height: 1.7 },
];

export const MONUMENT_LEVELS: readonly MonumentLevel[] = RAW_LEVELS.reduce<MonumentLevel[]>(
  (levels, level) => {
    const previous = levels[levels.length - 1];
    return [...levels, { ...level, y: previous ? previous.y + previous.height : 0 }];
  },
  [],
);

export const MONUMENT_HEIGHT = MONUMENT_LEVELS.reduce((sum, level) => sum + level.height, 0);

/** Small stupas per circular platform (drawing choice; total must be 72). */
export const RING_STUPA_COUNTS: Record<string, number> = {
  'circle-1': 32,
  'circle-2': 24,
  'circle-3': 16,
};

export const SMALL_STUPA = { radius: 0.13, height: 0.3 } as const;

export type SmallStupaPlacement = {
  levelId: string;
  levelIndex: number;
  x: number;
  y: number;
  z: number;
};

export function smallStupaPlacements(): SmallStupaPlacement[] {
  return MONUMENT_LEVELS.flatMap((level, levelIndex) => {
    const count = RING_STUPA_COUNTS[level.id];
    if (!count) return [];
    const ringRadius = level.extent - 0.26;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        levelId: level.id,
        levelIndex,
        x: Math.cos(angle) * ringRadius,
        y: level.y + level.height,
        z: Math.sin(angle) * ringRadius,
      };
    });
  });
}

/** Which parts of the illustrative model are emphasised. `null` = no emphasis. */
export type SceneHighlight = { levelIds: readonly string[]; smallStupas: boolean } | null;

export function highlightForRealm(realm: RealmId): SceneHighlight {
  return {
    levelIds: MONUMENT_LEVELS.filter((level) => level.realm === realm).map((level) => level.id),
    smallStupas: realm === 'arupadhatu',
  };
}

/**
 * Maps content feature IDs to parts of the drawing. This is scene wiring, not
 * historical data; a feature without an entry is simply not highlighted.
 */
export const FEATURE_ANCHORS: Record<string, NonNullable<SceneHighlight>> = {
  base: { levelIds: ['base'], smallStupas: false },
  'square-terraces': {
    levelIds: ['square-1', 'square-2', 'square-3', 'square-4', 'square-5'],
    smallStupas: false,
  },
  'circular-platforms': { levelIds: ['circle-1', 'circle-2', 'circle-3'], smallStupas: false },
  'openwork-stupas': { levelIds: [], smallStupas: true },
  'main-stupa': { levelIds: ['main-stupa'], smallStupas: false },
};

export function highlightForFeature(featureId: string | null): SceneHighlight {
  return featureId ? (FEATURE_ANCHORS[featureId] ?? null) : null;
}

/**
 * Where relief-story hotspots sit on the model: spread along the front wall of
 * the first square terrace. Positions are layout choices and do not indicate
 * where any real panel is located.
 */
export function reliefHotspotPosition(index: number, count: number): [number, number, number] {
  const wall = MONUMENT_LEVELS.find((level) => level.id === 'square-1') ?? MONUMENT_LEVELS[0]!;
  const spacing = 3;
  return [(index - (count - 1) / 2) * spacing, wall.y + wall.height / 2, wall.extent];
}

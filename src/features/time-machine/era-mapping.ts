import type { ChapterId, EraId } from '@/content/schema';

/**
 * Maps an era to a *visual treatment* of the illustrative model. These are
 * presentation layers, not historical data: nothing here encodes a date, a
 * building sequence or a measured condition of the monument.
 */
export type EraTreatment = {
  /** How many levels (counted from the base) are drawn solid. */
  solidLevels: number;
  /** Levels above `solidLevels` are drawn as a faint outline instead of hidden. */
  ghostRemaining: boolean;
  /** `sketch` = outline-only drawing; `stone` = shaded solid. */
  surface: 'stone' | 'sketch';
  /** Bronze line overlay used for the schematic "conservation" comparison. */
  wireOverlay: boolean;
};

export const TOTAL_LEVELS = 10;

const TREATMENTS: Record<EraId, EraTreatment> = {
  // Arbitrary schematic split: it does not represent a known construction phase.
  construction: { solidLevels: 3, ghostRemaining: true, surface: 'stone', wireOverlay: false },
  'nineteenth-century': {
    solidLevels: TOTAL_LEVELS,
    ghostRemaining: false,
    surface: 'sketch',
    wireOverlay: false,
  },
  restoration: {
    solidLevels: TOTAL_LEVELS,
    ghostRemaining: false,
    surface: 'stone',
    wireOverlay: true,
  },
  present: {
    solidLevels: TOTAL_LEVELS,
    ghostRemaining: false,
    surface: 'stone',
    wireOverlay: false,
  },
};

export function eraTreatment(era: EraId): EraTreatment {
  return TREATMENTS[era];
}

/** Era treatments are only shown in the "Across Centuries" chapter. */
export function sceneTreatment(chapter: ChapterId, era: EraId): EraTreatment {
  return chapter === 'centuries' ? TREATMENTS[era] : TREATMENTS.present;
}

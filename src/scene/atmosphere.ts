import type { ChapterId, EraId, RealmId } from '@/content/types';

/**
 * ARTISTIC SETTING — NOT A DEPICTION OF A REAL PLACE OR MOMENT.
 *
 * The sky, light, haze and distant ridges are art direction for the
 * illustrative model. They do not record the monument's surroundings, a time
 * of day at the site, or any historical condition. The ridge line is generic
 * and deliberately does not trace any named landform.
 */
export type SkyTone = 'night' | 'dawn' | 'day';

export type Atmosphere = {
  /** Sky gradient, top to bottom. */
  zenith: string;
  upper: string;
  band: string;
  horizon: string;
  /** Extra warmth added to the sky on the side the light comes from. */
  glow: string;
  glowStrength: number;
  fog: string;
  fogNear: number;
  fogFar: number;
  ground: string;
  ridgeNear: string;
  ridgeFar: string;
  stone: string;
  stoneDim: string;
  sunDisc: string;
  sunDiscOpacity: number;
  sunDiscScale: number;
  /** Elevation of the light source above the horizon, as the y part of a unit direction. */
  sunHeight: number;
  key: { color: string; intensity: number };
  rim: { color: string; intensity: number };
  hemisphere: { sky: string; ground: string; intensity: number };
  stars: number;
};

export const ATMOSPHERES: Record<SkyTone, Atmosphere> = {
  night: {
    zenith: '#05061a',
    upper: '#0e0f2e',
    band: '#1d1a47',
    horizon: '#33295c',
    glow: '#5b3a78',
    glowStrength: 0.55,
    fog: '#1a1740',
    fogNear: 26,
    fogFar: 120,
    ground: '#14132e',
    ridgeNear: '#100f2a',
    ridgeFar: '#1d1a45',
    stone: '#7f7c9e',
    stoneDim: '#5d5c88',
    sunDisc: '#cfd6ff',
    sunDiscOpacity: 0.5,
    sunDiscScale: 26,
    sunHeight: 0.34,
    key: { color: '#a9b8ff', intensity: 1.5 },
    rim: { color: '#c9b8ff', intensity: 0.9 },
    hemisphere: { sky: '#5a5fa8', ground: '#0c0b20', intensity: 0.75 },
    stars: 0.95,
  },
  dawn: {
    zenith: '#0f1030',
    upper: '#2a2258',
    band: '#7a3a62',
    horizon: '#e8824c',
    glow: '#ffc56b',
    glowStrength: 1,
    fog: '#5d3458',
    fogNear: 30,
    fogFar: 130,
    ground: '#3a2f5e',
    ridgeNear: '#2b1c40',
    ridgeFar: '#5a3058',
    stone: '#a59c9e',
    stoneDim: '#5f587a',
    sunDisc: '#ffd98a',
    sunDiscOpacity: 1,
    sunDiscScale: 44,
    sunHeight: 0.07,
    key: { color: '#ffd9b3', intensity: 1.7 },
    rim: { color: '#ffb155', intensity: 1.8 },
    hemisphere: { sky: '#7f72c4', ground: '#2b2147', intensity: 0.9 },
    stars: 0.45,
  },
  day: {
    zenith: '#3f6fb0',
    upper: '#86a9d6',
    band: '#f1cfa4',
    horizon: '#ffe6b3',
    glow: '#fff3cf',
    glowStrength: 0.9,
    fog: '#e9c9a4',
    fogNear: 34,
    fogFar: 140,
    ground: '#8a7566',
    ridgeNear: '#9c8590',
    ridgeFar: '#c9aea8',
    stone: '#c9b9a4',
    stoneDim: '#8f8590',
    sunDisc: '#fff6da',
    sunDiscOpacity: 1,
    sunDiscScale: 52,
    sunHeight: 0.3,
    key: { color: '#fff0d2', intensity: 2.4 },
    rim: { color: '#ffe0a8', intensity: 1.4 },
    hemisphere: { sky: '#bcd2f2', ground: '#7a6558', intensity: 1.05 },
    stars: 0,
  },
};

/**
 * Which light the scene is shown in. A presentation choice only: the ascent
 * brightens as the visitor moves up, and the outline-only period card is shown
 * against a night sky so its lines stay legible.
 */
export function skyToneFor(chapter: ChapterId, era: EraId, realm: RealmId): SkyTone {
  if (chapter === 'ascent')
    return realm === 'kamadhatu' ? 'night' : realm === 'rupadhatu' ? 'dawn' : 'day';
  if (chapter === 'centuries' && era === 'nineteenth-century') return 'night';
  return 'dawn';
}

/** Horizontal direction the light comes from (unit vector in the ground plane). */
export const SUN_AZIMUTH: readonly [number, number] = [-0.552, -0.834];

/** Deterministic pseudo-random sequence so the sky is identical on every visit. */
export function seededSequence(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

/** Height of the generic ridge line at an angle around the horizon (scene units). */
export function ridgeHeight(angle: number, layer: number): number {
  const a = angle + layer * 1.7;
  const wave =
    Math.sin(a * 3) * 0.5 + Math.sin(a * 7 + 1.3) * 0.28 + Math.sin(a * 13 + 0.4) * 0.14 + 0.9;
  return Math.max(0.6, wave) * (4.5 + layer * 3.5);
}

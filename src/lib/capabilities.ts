import type { SceneQuality } from '@/features/experience/controller';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function isWebGLAvailable(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

type HintedNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/**
 * Picks a conservative starting quality from standard, optional hints.
 * `none` means "do not start WebGL"; the HTML experience stays complete.
 */
export function detectSceneQuality(): SceneQuality {
  if (!isWebGLAvailable()) return 'none';
  const nav = navigator as HintedNavigator;
  const saveData =
    nav.connection?.saveData === true ||
    window.matchMedia('(prefers-reduced-data: reduce)').matches;
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
  const coarseSmallScreen =
    window.matchMedia('(pointer: coarse)').matches &&
    Math.min(window.innerWidth, window.innerHeight) < 600;
  if (saveData || lowMemory || coarseSmallScreen) return 'low';
  return (nav.hardwareConcurrency ?? 4) >= 8 ? 'high' : 'medium';
}

export const QUALITY_SETTINGS: Record<
  Exclude<SceneQuality, 'none'>,
  {
    maxDpr: number;
    radialSegments: number;
    antialias: boolean;
    edges: boolean;
    shadows: boolean;
    shadowMapSize: number;
  }
> = {
  low: {
    maxDpr: 1.5,
    radialSegments: 24,
    antialias: true,
    edges: true,
    shadows: false,
    shadowMapSize: 0,
  },
  medium: {
    maxDpr: 1.5,
    radialSegments: 40,
    antialias: true,
    edges: true,
    shadows: true,
    shadowMapSize: 1024,
  },
  high: {
    maxDpr: 2,
    radialSegments: 64,
    antialias: true,
    edges: true,
    shadows: true,
    shadowMapSize: 2048,
  },
};

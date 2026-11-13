import type { ChapterId, RealmId } from '@/content/types';

/**
 * Camera waypoints are art-direction parameters for the illustrative model,
 * not surveyed geospatial coordinates. Recalibrate after any model change.
 */
export type CameraWaypoint = {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
  near?: number;
  far?: number;
  durationSeconds: number;
};

export type WaypointKey = 'intro' | Exclude<ChapterId, 'ascent'> | `ascent:${RealmId}`;

export const DEFAULT_FOV = 38;
/** Hard ceiling for the optional opening glide (docs/02 §6). */
export const MAX_INTRO_SECONDS = 4;
export const INTRO_GLIDE_SECONDS = 3.6;

export const WAYPOINTS: Record<WaypointKey, CameraWaypoint> = {
  intro: { position: [24, 10, 28], target: [0, 2.2, 0], durationSeconds: 0 },
  awakening: { position: [15, 7.8, 18], target: [0, 2.3, 0], durationSeconds: 1.4 },
  centuries: { position: [0, 5.6, 24], target: [0, 2.6, 0], durationSeconds: 1.4 },
  architecture: { position: [12, 19.5, 12], target: [0, 1.2, 0], durationSeconds: 1.4 },
  // Faces the front wall that carries the relief-story hotspots.
  stories: { position: [4.5, 3.8, 15.5], target: [0, 1.5, 5], durationSeconds: 1.4 },
  'ascent:kamadhatu': { position: [13.5, 3, 16], target: [0, 1.6, 0], durationSeconds: 1.4 },
  'ascent:rupadhatu': { position: [11, 5.8, 13.5], target: [0, 2.2, 0], durationSeconds: 1.4 },
  'ascent:arupadhatu': { position: [6.2, 7.4, 7.6], target: [0, 4.4, 0], durationSeconds: 1.4 },
};

export function waypointKeyFor(chapter: ChapterId, realm: RealmId): WaypointKey {
  return chapter === 'ascent' ? `ascent:${realm}` : chapter;
}

/** Orbit limits for Explore mode: stay above ground and outside the mesh. */
export const EXPLORE_LIMITS = {
  minDistance: 9,
  maxDistance: 34,
  minPolarAngle: 0.25,
  maxPolarAngle: Math.PI / 2 - 0.08,
} as const;

/**
 * Narrow (portrait) viewports widen the vertical field of view so the whole
 * illustrative model stays in frame instead of being cropped at the sides.
 */
export function fovForAspect(baseFov: number, aspect: number): number {
  const referenceAspect = 1.3;
  if (!Number.isFinite(aspect) || aspect <= 0 || aspect >= referenceAspect) return baseFov;
  const half = Math.tan((baseFov * Math.PI) / 360) * (referenceAspect / aspect);
  return Math.min(78, (Math.atan(half) * 360) / Math.PI);
}

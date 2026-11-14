/**
 * Aerial flight over the real site, drawn by Google Maps (ADR-025).
 *
 * Everything here is a camera choice made for this project. The stops are not
 * a historical route, and the target is an approximate look-at point near the
 * coordinates UNESCO lists for the property — it is not a surveyed position.
 * Imagery, terrain and any 3D mesh are supplied by Google at view time; none of
 * it is stored in this repository.
 */

export type FlyoverCamera = {
  center: { lat: number; lng: number; altitude: number };
  /** Degrees clockwise from north that the camera faces. */
  heading: number;
  /** 0 looks straight down; 90 looks at the horizon. */
  tilt: number;
  /** Metres between camera and target. */
  range: number;
};

/** Approximate look-at point. Altitude is metres above sea level, chosen by estimate. */
export const FLYOVER_TARGET = { lat: -7.6079, lng: 110.2038, altitude: 270 } as const;

export const FLYOVER_STOP_IDS = ['arrival', 'circuit', 'overhead', 'summit', 'departure'] as const;
export type FlyoverStopId = (typeof FLYOVER_STOP_IDS)[number];

export type FlyoverStop = {
  id: FlyoverStopId;
  heading: number;
  tilt: number;
  range: number;
  /** Time to travel to this stop from the previous one. */
  travelMs: number;
  /** When set, the camera circles the target once after arriving. */
  orbitMs?: number;
};

export const FLYOVER_STOPS: readonly FlyoverStop[] = [
  { id: 'arrival', heading: 270, tilt: 70, range: 900, travelMs: 9000 },
  { id: 'circuit', heading: 270, tilt: 62, range: 620, travelMs: 5000, orbitMs: 40000 },
  { id: 'overhead', heading: 0, tilt: 0, range: 480, travelMs: 8000 },
  { id: 'summit', heading: 315, tilt: 66, range: 280, travelMs: 9000, orbitMs: 30000 },
  { id: 'departure', heading: 180, tilt: 74, range: 2600, travelMs: 10000 },
];

/** Where the camera sits before the first stop: high and far, facing the same way as the arrival. */
export const FLYOVER_OPENING: FlyoverCamera = {
  center: { ...FLYOVER_TARGET },
  heading: 270,
  tilt: 45,
  range: 6000,
};

/** Pause on each stop before the tour moves on by itself. */
export const FLYOVER_DWELL_MS = 2500;
/** Give up waiting for Google Maps after this long and show the failure state. */
export const FLYOVER_LOAD_TIMEOUT_MS = 20000;

export function cameraForStop(stop: FlyoverStop): FlyoverCamera {
  return {
    center: { ...FLYOVER_TARGET },
    heading: stop.heading,
    tilt: stop.tilt,
    range: stop.range,
  };
}

export function clampStopIndex(index: number): number {
  if (!Number.isFinite(index)) return 0;
  return Math.min(FLYOVER_STOPS.length - 1, Math.max(0, Math.trunc(index)));
}

export const isLastStop = (index: number) => index >= FLYOVER_STOPS.length - 1;

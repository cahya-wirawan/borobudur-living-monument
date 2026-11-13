import type { SceneQuality } from '@/features/experience/controller';

/**
 * Runtime quality adaptation. The scene renders on demand, so frames only
 * arrive in bursts (camera transitions, orbiting). We judge those bursts and
 * step the quality down when the device cannot keep up. Quality never steps
 * back up within a visit, which avoids oscillation, and never drops to "none":
 * turning 3D off is the visitor's choice or a real failure, not a guess.
 */

export type RenderableQuality = Exclude<SceneQuality, 'none'>;

/** Frames further apart than this are separate bursts, not a slow frame. */
export const IDLE_GAP_MS = 250;
/** How many in-burst frame intervals make one judgement. */
export const FRAME_SAMPLE_SIZE = 45;
/** Below this median frame rate the next lower preset is selected. */
export const MIN_ACCEPTABLE_FPS = 24;

export function medianFps(frameIntervalsMs: readonly number[]): number | null {
  if (frameIntervalsMs.length === 0) return null;
  const sorted = [...frameIntervalsMs].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)]!;
  return median > 0 ? 1000 / median : null;
}

export function shouldDegrade(frameIntervalsMs: readonly number[]): boolean {
  if (frameIntervalsMs.length < FRAME_SAMPLE_SIZE) return false;
  const fps = medianFps(frameIntervalsMs);
  return fps !== null && fps < MIN_ACCEPTABLE_FPS;
}

export function lowerQuality(quality: RenderableQuality): RenderableQuality | null {
  if (quality === 'high') return 'medium';
  if (quality === 'medium') return 'low';
  return null;
}

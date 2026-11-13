import { describe, expect, it } from 'vitest';
import {
  FRAME_SAMPLE_SIZE,
  MIN_ACCEPTABLE_FPS,
  lowerQuality,
  medianFps,
  shouldDegrade,
} from './performance';

const frames = (ms: number, count = FRAME_SAMPLE_SIZE) => Array.from({ length: count }, () => ms);

describe('quality adaptation', () => {
  it('computes a median frame rate that ignores a few outliers', () => {
    expect(medianFps([])).toBeNull();
    expect(Math.round(medianFps(frames(16.7))!)).toBe(60);
    expect(Math.round(medianFps([...frames(16.7, 40), 200, 220, 240])!)).toBe(60);
  });

  it('only judges a full sample and only degrades below the threshold', () => {
    const slow = 1000 / (MIN_ACCEPTABLE_FPS - 4);
    const fine = 1000 / (MIN_ACCEPTABLE_FPS + 6);
    expect(shouldDegrade(frames(slow, FRAME_SAMPLE_SIZE - 1))).toBe(false);
    expect(shouldDegrade(frames(slow))).toBe(true);
    expect(shouldDegrade(frames(fine))).toBe(false);
  });

  it('steps down one preset at a time and stops at low', () => {
    expect(lowerQuality('high')).toBe('medium');
    expect(lowerQuality('medium')).toBe('low');
    expect(lowerQuality('low')).toBeNull();
  });
});

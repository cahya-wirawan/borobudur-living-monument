import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createInitialState, createReducer } from '@/features/experience/controller';
import { getDictionary } from '@/i18n/dictionaries';
import {
  FLYOVER_DWELL_MS,
  FLYOVER_OPENING,
  FLYOVER_STOPS,
  FLYOVER_STOP_IDS,
  FLYOVER_TARGET,
  cameraForStop,
  clampStopIndex,
  isLastStop,
} from './tour';

const loadMaps3D = vi.fn();
vi.mock('./google-maps', () => ({
  loadMaps3D: (locale: string) => loadMaps3D(locale),
  onMapsAuthFailure: () => () => {},
  isFlyoverConfigured: true,
}));

import FlyoverStage from './FlyoverStage';

const calls: { method: string; options?: Record<string, unknown> }[] = [];

class FakeMap extends HTMLElement {
  flyCameraTo(options: Record<string, unknown>) {
    calls.push({ method: 'flyCameraTo', options });
  }
  flyCameraAround(options: Record<string, unknown>) {
    calls.push({ method: 'flyCameraAround', options });
  }
  stopCameraAnimation() {
    calls.push({ method: 'stopCameraAnimation' });
  }
}
if (!customElements.get('fake-map-3d')) customElements.define('fake-map-3d', FakeMap);

const en = getDictionary('en').flyover;

beforeEach(() => {
  calls.length = 0;
  window.sessionStorage.clear();
  loadMaps3D.mockReset();
  loadMaps3D.mockResolvedValue({ Map3DElement: FakeMap });
});
afterEach(() => vi.useRealTimers());

describe('flight plan', () => {
  it('has one stop per caption in both languages and stays near the target', () => {
    expect(FLYOVER_STOPS.map((stop) => stop.id)).toEqual([...FLYOVER_STOP_IDS]);
    for (const locale of ['en', 'id'] as const)
      expect(Object.keys(getDictionary(locale).flyover.stops).sort()).toEqual(
        [...FLYOVER_STOP_IDS].sort(),
      );
    for (const stop of FLYOVER_STOPS) {
      expect(stop.tilt).toBeGreaterThanOrEqual(0);
      expect(stop.tilt).toBeLessThan(90);
      expect(stop.range).toBeGreaterThan(100);
      expect(stop.travelMs).toBeGreaterThan(0);
      expect(cameraForStop(stop).center).toEqual(FLYOVER_TARGET);
    }
    expect(FLYOVER_OPENING.range).toBeGreaterThan(FLYOVER_STOPS[0]!.range);
  });

  it('clamps stop indexes', () => {
    expect(clampStopIndex(-3)).toBe(0);
    expect(clampStopIndex(99)).toBe(FLYOVER_STOPS.length - 1);
    expect(clampStopIndex(Number.NaN)).toBe(0);
    expect(isLastStop(FLYOVER_STOPS.length - 1)).toBe(true);
    expect(isLastStop(0)).toBe(false);
  });
});

describe('flyover state', () => {
  const reducer = createReducer({ reliefIds: [], featureIds: [] });
  it('opens on request and closes when the visitor moves to another chapter', () => {
    const initial = createInitialState('en');
    expect(initial.flyoverOpen).toBe(false);
    const open = reducer(initial, { type: 'SET_FLYOVER', open: true });
    expect(open.flyoverOpen).toBe(true);
    expect(reducer(open, { type: 'SET_FLYOVER', open: true })).toBe(open);
    expect(reducer(open, { type: 'NAVIGATE_CHAPTER', chapter: 'ascent' }).flyoverOpen).toBe(false);
  });
});

describe('FlyoverStage', () => {
  it('contacts Google only after the visitor agrees', async () => {
    const onClose = vi.fn();
    const { container } = render(<FlyoverStage locale="en" motion="full" onClose={onClose} />);
    expect(screen.getByRole('heading', { name: en.consentTitle })).toBeVisible();
    expect(screen.getByRole('link', { name: en.privacyLink })).toHaveAttribute(
      'href',
      'https://policies.google.com/privacy',
    );
    expect(loadMaps3D).not.toHaveBeenCalled();
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);

    fireEvent.click(screen.getByRole('button', { name: en.decline }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(loadMaps3D).not.toHaveBeenCalled();
  });

  it('flies to the first stop, then pauses and steps on request', async () => {
    render(<FlyoverStage locale="en" motion="full" onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: en.start }));
    await screen.findByRole('group', { name: en.controlsLabel });
    expect(loadMaps3D).toHaveBeenCalledWith('en');
    expect(screen.getByTestId('flyover-map').querySelector('fake-map-3d')).not.toBeNull();
    expect(calls.at(-1)).toMatchObject({
      method: 'flyCameraTo',
      options: { durationMillis: FLYOVER_STOPS[0]!.travelMs },
    });
    expect(screen.getByTestId('flyover-caption')).toHaveTextContent('View 1 of 5.');

    fireEvent.click(screen.getByRole('button', { name: en.pause }));
    expect(calls.at(-1)?.method).toBe('stopCameraAnimation');

    fireEvent.click(screen.getByRole('button', { name: en.next }));
    expect(screen.getByTestId('flyover-caption')).toHaveTextContent(en.stops.circuit);
    expect(calls.at(-1)).toMatchObject({ method: 'flyCameraTo' });
    expect(screen.getByRole('button', { name: en.play })).toBeVisible();
  });

  it('circles after arriving at an orbit stop and moves on after the pause', async () => {
    render(<FlyoverStage locale="en" motion="full" onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: en.start }));
    await screen.findByRole('group', { name: en.controlsLabel });
    const map = screen.getByTestId('flyover-map').querySelector('fake-map-3d')!;

    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    // Each leg "ends" well after it started, as a real flight would.
    let clock = performance.now();
    const now = vi.spyOn(performance, 'now').mockImplementation(() => clock);
    const end = () => {
      clock += 5000;
      act(() => void map.dispatchEvent(new Event('gmp-animationend')));
    };
    end(); // arrival reached: no orbit, so the pause starts
    act(() => void vi.advanceTimersByTime(FLYOVER_DWELL_MS));
    expect(screen.getByTestId('flyover-caption')).toHaveTextContent(en.stops.circuit);
    end(); // travelled to the circuit stop
    expect(calls.at(-1)).toMatchObject({
      method: 'flyCameraAround',
      options: { repeatCount: 1, durationMillis: FLYOVER_STOPS[1]!.orbitMs },
    });
    now.mockRestore();
  });

  it('never moves by itself under reduced motion', async () => {
    render(<FlyoverStage locale="en" motion="reduced" onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: en.start }));
    await screen.findByRole('group', { name: en.controlsLabel });
    expect(screen.queryByRole('button', { name: en.pause })).toBeNull();
    expect(screen.queryByRole('button', { name: en.play })).toBeNull();
    expect(calls.filter((call) => call.method === 'flyCameraAround')).toHaveLength(0);
    expect(calls.at(-1)).toMatchObject({ method: 'flyCameraTo', options: { durationMillis: 0 } });
  });

  it('shows a recoverable failure when Google Maps does not load', async () => {
    loadMaps3D.mockRejectedValueOnce(new Error('blocked'));
    const onClose = vi.fn();
    render(<FlyoverStage locale="id" motion="full" onClose={onClose} />);
    const id = getDictionary('id').flyover;
    fireEvent.click(screen.getByRole('button', { name: id.start }));
    expect(await screen.findByRole('alert')).toHaveTextContent(id.failedBody);
    fireEvent.click(screen.getByRole('button', { name: id.retry }));
    await waitFor(() => expect(loadMaps3D).toHaveBeenCalledTimes(2));
    await screen.findByRole('group', { name: id.controlsLabel });
  });
});

import { describe, expect, it } from 'vitest';
import {
  createInitialState,
  createReducer,
  toLinkable,
  type ExperienceAction,
  type ExperienceState,
} from './controller';

const reducer = createReducer({
  reliefIds: ['demo-panel-01', 'demo-panel-02'],
  featureIds: ['base', 'main-stupa'],
});
const initial = createInitialState('en');
const run = (actions: ExperienceAction[], state: ExperienceState = initial) =>
  actions.reduce(reducer, state);

describe('experience reducer', () => {
  it('starts on safe defaults with conservative capabilities', () => {
    expect(initial).toMatchObject({
      locale: 'en',
      mode: 'guided',
      chapter: 'awakening',
      era: 'present',
      realm: 'kamadhatu',
      activeFeatureId: null,
      activeReliefId: null,
      motion: 'reduced',
      sceneQuality: 'none',
      sourceDrawerOpen: false,
    });
  });

  it('navigates chapters and keeps era, realm and mode', () => {
    const state = run([
      { type: 'CHANGE_ERA', era: 'restoration' },
      { type: 'SELECT_REALM', realm: 'rupadhatu' },
      { type: 'SET_MODE', mode: 'explore' },
      { type: 'NAVIGATE_CHAPTER', chapter: 'ascent' },
    ]);
    expect(toLinkable(state)).toEqual({
      mode: 'explore',
      chapter: 'ascent',
      era: 'restoration',
      realm: 'rupadhatu',
      activeFeatureId: null,
      activeReliefId: null,
    });
  });

  it('is pure: the previous state object is never mutated', () => {
    const frozen = Object.freeze({ ...initial });
    const next = reducer(frozen, { type: 'NAVIGATE_CHAPTER', chapter: 'stories' });
    expect(next).not.toBe(frozen);
    expect(frozen.chapter).toBe('awakening');
  });

  it.each<ExperienceAction>([
    { type: 'NAVIGATE_CHAPTER', chapter: 'atlantis' as never },
    { type: 'CHANGE_ERA', era: '1814' as never },
    { type: 'SELECT_REALM', realm: 'nirvana' as never },
    { type: 'OPEN_RELIEF', id: 'panel-that-does-not-exist' },
    { type: 'OPEN_RELIEF', id: '../../etc/passwd' },
    { type: 'SELECT_FEATURE', id: 'golden-roof' },
    { type: 'SELECT_FEATURE', id: null },
    { type: 'SET_MODE', mode: 'admin' as never },
    { type: 'SET_MOTION', motion: 'wild' as never },
    { type: 'SET_QUALITY', quality: 'ultra' as never },
    { type: 'UNKNOWN' } as never,
  ])('rejects invalid action %j by returning the same state', (action) => {
    expect(reducer(initial, action)).toBe(initial);
  });

  it('opens a known relief inside the stories chapter and closes it on chapter change', () => {
    const open = run([{ type: 'OPEN_RELIEF', id: 'demo-panel-01' }]);
    expect(open).toMatchObject({ chapter: 'stories', activeReliefId: 'demo-panel-01' });
    expect(run([{ type: 'CLOSE_RELIEF' }], open).activeReliefId).toBeNull();
    expect(run([{ type: 'NAVIGATE_CHAPTER', chapter: 'ascent' }], open).activeReliefId).toBeNull();
  });

  it('closes the source drawer when the chapter changes', () => {
    const state = run([
      { type: 'SET_SOURCE_DRAWER', open: true },
      { type: 'NAVIGATE_CHAPTER', chapter: 'centuries' },
    ]);
    expect(state.sourceDrawerOpen).toBe(false);
  });

  it('RESTORE sanitises history state and preserves device capabilities', () => {
    const capable = run([
      { type: 'SET_MOTION', motion: 'full' },
      { type: 'SET_QUALITY', quality: 'high' },
    ]);
    const restored = reducer(capable, {
      type: 'RESTORE',
      linkable: {
        mode: 'explore',
        chapter: 'ascent',
        era: 'bogus' as never,
        realm: 'arupadhatu',
        activeFeatureId: 'main-stupa',
        activeReliefId: 'nope',
      },
    });
    expect(restored).toMatchObject({
      mode: 'explore',
      chapter: 'ascent',
      era: 'present',
      realm: 'arupadhatu',
      activeFeatureId: null,
      activeReliefId: null,
      motion: 'full',
      sceneQuality: 'high',
    });
    expect(reducer(restored, { type: 'RESTORE', linkable: toLinkable(restored) })).toBe(restored);
  });
});

describe('M2 selections', () => {
  it('highlights a known feature inside the architecture chapter and can clear it', () => {
    const selected = run([{ type: 'SELECT_FEATURE', id: 'main-stupa' }]);
    expect(selected).toMatchObject({ chapter: 'architecture', activeFeatureId: 'main-stupa' });
    expect(run([{ type: 'SELECT_FEATURE', id: null }], selected).activeFeatureId).toBeNull();
    expect(run([{ type: 'SELECT_FEATURE', id: 'base' }], selected).activeFeatureId).toBe('base');
  });

  it('clears the feature when leaving the chapter', () => {
    const state = run([
      { type: 'SELECT_FEATURE', id: 'base' },
      { type: 'NAVIGATE_CHAPTER', chapter: 'stories' },
    ]);
    expect(state.activeFeatureId).toBeNull();
  });

  it('RESTORE keeps a feature only inside the architecture chapter', () => {
    const base = { ...toLinkable(initial), activeFeatureId: 'base' };
    expect(
      reducer(initial, { type: 'RESTORE', linkable: { ...base, chapter: 'architecture' } })
        .activeFeatureId,
    ).toBe('base');
    expect(
      reducer(initial, { type: 'RESTORE', linkable: { ...base, chapter: 'ascent' } })
        .activeFeatureId,
    ).toBeNull();
  });

  it('moves directly between relief stories and closes the source drawer', () => {
    const state = run([
      { type: 'SET_SOURCE_DRAWER', open: true },
      { type: 'OPEN_RELIEF', id: 'demo-panel-01' },
      { type: 'OPEN_RELIEF', id: 'demo-panel-02' },
    ]);
    expect(state).toMatchObject({
      chapter: 'stories',
      activeReliefId: 'demo-panel-02',
      sourceDrawerOpen: false,
    });
  });
});

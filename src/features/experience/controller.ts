import {
  CHAPTER_IDS,
  ERA_IDS,
  REALM_IDS,
  type ChapterId,
  type EraId,
  type Locale,
  type RealmId,
} from '@/content/types';

/**
 * The single deterministic experience state (ADR-003). The 3D scene, GSAP
 * transitions and the URL all mirror this state; none of them own it.
 */

export const MODES = ['guided', 'explore', 'read'] as const;
export type Mode = (typeof MODES)[number];
export type MotionPolicy = 'full' | 'reduced';
export const SCENE_QUALITIES = ['low', 'medium', 'high', 'none'] as const;
export type SceneQuality = (typeof SCENE_QUALITIES)[number];

export type ExperienceState = {
  locale: Locale;
  mode: Mode;
  chapter: ChapterId;
  era: EraId;
  realm: RealmId;
  /** Highlighted architectural feature; only meaningful in the "architecture" chapter. */
  activeFeatureId: string | null;
  /** Open relief story; only meaningful in the "stories" chapter. */
  activeReliefId: string | null;
  motion: MotionPolicy;
  sceneQuality: SceneQuality;
  sourceDrawerOpen: boolean;
  /** The Google Maps flight covers the stage. Never restored from a link: it needs consent. */
  flyoverOpen: boolean;
};

/** The subset of state that is shareable through deep links. */
export type LinkableState = Pick<
  ExperienceState,
  'mode' | 'chapter' | 'era' | 'realm' | 'activeFeatureId' | 'activeReliefId'
>;

export type ExperienceAction =
  | { type: 'NAVIGATE_CHAPTER'; chapter: ChapterId }
  | { type: 'CHANGE_ERA'; era: EraId }
  | { type: 'SELECT_REALM'; realm: RealmId }
  | { type: 'SELECT_FEATURE'; id: string | null }
  | { type: 'OPEN_RELIEF'; id: string }
  | { type: 'CLOSE_RELIEF' }
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'SET_MOTION'; motion: MotionPolicy }
  | { type: 'SET_QUALITY'; quality: SceneQuality }
  | { type: 'SET_SOURCE_DRAWER'; open: boolean }
  | { type: 'SET_FLYOVER'; open: boolean }
  | { type: 'RESTORE'; linkable: LinkableState };

/** Allow-lists that come from the validated content pack. */
export type ContentIds = { reliefIds: readonly string[]; featureIds: readonly string[] };

export const DEFAULT_LINKABLE: LinkableState = {
  mode: 'guided',
  chapter: 'awakening',
  era: 'present',
  realm: 'kamadhatu',
  activeFeatureId: null,
  activeReliefId: null,
};

export function createInitialState(
  locale: Locale,
  linkable: Partial<LinkableState> = {},
): ExperienceState {
  return {
    locale,
    ...DEFAULT_LINKABLE,
    ...linkable,
    // Conservative until the client reports its real capabilities.
    motion: 'reduced',
    sceneQuality: 'none',
    sourceDrawerOpen: false,
    flyoverOpen: false,
  };
}

const includes = <T extends string>(list: readonly T[], value: unknown): value is T =>
  typeof value === 'string' && (list as readonly string[]).includes(value);

/**
 * Makes a linkable selection internally consistent: unknown IDs fall back to
 * defaults, a relief implies the "stories" chapter, and a feature only
 * survives inside the "architecture" chapter.
 */
export function normalizeLinkable(input: LinkableState, ids: ContentIds): LinkableState {
  const activeReliefId = includes(ids.reliefIds, input.activeReliefId)
    ? input.activeReliefId
    : null;
  const chapter = activeReliefId
    ? 'stories'
    : includes(CHAPTER_IDS, input.chapter)
      ? input.chapter
      : DEFAULT_LINKABLE.chapter;
  return {
    mode: includes(MODES, input.mode) ? input.mode : DEFAULT_LINKABLE.mode,
    chapter,
    era: includes(ERA_IDS, input.era) ? input.era : DEFAULT_LINKABLE.era,
    realm: includes(REALM_IDS, input.realm) ? input.realm : DEFAULT_LINKABLE.realm,
    activeFeatureId:
      chapter === 'architecture' && includes(ids.featureIds, input.activeFeatureId)
        ? input.activeFeatureId
        : null,
    activeReliefId,
  };
}

/**
 * Pure and side-effect free. Unknown or invalid IDs leave the state untouched
 * (same object identity), so callers can cheaply detect rejected actions.
 */
export function createReducer(ids: ContentIds) {
  return function reducer(state: ExperienceState, action: ExperienceAction): ExperienceState {
    switch (action.type) {
      case 'NAVIGATE_CHAPTER':
        if (!includes(CHAPTER_IDS, action.chapter) || action.chapter === state.chapter)
          return state;
        // Selections and overlays belong to the chapter they were made in.
        return {
          ...state,
          chapter: action.chapter,
          activeFeatureId: null,
          activeReliefId: null,
          sourceDrawerOpen: false,
          flyoverOpen: false,
        };
      case 'CHANGE_ERA':
        if (!includes(ERA_IDS, action.era) || action.era === state.era) return state;
        return { ...state, era: action.era };
      case 'SELECT_REALM':
        if (!includes(REALM_IDS, action.realm) || action.realm === state.realm) return state;
        return { ...state, realm: action.realm };
      case 'SELECT_FEATURE':
        if (action.id === state.activeFeatureId) return state;
        if (action.id === null) return { ...state, activeFeatureId: null };
        if (!includes(ids.featureIds, action.id)) return state;
        return {
          ...state,
          chapter: 'architecture',
          activeFeatureId: action.id,
          activeReliefId: null,
        };
      case 'OPEN_RELIEF':
        if (!includes(ids.reliefIds, action.id) || action.id === state.activeReliefId) return state;
        return {
          ...state,
          chapter: 'stories',
          activeFeatureId: null,
          activeReliefId: action.id,
          sourceDrawerOpen: false,
          flyoverOpen: false,
        };
      case 'CLOSE_RELIEF':
        return state.activeReliefId === null ? state : { ...state, activeReliefId: null };
      case 'SET_MODE':
        if (!includes(MODES, action.mode) || action.mode === state.mode) return state;
        return { ...state, mode: action.mode };
      case 'SET_MOTION':
        if (
          (action.motion !== 'full' && action.motion !== 'reduced') ||
          action.motion === state.motion
        )
          return state;
        return { ...state, motion: action.motion };
      case 'SET_QUALITY':
        if (!includes(SCENE_QUALITIES, action.quality) || action.quality === state.sceneQuality)
          return state;
        return { ...state, sceneQuality: action.quality };
      case 'SET_SOURCE_DRAWER':
        return action.open === state.sourceDrawerOpen
          ? state
          : { ...state, sourceDrawerOpen: action.open };
      case 'SET_FLYOVER':
        return action.open === state.flyoverOpen ? state : { ...state, flyoverOpen: action.open };
      case 'RESTORE': {
        const next = normalizeLinkable(action.linkable, ids);
        const unchanged = (Object.keys(next) as (keyof LinkableState)[]).every(
          (key) => next[key] === state[key],
        );
        return unchanged
          ? state
          : { ...state, ...next, sourceDrawerOpen: false, flyoverOpen: false };
      }
      default:
        return state;
    }
  };
}

export function toLinkable(state: ExperienceState): LinkableState {
  const { mode, chapter, era, realm, activeFeatureId, activeReliefId } = state;
  return { mode, chapter, era, realm, activeFeatureId, activeReliefId };
}

'use client';

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { selectClaims } from '@/content/select';
import type { ContentPack, Locale } from '@/content/types';
import {
  ArchitectureExplorer,
  type ArchitectureView,
} from '@/features/architecture/ArchitectureExplorer';
import { RealmNavigation } from '@/features/ascent/RealmNavigation';
import { Recap } from '@/features/ascent/Recap';
import { CHAPTER_ORDER, chapterIndex } from '@/features/experience/chapters';
import {
  createInitialState,
  createReducer,
  toLinkable,
  type LinkableState,
  type Mode,
} from '@/features/experience/controller';
import { viewEvidence } from '@/features/experience/evidence';
import {
  contentIds,
  experienceHref,
  parseLinkableState,
  readHref,
} from '@/features/experience/url-state';
import { ReliefCatalog } from '@/features/reliefs/ReliefCatalog';
import { ReliefDetail } from '@/features/reliefs/ReliefDetail';
import { Timeline } from '@/features/time-machine/Timeline';
import { format, getDictionary } from '@/i18n/dictionaries';
import { otherLocale } from '@/i18n/locales';
import { REDUCED_MOTION_QUERY, detectSceneQuality, prefersReducedMotion } from '@/lib/capabilities';
import type { RenderableQuality } from '@/lib/performance';
import { track } from '@/lib/telemetry';
import type { WaypointKey } from '@/scene/waypoints';
import { ChapterNav } from './ChapterNav';
import { ClaimList } from './ClaimList';
import { EvidenceBadge } from './EvidenceBadge';
import { ModeSwitcher } from './ModeSwitcher';
import { PrototypeBanner } from './PrototypeBanner';
import { SceneStage, type SceneStatus } from './SceneStage';
import { SourceDrawer } from './SourceDrawer';

type IntroPhase = 'off' | 'armed' | 'playing';

const subscribeNever = () => () => {};

export function ExperienceShell({
  pack,
  locale,
  initial,
}: {
  pack: ContentPack;
  locale: Locale;
  initial: LinkableState;
}) {
  const t = getDictionary(locale);
  const ids = useMemo(() => contentIds(pack), [pack]);
  const reducer = useMemo(() => createReducer(ids), [ids]);
  // Server props are right on first load and on forward navigation (the address
  // bar still shows the previous page while this mounts). On a client-side return
  // to this route, e.g. Back from Read mode, the props are a cached older
  // selection and the address bar, already on this route, is the truth.
  const [start] = useState<LinkableState>(() =>
    typeof window !== 'undefined' && window.location.pathname === `/${locale}/experience`
      ? parseLinkableState(window.location.search, ids)
      : initial,
  );
  const [state, dispatch] = useReducer(reducer, undefined, () => createInitialState(locale, start));

  // Presentation-only flags. They never decide which content is shown.
  const [sceneRequested, setSceneRequested] = useState(
    start.chapter !== 'awakening' || start.mode === 'explore',
  );
  const [sceneReady, setSceneReady] = useState(false);
  const [architectureView, setArchitectureView] = useState<ArchitectureView>('3d');
  const [attempt, setAttempt] = useState(0);
  const [introPhase, setIntroPhase] = useState<IntroPhase>('off');
  const [skipToken, setSkipToken] = useState(0);
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

  // Mirror the visitor's motion preference into the experience state.
  useLayoutEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => dispatch({ type: 'SET_MOTION', motion: query.matches ? 'reduced' : 'full' });
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // WebGL is only probed after an intentional entry or an explicit deep link.
  useLayoutEffect(() => {
    if (sceneRequested) dispatch({ type: 'SET_QUALITY', quality: detectSceneQuality() });
  }, [sceneRequested]);

  // URL mirrors state. The first sync canonicalises; later changes add history entries.
  const firstSync = useRef(true);
  const linkable = useMemo(() => toLinkable(state), [state]);
  useEffect(() => {
    const target = experienceHref(locale, linkable);
    if (target !== window.location.pathname + window.location.search) {
      if (firstSync.current) window.history.replaceState(null, '', target);
      else window.history.pushState(null, '', target);
    }
    firstSync.current = false;
  }, [locale, linkable]);

  useEffect(() => {
    const restore = () =>
      dispatch({
        type: 'RESTORE',
        linkable: parseLinkableState(window.location.search, ids),
      });
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, [ids]);

  const chapter = pack.chapters.find((c) => c.id === state.chapter) ?? pack.chapters[0];
  const position = chapterIndex(state.chapter) + 1;
  const total = CHAPTER_ORDER.length;
  const chapterTitle = chapter?.title[locale] ?? '';

  useEffect(() => {
    document.title = `${chapterTitle} — ${t.meta.siteName}`;
  }, [chapterTitle, t.meta.siteName]);

  const sceneStatus: SceneStatus = !sceneRequested
    ? 'idle'
    : state.sceneQuality === 'none'
      ? hydrated
        ? 'failed'
        : 'idle'
      : sceneReady
        ? 'ready'
        : 'loading';
  const introPending =
    introPhase !== 'off' && state.chapter === 'awakening' && sceneStatus !== 'failed';

  const requestScene = useCallback(() => {
    setSceneRequested(true);
  }, []);
  const failScene = useCallback(() => {
    setSceneReady(false);
    setIntroPhase('off');
    dispatch({ type: 'SET_QUALITY', quality: 'none' });
    track('fallback_used');
  }, []);
  const retryScene = useCallback(() => {
    setSceneReady(false);
    setAttempt((value) => value + 1);
    dispatch({ type: 'SET_QUALITY', quality: detectSceneQuality() });
  }, []);
  const cancelScene = useCallback(() => {
    setSceneRequested(false);
    setSceneReady(false);
    setIntroPhase('off');
  }, []);
  const handleReady = useCallback(() => setSceneReady(true), []);
  const dropQuality = useCallback(
    (quality: RenderableQuality) => dispatch({ type: 'SET_QUALITY', quality }),
    [],
  );
  const handleArrive = useCallback((key: WaypointKey) => {
    setIntroPhase((phase) => (key === 'intro' && phase === 'armed' ? 'playing' : 'off'));
  }, []);
  const skipIntro = useCallback(() => {
    setIntroPhase('off');
    setSkipToken((value) => value + 1);
  }, []);

  const begin = (mode: Exclude<Mode, 'read'>) => {
    track('experience_started', { mode });
    if (mode === 'guided' && !prefersReducedMotion()) setIntroPhase('armed');
    dispatch({ type: 'SET_MODE', mode });
    requestScene();
  };

  const evidence = useMemo(
    () => viewEvidence(pack, state),
    // Only the linkable selection changes what a view asserts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pack, state.chapter, state.era, state.realm],
  );
  const chapterClaims = selectClaims(pack, chapter?.claimIds ?? []);
  const other = otherLocale(locale);
  const era = pack.eras.find((e) => e.id === state.era);
  const realm = pack.realms.find((r) => r.id === state.realm);
  const feature = pack.features.find((f) => f.id === state.activeFeatureId);
  const reliefIndex = pack.reliefs.findIndex((r) => r.id === state.activeReliefId);
  const relief = pack.reliefs[reliefIndex];
  const detailAnnouncement =
    state.chapter === 'centuries' && era
      ? format(t.era.announce, { label: era.label[locale] })
      : state.chapter === 'ascent' && realm
        ? format(t.realm.announce, { title: realm.title[locale] })
        : state.chapter === 'architecture' && feature
          ? format(t.architecture.announce, { title: feature.title[locale] })
          : state.chapter === 'stories' && relief
            ? format(t.relief.announce, { n: reliefIndex + 1, title: relief.title[locale] })
            : '';
  const openRelief = (id: string) => {
    track('relief_opened', { relief: id });
    dispatch({ type: 'OPEN_RELIEF', id });
  };
  const preferDiagram = state.chapter === 'architecture' && architectureView === 'diagram';

  return (
    <div
      data-testid="experience"
      data-chapter={state.chapter}
      data-mode={state.mode}
      data-motion={state.motion}
      data-quality={state.sceneQuality}
      data-hydrated={hydrated}
      className="bg-ink flex h-dvh flex-col text-white"
    >
      {/* Everything except the chapter bar scrolls, so the bar never covers a control. */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
        <a
          href="#main"
          className="bg-bronze text-ink sr-only z-50 px-4 py-2 font-medium focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
        >
          {t.common.skipToContent}
        </a>
        <PrototypeBanner pack={pack} locale={locale} />

        <header className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-bronze/30 px-3 py-2 sm:px-5">
          <Link href="/" className="flex min-h-11 items-baseline gap-2">
            <span className="font-display text-2xl leading-none">{t.common.wordmark}</span>
            <span className="eyebrow max-sm:hidden">{t.common.tagline}</span>
          </Link>
          <p
            aria-hidden="true"
            className="text-stone text-sm tabular-nums tracking-widest max-lg:hidden"
          >
            {format(t.chapters.progressShort, {
              current: String(position).padStart(2, '0'),
              total: String(total).padStart(2, '0'),
            })}
          </p>
          <div className="max-lg:w-full max-lg:order-last lg:order-2 lg:ml-auto">
            <ModeSwitcher
              locale={locale}
              state={state}
              onSelect={(mode) => {
                dispatch({ type: 'SET_MODE', mode });
                if (mode === 'explore') requestScene();
              }}
            />
          </div>
          <nav
            aria-label={t.common.mainNavLabel}
            className="ml-auto flex items-center gap-x-4 text-sm lg:order-3 lg:ml-0"
          >
            <Link
              href={`/${locale}/sources`}
              className="link-dark inline-flex min-h-11 items-center"
            >
              {t.nav.sources}
            </Link>
            <Link href={`/${locale}/about`} className="link-dark inline-flex min-h-11 items-center">
              {t.nav.about}
            </Link>
            <Link
              href={experienceHref(other, linkable)}
              lang={other}
              hrefLang={other}
              aria-label={format(t.common.switchLanguage, {
                language: t.common.languageNames[other],
              })}
              className="link-dark inline-flex min-h-11 items-center"
            >
              {t.common.languageNames[other]}
            </Link>
          </nav>
        </header>

        <main
          id="main"
          tabIndex={-1}
          className="grid flex-1 outline-none max-lg:shrink-0 lg:min-h-0 lg:grid-cols-[minmax(0,1.45fr)_minmax(24rem,0.85fr)]"
        >
          <SceneStage
            pack={pack}
            locale={locale}
            state={state}
            status={sceneStatus}
            attempt={attempt}
            preferDiagram={preferDiagram}
            introPending={introPending}
            introArmed={introPhase === 'armed'}
            skipToken={skipToken}
            onRequest={requestScene}
            onCancel={cancelScene}
            onRetry={retryScene}
            onReady={handleReady}
            onArrive={handleArrive}
            onFail={failScene}
            onQualityDrop={dropQuality}
            onSkipIntro={skipIntro}
            onHotspotActivate={openRelief}
          />

          <section
            aria-labelledby="chapter-title"
            className="border-bronze/30 px-5 py-7 sm:px-8 lg:overflow-y-auto lg:border-l lg:py-10"
          >
            <div key={state.chapter} className="mx-auto grid max-w-[62ch] gap-6">
              <header className="reveal grid gap-3">
                <p className="eyebrow">
                  {format(t.chapters.progress, { current: position, total })}
                </p>
                <h1 id="chapter-title" className="font-display text-5xl leading-[1.02] sm:text-6xl">
                  {chapterTitle}
                </h1>
                <p className="text-parchment text-lg leading-relaxed">{chapter?.summary[locale]}</p>
              </header>

              <div className="reveal-late grid gap-6">
                {state.chapter === 'awakening' && sceneStatus === 'idle' && (
                  <div role="group" aria-label={t.hero.entryLabel} className="grid gap-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="btn-primary" onClick={() => begin('guided')}>
                        {t.hero.begin}
                      </button>
                      <button type="button" className="btn-ghost" onClick={() => begin('explore')}>
                        {t.hero.exploreFreely}
                      </button>
                      <Link href={readHref(locale, state.chapter)} className="btn-ghost">
                        {t.hero.readInstead}
                      </Link>
                    </div>
                    <p className="text-stone text-sm">{t.hero.noAudio}</p>
                  </div>
                )}

                {state.chapter === 'centuries' && (
                  <Timeline
                    pack={pack}
                    value={state.era}
                    locale={locale}
                    onChange={(next) => {
                      track('era_selected', { era: next });
                      dispatch({ type: 'CHANGE_ERA', era: next });
                    }}
                  />
                )}

                {state.chapter === 'architecture' && (
                  <ArchitectureExplorer
                    pack={pack}
                    locale={locale}
                    activeFeatureId={state.activeFeatureId}
                    onSelect={(id) => dispatch({ type: 'SELECT_FEATURE', id })}
                    view={architectureView}
                    onViewChange={setArchitectureView}
                    canShow3d={sceneStatus === 'ready'}
                  />
                )}

                {state.chapter === 'stories' && (
                  <ReliefCatalog pack={pack} locale={locale} onOpen={openRelief} />
                )}

                {state.chapter === 'ascent' && (
                  <RealmNavigation
                    realms={pack.realms}
                    value={state.realm}
                    locale={locale}
                    onChange={(next) => dispatch({ type: 'SELECT_REALM', realm: next })}
                  />
                )}

                {/* Era and feature views list their own statements above. */}
                {state.chapter !== 'centuries' && !feature && (
                  <ClaimList claims={chapterClaims} pack={pack} locale={locale} />
                )}

                <div className="grid gap-2 border-t border-bronze/30 pt-4">
                  <p>
                    <EvidenceBadge status="artistic" locale={locale} />
                  </p>
                  <p className="text-stone text-sm">{t.chapters.captions[state.chapter]}</p>
                </div>

                {position === total && <Recap pack={pack} locale={locale} />}

                <p>
                  <button
                    type="button"
                    className="btn-ghost"
                    aria-haspopup="dialog"
                    onClick={() => {
                      track('source_opened', { chapter: state.chapter });
                      dispatch({ type: 'SET_SOURCE_DRAWER', open: true });
                    }}
                  >
                    {t.sources.open}
                  </button>
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <ChapterNav pack={pack} locale={locale} state={state} dispatch={dispatch} />

      <p aria-live="polite" data-testid="announcer" className="sr-only">
        {format(t.chapters.announce, { current: position, total, title: chapterTitle })}
      </p>
      <p aria-live="polite" data-testid="announcer-detail" className="sr-only">
        {detailAnnouncement}
      </p>

      <ReliefDetail
        pack={pack}
        locale={locale}
        activeReliefId={state.chapter === 'stories' ? state.activeReliefId : null}
        onOpen={openRelief}
        onClose={() => dispatch({ type: 'CLOSE_RELIEF' })}
      />

      <SourceDrawer
        open={state.sourceDrawerOpen}
        onClose={() => dispatch({ type: 'SET_SOURCE_DRAWER', open: false })}
        evidence={evidence}
        pack={pack}
        locale={locale}
      />
    </div>
  );
}

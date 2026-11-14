'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Component, useEffect, useRef, type ReactNode } from 'react';
import type { ContentPack, Locale } from '@/content/types';
import type { ExperienceState } from '@/features/experience/controller';
import { readHref } from '@/features/experience/url-state';
import { sceneTreatment } from '@/features/time-machine/era-mapping';
import { format, getDictionary } from '@/i18n/dictionaries';
import type { RenderableQuality } from '@/lib/performance';
import type { ExperienceCanvasProps, SceneHotspot } from '@/scene/ExperienceCanvas';
import { skyToneFor } from '@/scene/atmosphere';
import { highlightForFeature, highlightForRealm, type SceneHighlight } from '@/scene/monument-spec';
import { waypointKeyFor, type WaypointKey } from '@/scene/waypoints';
import { featureCallouts } from '@/features/architecture/callouts';
import { isFlyoverConfigured } from '@/features/flyover/google-maps';
import { MonumentSchematic } from './MonumentSchematic';

const ExperienceCanvas = dynamic<ExperienceCanvasProps>(() => import('@/scene/ExperienceCanvas'), {
  ssr: false,
});

class SceneErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const FlyoverStage = dynamic(() => import('@/features/flyover/FlyoverStage'), { ssr: false });

export type SceneStatus = 'idle' | 'loading' | 'ready' | 'failed';

/**
 * The visual column. The authored still diagram is always rendered first, so
 * there is never a blocking preloader: the 3D canvas is layered on top only
 * once it has actually initialized, and any failure falls back to the still.
 */
export function SceneStage({
  pack,
  locale,
  state,
  status,
  attempt,
  preferDiagram,
  introPending,
  introArmed,
  skipToken,
  onRequest,
  onCancel,
  onRetry,
  onReady,
  onArrive,
  onFail,
  onQualityDrop,
  onSkipIntro,
  onHotspotActivate,
  onFlyoverChange,
}: {
  pack: ContentPack;
  locale: Locale;
  state: ExperienceState;
  status: SceneStatus;
  attempt: number;
  /** Visitor chose the 2D diagram over the 3D model (architecture chapter). */
  preferDiagram: boolean;
  /** Show the Skip control. */
  introPending: boolean;
  /** Hold the camera at the opening pose until the glide starts. */
  introArmed: boolean;
  skipToken: number;
  onRequest: () => void;
  onCancel: () => void;
  onRetry: () => void;
  onReady: () => void;
  onArrive: (key: WaypointKey) => void;
  onFail: () => void;
  onQualityDrop: (quality: RenderableQuality) => void;
  onSkipIntro: () => void;
  onHotspotActivate: (id: string) => void;
  onFlyoverChange: (open: boolean) => void;
}) {
  const t = getDictionary(locale);
  const hotspotLayer = useRef<HTMLDivElement>(null);
  const flyoverTrigger = useRef<HTMLButtonElement>(null);
  const flyoverWasOpen = useRef(false);
  const flyoverOpen = isFlyoverConfigured && state.flyoverOpen;
  // Closing the flight returns focus to the control that opened it.
  useEffect(() => {
    if (flyoverWasOpen.current && !flyoverOpen) flyoverTrigger.current?.focus();
    flyoverWasOpen.current = flyoverOpen;
  }, [flyoverOpen]);
  const treatment = sceneTreatment(state.chapter, state.era);
  const tone = skyToneFor(state.chapter, state.era, state.realm);
  const highlight: SceneHighlight =
    state.chapter === 'ascent'
      ? highlightForRealm(state.realm)
      : state.chapter === 'architecture'
        ? highlightForFeature(state.activeFeatureId)
        : null;
  const callouts =
    state.chapter === 'architecture' ? featureCallouts(pack, state.activeFeatureId) : [];
  const hotspots: SceneHotspot[] =
    state.chapter === 'stories'
      ? pack.reliefs.map((relief, index) => ({
          id: relief.id,
          label: format(t.relief.hotspot, { n: index + 1 }),
          ariaLabel: format(t.relief.openTitled, { n: index + 1, title: relief.title[locale] }),
        }))
      : [];
  const model = pack.media.find((media) => media.id === 'monument-procedural-model');
  const diagram = pack.media.find((media) => media.id === 'monument-schematic-diagram');
  const canvasActive =
    (status === 'loading' || status === 'ready') && state.sceneQuality !== 'none';
  const showCanvas = status === 'ready' && !preferDiagram;
  const waypointKey: WaypointKey =
    introArmed && state.chapter === 'awakening'
      ? 'intro'
      : waypointKeyFor(state.chapter, state.realm);

  return (
    <section
      aria-label={t.scene.regionLabel}
      data-testid="scene-stage"
      data-scene-status={status}
      data-scene-view={flyoverOpen ? 'flyover' : showCanvas ? '3d' : 'diagram'}
      className="flex flex-col lg:min-h-0"
    >
      <div
        data-tone={tone}
        className={`scene-backdrop relative isolate flex-1 overflow-hidden lg:min-h-0 ${
          // The flight needs more room than the diagram on a phone.
          flyoverOpen ? 'min-h-[76svh]' : 'min-h-[42svh]'
        }`}
      >
        <div inert={flyoverOpen} className="contents">
          <div
            data-testid="scene-still"
            aria-hidden={showCanvas}
            className={`absolute inset-0 flex items-end justify-center px-6 pt-10 pb-16 transition-opacity duration-700 ${
              showCanvas ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <MonumentSchematic
              idPrefix="stage-still"
              title={t.scene.stillLabel}
              description={diagram?.alt[locale] ?? t.scene.schematicNote}
              treatment={treatment}
              highlight={highlight}
              callouts={callouts}
              className="h-full max-h-[70%] w-full max-w-3xl"
            />
          </div>

          {canvasActive && state.sceneQuality !== 'none' && (
            <div
              role="img"
              aria-label={model?.alt[locale] ?? t.scene.canvasDescription}
              aria-hidden={!showCanvas}
              data-testid="scene-canvas"
              className={`absolute inset-0 transition-opacity duration-700 ${
                showCanvas ? 'opacity-100' : 'opacity-0'
              } ${state.mode === 'explore' && showCanvas ? 'touch-none' : 'pointer-events-none'}`}
            >
              <SceneErrorBoundary key={attempt} onError={onFail}>
                <ExperienceCanvas
                  waypointKey={waypointKey}
                  mode={state.mode}
                  motion={state.motion}
                  quality={state.sceneQuality}
                  treatment={treatment}
                  highlight={highlight}
                  tone={tone}
                  hotspots={hotspots}
                  hotspotLayer={hotspotLayer}
                  skipToken={skipToken}
                  onReady={onReady}
                  onArrive={onArrive}
                  onContextLost={onFail}
                  onQualityDrop={onQualityDrop}
                  onHotspotActivate={onHotspotActivate}
                />
              </SceneErrorBoundary>
            </div>
          )}

          {/* Real, focusable hotspot buttons are portalled here, outside the role="img" canvas. */}
          <div
            ref={hotspotLayer}
            data-testid="scene-hotspots"
            className={`pointer-events-none absolute inset-0 overflow-hidden ${showCanvas ? '' : 'hidden'}`}
          />

          {/* A brief veil marks the switch between drawing styles; it is not a depiction of time passing. */}
          {state.chapter === 'centuries' && (
            <div key={state.era} aria-hidden="true" className="era-veil absolute inset-0" />
          )}

          <div aria-hidden="true" className="stage-fade" />

          <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4">
            <p data-testid="illustrative-label" className="chip">
              {t.common.illustrativeLabel}
            </p>
            {introPending && (
              <button
                type="button"
                onClick={onSkipIntro}
                className="btn-ghost pointer-events-auto bg-ink/70 backdrop-blur"
              >
                {t.hero.skipIntro}
              </button>
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-3 sm:p-4">
            {status === 'idle' && (
              <button
                type="button"
                onClick={onRequest}
                className="btn-ghost pointer-events-auto bg-ink/70 backdrop-blur"
              >
                {t.scene.show3d}
              </button>
            )}
            {status === 'loading' && (
              <div className="bg-ink/80 pointer-events-auto flex max-w-md flex-wrap items-center gap-3 rounded-2xl border border-white/15 p-3 pl-4 text-sm backdrop-blur">
                <p role="status" className="text-white">
                  {t.scene.loading}
                </p>
                <button type="button" onClick={onCancel} className="btn-ghost">
                  {t.scene.cancelLoading}
                </button>
              </div>
            )}
            {showCanvas && state.mode === 'explore' && (
              <p className="chip">{t.scene.exploreHint}</p>
            )}
            {callouts.length > 0 && !showCanvas && (
              <p className="chip">{t.architecture.calloutNote}</p>
            )}
            {isFlyoverConfigured && status !== 'loading' && (
              <button
                ref={flyoverTrigger}
                type="button"
                onClick={() => onFlyoverChange(true)}
                className="btn-ghost bg-ink/70 pointer-events-auto backdrop-blur"
              >
                {t.flyover.open}
              </button>
            )}
          </div>
        </div>

        {/* Last in the stack, so nothing of ours covers Google's logo and credits. */}
        {flyoverOpen && (
          <FlyoverStage
            locale={locale}
            motion={state.motion}
            onClose={() => onFlyoverChange(false)}
          />
        )}
      </div>

      {status === 'failed' && (
        <div
          role="group"
          aria-labelledby="scene-fallback-title"
          data-testid="scene-fallback"
          className="bg-basalt grid gap-3 border-t border-bronze/40 p-4 sm:p-5"
        >
          <h2 id="scene-fallback-title" className="font-display text-xl text-white">
            {t.scene.fallbackTitle}
          </h2>
          <p className="text-parchment text-sm">{t.scene.fallbackBody}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onRetry} className="btn-ghost">
              {t.scene.retry}
            </button>
            <Link href={readHref(locale, state.chapter)} className="btn-primary">
              {t.scene.openRead}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

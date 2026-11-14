'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Locale } from '@/content/types';
import type { MotionPolicy } from '@/features/experience/controller';
import { format, getDictionary } from '@/i18n/dictionaries';
import { loadMaps3D, onMapsAuthFailure, type Map3D, type Map3DOptions } from './google-maps';
import {
  FLYOVER_DWELL_MS,
  FLYOVER_LOAD_TIMEOUT_MS,
  FLYOVER_OPENING,
  FLYOVER_STOPS,
  cameraForStop,
  clampStopIndex,
  isLastStop,
} from './tour';

const CONSENT_KEY = 'borobudur.flyover.consent';
/** A new leg can end the previous one; ignore "ended" events that arrive this soon. */
const LEG_GUARD_MS = 300;
/** Manual steps glide briefly unless motion is reduced. */
const STEP_MS = 1200;

function readConsent(): boolean {
  try {
    return window.sessionStorage.getItem(CONSENT_KEY) === 'yes';
  } catch {
    return false;
  }
}

function storeConsent(): void {
  try {
    window.sessionStorage.setItem(CONSENT_KEY, 'yes');
  } catch {
    // Storage can be blocked; the visitor is simply asked again next time.
  }
}

type LoadStatus = 'loading' | 'ready' | 'failed';

/**
 * A guided flight over the real site, rendered by Google Maps inside the same
 * stage as the illustrative model. Google is contacted only after the visitor
 * agrees, and the flight carries no information that the chapters do not.
 */
export default function FlyoverStage({
  locale,
  motion,
  onClose,
}: {
  locale: Locale;
  motion: MotionPolicy;
  onClose: () => void;
}) {
  const t = getDictionary(locale).flyover;
  const [consented, setConsented] = useState(readConsent);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [attempt, setAttempt] = useState(0);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(motion === 'full');

  const region = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<Map3D | null>(null);
  const live = useRef({ index, playing });
  const leg = useRef<{ kind: 'travel' | 'orbit' | 'hold'; startedAt: number }>({
    kind: 'hold',
    startedAt: 0,
  });
  const dwell = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIndex = useRef(-1);

  const clearDwell = () => {
    if (dwell.current) clearTimeout(dwell.current);
    dwell.current = null;
  };

  useEffect(() => {
    region.current?.focus();
  }, []);

  useEffect(() => {
    live.current = { index, playing };
  }, [index, playing]);

  // Reduced motion can be switched on while the flight is running.
  const autoplay = playing && motion === 'full';

  const handleLegEnd = useCallback(() => {
    const current = map.current;
    if (!current || !live.current.playing) return;
    if (performance.now() - leg.current.startedAt < LEG_GUARD_MS) return;
    const stop = FLYOVER_STOPS[clampStopIndex(live.current.index)];
    if (!stop) return;
    if (leg.current.kind === 'travel' && stop.orbitMs) {
      leg.current = { kind: 'orbit', startedAt: performance.now() };
      current.flyCameraAround({
        camera: cameraForStop(stop),
        durationMillis: stop.orbitMs,
        repeatCount: 1,
      });
      return;
    }
    if (leg.current.kind === 'hold') return;
    leg.current = { kind: 'hold', startedAt: performance.now() };
    clearDwell();
    dwell.current = setTimeout(() => {
      if (isLastStop(live.current.index)) setPlaying(false);
      else setIndex((value) => clampStopIndex(value + 1));
    }, FLYOVER_DWELL_MS);
  }, []);

  // Load Google Maps and mount the map, only after consent.
  useEffect(() => {
    if (!consented) return;
    let cancelled = false;
    let mounted: Map3D | null = null;
    const fail = () => {
      if (!cancelled) setStatus('failed');
    };
    let timeout = setTimeout(fail, FLYOVER_LOAD_TIMEOUT_MS);
    const offAuth = onMapsAuthFailure(fail);
    const pause = () => setPlaying(false);

    loadMaps3D(locale)
      .then(({ Map3DElement }) => {
        if (cancelled || !host.current) return;
        const base: Map3DOptions = { ...FLYOVER_OPENING, mode: 'SATELLITE' };
        try {
          mounted = new Map3DElement({
            ...base,
            // Page scroll keeps working on touch screens; two fingers move the map.
            gestureHandling: 'COOPERATIVE',
            description: getDictionary(locale).flyover.mapDescription,
          });
        } catch {
          mounted = new Map3DElement(base);
        }
        mounted.style.width = '100%';
        mounted.style.height = '100%';
        mounted.style.display = 'block';
        mounted.addEventListener('gmp-error', fail);
        mounted.addEventListener('gmp-animationend', handleLegEnd);
        // Taking the controls yourself ends the automatic tour.
        mounted.addEventListener('pointerdown', pause);
        mounted.addEventListener('wheel', pause, { passive: true });
        host.current.append(mounted);
        map.current = mounted;
        lastIndex.current = -1;
        // Google reports a rejected key only inside the map and in the console, and
        // such a map never moves or settles. Checked against the live API: a dead
        // map keeps its opening range and fires neither of the events below.
        clearTimeout(timeout);
        timeout = setTimeout(fail, FLYOVER_LOAD_TIMEOUT_MS);
        const alive = () => clearTimeout(timeout);
        const view = mounted as Map3D & { range?: number };
        mounted.addEventListener('gmp-animationend', alive, { once: true });
        mounted.addEventListener('gmp-steadychange', alive, { once: true });
        mounted.addEventListener('gmp-rangechange', () => {
          if (typeof view.range === 'number' && view.range !== FLYOVER_OPENING.range) alive();
        });
        setStatus('ready');
      })
      .catch(fail);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      offAuth();
      clearDwell();
      if (mounted) {
        try {
          mounted.stopCameraAnimation();
        } catch {
          // The element may already be torn down.
        }
        mounted.remove();
      }
      map.current = null;
    };
  }, [consented, attempt, locale, handleLegEnd]);

  // The stop index and the playing flag are the truth; the camera follows them.
  useEffect(() => {
    const current = map.current;
    if (status !== 'ready' || !current) return;
    const stop = FLYOVER_STOPS[clampStopIndex(index)];
    if (!stop) return;
    const moved = lastIndex.current !== index;
    lastIndex.current = index;
    clearDwell();
    if (!autoplay) {
      leg.current = { kind: 'hold', startedAt: performance.now() };
      current.stopCameraAnimation();
      if (moved)
        current.flyCameraTo({
          endCamera: cameraForStop(stop),
          durationMillis: motion === 'full' ? STEP_MS : 0,
        });
      return;
    }
    leg.current = { kind: 'travel', startedAt: performance.now() };
    current.flyCameraTo({ endCamera: cameraForStop(stop), durationMillis: stop.travelMs });
    return clearDwell;
  }, [status, index, autoplay, motion]);

  const agree = () => {
    storeConsent();
    setConsented(true);
  };
  const retry = () => {
    setStatus('loading');
    setAttempt((value) => value + 1);
  };
  const step = (delta: number) => {
    setPlaying(false);
    setIndex((value) => clampStopIndex(value + delta));
  };
  const togglePlay = () => {
    // Pressing play at the end starts the tour again.
    if (!playing && isLastStop(index)) setIndex(0);
    setPlaying((value) => !value);
  };

  const stop = FLYOVER_STOPS[clampStopIndex(index)];
  const phase = !consented ? 'consent' : status;

  return (
    <section
      ref={region}
      tabIndex={-1}
      aria-label={t.regionLabel}
      data-testid="flyover"
      data-flyover-phase={phase}
      data-flyover-stop={stop?.id}
      data-flyover-playing={autoplay}
      className="flyover-layer absolute inset-0 outline-none"
    >
      {/* A map that failed shows Google's own error card; ours replaces it. */}
      <div
        ref={host}
        data-testid="flyover-map"
        hidden={phase === 'failed'}
        className="absolute inset-0"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 grid gap-2 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          {phase === 'ready' ? (
            <p data-testid="flyover-label" className="chip">
              {t.imageryLabel}
            </p>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost bg-ink/80 pointer-events-auto shrink-0 backdrop-blur"
          >
            {t.close}
          </button>
        </div>

        {phase === 'ready' && stop && (
          // Kept clear of the lower edge, where Google draws its logo and data credits.
          <div className="flex w-full flex-col items-start gap-2">
            <div
              role="group"
              aria-label={t.controlsLabel}
              className="bg-ink/80 pointer-events-auto flex flex-wrap items-center gap-1 rounded-full border border-white/15 p-1 backdrop-blur"
            >
              <button
                type="button"
                className="btn-ghost border-transparent"
                onClick={() => step(-1)}
                disabled={index === 0}
              >
                {t.previous}
              </button>
              {motion === 'full' && (
                <button type="button" className="btn-primary" onClick={togglePlay}>
                  {playing ? t.pause : t.play}
                </button>
              )}
              <button
                type="button"
                className="btn-ghost border-transparent"
                onClick={() => step(1)}
                disabled={isLastStop(index)}
              >
                {t.next}
              </button>
            </div>
            <p aria-live="polite" data-testid="flyover-caption" className="chip max-w-md text-sm">
              {format(t.stopProgress, { current: index + 1, total: FLYOVER_STOPS.length })}{' '}
              {t.stops[stop.id]}
            </p>
          </div>
        )}
      </div>

      {phase !== 'ready' && (
        <div className="absolute inset-0 grid place-items-center overflow-y-auto p-4 pt-[4.5rem]">
          <div className="bg-ink/90 grid max-w-md gap-3 rounded-2xl border border-white/15 p-5 backdrop-blur">
            {phase === 'consent' && (
              <>
                <h2 className="font-display text-2xl text-white">{t.consentTitle}</h2>
                <p className="text-parchment text-sm">{t.consentBody}</p>
                <p className="text-stone text-sm">{t.coverageNote}</p>
                <p className="text-sm">
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-bronze underline underline-offset-4"
                  >
                    {t.privacyLink}
                  </a>
                </p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-primary" onClick={agree}>
                    {t.start}
                  </button>
                  <button type="button" className="btn-ghost" onClick={onClose}>
                    {t.decline}
                  </button>
                </div>
              </>
            )}
            {phase === 'loading' && (
              <p role="status" className="text-white">
                {t.loading}
              </p>
            )}
            {phase === 'failed' && (
              <>
                <h2 className="font-display text-2xl text-white">{t.failedTitle}</h2>
                <p role="alert" className="text-parchment text-sm">
                  {t.failedBody}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-ghost" onClick={retry}>
                    {t.retry}
                  </button>
                  <button type="button" className="btn-primary" onClick={onClose}>
                    {t.close}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

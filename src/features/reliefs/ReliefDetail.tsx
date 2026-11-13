'use client';

import { ClaimList } from '@/components/shell/ClaimList';
import { MediaRecords } from '@/components/shell/SourceDrawer';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { selectClaims, selectMedia } from '@/content/select';
import type { ContentPack, Locale } from '@/content/types';
import { format, getDictionary } from '@/i18n/dictionaries';
import { ReliefDemoArt } from './ReliefDemoArt';

/**
 * Relief story overlay. A demonstration entry always shows both demo notices
 * and states plainly that it has no location on the monument.
 */
export function ReliefDetail({
  pack,
  locale,
  activeReliefId,
  onOpen,
  onClose,
}: {
  pack: ContentPack;
  locale: Locale;
  activeReliefId: string | null;
  onOpen: (id: string) => void;
  onClose: () => void;
}) {
  const t = getDictionary(locale).relief;
  const index = pack.reliefs.findIndex((relief) => relief.id === activeReliefId);
  const relief = pack.reliefs[index];
  const previous = pack.reliefs[index - 1];
  const next = index >= 0 ? pack.reliefs[index + 1] : undefined;
  const media = relief ? selectMedia(pack, relief.mediaIds) : [];
  const claims = relief ? selectClaims(pack, relief.claimIds) : [];
  const art = media[0];
  const heading = 'eyebrow mb-2';

  return (
    <ModalDialog
      open={Boolean(relief)}
      onClose={onClose}
      labelledBy="relief-detail-title"
      fallbackFocus={() =>
        document.querySelector<HTMLElement>(`[data-relief-open="${pack.reliefs[0]?.id ?? ''}"]`)
      }
      className="bg-basalt m-auto max-h-[92dvh] w-[min(46rem,calc(100vw-1.5rem))] max-w-none border border-bronze/50 p-0 text-white"
    >
      {relief && (
        <div
          data-testid="relief-detail"
          data-relief-detail={relief.id}
          className="flex max-h-[92dvh] flex-col"
        >
          <header className="flex items-start justify-between gap-4 border-b border-bronze/30 p-5">
            <div className="grid gap-1">
              <p className="eyebrow">
                {format(t.position, { current: index + 1, total: pack.reliefs.length })}
              </p>
              <h2 id="relief-detail-title" className="font-display text-3xl leading-tight">
                {relief.title[locale]}
              </h2>
            </div>
            <button type="button" onClick={onClose} className="btn-ghost shrink-0">
              {t.close}
            </button>
          </header>

          <div className="grid flex-1 content-start gap-6 overflow-y-auto p-5" tabIndex={0}>
            <figure className="grid gap-2">
              {relief.demonstration && (
                <p
                  data-testid="relief-demo-banner"
                  className="bg-bronze text-ink px-2 py-1 text-center text-xs font-semibold tracking-wider"
                >
                  {t.demoBanner}
                </p>
              )}
              <div className="bg-ink p-3">
                <ReliefDemoArt
                  idPrefix={`detail-${relief.id}`}
                  label={art?.alt[locale] ?? t.demoNotice}
                  mediaId={art?.id}
                />
              </div>
              {relief.demonstration && (
                <figcaption className="text-parchment text-sm">{t.demoNotice}</figcaption>
              )}
            </figure>

            <section aria-labelledby="relief-about">
              <h3 id="relief-about" className={heading}>
                {t.aboutHeading}
              </h3>
              <p className="text-parchment">{relief.description[locale]}</p>
            </section>

            <section aria-labelledby="relief-location">
              <h3 id="relief-location" className={heading}>
                {t.locationHeading}
              </h3>
              <p className="text-parchment">{relief.verifiedLocation ?? t.locationDemo}</p>
            </section>

            {art && (
              <section aria-labelledby="relief-description">
                <h3 id="relief-description" className={heading}>
                  {t.descriptionHeading}
                </h3>
                <p className="text-parchment">{art.alt[locale]}</p>
              </section>
            )}

            <section aria-labelledby="relief-sources">
              <h3 id="relief-sources" className={heading}>
                {t.sourcesHeading}
              </h3>
              {claims.length > 0 ? (
                <ClaimList claims={claims} pack={pack} locale={locale} />
              ) : (
                <p className="text-parchment">{t.noStatements}</p>
              )}
            </section>

            <section aria-labelledby="relief-status">
              <h3 id="relief-status" className={heading}>
                {t.statusHeading}
              </h3>
              <MediaRecords media={media} locale={locale} />
            </section>
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-bronze/30 p-4">
            <button
              type="button"
              className="btn-ghost"
              disabled={!previous}
              onClick={() => previous && onOpen(previous.id)}
            >
              <span aria-hidden="true">←</span>
              {t.previous}
            </button>
            <button
              type="button"
              className="btn-ghost"
              disabled={!next}
              onClick={() => next && onOpen(next.id)}
            >
              {t.next}
              <span aria-hidden="true">→</span>
            </button>
          </footer>
        </div>
      )}
    </ModalDialog>
  );
}

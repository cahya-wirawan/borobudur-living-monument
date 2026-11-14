'use client';

import Link from 'next/link';
import type { ContentPack, Locale } from '@/content/types';
import type { ViewEvidence } from '@/features/experience/evidence';
import { format, getDictionary } from '@/i18n/dictionaries';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { ClaimList } from './ClaimList';
import { EvidenceBadge, EvidenceLegend } from './EvidenceBadge';

export function MediaRecords({
  media,
  locale,
  tone = 'dark',
}: {
  media: ViewEvidence['media'];
  locale: Locale;
  tone?: 'dark' | 'paper';
}) {
  const t = getDictionary(locale).sources;
  const muted = tone === 'dark' ? 'text-stone' : 'text-ink/75';
  return (
    <ul className="grid gap-4">
      {media.map((item) => (
        <li key={item.id} data-media={item.id} className="grid gap-1.5 text-sm">
          <p className={tone === 'dark' ? 'text-white' : 'text-ink'}>{item.alt[locale]}</p>
          <p>
            <EvidenceBadge status={item.provenance} locale={locale} tone={tone} />
          </p>
          <dl className={`grid gap-0.5 ${muted}`}>
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-medium">{t.creator}:</dt>
              <dd>{item.creator}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-medium">{t.license}:</dt>
              <dd>{t.licenseNames[item.licenseId] ?? item.licenseId}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-medium">{t.rights}:</dt>
              <dd>
                {item.isOriginal
                  ? t.rightsOriginal
                  : item.rightsReviewed
                    ? t.rightsReviewed
                    : t.rightsPending}
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

/**
 * Everything the current view asserts or shows, with clickable references.
 */
export function SourceDrawer({
  open,
  onClose,
  evidence,
  pack,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  evidence: ViewEvidence;
  pack: ContentPack;
  locale: Locale;
}) {
  const t = getDictionary(locale);

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      labelledBy="source-drawer-title"
      className="bg-basalt m-0 ml-auto h-dvh max-h-none w-full max-w-xl border-l border-white/15 p-0 text-white"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <h2 id="source-drawer-title" className="font-display text-3xl leading-tight">
            {t.sources.drawerTitle}
          </h2>
          <button type="button" onClick={onClose} className="btn-ghost shrink-0">
            {t.sources.close}
          </button>
        </header>
        <div className="grid flex-1 content-start gap-8 overflow-y-auto p-5" tabIndex={0}>
          <section aria-labelledby="drawer-statements">
            <h3 id="drawer-statements" className="eyebrow mb-3">
              {t.sources.statementsHeading}
            </h3>
            {evidence.claims.length > 0 ? (
              <ClaimList claims={evidence.claims} pack={pack} locale={locale} />
            ) : (
              <p className="text-parchment text-sm">{t.sources.noStatements}</p>
            )}
          </section>
          {evidence.sources.length > 0 && (
            <section aria-labelledby="drawer-references">
              <h3 id="drawer-references" className="eyebrow mb-3">
                {t.sources.sourcesHeading}
              </h3>
              <ul className="grid gap-3 text-sm">
                {evidence.sources.map((source) => (
                  <li key={source.id}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-dark"
                    >
                      {source.publisher}, “{source.title}”
                      <span className="sr-only"> ({t.common.externalLink})</span>
                    </a>
                    <p className="text-stone mt-0.5">
                      {t.sources.sourceTypes[source.type]} ·{' '}
                      {format(t.sources.accessed, { date: source.accessedAt })}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section aria-labelledby="drawer-media">
            <h3 id="drawer-media" className="eyebrow mb-3">
              {t.sources.mediaHeading}
            </h3>
            <MediaRecords media={evidence.media} locale={locale} />
          </section>
          <section aria-labelledby="drawer-legend">
            <h3 id="drawer-legend" className="eyebrow mb-3">
              {t.evidence.legendTitle}
            </h3>
            <EvidenceLegend locale={locale} />
          </section>
          <p>
            <Link href={`/${locale}/sources`} className="link-dark text-sm">
              {t.sources.allSources}
            </Link>
          </p>
        </div>
      </div>
    </ModalDialog>
  );
}

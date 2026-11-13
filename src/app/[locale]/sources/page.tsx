import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClaimList } from '@/components/shell/ClaimList';
import { EvidenceLegend } from '@/components/shell/EvidenceBadge';
import { MediaRecords } from '@/components/shell/SourceDrawer';
import { StaticPage } from '@/components/shell/StaticPage';
import { getContent } from '@/content/loader';
import { format, getDictionary } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/locales';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return pageMetadata(locale, '/sources', getDictionary(locale).sourcesPage.title);
}

export default async function SourcesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const pack = getContent();
  const t = getDictionary(locale);
  const h2 = 'font-display text-3xl';
  return (
    <StaticPage pack={pack} locale={locale} section="sources">
      <div className="grid max-w-[68ch] gap-12">
        <header className="grid gap-4">
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">
            {t.sourcesPage.title}
          </h1>
          <p className="text-lg leading-relaxed">{t.sourcesPage.intro}</p>
        </header>
        <section aria-labelledby="src-references" className="grid gap-4">
          <h2 id="src-references" className={h2}>
            {t.sources.sourcesHeading}
          </h2>
          <ul className="grid gap-4">
            {pack.sources.map((source) => (
              <li key={source.id} id={`source-${source.id}`}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-paper"
                >
                  {source.publisher}, “{source.title}”
                  <span className="sr-only"> ({t.common.externalLink})</span>
                </a>
                <p className="text-ink/75 mt-0.5 text-sm">
                  {t.sources.sourceTypes[source.type]} ·{' '}
                  {format(t.sources.accessed, { date: source.accessedAt })}
                </p>
                <h3 className="mt-3 text-sm font-semibold">{t.sourcesPage.supportsHeading}</h3>
                <ul className="mt-1 grid list-disc gap-1 pl-5 text-sm">
                  {pack.claims
                    .filter((claim) => claim.sourceIds.includes(source.id))
                    .map((claim) => (
                      <li key={claim.id}>{claim.text[locale]}</li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="src-statements" className="grid gap-4">
          <h2 id="src-statements" className={h2}>
            {t.sourcesPage.statementsHeading}
          </h2>
          <ClaimList claims={pack.claims} pack={pack} locale={locale} tone="paper" />
        </section>
        <section aria-labelledby="src-media" className="grid gap-4">
          <h2 id="src-media" className={h2}>
            {t.sources.mediaHeading}
          </h2>
          <MediaRecords media={pack.media} locale={locale} tone="paper" />
        </section>
        <section aria-labelledby="src-legend" className="grid gap-4">
          <h2 id="src-legend" className={h2}>
            {t.evidence.legendTitle}
          </h2>
          <EvidenceLegend locale={locale} tone="paper" />
        </section>
        <section aria-labelledby="src-corrections" className="grid gap-3">
          <h2 id="src-corrections" className={h2}>
            {t.sourcesPage.correctionsHeading}
          </h2>
          <p>{t.sourcesPage.correctionsBody}</p>
        </section>
      </div>
    </StaticPage>
  );
}

import { selectMedia } from '@/content/select';
import type { ContentPack, Locale, Relief } from '@/content/types';
import { getDictionary } from '@/i18n/dictionaries';
import { ReliefDemoArt } from './ReliefDemoArt';

/** Complete inline relief entry for Read mode. Demonstration records always carry both demo notices. */
export function ReliefDemoCard({
  relief,
  pack,
  locale,
  idPrefix,
  heading: Heading,
}: {
  relief: Relief;
  pack: ContentPack;
  locale: Locale;
  idPrefix: string;
  /** Heading level that fits the surrounding outline. */
  heading: 'h2' | 'h4';
}) {
  const t = getDictionary(locale).relief;
  const art = selectMedia(pack, relief.mediaIds)[0];
  return (
    <article data-relief={relief.id} className="border border-bronze/40 bg-ink grid gap-3 p-4">
      {relief.demonstration && (
        <p
          data-testid="relief-demo-banner"
          className="bg-bronze text-ink px-2 py-1 text-center text-xs font-semibold tracking-wider"
        >
          {t.demoBanner}
        </p>
      )}
      <ReliefDemoArt
        idPrefix={`${idPrefix}-${relief.id}`}
        label={art?.alt[locale] ?? t.demoNotice}
        mediaId={art?.id}
      />
      <Heading className="font-display text-2xl leading-tight text-white">
        {relief.title[locale]}
      </Heading>
      <p className="text-parchment text-sm">{relief.description[locale]}</p>
      {relief.demonstration && <p className="text-stone text-sm">{t.demoNotice}</p>}
    </article>
  );
}

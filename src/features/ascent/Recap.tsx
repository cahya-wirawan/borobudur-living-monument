import Link from 'next/link';
import { ClaimList } from '@/components/shell/ClaimList';
import { selectClaims } from '@/content/select';
import type { ContentPack, Locale } from '@/content/types';
import { readHref } from '@/features/experience/url-state';
import { getDictionary } from '@/i18n/dictionaries';

/** Closing recap: every statement the five chapters made, each with its source. */
export function Recap({ pack, locale }: { pack: ContentPack; locale: Locale }) {
  const t = getDictionary(locale);
  const claimIds = [...new Set(pack.chapters.flatMap((chapter) => chapter.claimIds))];
  return (
    <section
      aria-labelledby="recap-heading"
      data-testid="recap"
      className="bg-basalt grid gap-4 p-4"
    >
      <h2 id="recap-heading" className="font-display text-2xl">
        {t.recap.heading}
      </h2>
      <p className="text-parchment text-sm">{t.recap.intro}</p>
      <ClaimList claims={selectClaims(pack, claimIds)} pack={pack} locale={locale} />
      <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <Link href={`/${locale}/sources`} className="link-dark">
          {t.sources.allSources}
        </Link>
        <Link href={readHref(locale)} className="link-dark">
          {t.landing.read}
        </Link>
      </p>
    </section>
  );
}

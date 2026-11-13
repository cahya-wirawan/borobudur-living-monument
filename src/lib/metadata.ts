import type { Metadata } from 'next';
import { LOCALES, type Locale } from '@/content/types';
import { getDictionary } from '@/i18n/dictionaries';
import { IS_PUBLIC_RELEASE } from '@/i18n/locales';

/** Canonical + hreflang for a localized route. Unreviewed prototype builds are never indexed. */
export function pageMetadata(locale: Locale, path: string, title: string): Metadata {
  const t = getDictionary(locale);
  return {
    title: `${title} — ${t.meta.siteName}`,
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}${path}`])),
    },
    robots: IS_PUBLIC_RELEASE ? undefined : { index: false, follow: false },
  };
}

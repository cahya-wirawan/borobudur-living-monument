import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ContentPack, Locale } from '@/content/types';
import { format, getDictionary } from '@/i18n/dictionaries';
import { otherLocale } from '@/i18n/locales';
import { PrototypeBanner } from './PrototypeBanner';

type Section = 'read' | 'sources' | 'about';

/** Light "paper" layout for the text-first routes. No client JavaScript of its own. */
export function StaticPage({
  pack,
  locale,
  section,
  children,
}: {
  pack: ContentPack;
  locale: Locale;
  section: Section;
  children: ReactNode;
}) {
  const t = getDictionary(locale);
  const other = otherLocale(locale);
  const links: { href: string; label: string; key: Section | 'experience' }[] = [
    { key: 'experience', href: `/${locale}/experience`, label: t.nav.experience },
    { key: 'read', href: `/${locale}/read`, label: t.nav.read },
    { key: 'sources', href: `/${locale}/sources`, label: t.nav.sources },
    { key: 'about', href: `/${locale}/about`, label: t.nav.about },
  ];
  return (
    <div className="theme-paper bg-paper text-ink min-h-dvh">
      <a
        href="#main"
        className="bg-ink sr-only z-50 px-4 py-2 font-medium text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        {t.common.skipToContent}
      </a>
      <PrototypeBanner pack={pack} locale={locale} />
      <header className="border-b border-bronze-deep/30">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-1 px-5 py-2">
          <Link href="/" className="flex min-h-11 items-baseline gap-2">
            <span className="font-display text-2xl leading-none tracking-wide">
              {t.common.wordmark}
            </span>
            <span className="text-ink/75 text-sm font-medium tracking-[0.06em] max-sm:hidden">
              {t.common.tagline}
            </span>
          </Link>
          <nav
            aria-label={t.common.mainNavLabel}
            className="ml-auto flex flex-wrap items-center gap-x-5 text-sm"
          >
            {links.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                aria-current={link.key === section ? 'page' : undefined}
                className={`inline-flex min-h-11 items-center ${
                  link.key === section ? 'font-semibold underline underline-offset-8' : 'link-paper'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${other}/${section}`}
              lang={other}
              hrefLang={other}
              aria-label={format(t.common.switchLanguage, {
                language: t.common.languageNames[other],
              })}
              className="link-paper inline-flex min-h-11 items-center"
            >
              {t.common.languageNames[other]}
            </Link>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-5 py-10 outline-none sm:py-14">
        {children}
      </main>
    </div>
  );
}

import Link from 'next/link';
import { MonumentSchematic } from '@/components/shell/MonumentSchematic';
import { getContent } from '@/content/loader';
import { LOCALES } from '@/content/types';
import { getDictionary } from '@/i18n/dictionaries';

/** Static entry: both languages, the entry choices and the one-line disclaimer. No 3D, no JS required. */
export default function LandingPage() {
  const pack = getContent();
  const en = getDictionary('en');
  const diagram = pack.media.find((media) => media.id === 'monument-schematic-diagram');
  return (
    <div className="scene-backdrop flex min-h-dvh flex-col text-white">
      <a
        href="#main"
        className="bg-bronze text-ink sr-only z-50 px-4 py-2 font-medium focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        {en.common.skipToContent}
      </a>
      <main
        id="main"
        className="mx-auto grid w-full max-w-5xl flex-1 content-center gap-10 px-5 py-12"
      >
        <header className="grid gap-2 text-center">
          <h1 className="reveal font-display text-7xl leading-none sm:text-9xl">
            {en.landing.heading}
          </h1>
          <p className="eyebrow reveal-late">
            {en.landing.sub} · <span lang="id">{getDictionary('id').landing.sub}</span>
          </p>
        </header>
        <div className="mx-auto w-full max-w-2xl">
          <MonumentSchematic
            idPrefix="landing"
            title={en.scene.stillLabel}
            description={diagram?.alt.en ?? en.scene.schematicNote}
            className="h-auto w-full"
          />
          <p className="text-stone mt-2 text-center text-xs">{en.common.illustrativeLabel}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {LOCALES.map((locale) => {
            const t = getDictionary(locale);
            return (
              <section
                key={locale}
                lang={locale}
                aria-label={t.common.languageNames[locale]}
                className="grid content-start gap-4 border-t border-bronze/40 pt-5"
              >
                <h2 className="eyebrow">{t.common.languageNames[locale]}</h2>
                <p className="text-parchment text-lg">{t.landing.lead}</p>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/${locale}/experience`} className="btn-primary">
                    {t.landing.start}
                  </Link>
                  <Link href={`/${locale}/read`} className="btn-ghost">
                    {t.landing.read}
                  </Link>
                </div>
                <p className="text-stone text-sm">{pack.prototypeNotice[locale]}</p>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

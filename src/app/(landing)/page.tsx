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
  const id = getDictionary('id');
  return (
    <div className="bg-ink flex min-h-dvh flex-col text-white">
      <a
        href="#main"
        className="bg-bronze text-ink sr-only z-50 px-4 py-2 font-medium focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        {en.common.skipToContent}
      </a>
      <main id="main" className="flex flex-1 flex-col">
        <div className="scene-backdrop landing-sky flex min-h-[72svh] flex-1 flex-col overflow-hidden">
          <header className="grid gap-3 px-5 pt-[7svh] text-center">
            <h1 className="reveal font-display text-[clamp(3.75rem,15vw,13rem)] leading-[0.92] tracking-[0.03em]">
              {en.landing.heading}
            </h1>
            <p className="reveal-late text-parchment font-display flex flex-wrap justify-center gap-x-3 text-xl sm:text-2xl">
              <span>{en.landing.sub}</span>
              <span aria-hidden="true" className="text-bronze">
                /
              </span>
              <span lang="id">{id.landing.sub}</span>
            </p>
          </header>
          <div className="relative mx-auto mt-auto w-full max-w-4xl px-4 pt-8">
            <div aria-hidden="true" className="sun" />
            <MonumentSchematic
              idPrefix="landing"
              title={en.scene.stillLabel}
              description={diagram?.alt.en ?? en.scene.schematicNote}
              className="relative h-auto w-full"
            />
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-5 pt-2 pb-12">
          <p className="text-stone text-center text-sm">
            {en.common.illustrativeLabel}
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span lang="id">{id.common.illustrativeLabel}</span>
          </p>
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {LOCALES.map((locale) => {
              const t = getDictionary(locale);
              return (
                <section
                  key={locale}
                  lang={locale}
                  aria-label={t.common.languageNames[locale]}
                  className="grid content-start gap-4"
                >
                  <h2 className="font-display text-bronze text-2xl">
                    {t.common.languageNames[locale]}
                  </h2>
                  <p className="text-parchment text-xl leading-relaxed">{t.landing.lead}</p>
                  <div className="flex flex-wrap gap-3">
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
        </div>
      </main>
    </div>
  );
}

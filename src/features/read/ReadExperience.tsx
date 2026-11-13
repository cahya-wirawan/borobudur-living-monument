import Link from 'next/link';
import { ClaimList } from '@/components/shell/ClaimList';
import { EvidenceBadge, EvidenceLegend } from '@/components/shell/EvidenceBadge';
import { MonumentSchematic } from '@/components/shell/MonumentSchematic';
import { selectClaims } from '@/content/loader';
import type { ContentPack, Locale } from '@/content/schema';
import { chapterAnchor } from '@/features/experience/chapters';
import { experienceHref } from '@/features/experience/url-state';
import { ReliefDemoCard } from '@/features/reliefs/ReliefDemoCard';
import { eraTreatment } from '@/features/time-machine/era-mapping';
import { format, getDictionary } from '@/i18n/dictionaries';
import { highlightForRealm } from '@/scene/monument-spec';
import { featureCallouts } from '@/features/architecture/callouts';

function Figure({
  children,
  caption,
  locale,
}: {
  children: React.ReactNode;
  caption: string;
  locale: Locale;
}) {
  return (
    <figure className="grid gap-2">
      <div className="scene-backdrop p-4">{children}</div>
      <figcaption className="text-ink/80 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <EvidenceBadge status="artistic" locale={locale} tone="paper" />
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * The complete narrative as semantic HTML. It reads the same chapter, era,
 * realm, relief and claim records as the interactive experience, so the two
 * can never state different facts.
 */
export function ReadExperience({ pack, locale }: { pack: ContentPack; locale: Locale }) {
  const t = getDictionary(locale);
  const diagram = pack.media.find((media) => media.id === 'monument-schematic-diagram');
  const diagramAlt = diagram?.alt[locale] ?? t.scene.schematicNote;

  return (
    <article className="grid gap-14">
      <header className="grid max-w-[68ch] gap-4">
        <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">{t.read.title}</h1>
        <p className="text-lg leading-relaxed">{t.read.intro}</p>
        <nav aria-label={t.read.tocLabel}>
          <ol className="grid gap-1">
            {pack.chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapterAnchor(chapter.id)}`}
                  className="link-paper inline-flex min-h-8 items-center"
                >
                  {index + 1}. {chapter.title[locale]}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      {pack.chapters.map((chapter, index) => (
        <section
          key={chapter.id}
          id={chapterAnchor(chapter.id)}
          aria-labelledby={`${chapterAnchor(chapter.id)}-title`}
          className="grid scroll-mt-6 gap-6 border-t border-bronze-deep/30 pt-8"
        >
          <div className="grid max-w-[68ch] gap-3">
            <p className="text-ink/75 text-xs font-medium tracking-[0.18em] uppercase">
              {format(t.chapters.progress, { current: index + 1, total: pack.chapters.length })}
            </p>
            <h2
              id={`${chapterAnchor(chapter.id)}-title`}
              className="font-display text-4xl leading-tight"
            >
              {chapter.title[locale]}
            </h2>
            <p className="text-lg leading-relaxed">{chapter.summary[locale]}</p>
            <ClaimList
              claims={selectClaims(pack, chapter.claimIds)}
              pack={pack}
              locale={locale}
              tone="paper"
            />
            <p className="text-ink/80 text-sm">{t.chapters.captions[chapter.id]}</p>
          </div>

          {chapter.id === 'architecture' && (
            <div className="max-w-2xl">
              <Figure caption={t.scene.schematicNote} locale={locale}>
                <MonumentSchematic
                  idPrefix="read-architecture"
                  title={t.scene.stillLabel}
                  description={diagramAlt}
                  callouts={featureCallouts(pack)}
                  className="h-auto w-full"
                />
              </Figure>
              <h3 className="font-display mt-6 text-2xl">{t.architecture.featuresHeading}</h3>
              <p className="text-ink/80 mt-1 text-sm">{t.architecture.calloutNote}</p>
              <ol className="mt-4 grid list-decimal gap-5 pl-6">
                {pack.features.map((feature) => (
                  <li key={feature.id} id={`feature-${feature.id}`} className="grid gap-2 pl-1">
                    <h4 className="font-semibold">{feature.title[locale]}</h4>
                    <p>{feature.description[locale]}</p>
                    <ClaimList
                      claims={selectClaims(pack, feature.claimIds)}
                      pack={pack}
                      locale={locale}
                      tone="paper"
                    />
                  </li>
                ))}
              </ol>
            </div>
          )}

          {chapter.id === 'centuries' && (
            <div className="grid gap-4">
              <h3 className="font-display text-2xl">{t.read.erasHeading}</h3>
              <p className="text-ink/80 max-w-[68ch] text-sm">{t.era.note}</p>
              <ol className="grid gap-6 sm:grid-cols-2">
                {pack.eras.map((era) => (
                  <li key={era.id} id={`era-${era.id}`} className="grid content-start gap-3">
                    <h4 className="font-semibold">{era.label[locale]}</h4>
                    <Figure caption={era.description[locale]} locale={locale}>
                      <MonumentSchematic
                        idPrefix={`read-era-${era.id}`}
                        title={era.label[locale]}
                        description={era.description[locale]}
                        treatment={eraTreatment(era.id)}
                        className="h-auto w-full"
                      />
                    </Figure>
                    <ClaimList
                      claims={selectClaims(pack, era.claimIds)}
                      pack={pack}
                      locale={locale}
                      tone="paper"
                    />
                  </li>
                ))}
              </ol>
            </div>
          )}

          {chapter.id === 'stories' && (
            <div className="grid max-w-xl gap-4">
              <h3 className="font-display text-2xl">{t.relief.heading}</h3>
              {pack.reliefs.map((relief) => (
                <ReliefDemoCard
                  key={relief.id}
                  relief={relief}
                  pack={pack}
                  locale={locale}
                  idPrefix="read-relief"
                  heading="h4"
                />
              ))}
            </div>
          )}

          {chapter.id === 'ascent' && (
            <div className="grid gap-4">
              <h3 className="font-display text-2xl">{t.read.realmsHeading}</h3>
              <p className="text-ink/80 max-w-[68ch] text-sm">{t.realm.note}</p>
              <ol className="grid gap-6 md:grid-cols-3">
                {pack.realms.map((realm) => (
                  <li key={realm.id} id={`realm-${realm.id}`} className="grid content-start gap-3">
                    <h4 className="font-semibold">{realm.title[locale]}</h4>
                    <Figure
                      caption={format(t.scene.realmBandLabel, { realm: realm.title[locale] })}
                      locale={locale}
                    >
                      <MonumentSchematic
                        idPrefix={`read-realm-${realm.id}`}
                        title={format(t.scene.realmBandLabel, { realm: realm.title[locale] })}
                        description={diagramAlt}
                        highlight={highlightForRealm(realm.id)}
                        className="h-auto w-full"
                      />
                    </Figure>
                    <p>{realm.explanation[locale]}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <p>
            <Link href={experienceHref(locale, { chapter: chapter.id })} className="link-paper">
              {format(t.read.openInExperience, { title: chapter.title[locale] })}
            </Link>
          </p>
        </section>
      ))}

      <section
        aria-labelledby="read-legend"
        className="grid max-w-[68ch] gap-4 border-t border-bronze-deep/30 pt-8"
      >
        <h2 id="read-legend" className="font-display text-3xl">
          {t.evidence.legendTitle}
        </h2>
        <EvidenceLegend locale={locale} tone="paper" />
        <p>
          <Link href={`/${locale}/sources`} className="link-paper">
            {t.sources.allSources}
          </Link>
        </p>
      </section>
    </article>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EvidenceLegend } from '@/components/shell/EvidenceBadge';
import { StaticPage } from '@/components/shell/StaticPage';
import { getContent } from '@/content/loader';
import { format, getDictionary } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/locales';
import { pageMetadata } from '@/lib/metadata';
import pkg from '../../../../package.json';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return pageMetadata(locale, '/about', getDictionary(locale).about.title);
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const pack = getContent();
  const t = getDictionary(locale).about;
  const sections = [
    { id: 'method', heading: t.methodHeading, items: t.method },
    { id: 'limits', heading: t.limitsHeading, items: t.limits },
    { id: 'credits', heading: t.creditsHeading, items: t.credits },
  ];
  return (
    <StaticPage pack={pack} locale={locale} section="about">
      <div className="grid max-w-[68ch] gap-12">
        <header className="grid gap-4">
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">{t.title}</h1>
          <p className="text-lg leading-relaxed">{t.intro}</p>
        </header>
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`about-${section.id}`} className="grid gap-4">
            <h2 id={`about-${section.id}`} className="font-display text-3xl">
              {section.heading}
            </h2>
            <ul className="grid list-disc gap-3 pl-5">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
        <section aria-labelledby="about-legend" className="grid gap-4">
          <h2 id="about-legend" className="font-display text-3xl">
            {t.legendHeading}
          </h2>
          <EvidenceLegend locale={locale} tone="paper" />
        </section>
        <p data-testid="app-version" className="text-ink/75 text-sm">
          {format(t.version, { version: pkg.version })}
        </p>
      </div>
    </StaticPage>
  );
}

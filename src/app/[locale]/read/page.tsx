import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StaticPage } from '@/components/shell/StaticPage';
import { getContent } from '@/content/loader';
import { ReadExperience } from '@/features/read/ReadExperience';
import { getDictionary } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/locales';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return pageMetadata(locale, '/read', getDictionary(locale).read.title);
}

export default async function ReadPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const pack = getContent();
  return (
    <StaticPage pack={pack} locale={locale} section="read">
      <ReadExperience pack={pack} locale={locale} />
    </StaticPage>
  );
}

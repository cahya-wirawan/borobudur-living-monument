import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ExperienceShell } from '@/components/shell/ExperienceShell';
import { getContent } from '@/content/loader';
import { contentIds, parseLinkableState, readHref } from '@/features/experience/url-state';
import { isLocale } from '@/i18n/locales';
import { pageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function resolve({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const pack = getContent();
  const initial = parseLinkableState(await searchParams, contentIds(pack));
  return { locale, pack, initial };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, pack, initial } = await resolve(props);
  const chapter = pack.chapters.find((c) => c.id === initial.chapter);
  return pageMetadata(locale, '/experience', chapter?.title[locale] ?? '');
}

export default async function ExperiencePage(props: Props) {
  const { locale, pack, initial } = await resolve(props);
  // Read mode is its own text-first route (docs/11 §5: prefer redirect).
  if (initial.mode === 'read') redirect(readHref(locale, initial.chapter));
  return <ExperienceShell key={locale} pack={pack} locale={locale} initial={initial} />;
}

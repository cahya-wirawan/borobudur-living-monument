import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { getDictionary } from '@/i18n/dictionaries';
import { IS_PUBLIC_RELEASE, SITE_URL } from '@/i18n/locales';
import '../fonts';
import '../globals.css';

const t = getDictionary('en');

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: t.meta.siteName,
  description: t.meta.description,
  alternates: { canonical: '/', languages: { en: '/en/experience', id: '/id/experience' } },
  robots: IS_PUBLIC_RELEASE ? undefined : { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: '#0e0f26', width: 'device-width', initialScale: 1 };

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink">{children}</body>
    </html>
  );
}

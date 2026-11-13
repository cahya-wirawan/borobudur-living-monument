import { LOCALES, type Locale } from '@/content/types';

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'id' : 'en';
}

/**
 * Base URL for canonical and language-alternate links. An explicit setting
 * wins; on Vercel the deployment's own address is used; otherwise localhost.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

/** Search engines are only invited once a reviewed public release is built. */
export const IS_PUBLIC_RELEASE = process.env.RELEASE_CHANNEL === 'public';

'use client';

import Link from 'next/link';
import type { Locale } from '@/content/schema';
import type { ExperienceState, Mode } from '@/features/experience/controller';
import { readHref } from '@/features/experience/url-state';
import { getDictionary } from '@/i18n/dictionaries';

/** Guided and Explore are states of this page; Read is its own indexable route. */
export function ModeSwitcher({
  locale,
  state,
  onSelect,
}: {
  locale: Locale;
  state: ExperienceState;
  onSelect: (mode: Exclude<Mode, 'read'>) => void;
}) {
  const t = getDictionary(locale).modes;
  return (
    <div role="group" aria-label={t.label} className="flex">
      {(['guided', 'explore'] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          title={mode === 'guided' ? t.guidedHint : t.exploreHint}
          aria-pressed={state.mode === mode}
          onClick={() => onSelect(mode)}
          className="btn-ghost -ml-px first:ml-0 px-3"
        >
          {t[mode]}
        </button>
      ))}
      <Link
        href={readHref(locale, state.chapter)}
        title={t.readHint}
        className="btn-ghost -ml-px px-3"
      >
        {t.read}
      </Link>
    </div>
  );
}

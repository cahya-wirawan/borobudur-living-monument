'use client';

import type { ChapterId, ContentPack, Locale } from '@/content/schema';
import {
  CHAPTER_ORDER,
  chapterIndex,
  nextChapter,
  previousChapter,
} from '@/features/experience/chapters';
import type { ExperienceAction, ExperienceState } from '@/features/experience/controller';
import { toLinkable } from '@/features/experience/controller';
import { experienceHref } from '@/features/experience/url-state';
import { format, getDictionary } from '@/i18n/dictionaries';

/**
 * Chapter rail + Back/Next. Rail items are real links to the chapter's deep
 * link, so they also work before hydration and without the canvas.
 */
export function ChapterNav({
  pack,
  locale,
  state,
  dispatch,
}: {
  pack: ContentPack;
  locale: Locale;
  state: ExperienceState;
  dispatch: (action: ExperienceAction) => void;
}) {
  const t = getDictionary(locale).chapters;
  const titleOf = (id: ChapterId) => pack.chapters.find((c) => c.id === id)?.title[locale] ?? id;
  const previous = previousChapter(state.chapter);
  const next = nextChapter(state.chapter);
  const go = (chapter: ChapterId) => dispatch({ type: 'NAVIGATE_CHAPTER', chapter });

  return (
    <nav
      aria-label={t.railLabel}
      className="bg-ink z-20 flex shrink-0 items-center gap-3 border-t border-bronze/30 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-5"
    >
      <button
        type="button"
        className="btn-ghost shrink-0"
        disabled={!previous}
        aria-label={previous ? format(t.backTo, { title: titleOf(previous) }) : t.firstChapter}
        onClick={() => previous && go(previous)}
      >
        <span aria-hidden="true">←</span>
        <span className="max-sm:sr-only">{t.back}</span>
      </button>

      <ol className="flex min-w-0 flex-1 items-stretch justify-center gap-1 sm:gap-2">
        {CHAPTER_ORDER.map((id) => {
          const current = id === state.chapter;
          const number = String(chapterIndex(id) + 1).padStart(2, '0');
          return (
            <li key={id} className="min-w-0 flex-1 sm:max-w-44">
              <a
                href={experienceHref(locale, {
                  ...toLinkable(state),
                  chapter: id,
                  activeReliefId: null,
                })}
                aria-current={current ? 'step' : undefined}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
                    return;
                  event.preventDefault();
                  go(id);
                }}
                className={`flex min-h-11 flex-col justify-center border-t-2 px-1 pt-1 text-center text-xs transition-colors sm:text-left ${
                  current
                    ? 'border-bronze text-bronze'
                    : 'border-stone/40 text-stone hover:border-bronze/70 hover:text-white'
                }`}
              >
                <span aria-hidden="true" className="font-medium tracking-widest">
                  {number}
                </span>
                <span className="truncate max-md:sr-only">{titleOf(id)}</span>
              </a>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        className="btn-primary shrink-0"
        disabled={!next}
        aria-label={next ? format(t.nextTo, { title: titleOf(next) }) : t.lastChapter}
        onClick={() => next && go(next)}
      >
        <span className="max-sm:sr-only">{t.next}</span>
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}

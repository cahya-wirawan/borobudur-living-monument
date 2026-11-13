import { CHAPTER_IDS, type ChapterId } from '@/content/types';

export const CHAPTER_ORDER: readonly ChapterId[] = CHAPTER_IDS;

export function chapterIndex(chapter: ChapterId): number {
  return CHAPTER_ORDER.indexOf(chapter);
}

export function nextChapter(chapter: ChapterId): ChapterId | null {
  return CHAPTER_ORDER[chapterIndex(chapter) + 1] ?? null;
}

export function previousChapter(chapter: ChapterId): ChapterId | null {
  return CHAPTER_ORDER[chapterIndex(chapter) - 1] ?? null;
}

/** Stable anchor used by Read mode sections and cross-mode links. */
export function chapterAnchor(chapter: ChapterId): string {
  return `chapter-${chapter}`;
}

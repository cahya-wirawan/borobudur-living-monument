'use client';

import { selectMedia } from '@/content/select';
import type { ContentPack, Locale } from '@/content/types';
import { format, getDictionary } from '@/i18n/dictionaries';
import { ReliefDemoArt } from './ReliefDemoArt';

/**
 * Keyboard-reachable list of relief stories. It opens exactly the same record
 * as the matching hotspot in the 3D scene.
 */
export function ReliefCatalog({
  pack,
  locale,
  onOpen,
}: {
  pack: ContentPack;
  locale: Locale;
  onOpen: (id: string) => void;
}) {
  const t = getDictionary(locale).relief;
  return (
    <section aria-labelledby="relief-catalog-heading" className="grid gap-3">
      <h2 id="relief-catalog-heading" className="eyebrow">
        {t.catalogLabel}
      </h2>
      <ol className="grid gap-4">
        {pack.reliefs.map((relief, index) => {
          const art = selectMedia(pack, relief.mediaIds)[0];
          return (
            <li
              key={relief.id}
              data-relief={relief.id}
              className="bg-ink grid gap-3 border border-bronze/40 p-4"
            >
              {relief.demonstration && (
                <p className="bg-bronze text-ink px-2 py-1 text-center text-xs font-semibold tracking-wider">
                  {t.demoBanner}
                </p>
              )}
              <div className="grid items-center gap-4 sm:grid-cols-[9rem_1fr]">
                <ReliefDemoArt
                  idPrefix={`catalog-${relief.id}`}
                  label={art?.alt[locale] ?? t.demoNotice}
                  mediaId={art?.id}
                />
                <div className="grid gap-2">
                  <h3 className="font-display text-xl leading-tight">{relief.title[locale]}</h3>
                  {relief.demonstration && <p className="text-stone text-sm">{t.demoNotice}</p>}
                  <p>
                    <button
                      type="button"
                      data-relief-open={relief.id}
                      aria-haspopup="dialog"
                      aria-label={format(t.openTitled, {
                        n: index + 1,
                        title: relief.title[locale],
                      })}
                      onClick={() => onOpen(relief.id)}
                      className="btn-ghost"
                    >
                      {format(t.open, { n: index + 1 })}
                    </button>
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

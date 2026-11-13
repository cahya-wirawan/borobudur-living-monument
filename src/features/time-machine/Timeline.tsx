'use client';

import { ClaimList } from '@/components/shell/ClaimList';
import { EvidenceBadge } from '@/components/shell/EvidenceBadge';
import { selectClaims } from '@/content/select';
import type { ContentPack, EraId, Locale } from '@/content/types';
import { format, getDictionary } from '@/i18n/dictionaries';

/**
 * Time Machine control: four discrete, labeled states. Explicit buttons plus
 * previous/next and arrow keys; never a drag-only slider. The rail is a
 * navigation aid, not a continuous record: nothing exists between two ticks.
 *
 * Each era keeps two independent labels: what the *source* says (a documented
 * statement with its citation) and what the *picture* is (an illustration).
 */
export function Timeline({
  pack,
  value,
  onChange,
  locale,
}: {
  pack: ContentPack;
  value: EraId;
  onChange: (era: EraId) => void;
  locale: Locale;
}) {
  const t = getDictionary(locale).era;
  const eras = pack.eras;
  const index = Math.max(
    0,
    eras.findIndex((era) => era.id === value),
  );
  const selected = eras[index];
  const step = (delta: number) => {
    const next = eras[index + delta];
    if (next) onChange(next.id);
  };

  return (
    <div className="grid gap-5">
      <div
        role="group"
        aria-label={t.groupLabel}
        className="grid gap-3"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1);
          else if (event.key === 'ArrowLeft') step(-1);
          else return;
          event.preventDefault();
        }}
      >
        <div aria-hidden="true" data-testid="era-rail" className="relative mx-2 h-4">
          <div className="bg-bronze/50 absolute inset-x-0 top-1/2 h-px" />
          {eras.map((era, i) => (
            <span
              key={era.id}
              data-active={i === index}
              style={{ left: `${(i / (eras.length - 1)) * 100}%` }}
              className={`absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-bronze ${
                i === index ? 'bg-bronze' : 'bg-ink'
              }`}
            />
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {eras.map((era) => (
            <button
              key={era.id}
              type="button"
              data-era={era.id}
              aria-pressed={era.id === value}
              onClick={() => onChange(era.id)}
              className="btn-ghost justify-start text-left"
            >
              {era.label[locale]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn-ghost w-11 px-0"
            aria-label={t.previous}
            disabled={index === 0}
            onClick={() => step(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className="btn-ghost w-11 px-0"
            aria-label={t.next}
            disabled={index === eras.length - 1}
            onClick={() => step(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
          <p className="text-stone text-sm tabular-nums">
            {format(t.position, { current: index + 1, total: eras.length })}
          </p>
        </div>
      </div>

      {selected && (
        <div data-testid="era-detail" className="grid gap-5">
          <h2 className="font-display text-3xl leading-tight">{selected.label[locale]}</h2>
          <section aria-labelledby="era-statement" className="grid gap-3">
            <h3 id="era-statement" className="eyebrow">
              {t.statementHeading}
            </h3>
            <ClaimList claims={selectClaims(pack, selected.claimIds)} pack={pack} locale={locale} />
          </section>
          <section aria-labelledby="era-visual" className="grid gap-2">
            <h3 id="era-visual" className="eyebrow">
              {t.visualHeading}
            </h3>
            <p className="text-parchment">{selected.description[locale]}</p>
            <p>
              <EvidenceBadge status={selected.provenance} locale={locale} />
            </p>
          </section>
        </div>
      )}
      <p className="text-stone text-sm">{t.note}</p>
    </div>
  );
}

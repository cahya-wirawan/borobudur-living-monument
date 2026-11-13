'use client';

import { ClaimList } from '@/components/shell/ClaimList';
import { selectClaims } from '@/content/loader';
import type { ContentPack, Locale } from '@/content/schema';
import { getDictionary } from '@/i18n/dictionaries';

export type ArchitectureView = '3d' | 'diagram';

/**
 * Numbered list of architectural features. Selecting one highlights it in the
 * drawing (3D model or diagram). Every description and citation is plain HTML
 * here, so nothing depends on hovering or on the canvas.
 */
export function ArchitectureExplorer({
  pack,
  locale,
  activeFeatureId,
  onSelect,
  view,
  onViewChange,
  canShow3d,
}: {
  pack: ContentPack;
  locale: Locale;
  activeFeatureId: string | null;
  onSelect: (id: string | null) => void;
  view: ArchitectureView;
  onViewChange: (view: ArchitectureView) => void;
  /** False when the 3D scene is not running; the diagram is then the only view. */
  canShow3d: boolean;
}) {
  const t = getDictionary(locale).architecture;
  const active = pack.features.find((feature) => feature.id === activeFeatureId);
  const effectiveView: ArchitectureView = canShow3d ? view : 'diagram';

  return (
    <div className="grid gap-5">
      <div role="group" aria-label={t.viewLabel} className="flex">
        {(['3d', 'diagram'] as const).map((option) => (
          <button
            key={option}
            type="button"
            data-view={option}
            aria-pressed={effectiveView === option}
            disabled={option === '3d' && !canShow3d}
            onClick={() => onViewChange(option)}
            className="btn-ghost -ml-px px-3 first:ml-0"
          >
            {option === '3d' ? t.view3d : t.viewDiagram}
          </button>
        ))}
      </div>

      <section aria-labelledby="features-heading" className="grid gap-3">
        <h2 id="features-heading" className="eyebrow">
          {t.featuresHeading}
        </h2>
        <ol className="grid gap-2">
          {pack.features.map((feature, index) => {
            const pressed = feature.id === activeFeatureId;
            return (
              <li key={feature.id}>
                <button
                  type="button"
                  data-feature={feature.id}
                  aria-pressed={pressed}
                  onClick={() => onSelect(pressed ? null : feature.id)}
                  className="btn-ghost w-full justify-start gap-3 text-left"
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums ${
                      pressed
                        ? 'border-bronze bg-bronze text-ink'
                        : 'border-parchment text-parchment'
                    }`}
                  >
                    {index + 1}
                  </span>
                  {feature.title[locale]}
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {active ? (
        <div data-testid="feature-detail" className="grid gap-4">
          <h2 className="font-display text-3xl leading-tight">{active.title[locale]}</h2>
          <p className="text-parchment">{active.description[locale]}</p>
          <ClaimList claims={selectClaims(pack, active.claimIds)} pack={pack} locale={locale} />
          <p>
            <button type="button" className="btn-ghost" onClick={() => onSelect(null)}>
              {t.clear}
            </button>
          </p>
        </div>
      ) : (
        <p className="text-stone text-sm">{t.selectHint}</p>
      )}
    </div>
  );
}

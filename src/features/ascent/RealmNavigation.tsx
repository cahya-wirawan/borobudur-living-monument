'use client';

import { MonumentSchematic } from '@/components/shell/MonumentSchematic';
import type { ContentPack, Locale, RealmId } from '@/content/schema';
import { format, getDictionary } from '@/i18n/dictionaries';
import { highlightForRealm } from '@/scene/monument-spec';

/**
 * Journey control: step up or down, or jump straight to any realm. Realms are
 * listed in architectural order from the base upward. The zone diagram is the
 * same original schematic used elsewhere, with the selected zone emphasised.
 */
export function RealmNavigation({
  realms,
  value,
  onChange,
  locale,
}: {
  realms: ContentPack['realms'];
  value: RealmId;
  onChange: (realm: RealmId) => void;
  locale: Locale;
}) {
  const t = getDictionary(locale).realm;
  const index = Math.max(
    0,
    realms.findIndex((realm) => realm.id === value),
  );
  const selected = realms[index];
  const below = realms[index - 1];
  const above = realms[index + 1];

  return (
    <div className="grid gap-4">
      <div role="group" aria-label={t.groupLabel} className="grid gap-2">
        {realms.map((realm, i) => (
          <button
            key={realm.id}
            type="button"
            data-realm={realm.id}
            aria-pressed={realm.id === value}
            onClick={() => onChange(realm.id)}
            className="btn-ghost justify-start gap-3 text-left"
          >
            <span aria-hidden="true" className="text-stone tabular-nums">
              {i + 1}
            </span>
            {realm.title[locale]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          data-step="down"
          className="btn-ghost"
          disabled={!below}
          aria-label={below ? format(t.downTo, { title: below.title[locale] }) : t.bottom}
          onClick={() => below && onChange(below.id)}
        >
          <span aria-hidden="true">↓</span>
          {t.down}
        </button>
        <button
          type="button"
          data-step="up"
          className="btn-primary"
          disabled={!above}
          aria-label={above ? format(t.upTo, { title: above.title[locale] }) : t.top}
          onClick={() => above && onChange(above.id)}
        >
          <span aria-hidden="true">↑</span>
          {t.up}
        </button>
        <p className="text-stone text-sm">
          {format(t.position, { current: index + 1, total: realms.length })}
        </p>
      </div>

      {selected && (
        <div data-testid="realm-detail" className="grid gap-3">
          <h2 className="font-display text-3xl leading-tight">{selected.title[locale]}</h2>
          <p className="text-parchment">{selected.explanation[locale]}</p>
          <div className="scene-backdrop max-w-xs p-3">
            <MonumentSchematic
              idPrefix="realm-zone"
              title={t.diagramLabel}
              description={selected.explanation[locale]}
              highlight={highlightForRealm(selected.id)}
              className="h-auto w-full"
            />
          </div>
        </div>
      )}
      <p className="text-stone text-sm">{t.note}</p>
    </div>
  );
}

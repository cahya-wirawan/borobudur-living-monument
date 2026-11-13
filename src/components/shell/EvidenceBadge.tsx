import type { EvidenceStatus, Locale } from '@/content/schema';
import { getDictionary } from '@/i18n/dictionaries';

/** Shape + text, never color alone (docs/02 §7). */
function Glyph({ status }: { status: EvidenceStatus }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3 shrink-0">
      {status === 'documented' && <rect x="1.5" y="1.5" width="9" height="9" fill="currentColor" />}
      {status === 'inferred' && (
        <>
          <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 1.5a4.5 4.5 0 0 1 0 9z" fill="currentColor" />
        </>
      )}
      {status === 'artistic' && (
        <path d="M6 1 11 10.5H1z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      )}
    </svg>
  );
}

export function EvidenceBadge({
  status,
  locale,
  tone = 'dark',
}: {
  status: EvidenceStatus;
  locale: Locale;
  tone?: 'dark' | 'paper';
}) {
  const label = getDictionary(locale).evidence.labels[status];
  return (
    <span
      data-evidence={status}
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-medium tracking-wide ${
        tone === 'dark' ? 'border-bronze/50 text-bronze' : 'border-bronze-deep/50 text-bronze-deep'
      }`}
    >
      <Glyph status={status} />
      {label}
    </span>
  );
}

export function EvidenceLegend({
  locale,
  tone = 'dark',
}: {
  locale: Locale;
  tone?: 'dark' | 'paper';
}) {
  const t = getDictionary(locale).evidence;
  return (
    <dl className="grid gap-3">
      {(['documented', 'inferred', 'artistic'] as const).map((status) => (
        <div key={status} className="grid gap-1">
          <dt>
            <EvidenceBadge status={status} locale={locale} tone={tone} />
          </dt>
          <dd className={`text-sm ${tone === 'dark' ? 'text-stone' : 'text-ink/80'}`}>
            {t.descriptions[status]}
          </dd>
        </div>
      ))}
    </dl>
  );
}

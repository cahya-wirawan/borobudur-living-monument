import type { Claim, ContentPack, Locale } from '@/content/types';
import { selectSources } from '@/content/select';
import { format, getDictionary } from '@/i18n/dictionaries';
import { EvidenceBadge } from './EvidenceBadge';

/** Renders statements straight from claim records, each with status and clickable sources. */
export function ClaimList({
  claims,
  pack,
  locale,
  tone = 'dark',
}: {
  claims: readonly Claim[];
  pack: ContentPack;
  locale: Locale;
  tone?: 'dark' | 'paper';
}) {
  const t = getDictionary(locale);
  if (claims.length === 0) return null;
  const dark = tone === 'dark';
  return (
    <ul className="grid gap-4">
      {claims.map((claim) => (
        <li
          key={claim.id}
          data-claim={claim.id}
          className={`border-l pl-4 ${dark ? 'border-bronze/40' : 'border-bronze-deep/40'}`}
        >
          <p className={dark ? 'text-white' : 'text-ink'}>{claim.text[locale]}</p>
          {claim.qualification && (
            <p className={`mt-1 text-sm ${dark ? 'text-stone' : 'text-ink/80'}`}>
              {claim.qualification[locale]}
            </p>
          )}
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
            <EvidenceBadge status={claim.evidenceStatus} locale={locale} tone={tone} />
            <span className={dark ? 'text-stone' : 'text-ink/75'}>
              {t.evidence.review[claim.reviewStatus]}
            </span>
          </p>
          <ul className="mt-1.5 grid gap-1 text-sm">
            {selectSources(pack, [claim]).map((source) => (
              <li key={source.id}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={dark ? 'link-dark' : 'link-paper'}
                >
                  {format(t.sources.citation, { title: `${source.publisher}, “${source.title}”` })}
                  <span className="sr-only"> ({t.common.externalLink})</span>
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

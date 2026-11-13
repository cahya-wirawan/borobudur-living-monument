import type { ContentPack, Locale } from '@/content/types';
import { isPrototype } from '@/content/select';
import { getDictionary } from '@/i18n/dictionaries';

/** Persistent while any claim is unreviewed or the geometry is illustrative. Not dismissible. */
export function PrototypeBanner({ pack, locale }: { pack: ContentPack; locale: Locale }) {
  if (!isPrototype(pack)) return null;
  const label = getDictionary(locale).common.prototypeLabel;
  return (
    <aside aria-label={label}>
      <p
        data-testid="prototype-banner"
        className="bg-basalt text-parchment border-b border-bronze/30 px-4 py-1.5 text-center text-xs leading-snug"
      >
        <strong className="font-semibold tracking-wide uppercase">{label}</strong>
        {' — '}
        {pack.prototypeNotice[locale]}
      </p>
    </aside>
  );
}

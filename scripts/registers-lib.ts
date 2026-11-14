/**
 * Generates the audit registers from the content pack so they cannot drift
 * from what the app actually shows (docs/04 §5 and §7, task M3-T05).
 *   pnpm registers:generate          rewrite the files
 *   pnpm registers:generate --check  fail if the committed files are stale
 */
import type { ContentPack } from '../src/content/schema';

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

export const EVIDENCE_LEDGER_COLUMNS = [
  'record',
  'used_in',
  'visible_claim_en',
  'visible_claim_id',
  'supporting_source',
  'evidence_status',
  'visual_treatment',
  'review_status',
  'reviewer',
  'decision',
] as const;

/** One row per claim, then one row per visual so statement and picture are reviewed separately. */
export function evidenceLedgerCsv(pack: ContentPack): string {
  const usedIn = (claimId: string) =>
    [
      ...pack.chapters.map((r) => ({ kind: 'chapter', ...r })),
      ...pack.eras.map((r) => ({ kind: 'era', ...r })),
      ...pack.realms.map((r) => ({ kind: 'realm', ...r })),
      ...pack.features.map((r) => ({ kind: 'feature', ...r })),
      ...pack.reliefs.map((r) => ({ kind: 'relief', ...r })),
    ]
      .filter((record) => record.claimIds.includes(claimId))
      .map((record) => `${record.kind}:${record.id}`)
      .join(' ');
  const sourceUrl = (ids: readonly string[]) =>
    ids.map((id) => pack.sources.find((s) => s.id === id)?.url ?? `MISSING:${id}`).join(' ');
  const pending = (status: string) => (status === 'reviewed' ? 'approved' : 'pending human review');

  const rows: string[][] = [
    ...pack.claims.map((claim) => [
      `claim:${claim.id}`,
      usedIn(claim.id),
      claim.text.en,
      claim.text.id,
      sourceUrl(claim.sourceIds),
      claim.evidenceStatus,
      'text statement',
      claim.reviewStatus,
      '',
      pending(claim.reviewStatus),
    ]),
    ...pack.eras.map((era) => [
      `era-visual:${era.id}`,
      'chapter:centuries',
      era.description.en,
      era.description.id,
      '',
      era.provenance,
      'drawing style applied to the illustrative model; not a depiction of the period',
      'draft',
      '',
      'pending human review',
    ]),
    ...pack.media.map((media) => [
      `media:${media.id}`,
      '',
      media.alt.en,
      media.alt.id,
      '',
      media.provenance,
      media.isOriginal ? 'original project illustration' : 'third-party media',
      'draft',
      '',
      'pending human review',
    ]),
  ];
  return (
    [EVIDENCE_LEDGER_COLUMNS.join(','), ...rows.map((row) => row.map(csvCell).join(','))].join(
      '\n',
    ) + '\n'
  );
}

/** Bundled typefaces. Update together with src/app/fonts.ts. */
export const FONT_REGISTER = [
  {
    name: 'Marcellus',
    source: '@fontsource/marcellus (npm)',
    license: 'SIL Open Font License 1.1',
    use: 'Display headings',
  },
  {
    name: 'Source Sans 3',
    source: '@fontsource-variable/source-sans-3 (npm)',
    license: 'SIL Open Font License 1.1',
    use: 'Body text and controls',
  },
] as const;

export function rightsRegisterMarkdown(pack: ContentPack): string {
  const thirdParty = pack.media.filter((media) => !media.isOriginal);
  const cell = (value: string) => value.replace(/\|/g, '\\|');
  const lines = [
    '# Asset Rights Register',
    '',
    '_Generated from `src/content/content.json` by `pnpm registers:generate`. Do not edit by hand._',
    '',
    '## Summary',
    '',
    `- Media records: ${pack.media.length}`,
    `- Original project work: ${pack.media.length - thirdParty.length}`,
    `- Third-party media: ${thirdParty.length}`,
    `- Third-party media without a completed rights review: ${thirdParty.filter((m) => !m.rightsReviewed).length}`,
    '- Photographs, scans, audio and video of the monument: none',
    '',
    '## Media',
    '',
    '| ID | Kind | Fidelity label | Creator | License | Original | Rights reviewed | Attribution |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...pack.media.map(
      (m) =>
        `| \`${m.id}\` | ${m.kind} | ${m.provenance} | ${cell(m.creator)} | ${cell(m.licenseId)} | ${m.isOriginal ? 'yes' : 'no'} | ${m.isOriginal ? 'not applicable (original)' : m.rightsReviewed ? 'yes' : '**NO**'} | ${cell(m.attribution)} |`,
    ),
    '',
    '`project-original` means the work was authored in this repository. It is released under the',
    'MIT License (see `LICENSE`). Typefaces keep their own license, listed below.',
    '',
    '## Typefaces',
    '',
    '| Typeface | Source | License | Use |',
    '| --- | --- | --- | --- |',
    ...FONT_REGISTER.map((f) => `| ${f.name} | ${f.source} | ${f.license} | ${f.use} |`),
    '',
    '## References cited',
    '',
    '| ID | Publisher | Title | URL | Accessed |',
    '| --- | --- | --- | --- | --- |',
    ...pack.sources.map(
      (s) =>
        `| \`${s.id}\` | ${cell(s.publisher)} | ${cell(s.title)} | ${s.url} | ${s.accessedAt} |`,
    ),
    '',
    'A reference is research context. It is not a license to reuse the text, images or media found at that address.',
    '',
  ];
  return lines.join('\n');
}

export const REGISTER_FILES = {
  ledger: 'docs/evidence-ledger.csv',
  rights: 'docs/asset-rights-register.md',
} as const;

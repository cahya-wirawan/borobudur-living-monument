import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getContent } from '../src/content/loader';
import {
  EVIDENCE_LEDGER_COLUMNS,
  REGISTER_FILES,
  evidenceLedgerCsv,
  rightsRegisterMarkdown,
} from './registers-lib';

const pack = getContent();

describe('audit registers', () => {
  it('committed files match the content pack', () => {
    expect(readFileSync(REGISTER_FILES.ledger, 'utf8')).toBe(evidenceLedgerCsv(pack));
    expect(readFileSync(REGISTER_FILES.rights, 'utf8')).toBe(rightsRegisterMarkdown(pack));
  });

  it('ledger has one row per claim, era visual and media record, with a source for every claim', () => {
    const lines = evidenceLedgerCsv(pack).trim().split('\n');
    expect(lines[0]).toBe(EVIDENCE_LEDGER_COLUMNS.join(','));
    expect(lines).toHaveLength(1 + pack.claims.length + pack.eras.length + pack.media.length);
    const claimRows = lines.filter((line) => line.startsWith('"claim:'));
    expect(claimRows).toHaveLength(pack.claims.length);
    for (const row of claimRows) {
      expect(row).toContain('https://');
      expect(row).not.toContain('MISSING:');
    }
  });

  it('never records an approval that no human has given', () => {
    const csv = evidenceLedgerCsv(pack);
    expect(csv).not.toContain('"approved"');
    expect(csv.match(/pending human review/g)?.length).toBe(
      pack.claims.length + pack.eras.length + pack.media.length,
    );
  });

  it('escapes quotes and commas in CSV cells', () => {
    const tricky = structuredClone(pack);
    tricky.claims[0]!.text.en = 'He said "five", then six';
    expect(evidenceLedgerCsv(tricky)).toContain('"He said ""five"", then six"');
  });

  it('rights register reports no third-party media and lists both typefaces', () => {
    const markdown = rightsRegisterMarkdown(pack);
    expect(markdown).toContain('- Third-party media: 0');
    expect(markdown).toContain('Instrument Serif');
    expect(markdown).toContain('Inter');
    for (const media of pack.media) expect(markdown).toContain(`\`${media.id}\``);
  });
});

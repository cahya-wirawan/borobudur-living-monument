import { readFileSync, writeFileSync } from 'node:fs';
import { getContent } from '../src/content/loader';
import { REGISTER_FILES, evidenceLedgerCsv, rightsRegisterMarkdown } from './registers-lib';

const check = process.argv.includes('--check');
const pack = getContent();
const outputs: [string, string][] = [
  [REGISTER_FILES.ledger, evidenceLedgerCsv(pack)],
  [REGISTER_FILES.rights, rightsRegisterMarkdown(pack)],
];

let stale = false;
for (const [file, content] of outputs) {
  if (check) {
    let current = '';
    try {
      current = readFileSync(file, 'utf8');
    } catch {
      // Missing file counts as stale.
    }
    if (current !== content) {
      stale = true;
      console.error(`  STALE ${file} — run "pnpm registers:generate"`);
    }
  } else {
    writeFileSync(file, content);
    console.log(`  wrote ${file}`);
  }
}
if (stale) process.exit(1);
if (check) console.log('Registers are up to date.');

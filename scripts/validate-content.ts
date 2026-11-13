/**
 * Content + rights audit.
 *   pnpm validate:content   -> structural errors fail; release blockers are listed as warnings
 *   pnpm audit:release      -> release blockers fail too (also when RELEASE_CHANNEL=public)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { hasFailures, validateContent } from '../src/content/validate';

const args = process.argv.slice(2);
const release = args.includes('--release') || process.env.RELEASE_CHANNEL === 'public';
const fileArg = args.find((arg) => !arg.startsWith('--'));
const file = resolve(process.cwd(), fileArg ?? 'src/content/content.json');

const { issues } = validateContent(JSON.parse(readFileSync(file, 'utf8')));
const errors = issues.filter((issue) => issue.severity === 'error');
const blockers = issues.filter((issue) => issue.severity === 'release-blocker');

console.log(`Content audit (${release ? 'RELEASE' : 'prototype'} mode): ${file}`);
for (const issue of errors) console.error(`  ERROR   [${issue.code}] ${issue.message}`);
for (const issue of blockers)
  console[release ? 'error' : 'warn'](
    `  ${release ? 'BLOCKER' : 'pending'} [${issue.code}] ${issue.message}`,
  );

if (hasFailures(issues, release)) {
  console.error(
    `\nFAILED: ${errors.length} error(s), ${blockers.length} release blocker(s).` +
      (release ? ' This content is not publishable.' : ''),
  );
  process.exit(1);
}
console.log(
  `\nOK: 0 errors. ${blockers.length} release blocker(s) pending — prototype only, not publishable.`,
);

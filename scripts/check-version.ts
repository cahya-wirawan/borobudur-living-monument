/** Fails when package.json and CHANGELOG.md disagree. Run by CI: `pnpm version:check`. */
import { readFileSync } from 'node:fs';
import { versionProblems } from './release-lib';

const { version } = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };
const problems = versionProblems(version, readFileSync('CHANGELOG.md', 'utf8'));
for (const problem of problems) console.error(`  ERROR ${problem}`);
if (problems.length > 0) process.exit(1);
console.log(`Version OK: v${version} matches CHANGELOG.md`);

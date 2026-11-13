/**
 * Prepares a release: bumps package.json and cuts the changelog.
 *   pnpm release:prepare <patch|minor|major> ["Milestone M3: Production Hardening"]
 * It does not commit, tag, push or merge; see docs/13_VERSIONING_AND_RELEASES.md.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { bumpVersion, cutRelease, type BumpKind } from './release-lib';

const [kind, label] = process.argv.slice(2);
if (kind !== 'patch' && kind !== 'minor' && kind !== 'major') {
  console.error('Usage: pnpm release:prepare <patch|minor|major> ["label"]');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
  version: string;
  repository?: { url?: string };
};
const repository = (pkg.repository?.url ?? '').replace(/^git\+/, '').replace(/\.git$/, '');
if (!repository.startsWith('https://')) {
  console.error('package.json "repository.url" must be an https URL');
  process.exit(1);
}

const previous = pkg.version;
const version = bumpVersion(previous, kind as BumpKind);
const date = new Date().toISOString().slice(0, 10);

try {
  const changelog = cutRelease(readFileSync('CHANGELOG.md', 'utf8'), {
    version,
    previous,
    date,
    label,
    repository,
  });
  writeFileSync('CHANGELOG.md', changelog);
  writeFileSync(
    'package.json',
    readFileSync('package.json', 'utf8').replace(
      `"version": "${previous}"`,
      `"version": "${version}"`,
    ),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
console.log(`Prepared v${version} (was v${previous}). Review CHANGELOG.md, then commit.`);

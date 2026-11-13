/** Pure helpers for the release tooling (docs/13_VERSIONING_AND_RELEASES.md). */

export type BumpKind = 'major' | 'minor' | 'patch';

const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;
const UNRELEASED = '## [Unreleased]';
const VERSION_HEADING = /^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})(?: — .+)?$/gm;

export function bumpVersion(current: string, kind: BumpKind): string {
  const match = SEMVER.exec(current);
  if (!match) throw new Error(`"${current}" is not a MAJOR.MINOR.PATCH version`);
  const [major, minor, patch] = match.slice(1).map(Number) as [number, number, number];
  if (kind === 'major') return `${major + 1}.0.0`;
  if (kind === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return Math.sign(diff);
  }
  return 0;
}

/** Released versions in the order they appear (newest first in a valid changelog). */
export function changelogVersions(changelog: string): string[] {
  return [...changelog.matchAll(VERSION_HEADING)].map((match) => match[1]!);
}

/** Text between the Unreleased heading and the next version heading or link block. */
export function unreleasedBody(changelog: string): string {
  const start = changelog.indexOf(UNRELEASED);
  if (start === -1) throw new Error('CHANGELOG.md has no "## [Unreleased]" section');
  const rest = changelog.slice(start + UNRELEASED.length);
  const end = rest.search(/^(## \[|\[[^\]]+\]: )/m);
  return (end === -1 ? rest : rest.slice(0, end)).trim();
}

/** Problems that make the version/changelog pair inconsistent; empty when healthy. */
export function versionProblems(packageVersion: string, changelog: string): string[] {
  const problems: string[] = [];
  if (!SEMVER.test(packageVersion))
    problems.push(`package.json version "${packageVersion}" is not MAJOR.MINOR.PATCH`);
  if (!changelog.includes(UNRELEASED))
    problems.push('CHANGELOG.md has no "## [Unreleased]" section');
  const versions = changelogVersions(changelog);
  if (versions.length === 0) problems.push('CHANGELOG.md lists no released version');
  else if (versions[0] !== packageVersion)
    problems.push(
      `package.json is ${packageVersion} but the newest changelog version is ${versions[0]}`,
    );
  versions.forEach((version, index) => {
    const older = versions[index + 1];
    if (older && compareVersions(version, older) <= 0)
      problems.push(`changelog versions are not in descending order: ${version} before ${older}`);
  });
  if (new Set(versions).size !== versions.length) problems.push('changelog repeats a version');
  return problems;
}

/** Moves the Unreleased entries under a new dated version heading and refreshes the links. */
export function cutRelease(
  changelog: string,
  options: { version: string; previous: string; date: string; label?: string; repository: string },
): string {
  const { version, previous, date, label, repository } = options;
  if (unreleasedBody(changelog) === '')
    throw new Error('Nothing to release: "## [Unreleased]" is empty. Describe the changes first.');
  if (changelogVersions(changelog).includes(version))
    throw new Error(`CHANGELOG.md already contains version ${version}`);

  const heading = `## [${version}] - ${date}${label ? ` — ${label}` : ''}`;
  let next = changelog.replace(UNRELEASED, `${UNRELEASED}\n\n${heading}`);
  const unreleasedLink = `[Unreleased]: ${repository}/compare/v${version}...HEAD`;
  const versionLink = `[${version}]: ${repository}/compare/v${previous}...v${version}`;
  next = /^\[Unreleased\]: .*$/m.test(next)
    ? next.replace(/^\[Unreleased\]: .*$/m, `${unreleasedLink}\n${versionLink}`)
    : `${next.trimEnd()}\n\n${unreleasedLink}\n${versionLink}\n`;
  return next;
}

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  bumpVersion,
  changelogVersions,
  compareVersions,
  cutRelease,
  unreleasedBody,
  versionProblems,
} from './release-lib';

const REPO = 'https://example.invalid/org/repo';
const SAMPLE = `# Changelog

## [Unreleased]

### Added

- A new thing.

## [0.2.0] - 2026-01-02 — Milestone M1

### Added

- Older thing.

## [0.1.0] - 2026-01-01

[Unreleased]: ${REPO}/compare/v0.2.0...HEAD
[0.2.0]: ${REPO}/compare/v0.1.0...v0.2.0
`;

describe('semantic version helpers', () => {
  it('bumps each part and resets the lower ones', () => {
    expect(bumpVersion('0.3.4', 'patch')).toBe('0.3.5');
    expect(bumpVersion('0.3.4', 'minor')).toBe('0.4.0');
    expect(bumpVersion('0.3.4', 'major')).toBe('1.0.0');
    expect(() => bumpVersion('v1', 'patch')).toThrow();
  });

  it('compares numerically, not alphabetically', () => {
    expect(compareVersions('0.10.0', '0.9.0')).toBe(1);
    expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
    expect(compareVersions('0.2.9', '0.3.0')).toBe(-1);
  });
});

describe('changelog helpers', () => {
  it('reads versions and the unreleased body', () => {
    expect(changelogVersions(SAMPLE)).toEqual(['0.2.0', '0.1.0']);
    expect(unreleasedBody(SAMPLE)).toContain('A new thing.');
    expect(unreleasedBody(SAMPLE)).not.toContain('Older thing.');
  });

  it('cuts a release: dated heading, empty Unreleased, refreshed links', () => {
    const next = cutRelease(SAMPLE, {
      version: '0.3.0',
      previous: '0.2.0',
      date: '2026-02-03',
      label: 'Milestone M2',
      repository: REPO,
    });
    expect(changelogVersions(next)).toEqual(['0.3.0', '0.2.0', '0.1.0']);
    expect(next).toContain('## [0.3.0] - 2026-02-03 — Milestone M2\n\n### Added\n\n- A new thing.');
    expect(unreleasedBody(next)).toBe('');
    expect(next).toContain(`[Unreleased]: ${REPO}/compare/v0.3.0...HEAD`);
    expect(next).toContain(`[0.3.0]: ${REPO}/compare/v0.2.0...v0.3.0`);
    expect(next).toContain(`[0.2.0]: ${REPO}/compare/v0.1.0...v0.2.0`);
    expect(versionProblems('0.3.0', next)).toEqual([]);
  });

  it('refuses an empty or duplicate release', () => {
    const empty = SAMPLE.replace('### Added\n\n- A new thing.\n\n', '');
    const options = { previous: '0.2.0', date: '2026-02-03', repository: REPO };
    expect(() => cutRelease(empty, { ...options, version: '0.3.0' })).toThrow(/Nothing to release/);
    expect(() => cutRelease(SAMPLE, { ...options, version: '0.2.0' })).toThrow(/already contains/);
  });

  it('reports mismatches and ordering problems', () => {
    expect(versionProblems('0.2.0', SAMPLE)).toEqual([]);
    expect(versionProblems('0.3.0', SAMPLE).join()).toMatch(/newest changelog version is 0.2.0/);
    expect(versionProblems('0.2.0', SAMPLE.replace('[0.1.0]', '[0.5.0]')).join()).toMatch(
      /descending/,
    );
    expect(versionProblems('0.2.0', '# Changelog').length).toBeGreaterThanOrEqual(2);
  });
});

describe('this repository', () => {
  it('has a package version that matches its changelog', () => {
    const { version } = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };
    expect(versionProblems(version, readFileSync('CHANGELOG.md', 'utf8'))).toEqual([]);
  });
});

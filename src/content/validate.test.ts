import { describe, expect, it } from 'vitest';
import legacyFixture from '../../content/example-content.json';
import fixture from './content.json';
import { getContent } from './loader';
import type { ContentPack } from './schema';
import { hasFailures, validateContent } from './validate';

const clone = (): ContentPack => structuredClone(fixture) as ContentPack;
const codes = (input: unknown, severity?: 'error' | 'release-blocker') =>
  validateContent(input)
    .issues.filter((issue) => !severity || issue.severity === severity)
    .map((issue) => issue.code);

describe('committed content pack', () => {
  it('has no structural errors and loads', () => {
    expect(codes(fixture, 'error')).toEqual([]);
    expect(getContent().chapters).toHaveLength(5);
  });

  it('passes the prototype audit but is NOT publishable (claims are unreviewed drafts)', () => {
    const { issues } = validateContent(fixture);
    expect(hasFailures(issues, false)).toBe(false);
    expect(hasFailures(issues, true)).toBe(true);
    expect(codes(fixture, 'release-blocker')).toContain('unreviewed-claim');
  });

  it('labels every bundled visual as original and artistic', () => {
    for (const media of getContent().media) {
      expect(media.isOriginal).toBe(true);
      expect(media.provenance).toBe('artistic');
    }
    expect(getContent().monument.illustrativeGeometry).toBe(true);
  });

  it('never marks agent-drafted claims as reviewed', () => {
    expect(getContent().claims.every((claim) => claim.reviewStatus !== 'reviewed')).toBe(true);
  });
});

describe('content audit rules', () => {
  it('fails a documented claim with no source', () => {
    const pack = clone();
    pack.claims[0]!.sourceIds = [];
    expect(codes(pack, 'error')).toContain('missing-source');
  });

  it('fails dangling source, claim and media references', () => {
    const pack = clone();
    pack.claims[0]!.sourceIds = ['no-such-source'];
    pack.chapters[0]!.claimIds = ['no-such-claim'];
    pack.reliefs[0]!.mediaIds = ['no-such-media'];
    expect(codes(pack, 'error')).toEqual(
      expect.arrayContaining(['dangling-source', 'dangling-claim', 'dangling-media']),
    );
  });

  it('fails duplicate ids', () => {
    const pack = clone();
    pack.claims.push(structuredClone(pack.claims[0]!));
    expect(codes(pack, 'error')).toContain('duplicate-id');
  });

  it('fails a missing or empty locale and embedded markup', () => {
    const missing = clone() as unknown as { chapters: { title: Record<string, string> }[] };
    delete missing.chapters[0]!.title.id;
    expect(codes(missing, 'error')).toContain('schema');

    const empty = clone();
    empty.chapters[0]!.summary.id = '   ';
    expect(codes(empty, 'error')).toContain('schema');

    const markup = clone();
    markup.claims[0]!.text.en = 'Hello <img src=x onerror=alert(1)>';
    expect(codes(markup, 'error')).toContain('schema');
  });

  it('fails non-https source URLs', () => {
    const pack = clone();
    pack.sources[0]!.url = 'javascript:alert(1)';
    expect(codes(pack, 'error')).toContain('schema');
  });

  it('blocks release for third-party media with unknown license or no rights review', () => {
    const pack = clone();
    pack.media.push({
      id: 'borrowed-photo',
      src: '/images/borrowed.jpg',
      alt: { en: 'A photo', id: 'Sebuah foto' },
      kind: 'image',
      provenance: 'documented',
      creator: 'Unknown',
      licenseId: 'unknown',
      rightsReviewed: false,
      attribution: 'Unknown',
      isOriginal: false,
    });
    const found = codes(pack, 'release-blocker');
    expect(found).toEqual(expect.arrayContaining(['media-license', 'media-rights']));
    expect(hasFailures(validateContent(pack).issues, true)).toBe(true);
  });

  it('refuses to drop the illustrative-geometry label without a reviewed documented model', () => {
    const pack = clone();
    pack.monument.illustrativeGeometry = false;
    expect(codes(pack, 'error')).toContain('geometry-claim');
  });

  it('refuses a relief presented as an original panel without verification', () => {
    const pack = clone();
    pack.reliefs[0]!.demonstration = false;
    expect(codes(pack, 'error')).toContain('relief-unverified');
  });

  it('becomes publishable only when every claim is reviewed', () => {
    const pack = clone();
    for (const claim of pack.claims) claim.reviewStatus = 'reviewed';
    expect(hasFailures(validateContent(pack).issues, true)).toBe(false);
  });
});

describe('schema 1.1.0 (M2)', () => {
  it('migrates the original 1.0.0 example pack without structural errors', () => {
    expect((legacyFixture as { schemaVersion: string }).schemaVersion).toBe('1.0.0');
    const { pack, issues } = validateContent(legacyFixture);
    expect(issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(pack?.schemaVersion).toBe('1.1.0');
    expect(pack?.features).toEqual([]);
  });

  it('ships at least three sourced architectural features and two demo reliefs', () => {
    const pack = getContent();
    expect(pack.features.length).toBeGreaterThanOrEqual(3);
    expect(pack.features.every((feature) => feature.claimIds.length > 0)).toBe(true);
    expect(pack.reliefs.length).toBeGreaterThanOrEqual(2);
    expect(pack.reliefs.every((relief) => relief.demonstration && !relief.verifiedLocation)).toBe(true);
  });

  it('blocks eras, realms and features that cite no claim', () => {
    for (const key of ['eras', 'realms', 'features'] as const) {
      const pack = clone();
      pack[key][0]!.claimIds = [];
      expect(codes(pack, 'error'), key).toContain('unsourced-record');
    }
  });

  it('fails a feature that points at an unknown claim', () => {
    const pack = clone();
    pack.features[0]!.claimIds = ['invented-doctrine'];
    expect(codes(pack, 'error')).toContain('dangling-claim');
  });
});

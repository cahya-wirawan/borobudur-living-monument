import { describe, expect, it } from 'vitest';
import { format, getDictionary } from './dictionaries';

type Tree = { [key: string]: Tree | string | string[] };

function flatten(tree: Tree, prefix = ''): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((out, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out[path] = value;
    else if (Array.isArray(value)) value.forEach((item, i) => (out[`${path}.${i}`] = item));
    else Object.assign(out, flatten(value, path));
    return out;
  }, {});
}

const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();

describe('EN/ID interface parity', () => {
  const en = flatten(getDictionary('en') as unknown as Tree);
  const id = flatten(getDictionary('id') as unknown as Tree);

  it('has exactly the same keys in both locales', () => {
    expect(Object.keys(id).sort()).toEqual(Object.keys(en).sort());
  });

  it('has no empty strings and the same placeholders', () => {
    for (const key of Object.keys(en)) {
      expect(en[key]!.trim(), key).not.toBe('');
      expect(id[key]!.trim(), key).not.toBe('');
      expect(placeholders(id[key]!), key).toEqual(placeholders(en[key]!));
    }
  });

  it('keeps the mandated honesty labels', () => {
    expect(en['common.illustrativeLabel']).toBe(
      'Illustrative geometry — not a surveyed reconstruction',
    );
    expect(en['relief.demoBanner']).toBe('DEMO ARTWORK — NOT ORIGINAL RELIEF');
    expect(en['relief.demoNotice']).toBe('Demonstration artwork — not a specific original panel');
    expect(id['common.illustrativeLabel']).toMatch(/bukan rekonstruksi/);
    expect(id['relief.demoNotice']).toMatch(/bukan panel asli/);
  });
});

describe('format', () => {
  it('fills placeholders and leaves unknown ones visible', () => {
    expect(format('Chapter {current} of {total}', { current: 2, total: 5 })).toBe('Chapter 2 of 5');
    expect(format('{missing}', {})).toBe('{missing}');
  });
});

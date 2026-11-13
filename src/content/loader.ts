import raw from './content.json';
import type { ContentPack } from './schema';
import { validateContent } from './validate';

let cached: ContentPack | null = null;

/** Returns the validated content pack; throws if the committed fixture is structurally invalid. */
export function getContent(): ContentPack {
  if (cached) return cached;
  const { pack, issues } = validateContent(raw);
  const errors = issues.filter((issue) => issue.severity === 'error');
  if (!pack || errors.length > 0) {
    throw new Error(
      `Invalid content pack:\n${errors.map((issue) => `- [${issue.code}] ${issue.message}`).join('\n')}`,
    );
  }
  cached = pack;
  return pack;
}

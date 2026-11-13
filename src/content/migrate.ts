import { SCHEMA_VERSION } from './schema';

type Versioned = { schemaVersion?: unknown; features?: unknown };

/**
 * Upgrades older content packs to the current schema version. IDs referenced
 * by shared URLs are never renamed here (docs/11 §8).
 *
 * 1.0.0 -> 1.1.0: adds the `features` collection (empty when absent).
 */
export function migrateContent(input: unknown): unknown {
  if (typeof input !== 'object' || input === null) return input;
  const pack = input as Versioned;
  if (pack.schemaVersion === '1.0.0')
    return { ...pack, schemaVersion: SCHEMA_VERSION, features: pack.features ?? [] };
  return input;
}

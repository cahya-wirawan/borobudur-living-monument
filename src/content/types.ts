/**
 * Browser-safe entry point for content types and identifiers. Importing from
 * here never bundles the Zod schemas; validation stays on the server and in
 * build scripts (`schema.ts`, `validate.ts`, `loader.ts`).
 */
export * from './ids';
export type {
  Chapter,
  Claim,
  ContentPack,
  Era,
  Feature,
  Localized,
  Media,
  Realm,
  Relief,
  Source,
} from './schema';

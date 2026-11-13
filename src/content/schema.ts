import { z } from 'zod';

/** Zod equivalent of `content/content.schema.json`. Older packs are upgraded by `migrate.ts`. */
export const SCHEMA_VERSION = '1.1.0';

export const CHAPTER_IDS = ['awakening', 'centuries', 'architecture', 'stories', 'ascent'] as const;
export const ERA_IDS = ['construction', 'nineteenth-century', 'restoration', 'present'] as const;
export const REALM_IDS = ['kamadhatu', 'rupadhatu', 'arupadhatu'] as const;
export const LOCALES = ['en', 'id'] as const;
export const EVIDENCE_STATUSES = ['documented', 'inferred', 'artistic'] as const;
export const REVIEW_STATUSES = ['draft', 'needs-review', 'reviewed'] as const;

export type ChapterId = (typeof CHAPTER_IDS)[number];
export type EraId = (typeof ERA_IDS)[number];
export type RealmId = (typeof REALM_IDS)[number];
export type Locale = (typeof LOCALES)[number];
export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

const idSchema = z.string().regex(/^[a-z][a-z0-9-]*$/, 'IDs must be kebab-case').min(2);

const NO_MARKUP = /<\/?[a-z][^>]*>/i;
const text = z
  .string()
  .min(1)
  .refine((value) => value.trim() === value && value.trim().length > 0, 'Text must be trimmed and non-empty')
  .refine((value) => !NO_MARKUP.test(value), 'Text must not contain HTML markup');

const localized = z.strictObject({ en: text, id: text });
const idList = z
  .array(idSchema)
  .refine((ids) => new Set(ids).size === ids.length, 'ID lists must not contain duplicates');
const evidence = z.enum(EVIDENCE_STATUSES);
const httpsUrl = z.string().regex(/^https:\/\//, 'URL must use https');

export const sourceSchema = z.strictObject({
  id: idSchema,
  title: z.string().min(2),
  publisher: z.string().min(2),
  url: httpsUrl,
  accessedAt: z.iso.date(),
  type: z.enum(['official', 'scholarly', 'archival', 'other']),
});

export const claimSchema = z.strictObject({
  id: idSchema,
  text: localized,
  evidenceStatus: evidence,
  reviewStatus: z.enum(REVIEW_STATUSES),
  sourceIds: idList,
  qualification: localized.optional(),
});

export const chapterSchema = z.strictObject({
  id: z.enum(CHAPTER_IDS),
  title: localized,
  summary: localized,
  claimIds: idList,
});

export const eraSchema = z.strictObject({
  id: z.enum(ERA_IDS),
  label: localized,
  description: localized,
  provenance: evidence,
  claimIds: idList,
});

export const realmSchema = z.strictObject({
  id: z.enum(REALM_IDS),
  title: localized,
  explanation: localized,
  claimIds: idList,
});

/** An annotated architectural feature of the illustrative drawing (schema 1.1.0). */
export const featureSchema = z.strictObject({
  id: idSchema,
  title: localized,
  description: localized,
  claimIds: idList,
});

export const reliefSchema = z.strictObject({
  id: idSchema,
  title: localized,
  description: localized,
  demonstration: z.boolean(),
  claimIds: idList,
  mediaIds: idList,
  verifiedLocation: z.string().min(1).optional(),
});

export const mediaSchema = z.strictObject({
  id: idSchema,
  src: z.string().min(1),
  alt: localized,
  kind: z.enum(['image', 'model', 'audio', 'video', 'illustration']),
  provenance: evidence,
  creator: z.string().min(1),
  licenseId: z.string().min(1),
  licenseUrl: httpsUrl.optional(),
  rightsReviewed: z.boolean(),
  attribution: z.string().min(1),
  isOriginal: z.boolean(),
});

export const contentPackSchema = z.strictObject({
  schemaVersion: z.literal(SCHEMA_VERSION),
  monument: z.strictObject({
    id: idSchema,
    title: localized,
    location: localized,
    illustrativeGeometry: z.boolean(),
  }),
  prototypeNotice: localized,
  sources: z.array(sourceSchema).min(1),
  claims: z.array(claimSchema),
  chapters: z.array(chapterSchema).length(5),
  eras: z.array(eraSchema).length(4),
  realms: z.array(realmSchema).length(3),
  features: z.array(featureSchema),
  reliefs: z.array(reliefSchema).min(1),
  media: z.array(mediaSchema),
});

export type Localized = z.infer<typeof localized>;
export type Source = z.infer<typeof sourceSchema>;
export type Claim = z.infer<typeof claimSchema>;
export type Chapter = z.infer<typeof chapterSchema>;
export type Era = z.infer<typeof eraSchema>;
export type Realm = z.infer<typeof realmSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type Relief = z.infer<typeof reliefSchema>;
export type Media = z.infer<typeof mediaSchema>;
export type ContentPack = z.infer<typeof contentPackSchema>;

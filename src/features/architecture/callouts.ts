import type { SchematicCallout } from '@/components/shell/MonumentSchematic';
import type { ContentPack } from '@/content/schema';
import { highlightForFeature } from '@/scene/monument-spec';

/** Numbered diagram markers for the architectural features, in content order. */
export function featureCallouts(
  pack: ContentPack,
  activeFeatureId: string | null = null,
): SchematicCallout[] {
  return pack.features.flatMap((feature, index) => {
    const target = highlightForFeature(feature.id);
    return target
      ? [{ label: String(index + 1), target, active: feature.id === activeFeatureId }]
      : [];
  });
}

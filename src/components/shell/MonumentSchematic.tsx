import { TOTAL_LEVELS, type EraTreatment } from '@/features/time-machine/era-mapping';
import {
  MONUMENT_HEIGHT,
  MONUMENT_LEVELS,
  RING_STUPA_COUNTS,
  SMALL_STUPA,
  type SceneHighlight,
} from '@/scene/monument-spec';

const PRESENT: EraTreatment = {
  solidLevels: TOTAL_LEVELS,
  ghostRemaining: false,
  surface: 'stone',
  wireOverlay: false,
};

export type SchematicCallout = {
  /** Short visible marker, normally the feature's list number. */
  label: string;
  target: NonNullable<SceneHighlight>;
  active: boolean;
};

/** Bell-shaped outline with its base centred on (cx, baseY); SVG y grows downward. */
function bellPath(cx: number, baseY: number, radius: number, height: number): string {
  const top = baseY - height;
  const shoulder = baseY - height * 0.62;
  return [
    `M${cx - radius} ${baseY}`,
    `L${cx - radius} ${baseY - height * 0.12}`,
    `C${cx - radius} ${shoulder} ${cx - radius * 0.3} ${shoulder} ${cx - radius * 0.16} ${baseY - height * 0.7}`,
    `L${cx - radius * 0.08} ${top}`,
    `L${cx + radius * 0.08} ${top}`,
    `L${cx + radius * 0.16} ${baseY - height * 0.7}`,
    `C${cx + radius * 0.3} ${shoulder} ${cx + radius} ${shoulder} ${cx + radius} ${baseY - height * 0.12}`,
    `L${cx + radius} ${baseY}Z`,
  ].join(' ');
}

/** Where a callout's leader line starts (on the drawing) and which side its marker sits on. */
function calloutAnchor(
  target: NonNullable<SceneHighlight>,
): { x: number; y: number; side: 1 | -1 } | null {
  const levels = MONUMENT_LEVELS.filter((level) => target.levelIds.includes(level.id));
  const middle = levels[Math.floor(levels.length / 2)];
  if (middle) return { x: middle.extent, y: -(middle.y + middle.height / 2), side: 1 };
  if (target.smallStupas) {
    const ring = MONUMENT_LEVELS.find((level) => RING_STUPA_COUNTS[level.id] !== undefined);
    if (ring)
      return {
        x: -(ring.extent - 0.3 + SMALL_STUPA.radius * 1.4),
        y: -(ring.y + ring.height + SMALL_STUPA.height * 0.6),
        side: -1,
      };
  }
  return null;
}

/**
 * Original, repo-authored elevation drawing (media id `monument-schematic-diagram`).
 * It is the still alternative to the 3D scene and the Read-mode figure.
 * Illustrative geometry — not a surveyed reconstruction.
 */
export function MonumentSchematic({
  title,
  description,
  highlight = null,
  treatment = PRESENT,
  callouts = [],
  idPrefix,
  className,
}: {
  title: string;
  description: string;
  highlight?: SceneHighlight;
  treatment?: EraTreatment;
  /** Numbered markers. Decorative: the matching HTML list carries the meaning. */
  callouts?: readonly SchematicCallout[];
  /** Must be unique per page so aria-labelledby resolves correctly. */
  idPrefix: string;
  className?: string;
}) {
  const margin = 0.9;
  const halfWidth = (MONUMENT_LEVELS[0]?.extent ?? 6) + margin;
  const viewBox = `${-halfWidth} ${-(MONUMENT_HEIGHT + margin)} ${halfWidth * 2} ${MONUMENT_HEIGHT + margin * 1.6}`;
  const sketch = treatment.surface === 'sketch';

  const look = (built: boolean, highlighted: boolean) => {
    const dimmed = highlight !== null && !highlighted;
    return {
      fill:
        !built || sketch ? 'none' : highlighted ? 'var(--color-bronze)' : `url(#${idPrefix}-stone)`,
      stroke: !built
        ? 'var(--color-stone)'
        : sketch
          ? 'var(--color-parchment)'
          : 'var(--color-bronze)',
      strokeOpacity: built && !sketch && !highlighted ? 0.55 : 1,
      strokeDasharray: built ? undefined : '5 4',
      opacity: dimmed ? 0.45 : built ? 1 : 0.7,
      vectorEffect: 'non-scaling-stroke' as const,
    };
  };

  return (
    <svg
      role="img"
      aria-labelledby={`${idPrefix}-title ${idPrefix}-desc`}
      viewBox={viewBox}
      className={className}
      preserveAspectRatio="xMidYMax meet"
    >
      <title id={`${idPrefix}-title`}>{title}</title>
      <desc id={`${idPrefix}-desc`}>{description}</desc>
      <defs>
        {/* Light falls from above: a shading device, not a record of the stone's colour. */}
        <linearGradient
          id={`${idPrefix}-stone`}
          gradientUnits="userSpaceOnUse"
          x1={0}
          x2={0}
          y1={-MONUMENT_HEIGHT}
          y2={0}
        >
          <stop offset="0" stopColor="var(--stone-top, #b7a39a)" />
          <stop offset="1" stopColor="var(--stone-bottom, #4f4463)" />
        </linearGradient>
      </defs>
      <line
        x1={-halfWidth}
        x2={halfWidth}
        y1={0}
        y2={0}
        stroke="var(--color-parchment)"
        strokeWidth={1}
        opacity={0.35}
        vectorEffect="non-scaling-stroke"
      />
      {MONUMENT_LEVELS.map((level, index) => {
        const built = index < treatment.solidLevels;
        if (!built && !treatment.ghostRemaining) return null;
        const highlighted = highlight?.levelIds.includes(level.id) ?? false;
        const top = -(level.y + level.height);
        const ringCount = RING_STUPA_COUNTS[level.id];
        const columns = Math.floor(level.extent * 2);
        return (
          <g
            key={level.id}
            data-level={level.id}
            data-realm={level.realm}
            data-built={built}
            data-highlighted={highlighted}
          >
            {level.shape === 'stupa' ? (
              <path
                d={bellPath(0, -level.y, level.extent, level.height)}
                {...look(built, highlighted)}
                strokeWidth={1.2}
              />
            ) : (
              <rect
                x={-level.extent}
                y={top}
                width={level.extent * 2}
                height={level.height}
                {...look(built, highlighted)}
                strokeWidth={1.2}
              />
            )}
            {ringCount !== undefined &&
              [-1, 1].map((side) => (
                <path
                  key={side}
                  data-small-stupa
                  d={bellPath(
                    side * (level.extent - 0.3),
                    top,
                    SMALL_STUPA.radius * 1.4,
                    SMALL_STUPA.height * 1.3,
                  )}
                  {...look(built, highlight?.smallStupas ?? false)}
                  strokeWidth={1}
                />
              ))}
            {built && treatment.wireOverlay && level.shape !== 'stupa' && (
              <g stroke="var(--color-parchment)" strokeWidth={0.6} opacity={0.55}>
                {Array.from({ length: columns - 1 }, (_, i) => {
                  const x = -level.extent + (i + 1) * ((level.extent * 2) / columns);
                  return (
                    <line
                      key={i}
                      x1={x}
                      x2={x}
                      y1={top}
                      y2={top + level.height}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </g>
            )}
          </g>
        );
      })}
      {callouts.length > 0 && (
        <g aria-hidden="true" data-callouts>
          {callouts.map((callout) => {
            const anchor = calloutAnchor(callout.target);
            if (!anchor) return null;
            const markerX = anchor.side * (halfWidth - 0.4);
            return (
              <g key={callout.label}>
                <line
                  x1={anchor.x}
                  x2={markerX - anchor.side * 0.32}
                  y1={anchor.y}
                  y2={anchor.y}
                  stroke="var(--color-parchment)"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={markerX}
                  cy={anchor.y}
                  r={0.32}
                  fill={callout.active ? 'var(--color-parchment)' : 'var(--color-ink)'}
                  stroke="var(--color-parchment)"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x={markerX}
                  y={anchor.y}
                  fontSize={0.4}
                  fontWeight={600}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={callout.active ? 'var(--color-ink)' : 'var(--color-parchment)'}
                >
                  {callout.label}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}

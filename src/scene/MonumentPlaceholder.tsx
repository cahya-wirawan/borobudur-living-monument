'use client';

import { Edges } from '@react-three/drei';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Object3D, Vector2, type InstancedMesh } from 'three';
import type { EraTreatment } from '@/features/time-machine/era-mapping';
import {
  MONUMENT_LEVELS,
  SMALL_STUPA,
  smallStupaPlacements,
  type MonumentLevel,
  type SceneHighlight,
} from './monument-spec';

/**
 * ILLUSTRATIVE GEOMETRY — NOT A SURVEYED RECONSTRUCTION.
 * Original procedural geometry (media id `monument-procedural-model`).
 * See `monument-spec.ts` for what is and is not source-backed.
 */

const COLORS = {
  sketchFlat: '#0b0c24',
  sketchCurve: '#3a3972',
  saffron: '#f2b451',
  saffronGlow: '#b8660f',
  stone: '#aca8c4',
  parchment: '#f3e3c8',
} as const;

/** Stone tones depend on the light the scene is shown in (see `atmosphere.ts`). */
export type StoneTones = { stone: string; stoneDim: string };

function bellProfile(radius: number, height: number): Vector2[] {
  return [
    new Vector2(radius, 0),
    new Vector2(radius, height * 0.1),
    new Vector2(radius * 0.98, height * 0.2),
    new Vector2(radius * 0.92, height * 0.3),
    new Vector2(radius * 0.82, height * 0.41),
    new Vector2(radius * 0.68, height * 0.5),
    new Vector2(radius * 0.52, height * 0.56),
    new Vector2(radius * 0.36, height * 0.6),
    new Vector2(radius * 0.2, height * 0.64),
    new Vector2(radius * 0.2, height * 0.74),
    new Vector2(radius * 0.07, height * 0.76),
    new Vector2(radius * 0.03, height),
    new Vector2(0, height),
  ];
}

type LevelLook = { built: boolean; highlighted: boolean; dimmed: boolean };

function LevelMaterial({
  look,
  treatment,
  tones,
  smooth,
}: {
  look: LevelLook;
  treatment: EraTreatment;
  tones: StoneTones;
  smooth: boolean;
}) {
  if (!look.built)
    return <meshBasicMaterial color={COLORS.stone} transparent opacity={0.07} depthWrite={false} />;
  // Outline drawing: curved parts have no edge lines, so they get a lighter flat tone to stay readable.
  if (treatment.surface === 'sketch')
    return <meshBasicMaterial color={smooth ? COLORS.sketchCurve : COLORS.sketchFlat} />;
  return (
    <meshStandardMaterial
      color={look.highlighted ? COLORS.saffron : look.dimmed ? tones.stoneDim : tones.stone}
      emissive={look.highlighted ? COLORS.saffronGlow : '#000000'}
      emissiveIntensity={look.highlighted ? 0.55 : 0}
      roughness={0.92}
      metalness={0}
      flatShading={!smooth}
    />
  );
}

/** A thin projecting course along the top of a terrace. A drawing device, not a recorded moulding. */
const CAP = { overhang: 0.05, height: 0.07 } as const;

function Level({
  level,
  look,
  treatment,
  tones,
  segments,
  edges,
  shadows,
}: {
  level: MonumentLevel;
  look: LevelLook;
  treatment: EraTreatment;
  tones: StoneTones;
  segments: number;
  edges: boolean;
  shadows: boolean;
}) {
  const profile = useMemo(
    () => bellProfile(level.extent, level.height),
    [level.extent, level.height],
  );
  const stone = look.built && treatment.surface === 'stone';
  const edgeColor = !look.built
    ? COLORS.stone
    : treatment.surface === 'sketch' || treatment.wireOverlay
      ? COLORS.parchment
      : COLORS.saffron;
  const edgeOpacity = !look.built
    ? 0.55
    : treatment.surface === 'sketch'
      ? 0.95
      : look.dimmed
        ? 0.14
        : 0.34;
  const centerY = level.shape === 'stupa' ? level.y : level.y + level.height / 2;
  const grid = Math.max(2, Math.round(level.extent * 2));
  const capWidth = (level.extent + CAP.overhang) * 2;

  return (
    <group position={[0, centerY, 0]}>
      <mesh castShadow={shadows && stone} receiveShadow={shadows && stone}>
        {level.shape === 'square' && (
          <boxGeometry args={[level.extent * 2, level.height, level.extent * 2]} />
        )}
        {level.shape === 'circle' && (
          <cylinderGeometry args={[level.extent, level.extent, level.height, segments]} />
        )}
        {level.shape === 'stupa' && <latheGeometry args={[profile, segments]} />}
        <LevelMaterial
          look={look}
          treatment={treatment}
          tones={tones}
          smooth={level.shape !== 'square'}
        />
        {edges && level.shape !== 'stupa' && (
          <Edges threshold={20} color={edgeColor} lineWidth={1} transparent opacity={edgeOpacity} />
        )}
      </mesh>
      {stone && level.shape !== 'stupa' && (
        <mesh
          position={[0, level.height / 2 - CAP.height / 2, 0]}
          castShadow={shadows}
          receiveShadow={shadows}
        >
          {level.shape === 'square' ? (
            <boxGeometry args={[capWidth, CAP.height, capWidth]} />
          ) : (
            <cylinderGeometry
              args={[
                level.extent + CAP.overhang,
                level.extent + CAP.overhang,
                CAP.height,
                segments,
              ]}
            />
          )}
          <LevelMaterial
            look={look}
            treatment={treatment}
            tones={tones}
            smooth={level.shape !== 'square'}
          />
        </mesh>
      )}
      {look.built && treatment.wireOverlay && level.shape === 'square' && (
        <mesh scale={1.012}>
          <boxGeometry args={[level.extent * 2, level.height, level.extent * 2, grid, 1, grid]} />
          <meshBasicMaterial color={COLORS.parchment} wireframe transparent opacity={0.34} />
        </mesh>
      )}
    </group>
  );
}

function SmallStupas({
  segments,
  color,
  glowing,
  shadows,
}: {
  segments: number;
  color: string;
  glowing: boolean;
  shadows: boolean;
}) {
  const ref = useRef<InstancedMesh>(null);
  const placements = useMemo(() => smallStupaPlacements(), []);
  const profile = useMemo(() => bellProfile(SMALL_STUPA.radius, SMALL_STUPA.height), []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new Object3D();
    placements.forEach((placement, index) => {
      dummy.position.set(placement.x, placement.y, placement.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [placements]);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, placements.length]}
      castShadow={shadows}
      receiveShadow={shadows}
    >
      <latheGeometry args={[profile, Math.max(10, Math.round(segments / 3))]} />
      <meshStandardMaterial
        color={color}
        emissive={glowing ? COLORS.saffronGlow : '#000000'}
        emissiveIntensity={glowing ? 0.55 : 0}
        roughness={0.92}
      />
    </instancedMesh>
  );
}

export function MonumentPlaceholder({
  treatment,
  highlight,
  tones,
  segments,
  edges,
  shadows,
}: {
  treatment: EraTreatment;
  highlight: SceneHighlight;
  tones: StoneTones;
  segments: number;
  edges: boolean;
  shadows: boolean;
}) {
  const allBuilt = treatment.solidLevels >= MONUMENT_LEVELS.length;
  const upperHighlighted = highlight?.smallStupas ?? false;
  const upperDimmed = highlight !== null && !upperHighlighted;

  return (
    <group>
      {MONUMENT_LEVELS.map((level, index) => {
        const built = index < treatment.solidLevels;
        if (!built && !treatment.ghostRemaining) return null;
        const highlighted = highlight?.levelIds.includes(level.id) ?? false;
        return (
          <Level
            key={level.id}
            level={level}
            treatment={treatment}
            tones={tones}
            segments={segments}
            edges={edges}
            shadows={shadows}
            look={{ built, highlighted, dimmed: highlight !== null && !highlighted }}
          />
        );
      })}
      {allBuilt && treatment.surface === 'stone' && (
        <SmallStupas
          segments={segments}
          shadows={shadows}
          glowing={upperHighlighted}
          color={upperHighlighted ? COLORS.saffron : upperDimmed ? tones.stoneDim : tones.stone}
        />
      )}
    </group>
  );
}

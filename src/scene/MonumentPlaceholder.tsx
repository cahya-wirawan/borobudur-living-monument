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
  ink: '#171b1b',
  rock: '#8f8b80',
  rockDim: '#6f6c63',
  bronze: '#c4a57b',
  stone: '#a6a195',
  parchment: '#e9dcc7',
} as const;

function bellProfile(radius: number, height: number): Vector2[] {
  return [
    new Vector2(radius, 0),
    new Vector2(radius, height * 0.1),
    new Vector2(radius * 0.92, height * 0.3),
    new Vector2(radius * 0.68, height * 0.5),
    new Vector2(radius * 0.36, height * 0.6),
    new Vector2(radius * 0.2, height * 0.64),
    new Vector2(radius * 0.2, height * 0.74),
    new Vector2(radius * 0.07, height * 0.76),
    new Vector2(radius * 0.03, height),
    new Vector2(0, height),
  ];
}

type LevelLook = { built: boolean; highlighted: boolean; dimmed: boolean };

function LevelMaterial({ look, treatment }: { look: LevelLook; treatment: EraTreatment }) {
  if (!look.built)
    return <meshBasicMaterial color={COLORS.stone} transparent opacity={0.05} depthWrite={false} />;
  if (treatment.surface === 'sketch') return <meshBasicMaterial color={COLORS.ink} />;
  return (
    <meshStandardMaterial
      color={look.highlighted ? COLORS.bronze : look.dimmed ? COLORS.rockDim : COLORS.rock}
      roughness={0.94}
      metalness={0}
      flatShading
    />
  );
}

function Level({
  level,
  look,
  treatment,
  segments,
  edges,
}: {
  level: MonumentLevel;
  look: LevelLook;
  treatment: EraTreatment;
  segments: number;
  edges: boolean;
}) {
  const profile = useMemo(
    () => bellProfile(level.extent, level.height),
    [level.extent, level.height],
  );
  const edgeColor = !look.built
    ? COLORS.stone
    : treatment.surface === 'sketch' || treatment.wireOverlay
      ? COLORS.parchment
      : COLORS.bronze;
  const centerY = level.shape === 'stupa' ? level.y : level.y + level.height / 2;
  const grid = Math.max(2, Math.round(level.extent * 2));

  return (
    <group position={[0, centerY, 0]}>
      <mesh>
        {level.shape === 'square' && (
          <boxGeometry args={[level.extent * 2, level.height, level.extent * 2]} />
        )}
        {level.shape === 'circle' && (
          <cylinderGeometry args={[level.extent, level.extent, level.height, segments]} />
        )}
        {level.shape === 'stupa' && <latheGeometry args={[profile, segments]} />}
        <LevelMaterial look={look} treatment={treatment} />
        {edges && level.shape !== 'stupa' && (
          <Edges
            threshold={20}
            color={edgeColor}
            lineWidth={1}
            transparent
            opacity={look.built ? (look.dimmed ? 0.35 : 0.85) : 0.5}
          />
        )}
      </mesh>
      {look.built && treatment.wireOverlay && level.shape === 'square' && (
        <mesh scale={1.004}>
          <boxGeometry args={[level.extent * 2, level.height, level.extent * 2, grid, 1, grid]} />
          <meshBasicMaterial color={COLORS.parchment} wireframe transparent opacity={0.28} />
        </mesh>
      )}
    </group>
  );
}

function SmallStupas({ segments, color }: { segments: number; color: string }) {
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
    <instancedMesh ref={ref} args={[undefined, undefined, placements.length]}>
      <latheGeometry args={[profile, Math.max(8, Math.round(segments / 4))]} />
      <meshStandardMaterial color={color} roughness={0.94} flatShading />
    </instancedMesh>
  );
}

export function MonumentPlaceholder({
  treatment,
  highlight,
  segments,
  edges,
}: {
  treatment: EraTreatment;
  highlight: SceneHighlight;
  segments: number;
  edges: boolean;
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
            segments={segments}
            edges={edges}
            look={{ built, highlighted, dimmed: highlight !== null && !highlighted }}
          />
        );
      })}
      {allBuilt && treatment.surface === 'stone' && (
        <SmallStupas
          segments={segments}
          color={upperHighlighted ? COLORS.bronze : upperDimmed ? COLORS.rockDim : COLORS.rock}
        />
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[60, 48]} />
        <meshStandardMaterial color="#1e2522" roughness={1} />
      </mesh>
    </group>
  );
}

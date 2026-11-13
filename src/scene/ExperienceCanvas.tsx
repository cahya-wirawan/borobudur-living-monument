'use client';

import { Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { RefObject } from 'react';
import type { Mode, MotionPolicy, SceneQuality } from '@/features/experience/controller';
import type { EraTreatment } from '@/features/time-machine/era-mapping';
import { QUALITY_SETTINGS } from '@/lib/capabilities';
import { CameraDirector } from './CameraDirector';
import { MonumentPlaceholder } from './MonumentPlaceholder';
import { reliefHotspotPosition, type SceneHighlight } from './monument-spec';
import { DEFAULT_FOV, WAYPOINTS, type WaypointKey } from './waypoints';

export type SceneHotspot = { id: string; label: string; ariaLabel: string };

export type ExperienceCanvasProps = {
  waypointKey: WaypointKey;
  mode: Mode;
  motion: MotionPolicy;
  quality: Exclude<SceneQuality, 'none'>;
  treatment: EraTreatment;
  highlight: SceneHighlight;
  /** Relief-story hotspots; rendered as real buttons into `hotspotLayer`. */
  hotspots: readonly SceneHotspot[];
  hotspotLayer: RefObject<HTMLDivElement | null>;
  skipToken: number;
  onReady: () => void;
  onArrive: (key: WaypointKey) => void;
  onContextLost: () => void;
  /** Intent only: the experience reducer decides what opening a hotspot means. */
  onHotspotActivate: (id: string) => void;
};

function Hotspots({
  hotspots,
  layer,
  onActivate,
}: {
  hotspots: readonly SceneHotspot[];
  layer: RefObject<HTMLDivElement | null>;
  onActivate: (id: string) => void;
}) {
  return hotspots.map((hotspot, index) => {
    const [x, y, z] = reliefHotspotPosition(index, hotspots.length);
    return (
      <group key={hotspot.id} position={[x, y, z]}>
        {/* A plain plaque on the wall so the button has something to point at. */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.5, 0.3]} />
          <meshBasicMaterial color="#e9dcc7" transparent opacity={0.85} />
        </mesh>
        <Html
          center
          position={[0, 0.6, 0.02]}
          portal={layer as RefObject<HTMLElement>}
          zIndexRange={[5, 1]}
          style={{ pointerEvents: 'auto' }}
        >
          <button
            type="button"
            data-hotspot={hotspot.id}
            aria-label={hotspot.ariaLabel}
            onClick={() => onActivate(hotspot.id)}
            className="btn-primary whitespace-nowrap shadow-lg shadow-black/40"
          >
            {hotspot.label}
          </button>
        </Html>
      </group>
    );
  });
}

/**
 * Client-only WebGL layer, loaded lazily after an intentional entry. It is a
 * visualization of the experience state and emits intent events only; all
 * learning content lives in HTML outside the canvas.
 */
export default function ExperienceCanvas({
  waypointKey,
  mode,
  motion,
  quality,
  treatment,
  highlight,
  hotspots,
  hotspotLayer,
  skipToken,
  onReady,
  onArrive,
  onContextLost,
  onHotspotActivate,
}: ExperienceCanvasProps) {
  const settings = QUALITY_SETTINGS[quality];
  const initial = WAYPOINTS[waypointKey];

  return (
    <Canvas
      // Nothing animates between transitions, so render on demand to spare battery and heat.
      frameloop="demand"
      dpr={[1, settings.maxDpr]}
      gl={{ antialias: settings.antialias, alpha: true, powerPreference: 'default' }}
      camera={{ position: initial.position, fov: DEFAULT_FOV, near: 0.5, far: 160 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          onContextLost();
        });
        onReady();
      }}
    >
      <fog attach="fog" args={['#171b1b', 30, 90]} />
      <hemisphereLight args={['#e9dcc7', '#171b1b', 0.75]} />
      <directionalLight position={[9, 14, 6]} intensity={1.7} color="#f4e6cf" />
      <directionalLight position={[-10, 5, -8]} intensity={0.35} color="#9fb3ad" />
      <MonumentPlaceholder
        treatment={treatment}
        highlight={highlight}
        segments={settings.radialSegments}
        edges={settings.edges}
      />
      <Hotspots hotspots={hotspots} layer={hotspotLayer} onActivate={onHotspotActivate} />
      <CameraDirector
        waypointKey={waypointKey}
        mode={mode}
        motion={motion}
        skipToken={skipToken}
        onArrive={onArrive}
      />
    </Canvas>
  );
}

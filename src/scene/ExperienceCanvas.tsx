'use client';

import { Html } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, type RefObject } from 'react';
import type { Mode, MotionPolicy } from '@/features/experience/controller';
import type { EraTreatment } from '@/features/time-machine/era-mapping';
import { QUALITY_SETTINGS } from '@/lib/capabilities';
import {
  IDLE_GAP_MS,
  lowerQuality,
  shouldDegrade,
  type RenderableQuality,
} from '@/lib/performance';
import { ATMOSPHERES, type SkyTone } from './atmosphere';
import { CameraDirector } from './CameraDirector';
import { MonumentPlaceholder } from './MonumentPlaceholder';
import { SkyEnvironment } from './SkyEnvironment';
import { reliefHotspotPosition, type SceneHighlight } from './monument-spec';
import { DEFAULT_FOV, WAYPOINTS, type WaypointKey } from './waypoints';

export type SceneHotspot = { id: string; label: string; ariaLabel: string };

export type ExperienceCanvasProps = {
  waypointKey: WaypointKey;
  mode: Mode;
  motion: MotionPolicy;
  quality: RenderableQuality;
  treatment: EraTreatment;
  highlight: SceneHighlight;
  /** Which light the artistic setting is shown in. */
  tone: SkyTone;
  /** Relief-story hotspots; rendered as real buttons into `hotspotLayer`. */
  hotspots: readonly SceneHotspot[];
  hotspotLayer: RefObject<HTMLDivElement | null>;
  skipToken: number;
  onReady: () => void;
  onArrive: (key: WaypointKey) => void;
  onContextLost: () => void;
  /** The device could not keep up; the shell should select this lower preset. */
  onQualityDrop: (quality: RenderableQuality) => void;
  /** Intent only: the experience reducer decides what opening a hotspot means. */
  onHotspotActivate: (id: string) => void;
};

/** Samples frame intervals during render bursts and asks for a lower preset when they are slow. */
function FrameWatch({
  quality,
  onQualityDrop,
}: {
  quality: RenderableQuality;
  onQualityDrop: (quality: RenderableQuality) => void;
}) {
  const samples = useRef<number[]>([]);
  useFrame((_, deltaSeconds) => {
    const interval = deltaSeconds * 1000;
    if (interval <= 0 || interval > IDLE_GAP_MS) return;
    samples.current.push(interval);
    if (!shouldDegrade(samples.current)) {
      if (samples.current.length > 240) samples.current = [];
      return;
    }
    samples.current = [];
    const next = lowerQuality(quality);
    if (next) onQualityDrop(next);
  });
  return null;
}

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
          <meshBasicMaterial color="#f2b451" transparent opacity={0.9} />
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
            className="hotspot"
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
  tone,
  hotspots,
  hotspotLayer,
  skipToken,
  onReady,
  onArrive,
  onContextLost,
  onQualityDrop,
  onHotspotActivate,
}: ExperienceCanvasProps) {
  const settings = QUALITY_SETTINGS[quality];
  const initial = WAYPOINTS[waypointKey];
  const atmosphere = ATMOSPHERES[tone];

  return (
    <Canvas
      // Nothing animates between transitions, so render on demand to spare battery and heat.
      frameloop="demand"
      shadows={settings.shadows}
      dpr={[1, settings.maxDpr]}
      gl={{ antialias: settings.antialias, alpha: true, powerPreference: 'default' }}
      camera={{ position: initial.position, fov: DEFAULT_FOV, near: 0.5, far: 700 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          onContextLost();
        });
        onReady();
      }}
    >
      <SkyEnvironment
        atmosphere={atmosphere}
        shadows={settings.shadows}
        shadowMapSize={settings.shadowMapSize}
      />
      <MonumentPlaceholder
        treatment={treatment}
        highlight={highlight}
        tones={atmosphere}
        segments={settings.radialSegments}
        edges={settings.edges}
        shadows={settings.shadows}
      />
      <FrameWatch quality={quality} onQualityDrop={onQualityDrop} />
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

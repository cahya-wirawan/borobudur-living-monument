'use client';

import { useEffect, useMemo } from 'react';
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  SphereGeometry,
} from 'three';
import { SUN_AZIMUTH, ridgeHeight, seededSequence, type Atmosphere } from './atmosphere';

/**
 * ARTISTIC SETTING — see `atmosphere.ts`. Everything here is static, so the
 * scene can keep rendering on demand.
 */

const DOME_RADIUS = 300;
const STAR_COUNT = 420;

function sunDirection(height: number): [number, number, number] {
  const flat = Math.sqrt(1 - height * height);
  return [SUN_AZIMUTH[0] * flat, height, SUN_AZIMUTH[1] * flat];
}

function mix(a: Color, b: Color, t: number): Color {
  return a.clone().lerp(b, Math.min(1, Math.max(0, t)));
}

function SkyDome({ atmosphere }: { atmosphere: Atmosphere }) {
  const geometry = useMemo(() => {
    const sphere = new SphereGeometry(DOME_RADIUS, 64, 96);
    const zenith = new Color(atmosphere.zenith);
    const upper = new Color(atmosphere.upper);
    const band = new Color(atmosphere.band);
    const horizon = new Color(atmosphere.horizon);
    const glow = new Color(atmosphere.glow);
    const [sx, sy, sz] = sunDirection(atmosphere.sunHeight);
    const positions = sphere.getAttribute('position');
    const colors = new Float32Array(positions.count * 3);
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i) / DOME_RADIUS;
      const y = positions.getY(i) / DOME_RADIUS;
      const z = positions.getZ(i) / DOME_RADIUS;
      let color: Color;
      if (y <= 0.01) color = horizon.clone();
      else if (y < 0.1) color = mix(horizon, band, (y - 0.01) / 0.09);
      else if (y < 0.26) color = mix(band, upper, (y - 0.1) / 0.16);
      else color = mix(upper, zenith, (y - 0.26) / 0.4);
      // Warm the sky around the light source and cool it on the far side.
      const facing = Math.max(0, x * sx + y * sy + z * sz);
      const low = 1 - Math.min(1, Math.max(0, y) / 0.55);
      color.lerp(glow, Math.pow(facing, 12) * atmosphere.glowStrength * 0.8 * (0.3 + low * 0.7));
      const away = Math.max(0, -(x * sx + z * sz));
      color.lerp(upper, away * low * 0.55);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    sphere.setAttribute('color', new BufferAttribute(colors, 3));
    return sphere;
  }, [atmosphere]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} renderOrder={-10}>
      <meshBasicMaterial vertexColors side={BackSide} fog={false} depthWrite={false} />
    </mesh>
  );
}

function useGlowTexture(): CanvasTexture {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.07, 'rgba(255,255,255,0.95)');
      gradient.addColorStop(0.12, 'rgba(255,255,255,0.42)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.16)');
      gradient.addColorStop(0.6, 'rgba(255,255,255,0.04)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
    }
    return new CanvasTexture(canvas);
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Sun({ atmosphere }: { atmosphere: Atmosphere }) {
  const texture = useGlowTexture();
  const [x, y, z] = sunDirection(atmosphere.sunHeight);
  const distance = DOME_RADIUS * 0.9;
  return (
    <sprite
      position={[x * distance, y * distance, z * distance]}
      scale={atmosphere.sunDiscScale * 3.2}
      renderOrder={-8}
    >
      <spriteMaterial
        map={texture}
        color={atmosphere.sunDisc}
        opacity={atmosphere.sunDiscOpacity}
        transparent
        blending={AdditiveBlending}
        depthWrite={false}
        fog={false}
      />
    </sprite>
  );
}

function Stars({ opacity }: { opacity: number }) {
  const geometry = useMemo(() => {
    const random = seededSequence(72);
    const positions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i += 1) {
      const angle = random() * Math.PI * 2;
      const y = 0.12 + random() * 0.88;
      const flat = Math.sqrt(1 - y * y);
      const radius = DOME_RADIUS * 0.95;
      positions[i * 3] = Math.cos(angle) * flat * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(angle) * flat * radius;
    }
    const buffer = new BufferGeometry();
    buffer.setAttribute('position', new BufferAttribute(positions, 3));
    return buffer;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  if (opacity <= 0) return null;
  return (
    <points geometry={geometry} renderOrder={-9}>
      <pointsMaterial
        color="#f6efff"
        size={1.7}
        sizeAttenuation={false}
        transparent
        opacity={opacity}
        depthWrite={false}
        fog={false}
      />
    </points>
  );
}

/** A generic, repo-authored ridge silhouette around the horizon. Not a named landform. */
function Ridge({ layer, color }: { layer: number; color: string }) {
  const geometry = useMemo(() => {
    const steps = 240;
    const radius = 170 + layer * 40;
    const positions = new Float32Array((steps + 1) * 2 * 3);
    const indices: number[] = [];
    for (let i = 0; i <= steps; i += 1) {
      const angle = (i / steps) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      positions.set([x, -2, z, x, ridgeHeight(angle, layer) * 2.4, z], i * 6);
      if (i < steps) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const buffer = new BufferGeometry();
    buffer.setAttribute('position', new BufferAttribute(positions, 3));
    buffer.setIndex(indices);
    return buffer;
  }, [layer]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} renderOrder={-7 + (1 - layer)}>
      <meshBasicMaterial color={color} side={DoubleSide} fog={false} depthWrite={false} />
    </mesh>
  );
}

export function SkyEnvironment({
  atmosphere,
  shadows,
  shadowMapSize,
}: {
  atmosphere: Atmosphere;
  shadows: boolean;
  shadowMapSize: number;
}) {
  const [sx, sy, sz] = sunDirection(atmosphere.sunHeight);
  return (
    <>
      <fog attach="fog" args={[atmosphere.fog, atmosphere.fogNear, atmosphere.fogFar]} />
      <SkyDome atmosphere={atmosphere} />
      <Stars opacity={atmosphere.stars} />
      <Sun atmosphere={atmosphere} />
      <Ridge layer={1} color={atmosphere.ridgeFar} />
      <Ridge layer={0} color={atmosphere.ridgeNear} />

      <hemisphereLight
        args={[atmosphere.hemisphere.sky, atmosphere.hemisphere.ground]}
        intensity={atmosphere.hemisphere.intensity}
      />
      {/* Modelling light on the faces the cameras look at. */}
      <directionalLight
        position={[-12, 10, 11]}
        intensity={atmosphere.key.intensity}
        color={atmosphere.key.color}
        castShadow={shadows}
        shadow-mapSize={[shadowMapSize || 512, shadowMapSize || 512]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.03}
      >
        <orthographicCamera attach="shadow-camera" args={[-11, 11, 11, -11, 1, 50]} />
      </directionalLight>
      {/* Rim light from the direction of the visible sun. */}
      <directionalLight
        position={[sx * 30, Math.max(sy, 0.22) * 30, sz * 30]}
        intensity={atmosphere.rim.intensity}
        color={atmosphere.rim.color}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow={shadows}>
        <circleGeometry args={[260, 64]} />
        <meshStandardMaterial color={atmosphere.ground} roughness={1} />
      </mesh>
    </>
  );
}

'use client';

import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useRef, type ComponentRef } from 'react';
import type { PerspectiveCamera } from 'three';
import type { Mode, MotionPolicy } from '@/features/experience/controller';
import {
  DEFAULT_FOV,
  EXPLORE_LIMITS,
  INTRO_GLIDE_SECONDS,
  WAYPOINTS,
  fovForAspect,
  type WaypointKey,
} from './waypoints';

// Transitions follow the clock, not the frame count: by default GSAP stretches a
// tween when frames arrive slowly, which would let the capped opening glide
// overrun its limit on a struggling device.
gsap.ticker.lagSmoothing(0);

type Pose = { px: number; py: number; pz: number; tx: number; ty: number; tz: number };

/**
 * Moves the camera between registered waypoints. The waypoint key is derived
 * from the experience state; this component never decides *where* the visitor
 * is, only how the camera gets there. GSAP interpolates a plain pose object
 * and is always killed on change/unmount, so a deep link or a skipped
 * transition lands on a stable waypoint rather than a half-finished tween.
 */
export function CameraDirector({
  waypointKey,
  mode,
  motion,
  skipToken,
  onArrive,
}: {
  waypointKey: WaypointKey;
  mode: Mode;
  motion: MotionPolicy;
  /** Increment to finish the running transition immediately (Skip introduction). */
  skipToken: number;
  onArrive: (key: WaypointKey) => void;
}) {
  // Read the live camera inside effects: it is a mutable Three.js object, not React state.
  const get = useThree((state) => state.get);
  const invalidate = useThree((state) => state.invalidate);
  const aspect = useThree((state) => state.size.width / Math.max(1, state.size.height));
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const pose = useRef<Pose | null>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const previousKey = useRef<WaypointKey | null>(null);
  const exploring = mode === 'explore';

  useEffect(() => {
    const waypoint = WAYPOINTS[waypointKey];
    const [px, py, pz] = waypoint.position;
    const [tx, ty, tz] = waypoint.target;
    const destination: Pose = { px, py, pz, tx, ty, tz };
    const orbit = controls.current;
    const camera = get().camera;

    const apply = () => {
      const current = pose.current;
      if (!current) return;
      camera.position.set(current.px, current.py, current.pz);
      if (orbit) {
        orbit.target.set(current.tx, current.ty, current.tz);
        orbit.update();
      }
      camera.lookAt(current.tx, current.ty, current.tz);
      invalidate();
    };
    const arrive = () => {
      tween.current = null;
      if (orbit) orbit.enabled = exploring;
      onArrive(waypointKey);
    };

    const first = pose.current === null;
    const fromIntro = previousKey.current === 'intro';
    previousKey.current = waypointKey;
    // Start from wherever the camera really is (the visitor may have orbited).
    const start: Pose =
      first || !orbit
        ? (pose.current ?? destination)
        : {
            px: camera.position.x,
            py: camera.position.y,
            pz: camera.position.z,
            tx: orbit.target.x,
            ty: orbit.target.y,
            tz: orbit.target.z,
          };
    const distance = Math.hypot(
      start.px - px,
      start.py - py,
      start.pz - pz,
      start.tx - tx,
      start.ty - ty,
      start.tz - tz,
    );

    if (first || motion === 'reduced' || distance < 0.01 || waypoint.durationSeconds === 0) {
      pose.current = destination;
      apply();
      arrive();
      return;
    }

    pose.current = start;
    if (orbit) orbit.enabled = false;
    const running = gsap.to(pose.current, {
      ...destination,
      // Only the optional opening glide is long; it is capped and skippable.
      duration: fromIntro ? INTRO_GLIDE_SECONDS : waypoint.durationSeconds,
      ease: 'power2.inOut',
      onUpdate: apply,
      onComplete: arrive,
    });
    tween.current = running;
    return () => {
      running.kill();
      if (tween.current === running) tween.current = null;
    };
  }, [waypointKey, motion, exploring, get, invalidate, onArrive]);

  useEffect(() => {
    if (skipToken > 0) tween.current?.progress(1);
  }, [skipToken]);

  useEffect(() => {
    const camera = get().camera as PerspectiveCamera;
    camera.fov = fovForAspect(DEFAULT_FOV, aspect);
    camera.updateProjectionMatrix();
    invalidate();
  }, [aspect, get, invalidate]);

  return (
    <OrbitControls
      ref={controls}
      enabled={exploring}
      enablePan={false}
      enableDamping={false}
      {...EXPLORE_LIMITS}
    />
  );
}

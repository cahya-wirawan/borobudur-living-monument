/**
 * Loads the Google Maps JavaScript API on demand (ADR-025).
 *
 * Nothing in this file runs until the visitor has agreed to contact Google.
 * The key is a browser key: it is public by design and must be restricted to
 * this site's HTTP referrers in the Google Cloud console. It is not a secret.
 */
import type { FlyoverCamera } from './tour';

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
export const isFlyoverConfigured = GOOGLE_MAPS_API_KEY.length > 0;

/** The parts of `Map3DElement` this project uses (Maps JavaScript API, `maps3d` library). */
export interface Map3D extends HTMLElement {
  flyCameraTo(options: { endCamera: FlyoverCamera; durationMillis?: number }): void;
  flyCameraAround(options: {
    camera: FlyoverCamera;
    durationMillis?: number;
    repeatCount?: number;
  }): void;
  stopCameraAnimation(): void;
}

export type Map3DOptions = FlyoverCamera & {
  mode: 'SATELLITE' | 'HYBRID';
  gestureHandling?: 'COOPERATIVE' | 'GREEDY' | 'AUTO';
  description?: string;
};

type Maps3DLibrary = { Map3DElement: new (options: Map3DOptions) => Map3D };

type MapsWindow = Window & {
  google?: { maps?: { importLibrary?: (name: string) => Promise<unknown> } };
  gm_authFailure?: () => void;
  __borobudurMapsReady?: () => void;
};

const SCRIPT_ID = 'google-maps-js';
let pending: Promise<Maps3DLibrary> | null = null;
const authFailureListeners = new Set<() => void>();

/** Google calls a global when the key is rejected; fan it out to whoever is mounted. */
export function onMapsAuthFailure(listener: () => void): () => void {
  authFailureListeners.add(listener);
  return () => authFailureListeners.delete(listener);
}

export function loadMaps3D(locale: string): Promise<Maps3DLibrary> {
  if (!isFlyoverConfigured) return Promise.reject(new Error('Google Maps key is not configured'));
  if (pending) return pending;
  const win = window as MapsWindow;
  win.gm_authFailure = () => authFailureListeners.forEach((listener) => listener());

  pending = new Promise<void>((resolve, reject) => {
    if (win.google?.maps?.importLibrary) return resolve();
    win.__borobudurMapsReady = () => resolve();
    const params = new URLSearchParams({
      key: GOOGLE_MAPS_API_KEY,
      v: 'weekly',
      loading: 'async',
      libraries: 'maps3d',
      language: locale,
      callback: '__borobudurMapsReady',
    });
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.onerror = () => reject(new Error('The Google Maps script could not be loaded'));
    document.head.append(script);
  })
    .then(() => {
      const importLibrary = win.google?.maps?.importLibrary;
      if (!importLibrary) throw new Error('Google Maps loaded without importLibrary');
      return importLibrary('maps3d') as Promise<Maps3DLibrary>;
    })
    .catch((error: unknown) => {
      // Allow a later retry instead of caching the failure.
      pending = null;
      document.getElementById(SCRIPT_ID)?.remove();
      throw error;
    });
  return pending;
}

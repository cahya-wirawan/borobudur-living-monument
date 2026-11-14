import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Content Security Policy (docs/09 §4, ADR-019).
 * Everything is same-origin: no CDN, analytics, remote fonts or frames.
 * - script-src keeps 'unsafe-inline' because statically prerendered Next.js
 *   pages bootstrap with inline scripts that cannot carry a per-request nonce.
 *   'unsafe-eval' is allowed in development only (React refresh).
 * - style-src keeps 'unsafe-inline' for element style attributes set by the
 *   3D overlay and the font loader.
 * - blob: covers WebGL textures/workers created at runtime.
 */

/**
 * The optional Google Maps flight (ADR-025) exists only when a browser key is
 * configured at build time. Only then is the policy widened, using the
 * allow-list Google publishes for the Maps JavaScript API, including the
 * 'unsafe-eval' it asks for. Without a key the site stays same-origin only.
 */
const maps = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
const GOOGLE_HOSTS = 'https://*.googleapis.com https://*.gstatic.com https://*.google.com';
const GOOGLE_MEDIA_HOSTS = `${GOOGLE_HOSTS} https://*.googleusercontent.com`;

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev || maps ? " 'unsafe-eval'" : ''}${
    maps ? ` ${GOOGLE_MEDIA_HOSTS} https://*.ggpht.com blob:` : ''
  }`,
  `style-src 'self' 'unsafe-inline'${maps ? ' https://fonts.googleapis.com' : ''}`,
  `img-src 'self' data: blob:${maps ? ` ${GOOGLE_MEDIA_HOSTS}` : ''}`,
  `font-src 'self'${maps ? ' https://fonts.gstatic.com' : ''}`,
  `connect-src 'self'${isDev ? ' ws:' : ''}${maps ? ` ${GOOGLE_HOSTS} data: blob:` : ''}`,
  "worker-src 'self' blob:",
  "media-src 'none'",
  "object-src 'none'",
  `frame-src ${maps ? 'https://*.google.com' : "'none'"}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // The experience needs none of these device capabilities.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  // Only honoured over HTTPS; harmless on a local http preview.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Docker image sets NEXT_OUTPUT=standalone for a small self-contained server.
  // Left unset elsewhere so `next start` keeps working.
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
  poweredByHeader: false,
  // Lets a second build (the keyed end-to-end build) live beside the default one.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Pin the workspace root so a stray lockfile in a parent directory is never picked up.
  turbopack: { root: __dirname },
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;

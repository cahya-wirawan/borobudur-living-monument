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
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? ' ws:' : ''}`,
  "worker-src 'self' blob:",
  "media-src 'none'",
  "object-src 'none'",
  "frame-src 'none'",
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
  // Pin the workspace root so a stray lockfile in a parent directory is never picked up.
  turbopack: { root: __dirname },
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;

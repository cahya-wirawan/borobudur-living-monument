# 09 — Deployment, Security, and Operations

## 1. Hosting model
Static-first web deployment on any platform supporting Next.js App Router static pages (Vercel, Netlify or containerized Next.js). For a no-server configuration, assess whether dynamic App Router features prevent full export; choose the simplest deployment that genuinely supports chosen rendering. No backend services are required for the public MVP. Large GLB/KTX2 media should be served through a CDN/object store with long immutable caching and correct Content-Type/CORS.

## 2. Environments
- **Local:** no credentials and offline educational fixtures.
- **Preview:** demo site, development assets, prominent `Research prototype` disclaimer; no search indexing if internal.
- **Production:** only after engineering, rights, editorial and cultural review gates pass.

Configuration variables must have safe defaults and be documented via `.env.example` with **no real secrets**. User-generated PII and cookies are absent by design.

## 3. Build pipeline (recommended)
1. `pnpm install --frozen-lockfile`
2. `pnpm format:check` (if available) and `pnpm lint`
3. `pnpm typecheck`
4. `pnpm validate:content` (schema, provenance, locale, rights flags)
5. `pnpm test --run`
6. `pnpm test:e2e`
7. `pnpm build`
8. `pnpm budget:check` (script may read output bundle and asset sizes)
9. Generate a preview, manually sign off if public.

Add these scripts in implementation. A failed rights/provenance gate should be conspicuous and block a **production release**, not force deletion of demo assets from local development.

## 4. Browser/security policy
- Content Security Policy compatible with actual Next.js scripts, WebGL canvas, CDN media and image assets; avoid `'unsafe-eval'` if possible. Determine practical nonces/hashes based on deployment mode.
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HTTPS, secure response headers as appropriate.
- Restrict source URLs to `https:` and review hosts; avoid `javascript:` and embedded arbitrary iframes.
- Sanitize/validate structured content before rendering; don't use raw HTML injected from untrusted metadata.
- Lockfile and automated dependency scanning; do not blindly upgrade Three/R3F major versions without testing.
- Defend against malicious third-party assets: validate file types, limits, provenance, and URLs before publishing to public CDN.

## 5. Performance operations
- Serve compressed Next.js assets via CDN, use Brotli/gzip where supported.
- Use `preload` only for immediate essentials; lazy-load 3D models, avoid prefetching unused huge images.
- Monitor Core Web Vitals separately for landing vs interactive experience; keep scene FPS diagnostics behind development flag.
- Keep low/medium/high quality presets; persist choice per session only if the visitor requests it (no tracking needed).
- WebGL context loss must be recoverable; avoid forcing reload.

## 6. User privacy
No sign-in, email collection or person-level telemetry. Optional aggregate analytics require an explicit product/privacy decision, with cookie banner only if legally and technically needed. Do not send visitor's selected camera/relief state to unnecessary third parties.

## 7. Monitoring and incidents
- Deployment checks: index/experience/read/source routes return correct content, direct link hydration works, static fallback available.
- Collect privacy-safe aggregated error metrics **only if approved**, without visitor identifiers.
- On broken external assets, fall back to illustrative originals rather than blank page.
- Rollback by redeploying prior immutable release; retain original verified content/asset manifest.

## 8. Public-release checklist
Engineering sign-off + accessibility sign-off + historical content review + rights clearance + localization sign-off; add visible author credits and correction request contact method before public launch.

## 9. Implemented state (v0.4.0)

Nothing is deployed. Choosing a host and domain is an open owner decision (AGENTS.md "Stop and ask"), so task `M3-T04` is blocked on it. Everything below is implemented and verified locally and in CI.

### Reproducible preview

```bash
pnpm install --frozen-lockfile
pnpm preview            # production build, then serves on http://localhost:3000
```

The lockfile pins every dependency, the build needs no environment variables, and no network access is required after install. The same commands on a tagged commit reproduce that release.

### Hosting requirements

- A Node.js 20.9+ runtime that can run `next start`, or a platform with native Next.js support. `/{locale}/experience` is rendered per request so deep links arrive as correct HTML (ADR-009); every other route is static.
- A pure static export is not possible without moving deep-link parsing to the browser.
- HTTPS. `Strict-Transport-Security` is already sent.

### Response headers (set in `next.config.ts`, checked by `e2e/security.spec.ts`)

`Content-Security-Policy` (same-origin only), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy: same-origin`, `Permissions-Policy` (camera, microphone, geolocation, payment, usb disabled), `Strict-Transport-Security`. `X-Powered-By` is removed. See ADR-019 for the CSP trade-offs.

### Caching

- `/_next/static/*` files are content-hashed and served `immutable` for one year.
- Static pages are prerendered; the experience route is not cached by default.
- If a CDN is placed in front, do not cache `/{locale}/experience` across different query strings unless the query is part of the cache key.

### Privacy and secrets

No cookies, local storage, analytics, accounts or third-party requests (asserted in tests). There are no secrets; `.env.example` documents the two optional variables.

### Pipeline

CI (`.github/workflows/ci.yml`) runs: version check, content audit, register drift check, format check, lint, typecheck, unit tests, build, end-to-end tests. The release audit runs as information only until a public release is prepared.

### Rollback

Each release is a git tag. To roll back, redeploy the previous tag (`git checkout vX.Y.Z && pnpm install --frozen-lockfile && pnpm build`). Content and code are versioned together, so a rollback restores both.

### Before a public deployment

1. Owner chooses host and domain; set `NEXT_PUBLIC_SITE_URL`.
2. Smoke-test the deployed preview: `/`, `/en/experience`, a deep link, `/id/read`, the no-WebGL fallback, and the response headers.
3. Keep `RELEASE_CHANNEL` unset (no indexing) until the editorial, rights and accessibility gates pass; `RELEASE_CHANNEL=public` will refuse to build before then.

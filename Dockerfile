# syntax=docker/dockerfile:1
# Production image for Borobudur — The Living Monument.
#   docker compose up --build        (see compose.yaml)
# No secrets or build arguments are required.

FROM node:22-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
RUN corepack enable

# Dependencies only, so this layer is reused until the lockfile changes.
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Base URL for canonical links. Override when the site has a real address.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Leave empty for a prototype build. "public" enables indexing and makes the
# build fail while any content is unreviewed.
ARG RELEASE_CHANNEL=
# Optional browser key for the Google Maps flight (public by design; restrict it by referrer).
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
    RELEASE_CHANNEL=$RELEASE_CHANNEL \
    NEXT_OUTPUT=standalone
# Runs the content audit first (prebuild), then the production build.
RUN pnpm build

# Minimal runtime: only the traced server, static assets and public files.
FROM node:22-alpine AS run
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1:3000/ || exit 1
CMD ["node", "server.js"]

# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN addgroup -g 1001 -S nodejs && adduser -S nuxt -u 1001
USER nuxt

COPY --from=builder --chown=nuxt:nodejs /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

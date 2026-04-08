FROM node:20-alpine AS deps
WORKDIR /workspace
COPY package.json ./package.json
COPY admin-web/package.json ./admin-web/package.json
COPY packages/api-client/package.json ./packages/api-client/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /workspace
COPY --from=deps /workspace/node_modules ./node_modules
COPY package.json ./package.json
COPY admin-web ./admin-web
COPY packages ./packages
WORKDIR /workspace/admin-web
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /workspace/admin-web/public ./public
COPY --from=builder --chown=nextjs:nodejs /workspace/admin-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /workspace/admin-web/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]

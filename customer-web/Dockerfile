FROM node:20-alpine AS deps
WORKDIR /workspace
COPY package.json ./package.json
COPY customer-web/package.json ./customer-web/package.json
COPY packages/api-client/package.json ./packages/api-client/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /workspace
COPY --from=deps /workspace/node_modules ./node_modules
COPY package.json ./package.json
COPY customer-web ./customer-web
COPY packages ./packages
WORKDIR /workspace/customer-web
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /workspace/customer-web/public ./public
COPY --from=builder --chown=nextjs:nodejs /workspace/customer-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /workspace/customer-web/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]

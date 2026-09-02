# ==============================================================================
# Production Multi-Stage Hardened Dockerfile
# ==============================================================================

# STAGE 1: Build & Compilation
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package.json ./

RUN npm install

# Copy source code & configurations
COPY tsconfig.json vite.config.ts ./
COPY index.html ./
COPY src/ ./src/
COPY server.ts ./

# Run production build (Vite + esbuild bundle for server)
ENV NODE_ENV=production
RUN npm run build

# ==============================================================================
# STAGE 2: Production Minimal Runtime
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Environment configuration
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    LOG_STRUCTURED=true \
    METRICS_ENABLED=true

# Security: Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy package manifests & production dependencies
COPY package.json ./
RUN npm install --omit=dev --ignore-scripts && \
    npm cache clean --force

# Copy compiled production artifacts
COPY --from=builder /app/dist ./dist

# Set ownership to non-root user
RUN chown -R nodejs:nodejs /app

USER nodejs

# Network configuration
EXPOSE 3000

# Health check probe
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/live || exit 1

# Production execution
CMD ["node", "dist/server.cjs"]

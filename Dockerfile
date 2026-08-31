# ==========================================
# Aquafarm Frontend - Multi-Stage Dockerfile
# ==========================================

# ─── Stage 1: Build & Bundle ───
FROM node:20-alpine AS builder
WORKDIR /app

# Build arguments for injecting production API URL at build-time
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Copy dependency manifests
COPY package*.json ./
RUN npm ci

# Copy source code and build production bundle
COPY tsconfig*.json vite.config.ts index.html ./
COPY public ./public
COPY src ./src
RUN npm run build

# ─── Stage 2: High-Performance Nginx Web Server ───
FROM nginx:alpine AS runner

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Healthcheck for load balancers and container orchestrators
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

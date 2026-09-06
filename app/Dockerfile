FROM node:24-alpine AS base
RUN apk add --no-cache pnpm

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml  ./
RUN pnpm install

# Rebuild the source code only when needed
FROM base AS builder
ARG VERSION="development"
ARG APIBASE=""
ARG LOGLEVEL="warning"
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV VITE_SPACECOWBOY_VERSION=$VERSION
ENV VITE_SPACECOWBOY_API_BASE=$APIBASE
ENV VITE_SPACECOWBOY_LOGLEVEL=$LOGLEVEL

# Build static production assets
RUN pnpm run build

# Production image serving the static files
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Copy hasil build doang
COPY --from=builder /app/dist ./dist

# Hapus cache npm/yarn
RUN yarn cache clean

EXPOSE 3001
CMD ["node", "dist/main.js"]

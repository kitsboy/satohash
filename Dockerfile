# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies & Build ----
FROM base AS build
# Install ALL dependencies (including devDependencies needed for Vite)
RUN npm ci
COPY . .
# Run Vite build
RUN npm run build

# ---- Production ----
FROM node:20-alpine AS production
WORKDIR /app

# Copy production dependencies (we'll reinstall just prod ones to save space)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built assets and server files
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/ecosystem.config.cjs ./

ENV NODE_ENV=production
ENV PORT=3001

# Install PM2 globally
RUN npm install -g pm2

# Create data directory
RUN mkdir -p /app/data

EXPOSE 3001

CMD ["pm2-runtime", "ecosystem.config.cjs", "--env", "production"]

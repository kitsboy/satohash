# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency graphs
COPY package.json package-lock.json ./

# Install dependencies strictly
RUN npm ci

# Copy full application 
COPY . .

# Build application
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Only copy over the built assets and strictly necessary server files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/package.json ./package.json

# Only install production dependencies
RUN npm install --omit=dev

# Set strict production environment
ENV NODE_ENV=production
ENV PORT=3000

# Protect from running as root
USER node

EXPOSE 3000

CMD ["npm", "run", "server"]

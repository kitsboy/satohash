FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Build frontend
RUN npm run build

# Create data directory
RUN mkdir -p /app/data

EXPOSE 3001

CMD ["node", "server/index.js"]

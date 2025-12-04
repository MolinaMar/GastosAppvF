FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY backend/package*.json backend/
RUN cd backend && npm ci --omit=dev

# Copy source
COPY backend backend

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Start the backend
CMD ["sh", "-c", "cd backend && node server.js"]

FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN cd backend && npm install
RUN cd frontend && npm install

# Copy all files
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "backend/server.js"]

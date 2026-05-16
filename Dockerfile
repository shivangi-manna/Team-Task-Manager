FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN cd backend && npm install --omit=dev
RUN cd frontend && npm install

COPY . .

RUN cd frontend && npm run build

ENV NODE_ENV=production

CMD ["node", "backend/server.js"]

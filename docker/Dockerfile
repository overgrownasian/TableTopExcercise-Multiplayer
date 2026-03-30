FROM node:25-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.server.json ./
COPY scripts ./scripts
COPY src ./src
COPY public ./public

RUN npm run build

FROM node:25-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4310
ENV JOIN_BASE_URL=

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

RUN mkdir -p /app/data && chown -R node:node /app

VOLUME ["/app/data"]

EXPOSE 4310

USER node

CMD ["node", "dist/server.js"]

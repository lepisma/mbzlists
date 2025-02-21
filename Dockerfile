FROM node:23-alpine AS builder

WORKDIR /app

COPY . .

RUN apk add --no-cache build-base python3 pkgconf pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev
RUN npm ci
RUN npm run build

ENV NODE_ENV=production
ENV DATA_DIR=/data/

CMD [ "node", "build" ]

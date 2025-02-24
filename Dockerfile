FROM node:23-alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

ENV NODE_ENV=production
ENV DATA_DIR=/data/

CMD [ "node", "build" ]

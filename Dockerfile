FROM node:16 as builder

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY src ./src
COPY index.ts/ ./
RUN npm ci --no-audit --prefer-offline
RUN npm run compile

FROM node:16 as runner

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY config ./config

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD [ "npm", "run", "start:prod" ]

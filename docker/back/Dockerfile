FROM node:14-alpine

WORKDIR /back

COPY ./packages/api/package.json    ./packages/api/package.json
COPY ./packages/hamlet/package.json ./packages/hamlet/package.json
COPY ./package.json ./yarn.lock     ./

RUN yarn install --pure-lockfile --non-interactive

COPY ./tsconfig.base.json ./
COPY ./packages/api ./packages/api
COPY ./packages/hamlet ./packages/hamlet

RUN yarn hamlet build

ENV DOCKER=1
EXPOSE 3001

ENTRYPOINT ["yarn", "hamlet", "start"]

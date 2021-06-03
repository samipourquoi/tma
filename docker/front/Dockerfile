FROM node:14-alpine

WORKDIR /front

COPY ./packages/api/package.json     ./packages/api/package.json
COPY ./packages/othello/package.json ./packages/othello/package.json
COPY ./package.json ./yarn.lock      ./

RUN yarn install --pure-lockfile --non-interactive

COPY ./tsconfig.base.json ./
COPY ./packages/api ./packages/api
COPY ./packages/othello ./packages/othello

RUN yarn othello build && yarn cache clean

ENV DOCKER=1
EXPOSE 3000

ENTRYPOINT ["yarn", "othello", "start"]

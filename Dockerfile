FROM node:10-alpine

WORKDIR /app

COPY . /app

ENV NODE_ENV production

RUN npm install --production

ENTRYPOINT ["node", "-r", "dotenv/config", "."]

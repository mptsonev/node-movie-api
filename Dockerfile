FROM node:14.15-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json ./tsconfig.json ./
RUN mkdir ./src
RUN npm install
COPY ./src ./src

RUN npm run build

CMD ["node", "./dist/server.js"]

FROM node:14.15-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json ./tsconfig.json ./
RUN mkdir ./src
COPY ./src ./src

RUN npm install
RUN npm run build

CMD ["node", "./dist/server.js"]

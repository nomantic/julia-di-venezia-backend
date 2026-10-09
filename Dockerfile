FROM node:20

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build:server && npm run build:worker

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "run", "start:server"]

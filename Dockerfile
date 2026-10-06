FROM node:20

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "run", "start:server"]

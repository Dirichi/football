FROM node:12.8-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN apk update || : && apk add python make g++
RUN npm install

COPY . .

CMD [ "npm", "run", "start" ]

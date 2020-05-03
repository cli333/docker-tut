FROM node:13.12.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/ .bin:$PATH

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

COPY . ./

CMD ["npm", "start"]
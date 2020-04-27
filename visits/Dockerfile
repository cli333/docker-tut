FROM node:alpine

WORKDIR /usr/app

COPY . .

RUN npm install --unsafe-perm --no-cache

CMD ["npm", "start"]
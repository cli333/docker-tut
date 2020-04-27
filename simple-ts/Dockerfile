# Specify a base image
# need to use image that has npm inside of it
FROM node:alpine

WORKDIR /usr/app

# copy everything from current directory to container
COPY . .


# Install dependencies
RUN npm install --unsafe-perm --no-cache


# Default command
CMD ["npm", "start"]
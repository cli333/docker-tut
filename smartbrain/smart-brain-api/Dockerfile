FROM node:8.11.4

# CMD ["/bin/bash"]

WORKDIR /app

COPY ./ ./

RUN npm install

# launches when image is run
CMD ["npm", "run", "start"]

# docker run -p <container port>:<host port> <image name>
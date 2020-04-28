# build phase
FROM node:alpine as builder
WORKDIR /usr/app
COPY ./ ./
RUN npm install
RUN npm run build

# /usr/app/build <-- will contain the build

# run phase
FROM nginx
EXPOSE 80
COPY --from=builder /usr/app/build /usr/share/nginx/html
# copy build folder from build phase to specific nginx folder
# nginx by default will run!


# create-react-issue
# docker run -it -p 3000:3000 'image id'
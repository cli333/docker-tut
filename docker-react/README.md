## Build and tag the Docker image:

docker build -t sample:dev .

## Then, spin up the container once the build is done:

docker run \
 -it \
 --rm \
 -v \${PWD}:/app \
 -v /app/node_modules \
 -p 3001:3000 \
 -e CHOKIDAR_USEPOLLING=true \
 sample:dev

## What’s happening here?

The docker run command creates and runs a new container instance from the image we just created.
-it starts the container in interactive mode. Why is this necessary? As of version 3.4.1, react-scripts exits after start-up (unless CI mode is specified) which will cause the container to exit. Thus the need for interactive mode.

--rm removes the container and volumes after the container exits.
-v \${PWD}:/app mounts the code into the container at “/app”.

{PWD} may not work on Windows. Use pwd:/app

Since we want to use the container version of the “node_modules” folder, we configured another volume: -v /app/node_modules. You should now be able to remove the local “node_modules” flavor.
-p 3001:3000 exposes port 3000 to other Docker containers on the same network (for inter-container communication) and port 3001 to the host.

For more, review this Stack Overflow question.

Finally, -e CHOKIDAR_USEPOLLING=true enables a polling mechanism via chokidar (which wraps fs.watch, fs.watchFile, and fsevents) so that hot-reloading will work.
Open your browser to http://localhost:3001/ and you should see the app. Try making a change to the App component within your code editor. You should see the app hot-reload. Kill the server once done.

## Stop caching

docker build --no-cache -t sample:dev

## Use compose

docker-compose up -d --build

-d // run detached

--rm // Remove container after run. Ignored in detached mode.

# Notes

hot-reloading doesn't seem to work except with compose

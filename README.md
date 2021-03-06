# Udemy Course - Docker and Kubernetes: The Complete Guide

- [Course](https://www.udemy.com/docker-and-kubernetes-the-complete-guide/)
- [Repository](https://github.com/StephenGrider/DockerCasts)

## Section 1 - Dive Into Docker

### Lecture 1 - Why use Docker?

- when we install SW we might get errors so we need to rerun the process. DOcker fixes that
- Docker makes easy to install and run sw in any platform or any machine
- installing sw on docker is as easy as `docker run -it redis`

### Lecture 2 - What is Docker?

- Docker is an ecosystem of systems and Sw:
  _ Docker Client
  _ Docker Server
  _ Docker machine
  _ Docker Image
  _ Docker Hub
  _ Docker Compose
- Docker is a platform and ecosystem around creating and running containers
- a docker image is a single file with all the deps and config required to run a program
- a docker container is an instace of an image. a container runs a program
- docker gets images from docker hub
- a container is a running program with its own isolated set of HW resources

### Lecture 3 - Docker for Mac/Windows

- we have already docker on our machine (Linux)
- in a Docker for Win/Mac package there are two tools.
  _ Docker Client(Docker CLI) use to issue commands to
  _ Docker Server(Docker Daemon) responsible for creating images, running containers etc

### Lecture 4 - Installing Docker on macOS

- steps: signup for docker hub account -> download/instal docker for mac -> login to docker -> verify docker installation
- get community edition
- we test installation running `docker version` on terminal

### Lecture 5 - Docker Setup on Windows

- we choose to use Linux containers
- restart machine
- sign in
- use terminal

### Lecture 8 - Using the Docker Client

- we run a command in docker cli `docker run -hello-world`
- we see a message 'Hello from Docker!'
- THe actions logged by docker are
  _ docker client contacted docker daemon
  _ docker daemon pulled hello-world image from docker hub
  _ docker daemon created a new container from that image that runs the executable that produces the output we read
  _ docker daemon streamed the ourput to docker client which sent it to terminal
- Docker went to docker hub because it could not find the image locally
- docker server (daemon)d oes oall the heavy lifting
- after the run we have a local copy of the image on our local machine
- if we rerun the container the image is not downloaded

### Lecture 9 - What is a COntainer?

- in out machine the stack of running programs is:
  _ Top Level: Processes running on the computer
  _ Middle Level: System calls (running programs issue requests to kernel to interact with a piece of HW)
  _ Low Level: Kernel - executes system calls and interacts with HW
  _ HW (CPU,Mem,Periph,HDD)
- Say we have 1 version of Python on or HDD (v2). a process that needs python v2 will run while a process that needs python v3 will crash
- we can solve the issue with namespacing segments of HDD dedicated to each process. when a process makes a system call to read from HDD kernelcheck which process is making the call and directs it to its segment
- _Namespacing_: isolating resources per process (or process group) WHo?Process,Users What?HDD<NW<Hostnames,IPC
- _Control Groups_ (cgroups): control the amount of resources What?CPU,HD I/O,MEM,NW BW
- Both feats together are used to isolate a process. the whole stack of an isolated process is what we call a container
- Container: A process + its isolated and dedicated resources using the kernel
- How we go from an image to a running container???
  _ Image contains: an FS snapshot + startup command
  _ when we run the imag (turn it into container): docker allocates an HDD segment to the container -> startup command is executed -> process is created -> process uses only its allocated HDD segment + aloocated resources

### Lecture 10 - How Docker is Running on our computer?

- namespacing and control goups are not natively supported by all OSs. only by LINUX
- to run docker on MacOS or Window docker setts up a Linux VM.
- so if we run `docker version` server will always be linux

## Section 2 - Manipulating Containers with the Docker Client

### Lecture 11 - Docker Run in Detail

- Creating and running a container from an image: `docker run <image name>`
  _ docker: reference to docker client
  _ run: try to create and run a container \* <image name>: name of image to use for this container

### Lecture 12 - Overriding Default Commands

- Creating and running a container from an image overriding the default run command: `docker run <image name> command` \* command: default command override
- example: `docker run busybox echo hi there` 'echo hi there' is the override
- command can be unix call like 'ls'.
- busybox is just a cycle burner does nothing
- if i run `docker run busybox ls` i get root dir of the default docker image FS snapshot
- every image comes withy its FS snapshot
- i cannot run `docker run hello-world ls` as these programs do not exist in the hello-world default FS snapshot. they do in busybox that why i can run them

### Lecture 14 - Listing Running Containers

- List all running containers: `docker ps`
  _ docker: reference the docker client
  _ ps: list all running containers
- ps gives a lot of info on the running container. id, image, command, status, random name
- to see all contianers that were created and run on our machine we can use `docker ps --all`

### Lecture 15 - Container Lifecycle

- we saw with ls that containers that stoped are still identified in our system
- docker run = docker create + docker start
  _ docker create: creates the container `docker create <image name>` and printouts a <container id>
  _ docker start: starts the container (identified by its id) `docker start <container id>`
- create sets up the FS snapshot on the HDD
- start executes the startup command but by default does not attach to the process so we dont see any output on terminal. but it runs
- to see output on terminal from the process we need to attach to it when starting it using -a `docker start -a <container id>`
- we dont need to write all the container id just the staritng part of it that is uniquely identifying. auto complete with TAB applies

### Lecture 15 - Restarting Stopped Containers

- if i run `docker ps --all` after a container has stoped i see it in the list with STATUS exited
- a stopped contianer can start again. we run `docker start` using its id
- once we have created a container with its default or overriden command we cannot change it. its in its blueprint as shown in the running conatiners list

### Lecture 16 - Removing Stopped Containers

- clean up is critical to free space on host machine
- we can use `docker system prune` to clean up my system of:
  _ stopped containers
  _ unused nw resources
  _ build cache (downloaded images)
  _ unused images

### Lecture 17 - Retrieving Log Outputs

- Get logs from a container: `docker logs <container id>` \* logs: get logs
- this is an alternative to staritng the container with the -a flag.
- we can use log even after the container has been started, even after it has exited
- docker logs gets the logs of the running container up to that point in time
- docker logs DOES NOT rerun the container

### Lecture 18 - Stopping Containers

- Stop a Container: `docker stop <contianer id>`
  _ sends a SIGTERM signal to the reunning process
  _ SIGTERM is equivalent to ctrl+c (stop as soon as possible)
- Kill a Container: `docker kill <contianer id>`
  _ sends a SIGKILL signal to the running process
  _ SIGKILL is equivalent to kill command (stop NOW)
- stop command is always preferable
- docker automatically sends a kill command if docker stop does not stop the process in 10 seconds
- some processes do not listen to SIGTERM (aka stop command)

### Lecture 19 - Multi-Command Containers

- we start `redis-server` locally (not from docker)
- to attach to the server and manipulate data or see logs we run `redis-cli`
- we run redis on docker `docker run redis`
- running `redis-cli` on the host machine does not see the redis-server in the docker container
- redis is running int he container so is insulated from the outside world
- there is no free access from outside the container to the inside
- we need to be able to run a second command in the container

### Lecture 20 - Executing Commands in Running Containers

- Execute an additional command in a container: `docker exec -it <container id> <command>`
  _ exec: run another command
  _ -it: allow us to provide input to the container
  _ <container id>: id of the (running) container
  _ <command>: command to execute
- if we skip -it flag the command is executed but we cannot input any text. it is running in the background. in our case redis-cli without an input attached closes

### Lecture 21 - THe purpose of the IT flag

- processes in docker run in a linux environment.
- any process running in a linux environment. has 2 communication channels attached to it. STDIN, STDOUT, STDERR
- STDIN is standard input (what we type in the terminal)
- STDOUT is standard output (what shows up on terminal screen)
- STDERR is standard error (shown up in terminal string)
- typically STD comm channels are attached to the terminal that invoked the process unless programmatically directed elsewere
- -it is -i and -t combined
  _ -i: attaches processes ind ocker stdin to terminal
  _ -t: makes text look pretty in terminal

### Lecture 22 - Getting a Command Promt in a COntainer

- exec command is also used to give us terminal (shell) access to arunning container
- in that way we can write commands without the need to issue new docker exec commands
- we do this by executing the sh command in a running container `docker exec -it <container id> sh`
- what we get is a terminal in the running container linux running instance
- we can run the command multiple times for multiple shells
- sh shands for shell. other command processors are: bash, powershell, zsh
- almost all containers have sh installed. some more bulky container include bash as well

### Lecture 23 - Starting with a Shell

- we can use the -it flag with run command and start a shell immediatley after the container starts up
- the downside of running `docker run -it <container id> sh` is that the primary process does not start up automatically. just the command we spec (sh). so we have to start the primary process our selves

### Lecture 24 - Container Isolation

- to exit from a container shell we type ctrl+D or exit
- 2 separate containers by default do not share their FS
- to show case we start 2 busybox containers in shell mode `docker run -it busybox sh`
- in the first we touch the file in its fs. the file is not existent in the orthers fs

## Section3 - Building Custom Images Through Docker Server

### Lecture 25 - Creating Docker images

- to make our own image that will run in our container we have to:
  _ Create our Dockerfile: a config file that defines how our container should behave
  _ then we provide the dockerfile to the docker cli
  _ cli sends it to the docker deamon to build an image
  _ we have our usable image to run
- in a dockerfile:
  _ we specify a base image (existing image)
  _ run additional commands to install additional programs \* specify a command to run on container startup

### Lecture 26 - Building a Dockerfile

- our first custom dockerfile will create an image that runs redis-server
- we create a project dir for the image /redis-image
- we cd into it and open our text editor
- we create anew file named 'Dockerfile'
- comments in dockerfile are startign with #
- first we use an existinf docker image as a base `FROM alpine`
- then we download and install a dependency `RUN apk add --update redis`
- finally we tell the image what to do when it starts as a container `CMD ["redis-server"]`
- with the dockerfile ready we build it: we run `docker build .` in the project root folder where Dockerfile resides
- the image builds and we get a message in the end `Successfully built 08960804125d`
- we cp the id. this is the imagege id. we use it to run our customimage `docker run 08960804125d`
- redis is running OK

### Lecture 27 - Dockerfile teardown

- 'FROM' 'RUN' 'CMD' : instructions telling docker server what to do
- 'alpine' 'apk add --update redis' '["redis-server' : arguments to the instructions
- `FROM alpine` sets the image it will use as a base

### Lecture 28 - What's a Base Image?

- ANALOGY: writing a dockerfile == being given a computer with no OS and being told to install Chrome. what would we do??
  _ install an OS => `FROM alpine`
  _ start up default browser ------------------
  _ navigate to chrome.google.com
  _ download installer => `RUN apk add --update chrome`
  _ open file/folder explorer
  _ execute installer------------------------- \* execute chrome runnable `CMD ["chrome`]`
- why do we use alpine as base image??? we choose this image because it suits our needs.
- if we used ubuntu we would use `apt-get install chrome`

### Lecture 29 - The Build Process in Detail

- when we run build command the '.' is the build context (files we want to includ ein build relative to the PWD)
- each line in dockerfile produces a build step
- for every step in teh build an intermediate container is used (then discarded)
- fr step 2 docker server looks at previous step and runs a temp container to host the command
- after the installation container is stopped and docker takes a filesystem snapshot out of it and saves it as a temp image with redis to be used int he next step (3/3)
- again step 3 runs a temp container out of the previous image.. in the end the output of step 3 (fs snapshot + primary commad) are the final build image

### Lecture 31 - Rebuilds with Cache

- the reason of dockers great perforance when building new image:
  _ every step outputs its own image
  _ if we add an other step (e.g RUN apk add --update gcc) and rebuild it goes very fast
  _ this is why the temp images of each step are cached. so no recreated
  _ even virgin base image is not downloaded its local \* it does not even go to step one. uses cached image of step 2 and goes to 3
- reversing steps order invalidates cach
- put your changes down the line to save time

### Lecture 32 - Tagging an Image

- our image has a generated meaningless image name
- Tagging an image: `docker build -t <dockerID>/<project>:<version> .`
  _ -t : tag the image flag
  _ <dockerID>/<project>:<version> : image tag following the docker standard \* . : specifies the directury of files/folders to use for the build (. == current dir)

### Lecture 33 - Manual image Generation with Docker Commit

- the docker build process use images to build containers and we use these containers to generate images
- we can manualy do the same. start a container -> run a command in it (install sthing) and generate an image out of it

```
docker run -it alpine sh
>> apk add --update redis
```

- on another terminal we run `docker commit -c 'CMD["redis-server"]' <container id>` . this command takes a snapshot of the runnign container genrating an image passing in the primary command (-c flag). we cane even tag the generated image

## Section 4 - Making Real Projects with Docker

### Lecture 34 - Project Outline

- in this section we will do a new project: create a tiny nodeJS web app => wrap it up in a docker container => access the app from a browser running on our machine
- steps in our implementation:
  _ create nodeJS webapp
  _ create a Dockerfile
  _ build image from dockerfile
  _ run image as container \* connect to web app from browser

### Lecture 35 - Node Server Setup

- we make a project dir /simpleweb and cd into it
- we add a package.json file which is a bare minimum one. just express and a start script

```
{
	"dependencies": {
		"express": "*"
	},
	"scripts": {
		"start": "node index.js"
	}
}
```

- we add app root js file index.js in root dir as well with boilerplate express js code

```
const express = require 'express';

const app = express();

app.get('/', (req,res)=>{
	res.send("Hi from node");
});

app.listen(3000, ()=>{
	console.log("Server is running on port 3000...");
})
```

- so no `npm init` (no node_modules dir) no fancy code yet

### Lecture 37 - A few planned Errors

- to start node we need to install dependencies `npm install` and start the server `npm start`
- both assume npm package is installed apart from node
- we start thinking how to setup our Dockerfile
  _ Specify base image: FROM alpine
  _ Run some commands to install aditional programs: RUN npm install \* Specify a command to run on container setup: CMD ["npm","start"]
- we expect a fail... alpine is not expected to have node and npm installed
- we add the dockerfile with these contents and run docker build... it fails. npm is not found

### Lecture 38 - base Image Issues

- we use alpine as base image. this is a small image that does not suitalbe for owr needs.
- we need an image with node in and npm. maybe node. OR add commands to install node and npm on alpine
- in [Dockerhub](http://hub.docker.com) node image has node preinstalled. we see all the available versions eg. node:6.14 or node:alpine (most compact version)
- in Docker world Alpine means Minimum
- we build the new Dockerfile

```
# specify base image
FROM node:alpine
## install some dependencies
RUN npm install
# default command
CMD ["npm","start"]
```

- we get errors when running the comman npm install... the files in our machine are missing from teh container
- Files on our local machine are NOT by default avialble in ontainer FS (HD segemtn)
- so container cannot find package.json
- we need to allow use of local files inthe build container in the Dockerfile

### Lecture 40 - Copying Build Files

- To copy files from local machine to container: `COPY ./ ./` COPY from to
  _ COPY : dockerfile commande for copying files
  _ ./ : (1) path to folder to copy from on our machine relative to build context. \* ./ : (2) place to copy stuff to inside the container
- build context? PWD altered by docker build <path> . in our case where Dockerfile resides
- we put this command before the `RUN npm install`
- image is created... we tag it `docker build -t achliopa/simpleweb .`
- we run it: `docker run achliopa/simpleweb`
- it runs.
- we visit with borwser localhost:3000 and get an error... we need to map ports to container

### Lecture 41 - Container Port Mapping

- our browser makes a request to localhost:8080 (on our machine)
- container has its own se of ports that by default do not accept incoming traffic
- we need to set explicit port mapping to enable port forwarding to the localhost
- this is for incoming comm. container can talk to the outside world (it does it to get dependencies)
- Port mapping is set in Docker Run command
- Docker Run with Port mapping: `docker run -p 3000:3000 <image id>`
  _ -p : port forwarding flag
  _ 3000 : (1) localhost port to route from \* 3000 : (2) contatiner port to route to

- ports do not have to be identical
- we can visit our running app now

### Lecture 42 - Specifying a Working Directory

- we will run our built image starting a shell inside it to do dbugging `docker run -it achliopa/simpleweb sh` we dont do port mapping as we dont need to visit app for debugging
- we run ls and we see that our peoject files are added to the alpine linux root folder /
- this is not good practice.. we might overwritte linux kernel folders
- we need to define a working dir in the Dockerfile. w use the command `WORKDIR /usr/app`
- what this command does? it enforces that any following command will be executed relative to this path in the container of the image to be built. so `COPY ./ ./` is equivalent to `COPY ./ ./usr/app` if we didnt use the command
- if folder does not exist will create it
- usr/app is a safe place for our app we could use /home instead or /var
- we rebuild it (we changed the order of commands so no caching)
- if we open shel in the container it takes us directly to /usr/app
- we can run our app with port forwarding and visit browser
- in that running container we get its id and run `docker exec -it <cont id> sh` to open a terminal inside

### Lecture 43 - Unnecessary Rebuilds

- with our app running we visit our webpage and see content
- we change the index.js in the project folder in our local machine modifying the console.log
- as we expect when we refreh page we see no change... we have to rebuild and rerun image
- step 3 'COPY ./ ./' copies all contents of project folder again even if the change is on 1 file
- we also dont need to run 'CMD npm install' as no change to package.json was made
- also we should try excluding node_modules from the COPY (faster)

### Lecture 44 - Minimizing Cache Busting and Rebuilds

- npm install command cares about package.json
- we can solve the unecessary reinstall by grouping COPY and CMD of dependent files

```
COPY ./package.json ./
RUN npm install
COPY ./ ./
```

- this approach is node specific
- the result is that any change on code will not trigger npm install

## Section 5 - Docker Compose with Multiple Local Containers

### Lecture 45 - App Overview

- we will create a docker container with a webapp that displayes the number of visits to the webpage
- to build it we will need 2 components. a node(express) web app and a redis server (in memory data storage)
- one possible approach is to use a single container with node and redis running inside. if the app receives a lot of traffic this will be abottleneck.
- as we get more traffic we will need more web servers (more instances of docker containers)
- redis server will run multiple times as well. so between redis servers it will be inconsisency on the data they store... so whichever conteiner we connect to will give a different number
- so a scaled up app will have mulptiple docker node containers and a simngle docker redis container
- first we will build an app with 2 containers and then we will scale it up

### Lecture 46 - App Server Code

- we make a new project dir /visits and cd into it
- we will create a package.json file

```
{
	"dependencies": {
		"express": "*",
		"redis": "2.8.0"
	},
	"scripts": {
		"start": "node index.js"
	}
}
```

- redis is a lib for connecting redis -server to node
- we also create an index.js file

```
const express = require("express");
const redis = require("redis");

const app = express();
const client = redis.createClient();
client.set('visits',0);

app.get('/', (req,res)=> {
	client.get('visits', (err,visits)=>{
		res.send('Number of visits is '+ visits);
		client.set('visits', parseInt(visits)+1);
	});
});

app.listen(8081, ()=> {
	console.log('Listening on port 8081');
});
```

- we do not config redis client (ports etc) yet
- data come from redis as strings we need to parse tehm to int to make operations

### Lecture 47 - Assembling a Dockerfile

- we compose a dockerfile to compose the node app so essentially is same with what we wrote for simpleweb app (relative paths are different but result is same)

```
# specify base image
FROM node:alpine
## install some dependencies
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
# default command
CMD ["npm","start"]
```

- we build it `docker build -t achliopa/visits .`

### Lecture 48 - Introducing Docker Compose

- we run our newly created image of the node server of our app wiith `docker run achliopa/visits`
- we get a bunch of errors as node cannot connect to redis. redis lib tries to connect to redis default port on the localhost '127.0.0.1:6379'
- our first thought is to run a redis container.. we do it `docker run redis` no customization
- even if we have now a running docker container with redis on our host if we rerun our node docker container it still cannot connect...
- docker containers need to be set in the same docker network cluster to talk to each other
- localhost in docker container refers to the alpine linux running instance in the container
- to setup a network infrastructure for docker containers we have 2 options:
  _ use Docker CLI's Network Features
  _ use Docker Compose

- using docker cli network feats to connect containers together
- docker-compose is a separate toolused much more frequently to do the job.
- it gets installed with docker on our machine
- docker-compose is a separate cli tool
  _ it is used to start-up multiple docker containers at the same time
  _ automates some of the long-winded arguments we are passing to docker run

### Lecture 49 - Docker Compose Files

- using docker-compose we use the same docker cli commands we use to run containers
- we encode thes e commands into a YAML file in our project folder. the file is called 'docker-compose.yml'
- cli commands are not cp'ed in docker-compose.yml. a sp[ecial syntax is used]
- for our app the YAML file will be like:

```
# Here are the created containers for the build
	redis-server
		# make it using 'redis' image
	node-app
		# make it using the Dockerfile in the current dir
		# map port 8081 to 8081
```

- we add a docker-compose.yml file in our project root
- we start to implemetn it
- first we set the yaml version `version: '3'`
- then we list the services to be used.

```
services:
	redis-server:
		image: 'redis'
	node-app:
		build: .
		ports:
			- "4001:8081"
```

- services means containers (type of)
- with image: we specify an available imge to use (localy or in dockerhub
- `build: .` means to search in the durrent dir for a Dockerfile and use it to build the image for the service-container
- indentation is important for YAML files
- - in YAML means an array
- "8081:8081" => <port on our machine>:<port in container>

### Lecture 50 - networking with Docker Compose

- we still have put no config for the network infrastructure
- actually we dont need it. because we pute them in teh same docker-compose file docker-compose will put them in the same network infrastructure (virtual vlan) without the need to open ports between them (SWEET!!)
- as the services are in different containers aka vms. we need to add configuration in redis node lib createCLient() connection method in index.js
- we dont know theys IPs in the virtual vlan so we refer them by service name.

```
const client = redis.createClient({
	host: 'redis-server',
	port: 6379
});
```

### Lecture 51 - Docker Compose Commands

- an equivalent of `docker run <image>` is `docker-compose up` which creates instances of all services specked in the YAML file
- if we want to rebuild the images of the servicdes in the YAML and run them we use `docker-compose up --build`
- we run `docker-compose up` in our project folder.
- the log says that a netrwork 'visits-default' is created with default drivers
- this network joins images together
- the images created are <project*folden_ame>*<service*name>*<number> eg. visits_redis-server_1
- we run localhost:4001 in browser and our app works ok

### Lecture 52 - Stopping Docker Compose Containers

- we can run a container from an image without attaching to its STOUT with flag -d `docker run -d <image>` . it executed in teh background
- with docker-compose we start multiple containers. is a pain to stop them one by one
- we can stop all with `docker-compose down`
- flag -d (run in background works also for docker-compose e.g `docker-compose up -d`)

### Lecture 53 - Container Maintenance with Compose

- what we do if a container started with compose crashes???
- to test it we add a crash every time someone visits the toute '/crash'

```
const process = require('process');
app.get('/crash',(req,res)=>{
	process.exit(0);
	});
```

- we start our containers and visit localhost:4001/crash.
- our log says visits_node-app_1 exited with code 0
- if we run `docker ps` we see that only visits_redis-server_1 runs

### Lecture 54 - Automatic Container Restarts

- we will look how to make docker-compose maintain and auto restart our containers
- in our process.exit() call we pass 0
- in unix status codes 0 means that we exited but everything is OK, exit status code >0 means something went wrong
- to make containers restart we will add 'restart policies' inside our docker-compose .yml file:
  _ "no": never attempt to restart this contatiner if it stops or crashes
  _ always: if this container stops 'for any reason' always attempt to restart it
  _ on-failure: only restart5 if the container stops with an error code
  _ unless-stopped: always restart unles we (the developers) forcibly stop it
- no restart policy is the default one (if we dont specify otherwise)
- in node-app service we add a new policy `restart: always`
- the 'restart' plocy is per service
- we test . our container stops and becomes green again.
- when restarting docker reuses the stoped container so does not create a new instance
- no is put in quotes 'no' because in YAML no is interpreted as false
- in webapps we usually choose always
- in a worker process we choose on-failure

### Lecture 55 - Container Status with Docker Compose

- currenlty we use docker cli to check contianer status with `docker ps`
- the docker-compose equivalent is `docker-compose ps` it will return status of the containers in the docker-compose file in our current dir (project folder)
- docker-compose commands need to go to docker-compose.yml file to execute. if we run it from the smae dir we dont need to specify the route to the docker-compose file

## Section 6 - Creating a Production-Grade Workflow

### Lecture 56 - Development Workflow

- we will see the entire workshop of buildng an app on docker and publishing it on a hosting service
- we will go through the whole workflow: development -> testing->deployment cycle

### Lecture 57 - Flow Specifics

- we will create a github repo: a central point of coordination for the code we write and deploy
- our github repo will have 2 branches: feature branch (development branch) and master branch (cclean working ready to deploy code)
- we will pull the code from the features branch (like joining a dev tema)
- we will make changes to the codebase
- we will push back to feature branche (neven on MASTER)
- we will make a Pull request from feature to master (to take all changes in features branch and merge them with master branch)
- this pull request will trigger a series of actions:
  _ a workflow we will setup will take the app and push it to Travis CI (run tests)
  _ travis after tests pass will take the codebase and push it over to AWS hosting

### Lecture 58 - Docker's Purpose

- docker is not mentioned in the flow. is not needed
- docker is a tool that will make some of these steps a lot easier

### Lecture 59 - Project Generation

- we will generate a project and wrap it up in a docker container. so no custom code
- our app will be a React frontend
- we should have node installed locally

### Lecture 60 - More on Project Generation

- we install globally the create-react-app tool (we have it) `npm install -g create-react-app` if we dont have it already
- inside our projects folder we create a new app `create-react-app frontend`
- we go in the project root folder

### Lecture 61 - Necessary Commands

- the 3 main commands we need are
  _ npm run start: starts up the dev server. For development use only
  _ npm run test: runs tests associated with the project \* npm run build: builds a production version of the application
- we should run this command before running on host the scripts

```
echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_watches &&
echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_queued_events &&
echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_instances &&
watchman shutdown-server
```

- we run `npm start`
- we run `npm run test`
- we run `npm run build`
- build produces a build/ folder inside static/ folder th e js file is our app packaged and ready for deployment together with the html file
- start command launches the dev server

### Lecture 62 - Creating the Dev Dockerfile

- in the frontend project folder we create a new Dockerfile and name it Dockerfile.dev
- this is only for development. (command will be npm run start)
- later in the workflow we will add a Dockerfile named Dockerfile for production (CMD will npm run build)
- we start building the dev dockerfile like our previous node app

```
FROM node:alpine

WORKDIR '/app'

COPY package.json .
RUN npm install
COPY . .

CMD ["npm","run","start"]

```

- we need to run a dockerfile with a customname. we ll add the -f flag specifiyng the dockerfile to use `docker build -f Dockerfile.dev .`

### Lecture 63 - Duplicating Dependencies

- we come back into a problem we foresaw some sections ago...
- we have already run 'npm start' in our local machine so npm modulkes were installed in the project dir in a folder anmed node_modules. this folder is big
- when we issued COPY . . in our dockerfile we copied this entire folder from local workingindir to the container. so build command issues a warning for size
- we need fast build so we should ignor ethis folder as it is recreated in the container
- a dumb solution is to delete the node_modules folder before buildign the image

### Lecture 64 - Starting the Container

- we cp the image id and use it to run it with `docker run`
- the log says we can view the app at localhost:3000 and on our machine at 172.17.0.2:3000
- localhost:3000 does not work but 172.17.0.2:3000 works on our host machine browser
- to access the app at localhost on our machine we need to map ports so we run `socker run -p 3000:3000 id`
- we make a change. we mod the text in App.js. we refresh the page and no change in the app.
- the change we did was in our local copy not in the container we need to rebuild or find an automated solution

### Lecture 66 - Docker Volumes

- volumes are a way of mapping a local HD folder in the container
- so far we have seen only how to copy data from localhost to container.
- with volumes we set a reference in the container that maps back to the localhost
- seting volumes is more difficult than COPY
- the docker run command with volumes is like: `docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app <image_id>`
  _ -v /app/node_modules : put a bookmark on the node_modules folder
  _ -v \$(pwd):/app : map the pwd (current dir) into the /app folder
- the second switch is the one doing the mapping we want
- the first switch dows not have a colon. if we omit it and run the command `docker run -p 3000:3000 -v $(pwd):/app e84a4e3ebcf6` we get a node error

### Lecture 67 - Bookmarking Volumes

- why we saw the error? as node libs (node_modules) are not found. the libs are not found why? because container is mapping to our local dir and in our local dir we have deleted the node_modules
- to bookmark a volume (not map it to the local machine) we write the path in container but skip the colon and the first part (path on our machine) `-v /app/node_modules` so we make it a placeholder in teh container but dont map it to the localmachine
- we run the full command `docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app e84a4e3ebcf6` and app start instantly
- now our local code changes get instantly reflected in the running app inside the docker container dev server. COOL!!!! (auto refresh is a create-react-app feat)

### Lecture 68 - Shorthand with Docker Compose

- writing docker cli command with volumes is very long....
- we will use docker-compose to fix that.
- docker-compose is legit even for single container builds as it simplifies the commands
- we assemble a dodker-compose.yml file for our project

```
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - /app/node_modules
      - .:/app
```

- docker-compose up breaks.. it cannot find Dockerfile as the name is not the default

### Lecture 69 - Overriding Dockerfile Selection

- we tweak the docker-compose file to fix the issue
- we mod the build: setting adding subsettings

```
    build:
      context: .
      dockerfile: Dockerfile.dev
```

- the dockerfile: setting does the trick

### Lecture 70 - Do We Need Copy?

- we run `docker-compose up`
- app is running ok
- we do a code change. app rebuilds and chrome refreesh. all ok
- with volume mapping set we dont need the COPY . . in the Dockerfile.
- we still need COPY package.json . as we need it to build the libs
- if in the future we dont use docker-compose. then Dockerfile wont build without the COPY . .
  so we opt on leaving it in

### Lecture 71 - Executing Tests

- we ll first run the tests on dev env and then will do it on Travis CI
- we build our container with Dockerfile `docker build -f Dockerfile.dev .` we get the image id
- we run the tests with `docker run <image_id> npm run test`
- we see the test output but we cannot interact with the console. we need the -it flag for that

### Lecture 73 - Live Updating Tests

- we modify the test file App.test.js adding one more test. tests do not rerun automaticaly
- even if we manually rerun tests the new test is NOT included
- we have the usual problem we copied our folder at build time so any local change is not reflected in the container project dir
- we can follow a docker-compose approach with volumes like in dev, setting maybe a test service looking in a test dockerfile with the test command
- another approach is to bring up an instance with `docker-compose up`
- we can attach to the existing container and run our test command
- we open a second terminal and run `docker ps` to get the instance id.
- we use it to run `docker exec -it <instance_id> npm run test`
- changes now trigger rerun of tests
- is a good solution but not optimal to mix compose with cli

### Lecture 73 - Docker Compose for Running Tests

- we will impleemnt the first approach adding in docker-compose a second service for testing

```
  tests:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - /app/node_modules
      - .:/app
    command: ["npm","run","test"]
```

- to avoid adinga separate dockerfile we use the one for dev overriding the command withthe command property
- it work but we get the test outputin the login interface. no styling and no interaction

### Lecture 74 - Shortcomings on Testing

- we want the docker-compose service approach with the -it flag ability
- with docker compose we cannot set up a connection between our host terminal and teh test conteiner stdin
- we ll open another terminal and run `docker attach` to the tests running ontainer. attach attaches the terminal to the stdin,stdout and stderr of the running contrainer
- in the other terminal we run `docker ps` to see the ids then `docker attach <id>` but it does not seem to work
- we cannot do much more with this solution
- to see why this happens we open a 3rd terminal and run `docker exec -it <container id> sh` for the testing container to open a shell. in the shell we run 'ps'
- we see 1 npm and 2 node processes running... strange... the first is the script in the command we call and the 2 node ones the process that does the test
- `docker attach` alwways attaches the host terminal with the std strams of the primary process and this is NOT the one doing the tests as we saw
- so docker attach is not the way for us...
- if we can memorize the exec vcommand it is the better one

### Lecture 75 - Need for Nginx

- there is a great difference with our app running in a dev environent and in production environment
- in dev environemnt thereis a dev server running in the we container. the browser interacts withthe dev server that uses the build folder to serve content. namely the one html file (index.html) and the bundled up js application code
- in prod enviornment we have the public files (index.html + optimized js bundle + any other files) but the dev server is missing. it is not appropriate for a production environment. it consumes far too many resources to handle code changes fast. in production our code base is stable
- for production environment container we will use the [nginx](https://www.nginx.com/) server a lightweight ans stable production grade webserver

### Lecture 76 - Multi-step Docker Bulds

- we ll look how to get nginx into our production container
- we will add a seconf dockerfile in our project dit named 'Dockerfile' for our production image.
- in our new Dockerfile we need to:
  _ use node:alpine as base
  _ copy the package.json file
  _ install dependencies (ISSUE: deps only needed to execute 'npm run build')
  _ run npm run build \* start nginx and serve build dir (ISSUE: how we install nginx?)
- we look in docker hub for nginx. there are nginx image to host simple context (no node inside) by we need node to build
- in looks like we need 2 diff base images
- we will use a dockerfile with a `multistep build process` with 2 blocks of configuration
  _ Build Phase: Use npde:alpine => copy package.json file => install dependencies => run 'npm ruin build'
  _ Run Phase: use nginx => copy over the result of 'npm run build' => start nginx

### Lecture 77 - Implementing Multi-Step Builds

- the first step in our dockerfile looks like

```
FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
```

- steps start with `as <stagename>` in a FROM block.
- we dont need volume as we wont work on the files after the container is prepared
- we dont need a CMD as our container puprose is to build the project and exit
- our build artifacts for production will be in /app/build in the container FS we need to copy it to the next step container
- we implement the run phase
- we dont need to name it. FROM block signamls the end of previous step (phase) and the start of a new

```
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
```

- in this step we specify the base image
- we use the --from= flag to tell dockerfile that we want to copy files not from the defualt location (host) but from an other location as parameter we pass the previous step `--from=builder`
- we copy the build artifacts fromt he outout folder in the builder container fs to the nginx container defualt location (according to nginx image documentation)
- we dont neeed to set a CMD as nginx contianer primary command starts the nginx server

### Lecture 78 - Running Nginx

- we are ready to test with `docker build .` no need for -f flag as we use default dockerfile name
- we run the container `docker run -p 8080:80 <container_id>`
- we see no output. but we visit browser at localhost:8080 annd see our app running

## Section 7 - Continuous Integration and Deployment with AWS

### Lecture 79 - Services Overview

we ll look how to get nginx into our production container

- we will add a seconf dockerfile in our project dit named 'Dockerfile' for our production image.
- in our new Dockerfile we need to:
  _ use node:alpine as base
  _ copy the package.json file
  _ install dependencies (ISSUE: deps only needed to execute 'npm run build')
  _ run npm run build \* start nginx and serve build dir (ISSUE: how we install nginx?)
- we look in docker hub for nginx. there are nginx image to host simple context (no node inside) by we need node to build
- in looks like we need 2 diff base images
- we will use a dockerfile with a `multistep build process` with 2 blocks of configuration
  _ Build Phase: Use npde:alpine => copy package.json file => install dependencies => run 'npm ruin build'
  _ Run Phase: use nginx => copy over the result of 'npm run build' => start nginx

### Lecture 77 - Implementing Multi-Step Builds

- the first step in our dockerfile looks like

```
FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
```

- steps start with `as <stagename>` in a FROM block.
- we dont need volume as we wont work on the files after the container is prepared
- we dont need a CMD as our container puprose is to build the project and exit
- our build artifacts for production will be in /app/build in the container FS we need to copy it to the next step container
- we implement the run phase
- we dont need to name it. FROM block signamls the end of previous step (phase) and the start of a new

```
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
```

- in this step we specify the base image
- we use the --from= flag to tell dockerfile that we want to copy files not from the defualt location (host) but from an other location as parameter we pass the previous step `--from=builder`
- we copy the build artifacts fromt he outout folder in the builder container
- we have now all set up om the docker part of the deployment process
- we will see how to use the containers we have prepared in our workflow
- we will use in our workflow : github, Travis CI, AWS

### Lecture 80 - Github setup

- our flow on github:
  _ create github repo
  _ create local git repo
  _ connect local git to github remote
  _ push work on github
- we create a new repo on github: docker-react
- we set it to public (private wont do the trrick...)
- working with a private repo is possible we just have to add keys on the servers that use our codebase
- we start a local repo in frontend and push it up to github (at docker-react repo)
- as we use a main gihub repo for our course we nest this a s a submodule

```
git submodule add git@github.com:achliopa/docker-react myCode/docker-react
```

- now in order to commit and push to the subrepo we need to do it in the master one
- if we need to update changes we do a pull inside the folder or outside `git submodule update --init --recursive`
- also when we clone our outer repo if we want to include the submodule we use `git clone --recursive git@github.com:achliopa/udemy_DockerKubernetesCourse.git`

### Lecture 81 - Travis CI setup

- we ll setup travis CI on github. travis works as follows
  _ whenever we puch code on our github repo travis is triggered
  _ travis does its work
- travis can test, deploy
- we will use it for test and deployment (on AWS)
- we setup travis-ci for our repo
- we go to we signin/up and grant access
- we go in the dashboard
- in our avatar pro we see our github repos. we enable it for docker-react
- our repo is added in the list in the dashboard
- we see our repo

### Lecture 82 - Travis YML file configuration

- we need to direct Travis to test our code when we push
- we add a config file .travis.yml in our root project dir:
- in the file we need to:
  _ tell travis we need a copy of docker running
  _ build our image using Dockerfile.dev (our test container is set thjere)
  _ tell travis to run our test suite
  _ tell travis how to deploy our code to AWS
- our .travis.yml is

```
sudo: required
services:
	- docker

before_install:
	- docker build -t achliopa/docker-react -f Dockerfile.dev .
```

- every time we run docker in travis ci we need superuser permissions `sudo: required`
- we need to tell travis on teh services we will use (docker). travis will run docker
- 'before_install' sets what will run before our tests run (test setup)
- first we need to create the test container image `- docker build -t achliopa/docker-react -f Dockerfile.dev .`
- we need the generaated id for the next command. we add a tag to use it later
- we can add a simple tag as its going to be used only in the travis ci temporary vm

### Lecture 83 - A Touch More Travis Setup

- we need to tell travis what to do with our code (test)

```
script:
	- docker run achliopa/docker-react npm run test -- --coverage
```

- if travis gets a result other that 0 from the scripts it will assume our scripts (test) failed
- every time we run tests on travis it assumes that test run and exit automatically
- npm run test runs continuously and does not exit (travis will think as error)
- to make sure the test run exits after it test we run `npm run test -- --coverage` instead
- this option gives a coverage report

### Lecture 84 - Automatic Build Creation

- we push our code to github
- travis ci is triggered. in dashboard we see that our tests pass (if we go to travis when tests are run we can see log)

### Lecture 85 - AWS Elastic Beanstalk

- our app is tested and ready to be deployed to AWS
- we go to amazon aws and create an account
- we go to dashboard
- to deploy our project we will use elastic beanstalk
- elastic beanstalk is the easiest way to start with production docker instances. it is best suited in single containers
- we click create new application => give a name => create
- we have a workspace and we are prompted to create an environment. we create one
- we select web server environment => select
- in Base Configuraton => Platform we select `Docker`
- DO NOT FORGET TO SHUT DOWN THE INSTANCE AFTER FINISHING TO AVOID BILLING

### Lecture 86 - More on Elastic Beanstalk

- wehn setup is compete our docker-env is healthy and running
- why we use elastic beanstalk?
  _ when our user tries to acces our app from hist browser the request will be handled by a Load Balancer in teh AWS ElastiBeanstalk Environment we created
  _ Load balancer will direct the request to a VM running Docker in the AWS Env. in that machine a docker container runs with our app \* The benefit of elastic beanstalk is that it monitors traffic to our VM. when traffic is high Elastic beanstalk will start additional VMs (+containers) to handle traffic
- So Elasticbeanstalk == Auto Scale of our app
- our aws env workspace has the url of the env we can call vfrom browser4

### Lecture 87 - Travis Config for Deployment

- we mod the .travis.yml file to do the deployment after test pass
- travis has preconfigured scripts to auto deploy for a number of known providers like digital ocean, aws ...
- we also need to set in which region our app is tunnin int (it is a part of the url)
- we put the name of the app
- we put the env name
- we put the bucketname (S3 bucket) where AWS puts our repo for the app. we go to S3 in AWS dashboard and look for the environments bucket (elasticbeanstalk.region.id)
- we add the bucket_path which is the folder in the bucket where our app resides. typically is the app name we gave to teh Elasti beanstalk
- we said that we will triger the deploy (and test when master gets a new version) so we tell travis to deploy only when there is a push to master

```
deploy:
  provider: elasticbeanstalk
  region: "eu-central-1"
  app: "docker-react"
  env: "DockerReact-env"
  bucket_name: "elasticbeanstalk-eu-central-1-448743904882"
  bucket_path: "docker-react"
  on:
    branch: master
```

### Lecture 88 - Automated Deployments

- we need to generate and give API keys to our EWS env to travis so that it is authorized to do the deployment
- we go to AWS IAM service to set keys => users => add user =>
- we set a name 'docker-react-travis-ci' and give it programmatic access only => next.permissions => attach existing policies directly
- we select 'AWSElasticBeanstalkFullAccess ' => next => create user
- we get a pair of keys an access key id and a secret access key
- we have only one time acces to the secret key
- we dont want to put these keys directly in teh .travis.yml as this is in a github public repo
- we use enviroment features prvided by travis ci
- we go to travis-ci => project => settings => environment variables
- we enter access key and secretaccess key
- accesskey: name: AWS_ACESS_KEY . do not dispaly it on build log => add
- secret: name: AWS_SECRET_KEY do not dispaly it on build log => add
- we add them to deploy script in .travis.yml

```
deploy:
  provider: elasticbeanstalk
  region: "eu-central-1"
  app: "docker-react"
  env: "DockerReact-env"
  bucket_name: "elasticbeanstalk-eu-central-1-448743904882"
  bucket_path: "docker-react"
  on:
    branch: master
  access_key_id: $AWS_ACCESS_KEY
  secret_access_key:
    secure: "$AWS_SECRET_KEY"
```

- we will comit and push our changes to github to see the flow take action
- we see in travis the log of the deploy

### Lecture 89 - Exposing Ports Through the Dockerfile

- in the travis build log we see. that deploy is done
- we visit the elastibgeanstalk app url in browser but we dont see the app
- also the state of the environemnt says degraded
- we need to expose the port in elasticbeanstalk when we run the docker container in travis.yml
- we do the expose after the first deploy (not sure why) and we do it in the production dockerfile in the prod phase. `EXPOSE 80`

```
FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
FROM nginx
EXPOSE 80
COPY -from=builder /app/build/ /usr/share/nginx/html
```

- this command has no effect in local dev environment but it is meaningful in elastibeanstalk . as aws looks into the dockerfile for port mapping
- we repeat commit push and see the deploy
- travis work is about 4min

### Lecture 91 - Workflow with Github

- we will create the secont working branch 'features' so when we pull to master and merge it will trigger build
- we checkout code to a new branch `git checkout -b feature`
- we modify App.js => add => commit => push origin feature
- this creates a new branch on github (feature)
- we now have to do a pull request and merge
- in github repo we see the new branch. on the right it has a compare & pull request
- on top it says we will attempt to take all in features and merge them in master branch
- we leave a message and click create pull request.
- an issue page is created for other developers to make comments
- we see there ar no issue fro merge but travis has pending checks

### Lecture 92 - Redeploy on Pull Request merge

- after some time we see that ravis checks passed. travis attempted to merge our changes and run the tests which passed. so its safe to merge
- as we merge it equalls a push to master so the whole test+deploy flow reruns

### Lecture 93 - Deployment Wrapup

- docker had nothing to do int eh deployment process.
- docker is a tool that eases up the deployment process
- travis pipeline is reusable for other projects as well

## Section 8 - Building a Multi-Container Application

### Lecture 95 - Single Container Deployment Issues

- some issues with our first production grade app
  _ the app was simple . no outside dependencies
  _ our image was built multiple times \* how do we connect to a ddatabase from a container?
- we would like to not do the build in an active running web server
- the next level is to deploy to elasticbeanstalk a multicontainer app

### Lecture 96 - Application overview

- the app will be a super complicated fibonacci series calculator
- user will enter the index in teh series on the web page
- a backend process will calculate the fibonacci number for this index
- the result will be presented on screen
- also we will diplay the result in a list of items (together with previou sones)
- and alist of previous searched indexes

### Lecture 98 - Application Architecture

- the development architecture of our app:
  _ browser hits nginx web server
  _ nginx will do some routing. it will see if the browser is trying to access a view (html pr js frontend file) it will route to the react server
  _ if the request is trying to access a backend API it will route to an ecpress node API server
  _ express api server will hit an imemory redis data storage or a postres db
  _ redis will exchange info with a worker process that will calculate the fibonacci series
  _ postgress will store the visited indexes \* redis will have teh calculated values
- Redis: Stores all indices and calculated values as key value pairs
- Postgres: stores a permanent list of indices that have been received
- worker: watches redis for new indices. pull seach new index. calculates new value and then puts it back to redis

### Lecture 99 - Worker Process Setup

- we make a new project dir 'complex'
- we make a new folder inside named 'worker'
- we add a package.json file into worker folder

```
{
	"dependencies": {
		"nodemon":"1.18.3",
		"redis": "2.8.0"
	},

	"scripts": {
		"start": "node index.js",
		"dev": "nodemon"
	}
}
```

- its going to be a node daemon talking to redis store
- we add a js file in worker named index.js where we add `const keys = require('./keys');`
- so all keys for connecting to redis will come from a separate js file named keys.js
- keys will come as env params

```
module.exports = {
	redisHost: process.env.REDIS_HOST,
	redisPort: process.env.REDIS_PORT
}
```

- our index.js complete

```
const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

function fib(index) {
	if (index < 2) return 1;
		return fib(index-1) + fib(index-2);
}

sub.on('message', (channel,message)=>{
	redisClient.hset('values',message,fib(parseInt(message)));
});
sub.subscribe('insert');
```

- we create two redis clients. one subscribes to events and listens to new messages. the other actually sets the value running a fibonacci recursive function (takes along time so that why we need a second client to not miss incoming events)
- in the client we pass a callback to restart if connection is lost after a second

### Lecture 100 - Express API Setup

- we add a new folder 'server' inside the root folder
- we add a package.json as well

```
{
	"dependencies": {
		"express": "4.16.3",
		"pg": "7.4.3",
		"redis": "2.8.0",
		"cors": "2.8.4",
		"nodemon": "1.18.3",
		"body-parser": "*"
	},
	"scripts": {
		"start": "node index.js",
		"dev": "nodemon"
	}
}
```

- we add a keys.js file same as workers with reference to the env params with keys for redis and prostgres

### Lecture 101 - Connecting to Postgress

- we create a new file called index.js in 'server'
- the file will host all the logig to:
  _ connect to redis
  _ connect to postgres \* broke information between them and the react app
- cors will allow us to make cross origin requests
- everytime we connect to a PostgresDB we need to create a table to host values

### Lecture 102 - More Express API Setup

- we add a connection to redis to pass the inserted value

```
const keys = require('./keys');

//express app setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// postgres client setup
const { Pool } = require('pg');
const pgClient = new Pool({
	user: keys.pgUser,
	host: keys.pgHost,
	database: keys.pgDatabase,
	password: keys.pgPassword,
	port: keys.pgPort
});
pgClient.on('error', ()=> console.log('Lost PG connection'));

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
	.catch((err)=>console.log(err));

//Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();


// express route handlers
app.get('/', (req,res)=>{
	res.send('Hi');
});

app.get('/values/all', async (req,res)=>{
	const values = await pgClient.query('SELECT * FROM values');

	res.send(values.rows);
});

app.get('/values/current', async (req,res)=>{
	redisClient.hgetAll('values', (err,values) => {
		res.send(values);
	});
});

app.post('/values', async (req,res) => {
	const index = req.body.index;

	if(parseInt(index)>40){
		return res.status(422).send('index too high');
	}

	redisClient.hset('values',index, 'Nothing yet!');
	redisPublisher.publish('insert',index);
	pgClient.query('INSERT INTO values(number) VALUES($1)',[index]);

	res.send({working:true});
});

app.listen(5000, err => {
	console.log('Listening');
});
```

- we set a hash in redis with key index and value emty and we publish an event of type inser with the index
- we add express routes and handlers

### Lecture 103 - Generating the React App

- in base project folder we run `create-react-app client`

### Lecture 104 - Fetching Data in the React App

- we want to implement 2 pages in the frontend. a dummy page and a full flejed form with a list
- we create teh dumm page `OtherPage.js` in src asimple functional component witha Link
- we add the main page component in Fib.js in src
- we implement the compoent as stateful class component
- we add a lifecylemethod and 2 helpers to fetch data from backend and set state

### Lecture 105 - Rendering Logic in the App

- we add a render method
- we add a form and event handler
- we add 2 lists in helpers methods
- when we get back data from postgres we get an array of objects

```
import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
	state = {
		seenIndexes: [],
		values: {},
		index: ''
	};

	componentDidMount() {
		this.fetchValues();
		this.fetchIndexes();
	}

	async fetchValues() {
		const values = await axios.get('/api/values/current');
		this.setState({ values: values.data });
	}

	async fetchIndexes() {
		const seenIndexes = await axios.get('/api/values/all');
		this.setState({
			seenIndexes: seenIndexes.data
		});
	}

	handleSubmet = async (event) => {
		event.preventDefault();
		await axios.post('/api/values', {
			index: this.state.index
		});
		this.setState({index: ''});
	};

	renderSeenIndexes() {
		return this.state.seenIndexes.map(({number}) => number).join(', ');
	}

	renderValues() {
		const entries = [];

		for (let key in this.state.values) {

		}
	}

	render() {
		return(
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>Enter your index:</label>
					<input
						value={this.state.index}
						onChange={event => this.setState({index: event.target.value})}
					/>
					<button>Submit</button>
				</form>
				<h3>Indices I have seen:</h3>
				{this.renderSeenIndexes()}
				<h3>Calculated Values:</h3>
				{this.renderValues()}
			</div>
		);
	}
}

export default Fib;
```

### Lecture 107 - Routing in the React App

- we ll use react-router-dom lib to route between the 2 pages (React componetns) we hav eimplemented
- we add `"react-router-dom": "4.3.1"` in package.json dependencies and `"axios": "0.18.0"`
- in App.js we add the BrowserRouter and Route and implement basic router
- we add 2 links in the header

## Section 9 - "Dockerizing" Multiple Services

### Lecture 110 - Dockerizing a React App - Again!

- we will make a Dockerfile for each process we have implemented (React App , Express Server, Worker Daemon)
- the dockerfiles will be for development not production
- again like before we dont want npm install to run whenever we modify the code base. only when we mod the package.json
- so we will do what we did in the single service application dev dockerfile in a previous section
  _ xopy over package.json
  _ run npm install
  _ copy over all else
  _ use docker compose to set a volume to 'share files' between local and container
- all our component folders are similar (node based apps) and we add the dockerfile inside each one
- in client fodler we add Dockerfile.dev

```
FROM node:alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm","run","start"]
```

- in client folder we run `docker build -f Dockerfile.dev .` to build our client image
- we add Dockerfile.dev files for server and worker (identical). we use npm run dev to start nodemon so that we listen to code changes as we do changes to code base

```
FROM node:alpine
WORKDIR "/app"
COPY ./package.json ./
RUN npm install
COPY . .
CMD["npm","run","dev"]
```

- we build our custem images and run them `docker run <id>`

### Lecture 112 - Adding Postgres as a Service

- we ll assempble a docker-compose file to connect and build/run our iamges easily
  _ postgres: which image from hub?
  _ redis: which image from hub?
  _ server: specify build, volumes, env variables
  _ later add worker and client
- volumes we need to speed up devleopment
- env are needed for process.env params
- in project root we add the file
- start of file

```
version: '3'
services:
    postgres:
      image: 'postgres:latest'
```

- in docker run of postgres image we can spec the password to use as a param

### Lecture 113 - Docker-Compose Config

- in the same way we add redis

```
    redis:
      image: 'redis:latest'
```

- we add server service specifying the build (file and folder)
- also we add volums to map dev folder to container. aslo we skip node_modules so we dont overwrite it
- all forders are relative to the project root folder

```
    server:
      build:
        dockerfile: Dockerfile.dev
        context: ./server
      volumes:
        - /app/node_modules
        - ./server:/app
```

### Lecture 114 - Environment Variables with Docker Compose

- we add another section to the server config in compose file to set environment variables
- there are 2 ways to set env variables in a docker compose file.
  _ variableName=value : sets variable to value in the container at 'run time'. the value is not stored in the image
  _ variableName; setsa variable in the container at 'run time' value is taken from host machine
- the params are (we look them in dockerhub image docs)
- hostname in docker viurual private network is the docker-compose service name

```
      environment:
        - REDIS_HOST=redis
        - REDIS_PORT=6379
        - PGUSER=postgres
        - PGHOST=postgres
        - PGDATABASE=postgres
        - PGPASSWORD=postgres_password
        - PGPORT=5432
```

### Lecture 115 - The Worker and Client Services

- in the same way we add worker and client config

```
    client:
      build:
        dockerfile: Dockerfile.dev
        context: ./client
      volumes:
        - /app/node_modules
        - ./client:/app
    worker:
      build:
        dockerfile: Dockerfile.dev
        context: ./worker
      volumes:
        - /app/node_modules
        - ./worker:/app
      environment:
        - REDIS_HOST=redis
        - REDIS_PORT=6379
```

- we have note added port mapping.. this is because nginx exposes the whole to the outside world
- so we will add nginx service and dd there the port mapping

### Lecture 116 - Nginx Path Routing

- in our previous project nginx was used in production environment to host hte production built files for serving our content
- in this project nginx will exist in the developlemnt env (to do routing)
  _ our browser will request content like index.html and the included bundle.js these requsests go to React server
  _ after frontside rendering browser will request data from API to feed the app \* browser will request /values/all and balues/current content from Express API server
- we need an infrastructure to do top level routing... this will be done by nginx
- in our code client side app (react) requests API data with Axios from /a[i/values/\* routes
- our backend API serves them in /values/\* routes
- nginx will have a simple job.
  _ when request has / will direct to react server
  _ wehen request has /api/ will redirect to the express server
- an obvious question is why we dont assigne different ports to exress and react server and make this routing based on port to avoid nginx
- in production env we want things transparent and avoid using ports in our urls
- also ports might be used or changed
- nginx after routing /api/ chops off api and passes the rest to the express APi

### Lecture 117 - Routing with Nginx

- to setup nginx and give it a set of routing rules we will create a file called default.conf
- default.conf adds configuration rules to Nginx:
  _ tell nginx that there is an 'upstream' server at client:3000
  _ tell nginx that there is an 'upstream' server at server:5000
  _ tell nginx to listen on port 80
  _ if anyone comes to '/' send them to client upstream \* if anyone comes to '/api' send them to server upstream
- Upstream servers are inaccessible without nginx
- we mention client:3000 and server:5000 as in out index.js we set up our servers to listen to these ports inm tehir respective hosting or virtual machoines or alpine linux container os.
- client and server hostnames are not random but are the service names or the running docker containers in our docker compose virtual network
- we add a new project subfolder named 'nginx' and inside we add the default.conf file

```
upstream client {
	server client:3000;
}

upstream api {
	server api:5000;
}

server {
	listen 80;

	location / {
		proxy_pass http://client;
	}

	location /api {
		rewrite /api/(.*) /$1 break;
		proxy_pass http://api
	}
}
```

- server is a reserved word in ngingx conf so we rename our server service as api
- routing is done using the location rules and proxy_pass directive
- rewrite is using regex to chop off the /api part of the path.
- break means skip any further rule and pass on
- to get default.conf in the nginx container we will the Dockerfile command COPY

### Lecture 118 - Building a Custom Nginx Image

- according to nginx image docs in dockerhub we need to copy the config file in /etc/nginx/conf.d/folder in the image
- if a file exists with the same name it will be overwritten

```
FROM nginx
COPY ./default.conf /etc/nging/conf.d/default.conf
```

- we add nginx as a service in the compose file

```
    nginx:
      restart: always
      build:
        dockerfile: Dockerfile.dev
        context: ./nginx
      ports:
        - '3050:80'
```

- we do port mapping ans add restart policy to always. nginx is the dorr to our app , is lightweight so it should run anytime

### Lecture 119 - Starting Up Docker Compose

- our first `docker-compose up` is likely to fail. why? \* as there are dependencies of services to others (e.g redis) there is no guarantee that these will be up and running before they will be required
- in that case we kill it 'ctrl+c' and force rebuilt `docker-compose up --build`

### Lecture 121 - Troubleshooting Startup Bugs

- our app loads but we get websocket error in console
- this is because everytime react up boots up it needs an active websocket conenction to the dev server
- when we enter a val our app does not rerender we need to refresh to see the result

### Lecter 122 - Opening Websocker Connections

- nginx is not setup to pass through websocket connections so our app does not rerender
- we need to add one more routing rule to default.conf. our console error shows the websocket connection is done on /sockjs-node/.

```
	location /sockjs-node {
		proxy_pass http://client;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "Upgrade";
	}
```

- we rebuild compose and see it working

## Section 10 - A Continuous Integration Workflow for Multiple Containers

### Lecture 123 - Production Multi-Container Deployments

- our workflow for a single container workflow was
  _ push code to github
  _ travis autmatically pulls repo
  _ travis builds an image , tests code
  _ travis pushes code to ews EB \* EB builds image, deploys it
- building our project in EB (prod env) was suboptimal as production server should reserve its power to serve content not do builds
- our modified optimized flow for multicontainer deployment wiil be
  _ push code to github
  _ travis automatically pulls repo
  _ travis builds a test image, tests code
  _ travis builds a test image, tests code
  _ travis builds prod images
  _ travis pushes build prod images to dockerhub
  _ travis pushes project to AWS EB
  _ EB pulls images from Docker Hub, deploys
- dockehub allows us to have our own personal images online

### Lecture 124 - Production Dockerfiles

- worker and server dockerfiles for production are same as dev just the command changes
- nginx prod dockerfile is the same as dev
- an optimization for nginx would be to remove the roting of websockets in default.conf creating a production version of it as in production there is no devserver

### Lecture 125 - Multiple Nginx Instances

- we move to client to build its production Dockerfile. we cp the prod dockerfiel from teh single container application of previous section

```
FROM node:alpine as builder
WORKDIR '/app'
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx
EXPOSE 80
COPY --from=builder /app/build/ /usr/share/nginx/html
```

- then we did a multi step build building and then running an nginx image cping files from build phase to serve
- in our single container deployment AWS EB was running an nginx server with production files serving content at port 80.
- now things will be different. with multicontainer env. in production AWS EB will
  _ run multiple containers
  _ nginx router will listen at port 80
  _ nginx router will proxy / calls to port 3000 where another nginx server will serve production artifcts of react app
  _ nginx will proxy /api calls to port 5000 where the express API server will serv JSON content \* all will run on the same machine (EB) that can scale transparently
- we could use one nginx server to do both. route and serve. with using 2 we gain on flexibility later on

### Lecture 126 - Altering Nginx listen port

- we add an nginx subfolder in client. in there we add a default.conf config file
- we need to change the listening port to 3000. to do so we mod the nginx server config

```
server {
	listen 3000;

	location / {
		root /usr/share/nginx/html;
		index index.html index.htm;
	}
}
```

- we set the / route serving content from nginx default location
- in the dockerfile we use the multistep approach.. we need to copy the default.conf file inside
- only the nginx step is different from signle container app prod dock file

```
FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /usr/share/nginx/html
```

### Lecture 127 - A FIX

- now our react app uses react-router... the default.conf of nginx websrv that will serve bundled content needs one more line `try_files $uri $uri/ /index.html;` that basically sends all routes to index.html (single page app)

### Lecture 128 - Cleaning Up Tests

- in client (crea-react-app autogenerated) test it tests App component rendering. our component is doing async axios backend calls so we need to do proper async friendly testing (using moxios). for now we jist erase test contents so that it passes alwways

### Lecture 129 - Github and Travis CI Setup

- we follow the submodule path to add a nested repo in our course repo for deployment purpose
  _ cp our complex folder away
  _ create a local repo,ad,commit
  _ create github repo. push to github
  delete temp complex folder../
  _ delete complex folder from course
  _ commit and push to course repo
  _ add a submodule to course local repo. in couser root folder run `git submodule add git@github.com:achliopa/multi-docker myCode/complex` \* add , commit push master repo
- we navigate to travis ci to link to our new multi-docker repo
- in our dashboard we sync account and enable travis in our new repo
- we need a .travis.yml file

### Lecture 130 - Travis Configuration Setup

- in the travis file we will:
  _ specify docker as dependency
  _ build test version of react project (we could add tests for worker and api server)
  _ run tests
  _ build prod versions of all projects
  _ push all to docker hub
  _ tell Elastic Beanstalk to update

```
sudo: required
services:
  - docker

before_install:
  - docker build -t achliopa/react-test -f ./client/Dockerfile.dev ./client

script:
  - docker run achliopa/react-test npm test -- --coverage

after_success:
  - docker build -t achliopa/multi-client ./client
  - docker build -t achliopa/multi-nginx ./nginx
  - docker build -t achliopa/multi-server ./server
  - docker build -t achliopa/multi-worker ./worker
```

### Lecture 131 - Pushing Images to Docker Hub

- we need to login to docker-cli
- we ll put the docker login command in .treavis.yml hidding our username and password from common view (will be passed as travis env params)
- travis -> muulti-docker project -> settings we add environment vars. DOCKER_ID DOCKER_PASSWORD
- add login to .travis.yml `- echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_ID" --password-stdin` we retreive the password from env params and pass it to stdin sending it to the next command with pipe. next command uses password from stdin
- being logedin we just have to push our images to dockerhub (our account)

```
  # takes those images and push them to docker hub
  - docker push achliopa/multi-client
  - docker push achliopa/multi-nginx
  - docker push achliopa/multi-server
  - docker push achliopa/multi-worker
```

- we need to push to github to ttrigger travis to test our flow so far (should see images on dockerhub). its a success

## Section 11 - Multi-Container Deployments to AWS

### Lecture 133 - Multi-Container Definition Files

- we ll pull the images from dockerhub and push them to AWS EB for deploy
- in single container app we puched the project with the dockerfile to EB. EB sees thatwe have adockerfile and builds and runs the image.
- in our multicontainer app we have multiple containers with each one having its Dockerfile
- AWS EB doens not know which one to run
- we ll add one more AWS specific config file in our project teling AWS how to run our project 'Dockerrun.aws.json' this file looks like docker-compose.yml
- docker-compose is meant for dev environments. it defines how to build images and sets their interconnections
- dockerrun does not need to build images. images are already build. we have container definitions secifying the images to use and where to pull them from

### Lecture 134 - Docs on COntainer Definitions

- elastic beanstalk does not know how to run containers
- when we tell AWS EB to host our containers it uses Amazon Elastic Container Service (ECS)
- in ECS we create files called 'task definitions' with instructions on how to run a single container. these files are similar to the _container definitions_ we will write in 'Dockerrun.aws.json'
- to customize Dockerrun file we need to read about [AWS ECS task definitions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) -> task definition parameters -> container definitions

### Lecture 135 - Adding Container Definition in Dockerrun

- we add 'Dockerrun.aws.json' in project root
- we specify its version
- we add our containeDefinitions as an arra of config objects
- in the config obj we specify the name of the container,
- we spec the image to use (AWS ECS understands from syntax we are refering to dockerhub so it pulls it from the dockerhub)
- we spec the hostname for the running container in the app virtual private network in the EB.
- we mark if the container is essential. at least one showuld be marked as essential. if it is essential and it crashes all others will be stopped

```
{
	"AWSEBDockerrunVersion": 2,
	"containerDefinitions": [
		{
			"name": "client",
			"image": "achliopa/multi-client",
			"hostname": "client",
			"essential": false,

		}
	]
}
```

### Lecture 137 - Forming Container Links

- for nginx we dont add hostname. no container in the group needs to look out and connect to it. same holds for worker
- nginx is essential as if it fail noone can access the app
- nginx needs portmapping as in compose as it is the connection to the outside world
- portmapping is set as an array of mappings

```
			"portMappings": [
				{
					"hostPort": 80,
					"containerPort": 80
				}
			]
```

- in nginx we add one more param 'links' to set the link to the other containers in the group
- in dockercompose interconnection between containers was set automatically based on their names(hostnames) but in AWS ECS it needs to be se explicitly `"links": ["client","server"]`
- links in container definitions need to be specified in one end (the comm originator) as links are unidirectional.
- links use the container name not the hostname
- it is recommended to validate json using online tools before deploy'

### Lecture 138 - Creating the EB environment

- we go to AWS => ElasticBeanstalk => create new app => give name (multi-docker) => create => actions => create environment => web server env => select => base config, platform , preconfig platform, choose 'Multi-container Docker' => click create env
- we will use 2 official images from dockerhub for data storage (postgrs and redis)
- we gave specified nothing on .travis.yml or dockerrun file for them
- this is a discussion of architecture on seeting data storage inside of containers

### Lecture 139 - Managed Data Service Providers

- in dev environment we run the data services as containers
- in production environment:
  _ all our business logic(API server, worker daemon, nginx router and nginx web content server with react prob build files) will run in AWS EB(elastic beanstalk) instance.
  _ Redis will run in AWS Elastic Cache \* Postgres DB will run in AWS Relational Database Service (RDS)
- why use external dedicated AWS services for data storage?
  _ we use general data services not docker specific
  _ AWS Elastic Cache: automaticaly creates and maintains (production grade) Redis instances for us, very easy to scale, built in logging and maintenance, better OTB security than our custom logic, easy to migrate \* AWS realtional Database Service (RDS): same advanatages like fo AW Elastic Cache + automatice rollbacks and backups
- Automatic DB backups are not easy. auto rollback to backups on failure is not trivial to implement on your own
- in a next project will use Postgres and Redis in containers in aproduction environment

### Lecture 140 - Overview of AWS VPC and Security Groups

- we want to be able to connect our instance in the AWS EB Instance to the AWS RDS instance (postgres) and AWS EC Instance (Redis). By default these serices can't talk to each other
- we need to set the connection ourselves.
- when we created our EB instance it was created in a specific region (data center) 'eu-central-1'
- in each of these regions we get a VPC (Virtual Private Cloud). a private network so that any service or instance we create is isolated only to our account.
- so when we create an instance only our account has access to that
- VPC is used to apply security rules and to connect different services we create on AWS
- we get one VPC by default created for our account in any region (AWS data center)
- our instances are assigned to the VPC nearest to our local ip unless programmatically directed otherwise
- from services dashboard we go to VPC. => we click your vpcs and see our default vpc. we note thte id
- we switch to another region and see our default vpc for that region. it has a different id
- after starting our services we have them running (by default) to our default vpc of our closest region
- to make our different services talk to each other inside the vpc we need to set a 'security group' (Firewall Rules)
  _ allow any incoming traffic on Port 80 from any IP
  _ allow traffic on port 3010 from IP 172.0.40.2 (custom rules)
- our EB instance has a security group created that accepts conenction on prot 80. beign in ourdefault region VPC we can click security groups and see the rules for our running EB instance. in inbound rules er see it is accepting http requests in port 80- from any source, outbound rules allow anything
- TO allow intercom between our services we will create a new security group and attach all thre AWS instances (EB,EC,RDS) adding a rule that says allow any communication between instances that belong to this security group

### Lecture 141 - RDS Database Creation

- (being in our default region) we search for rds in services => close modal => click create database => postgreSQL => (click enable options for free tier usage) => next => we leave all default only set master username and password same as our dockercompose values and db instance identifier 'multi-docker-postgres'. if we choose another usr/password we need to pass the m in config file => next => we put the instance in our default vpc leave the rest default => we set a db name (we use the same as in dockercompose file) => leave the rest default and click create db

### Lecture 142 - ElasticCache Redis Creation

- in our default region => services => ElastiCache => Redis => Create => (We get a cluster) => Set up some settings
  _ name: multi-docker-redis
  _ node type: => t2 => cache.t2.micro
  _ replicas: none
  _ subnet group name : redis-group
  _ vpc id : our defualt
  _ subnets : select all
- click create

### Lecture 143 - Creating a Custom Security Group

- we go back to vpc => security groups (we have one more created by rds) => we create a new one => name it and add description , use default vpc =. create
- we see ti in the list => we go down to rules (we need to allow comm inside this group) => inbound Rules => add rule (type:custom tcp, protocol: tcp, port range: 5432-6379, source: sg-dsds|multi-docker) => save
- we need to assign this security roup to services

### Lecture 144 - Applying Security Groups to Resources

- first we do EC (redis) +> serivces => elasticcache => redis => select instance => modify => vpc groups edit => select also multi-docker => save => modify
- do rds => service => rds => instances => select our postgres instance => scroll down to details section => modify => network and security => security group => add multi-docker => continue +> select apply immediately in scheduling => modify db instance
- do eb => services => elasticbeanstalk => our instance => configuration => instances => modify => ec2 security groups => add multi-docker => apply

### Lecture 145 - Setting Environment variables

- we need to set a number of environment variable in our custom inages production config files to connect to the outer services in other AWS instances like we did in compose file for dev environment
- we go to services => eb => our instance => configuration => software => modify => environment properties => add env properties (not hidden) . if we want them hidden we hsould try AWS secrets manager
  _ REDIS_HOST: our elastic instance url (elasticcache => our instance => primary endpoint)
  _ REDIS_PORT: 6379
  _ PGUSER: <user we set in RDS config>
  _ PGPASSWORD: <passwoird we set in RDS configuration>
  _ PGHOST: go to services => RDS => instances => our instance => connect +> get enpoint and cp it
  _ PGPORT 5432 \* PGDATABASE: the anme we gave to the db at rds configuration
- apply
- In Elastibeanstalk the env variables we set are added to all containers created inside

### Lecture 146 - IAM Keys for deployment

- our production images are now on dockerhub. we will tell AWS EB (from travis yaml file) to go and pull the images and deploy them
- we ll sent all the project to EB but the only file it needs to do the deploy is the Dockerrun.aws.json
- in our signel container travis.yml file we added deploy configuration for EB and a set of keys to allow travis to get access to EB and copy files (we did not expose them travis pulled them from his env vars we set)
- we need new keys for our new instance. we go to services => IAM => USERS => add user ->name it, set programatic access => next => attach existing policies directly => filter by beanstalk =?> select all => create.
- cp access key and secret to travic ci repo(multi-docker)env variables (settings) as AWS_ACCES_KEY and AWS_SECRET_KEY

### Lecture 147 - Travis Deploy Script

- we finish off travis.yml adding the deploy config (almost identical to the single container app)
- for bucket name and path we go to services => S3 => (find bucket)

```
deploy:
  provider: elasticbeanstalk
  region: eu-central-1
  app: multi-docker
  env: MultiDocker-env
  bucket_name: elasticbeanstalk-eu-central-1-448743904882
  bucket_path: docker-multi
  on:
    branch: master
  access_key_id: $AWS_ACCESS_KEY
  secret_access_key:
    secure: $AWS_SECRET_KEY
```

- we commit and push to github our project to trigger build test and deploy

### Lecture 148 - Container Memory Allocations

- with a successful deploy in travis we got o aws ed instance (we see an error)
- it comlains that we didnt specify an option called memory. we need this when we use dockerrun and multiple containers
- eb needs it to know how much memeory to allocate in each container. we add a mem option to each container definition in dockerrun file
- we add `"memory": 128` to all 4.
- we commit and push to master on github to trigger the build

### Lecture 149 - Verifying Deployment

- if sthing wernt wrong and EB instance is not healthy goto Logs => request logs (last 100lines)
  logs are for all containers running
- we hit the url and OUR APP IS RUNNINGGG!!!

### Lecture 150 - A quick App Change

- we do a small change and see redeploploy

### Lecture 152 - Cleaning UP AWS Resources

- aws EB -> delete application
- delete rds no snapshot
- delete redis
- go to vpc -> security groups -> multi-docker -> security groups action -> delete
- delete iam users

## Section 12 - Onwards to Kubernetes!

### Lecture 153 - The Why's and What's of Kubernetes

- in our previous lulti container application we had 4 different containers running in the same Elastic beanstalk Instance at the same time
- scaling this app would force us look into themore resource intencive service the worker. we would like to spawn more instances of it to handle load
- scaling strategy for elastic beanstalk creates more machines or more copies of elasticbeanstalk instance. in that sense when we scale we duplicate all our containers in the EB instance.
- so our scaling scheme is suboptimal
- kubernetes allwo us to control which container goes in each node (VM or physical) while the Master node orchestrates the cluster controlling what each node does.
- Nodes + Master form a CLuster
- The approach is much like Docker Swarm
- a load balancer directs the requests to our app to the nodes
- Kubernetes:
  _ WHat: System for running many different containers over multiple different machines
  _ Why: When we need to run many different containers with different images

### Lecture 154 - Kubernetes in Development and Production

- In development enviornment we use kubernetes with a program called minikube (CLI)
- minikube sets up a tiny kubernetes cluster on our local machine
- in production we usually make use of managed solutions. AWS EKS (Elastic Container Service for Kubernetes) or GKE (Google Cloud Kubenetes Engine) set up a Production Kubernetes Cluster for us
- We can set a DIY Kubenretes Cluster ourselves
- On our local development machine:
  _ minikube: will setup and manage a VM (single node) to host our containers (used only in developement)
  _ kubectl: is used to interact withthe node and manae the containers inside (used also in production)
- TO setup kubernetes on our local machine:
  _ Install Kubectl (CLI for insteraction with our master)
  _ Install a VM driver virtualbox (to make a VM that will be our single dev node) \* Install minikube (runs a single node on that vm)
- For linux
  _ update Ubuntu
  `sudo apt-get update sudo apt-get install -y apt-transport-https`
  _ install virtual box
  `sudo apt-get install -y virtualbox virtualbox-ext-pack`
  _ install kubectl
  `// sudo apt-get update && sudo apt-get install -y apt-transport-https curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add - echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list sudo apt-get update sudo apt-get install -y kubectl`
  _ install minikube
  `curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.30.0/minikube-linux-amd64 && chmod +x minikube && sudo cp minikube /usr/local/bin/ && rm minikube` \* check installation
  `minikube start kubectl api-versions`

### Lecture 156 - Mapping Existing Knowledge

- we start minikube `minikube start` and check status `minikube status` all seem ok
- we run `kubectl cluster-info` and get

```
Kubernetes master is running at https://192.168.99.100:8443
CoreDNS is running at https://192.168.99.100:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

- our goal is to take the multi-client image (published at docjerhub) from previous section and get it running on our local Kubernetes CLuster running as a container
- we will use our docker-compose knowledge on kubernetes
- in our multi-docker project our compose file had a number of services specified
- each docker-compose service entry:
  _ can optionally get docker-compose to build an image
  _ represents a container we want to create \* defines networking requirements(ports)
- in kubernetes to run the services/containers in teh cluster:
  _ k8 expects all images to already been built
  _ we have one config file per object we want to create \* all networking has to be set up manually
- in kubernetes there is no auto networking between contianers in teh cluster . all have to be setup
- to get our simple 'multi-client' container running on our local Kubernetes CLuster
  _ make sure our image is hosted on dockerhub
  _ make one config file to create teh container \* make one config file to setup networking

### Lecture 157 - Adding COnfiguration Files

- we check docker hub and confirm our custom image is there
- we create a new project folder `simplek8s`
- in our project folder we add a config file 'client-prod.yaml' and write it down (we ll expalin it later)

```
apiVersion: v1
kind: Pod
metadata:
  name: client-pod
  labels:
    component: web
spec:
  containers:
    - name: client
      image: achliopa/multi-client
      ports:
        - containerPort: 3000
```

- we add a second config file for networking setup 'client-node-port.yaml' and write it down

```
apiVersion: v1
kind: Service
metadata:
  name: client-node-port
spec:
  type: NodePort
  ports:
    - port: 3050
      targetPort: 3000
      nodePort: 31515
  selector:
    component: web
```

### Lecture 158 - Object Types and API Versions

- like in docker-compose andAWS EB in kubernetes we use config files to make contianers
- however in kubernetes a config file is used to create objects. Example Object Types are:
  _ StatefulSet
  _ ReplicaController
  _ Pod: used to run a container
  _ Service: set up networking
- Objects serve different purposes: running a container, monitoring a container, setting up networking etc
- our config files will be fed to the kubectl CLI tool. kubectl interprets these files and creates objects
- objects are 'things' that exist in a k8s cluster
- 'kind' param specifies the type of object we w ant to make
- 'apiversion' each apiVersion defines a different set of objects we can use in a config file.
  _ v1: componentStatus, Endpoints, Namespace, configMap,Event,Pod
  _ apps/v1: ControllerRevision, StatefulSet

### Lecture 159 - Running Containers in Pods

- when we started minikube on our local machine it started a VM using Virtualbox.
- we refer to this VM as Node. this node is use by kubernetes to run a number of objects
- a fundamental object type is the Pod. when we run 'client-pod.yaml' it will create a Pod inside the k8 node
- A Pod is a grouping of containers with a common purpose
- in K8s we cannot run a bare container in teh cluster without some overhead. Pod is the smallest unit od deployment
- the requirement of Pods is that at least one container will run inside them. in that sense AWS EB is a sort of Pod. id a container failed (eg worker) the rest would function.
- within a Pod we group containers that have a very closely coupled relationship (e.g a postgres container (primary container) with a logger and a backup-manager container (support containers)) and must be executed together. if the primary fails the others have no reason to be.
- in 'client-pod.yaml' we specify a pod that will run 1 container named client (name is used for logging).
  we spec the image the container is mad eon (from dockerhub)
- with ports param in container spec in pod config we say we want to expose port 3000 to the outside world (containerport)
- port 3000 is exposed in in the config file of the nginx server that runs in the container so we need to export it

### Lecture 160 - Service Config Files in Depth

- in 'client-pod.yaml' we also specify metadata of the pod like its name (used in logging) and labels used in networking
- in 'client-node-port.yaml' config file we specify a 'Service' object type
- A 'Service' object type sets up networking in a Kubernetes cluster
- For Services objects there are 4 subtypes
  _ ClusterIP
  _ NodePort : exposes a container to the outside world (only good for dev purposes)
  _ LoadBalancer
  _ Ingress
- in our service config file. we spec a subtype of NodePort. so we make a NodePort Service to be able to access from our local machine browser the container (client) in the cluster.
- We DO NOT use NodePort on production environments
- Inside our Local Machine
  _ We have a Kubernetes Node VM created by Minikube `minikube start`
  _ every kubernetes node in a cluster has a service called 'kube-proxy' that serves as the nodes only window to the outside world
  _ a request coming to the node (e.g from the LM browser) goes to the kube-proxy that looks into it and routes it to services or pods in the node
  _ the NodePort service takes the request and forwards it to the Pod (client-pod) running the multi-client container which in its config file exposes port 3000
- In the NodePort config there is no reference to the pod by name. it uses a selector by label with tag 'component' so we refer by label tag to the pod
- So NodePort with do the routing to any pod with label key value pair of 'component: web' label key-vlaue names are arbitrary
- what the port spec does

```
  ports:
    - port: 3050
      targetPort: 3000
      nodePort: 31515
```

- is it exposes the selected pods targePort (3000) to the outside world (it should be exposed in the pod as well)
- ports is an array of mappings
  _ port : is a port that an other Pod in the node can use to connect to the selected Pods in our case to multi-client Pod (we dont use)
  _ targetPort : is the port in the selected Pod that we want to open traffic to (should be same as containerPod) \* nodePort : is the port we will use from outside the nod e(e.g our LM browser) to access the targetPort. if we dont assign it it will be randomly assigned in range (30000 - 32767)
- the strange port num is a reason it is not used in produduction

### Lecture 161 - Connecting to Running Containers

- we are now ready to load our config files in the kubernetes cluster and try to access our container from browser
- to feed our config file we will use the kubectl tool using the apply command `kubectl apply -f <filename>`
  _ kubectl: cli we use to change our Kubernetes cluster
  _ apply: change the current configuration of our cluster
  _ -f: we want to specify a file that has the config changes
  _ <filename>: path to the file with the config
- to apply our config files:
  _ we start the cluster with `minikube start`
  _ we run `kubectl apply -f client-pod.yaml`. the pod/client-pod gets created
  _ we run `kubectl apply -f client-node-port.yaml`. service is created
  _ we print the status of all our running pods with `kubectl get pods`. it printsout a list of all our pods in the cluster with thier status
- Print the status of all running Pods: `kubectl get pods`
  _ kubectl: CLI we use to change our kubernetes cluster
  _ get: we want to retrieve information about a running object \* pods: specifies the object type we want to get information about
- in the pod list the READY number is X/Y X is the running instances and Y the ones we requested
- In the same way we printout the status of running services: `kubectl get services`
- we get 2 enbtries: our NodePort and a ClusterIP which is a cluster inner service
- our NodePort service has a cluster IP and an external IP (null). in PORTs we have <port>:<nodePort>:<protocol>
- as we expect (no external IP assigned) if we hit localhost:<nodePort> from our LM brwser we see nothing
- the external IP is a property assigned by minikube that started the cluster (VM). we can get it with `minikube status` or `minikube ip`. we visit up and it runs although with errors (no backend running)

### Lecture 162 - The Entire Deployment Flow

- after we run the client-pod.yaml that creates the pod we confirm with `kubectl get pods` that is is running. if we run `docker ps` in our machine we see a lot of containers running on of them is the multi-client that runs in our pod. we kill it. if we rerun `docker ps` it is still there... it was restarted. with `kube get pods` we confirm it as RESTARTS index went from 0 to 1
- In a realistic k8s deployment scenario we have:
  _ a number of images in dockerhub waiting to be deployed
  _ one or more config files (like client-pod.yaml)
  _ a Master node running a number of programs to manage the cluster
  _ a number of nodes (VMs or physical machines) with docker installed
- We asusme that:
  _ one of the images in docker hub is 'multi-worker'
  _ we have config files (deployment files) that specify we want 4 copies of 'multi-worker' to run \* on our master a program 'kube-api-server' is running and monitors the cluster
- the course of actions is:
  _ config file is passed to master (kubectl apply ...)
  _ master registers our request in a list of responsibilities (a todo list ) like multi-worker 0/4 (4 requested 0 running)
  _ kube-api-server reaches out to the available nodes (3) and asks them to run a number of instances of multi-worker image (depending on their load)
  _ each node runs docker. the copy of docker in the node will reach out to dockerhub and get the image. copy it and store it in the local cache
  _ each node will use the image to create containers according to master order and run them
  _ kube-api-server confirms that the requesten number of instances is up and running \* master is continuously polling the nodes to confirm that he has the instances requested running. if one fails it is restarted. he can use whatever resource available (nodes) to meet its goal

### Lecture 163 - Imperative vs Declarative Deployments

- Kubernetes key points:
  _ Kubernetes is a system to deploy containerized apps
  _ Nodes are individual machines (or VM's) that run containers (slaves)
  _ Masters are machines (or vm's) with a set of programs to manage nodes
  _ Kubernetes didn't build our images - it got them from somewhere else
  _ Kubernetes (the master) decided where to run each container - each node can run a dissimilar set of containers
  _ To deploy something, we update the desired state of the master with a config file \* The master works constantly to meet our desired state
- Minikube is a scaled down kubernetes cluster with 1 node (VM)
- We can have control on where our containers will be deployed (which node)
- The term desired state refers to the list of responsibilities
- There are 2 ways to approach deployment:
  _ Imperative Deployments (Discrete Commands): 'Do exactly these steps to arrive at this container setup'
  _ Declarative Deployments (Guidance): 'Out container setup should look like this. Make it happen'
- Imperative Deployment imaginary scenario
  _ Goal: We need 3 containers
  _ Actions: check state => issue commands to alter state => achieve goal
- Imperative Deployment imaginary scenario (expert mode):
  _ Goal: Update x containers to v1.23
  _ Actions: WTF?? too much containers too much work to do
- Declarative Deployment imaginary scenario:
  _ Goal: I need to update multi-worker to v1.23
  _ Actions: 1) Change config file t0 spec multi-workerv1.23 => Send config file to kubernetes. (Master takes car of all changes, we dont care about current state or anything)
- A lot of docs in stack overflow or kubernetes docs recommend issuing commands into kubectl (imperative approach)
- Kubernetes (kubectl) has commnads to suport declartive approach. Always strive to take the declarative approach. at least in production

## Section 13 - Maintaining Sets of Containers with Deployments

### Lecture 164 - Updating Existing Objects

- our goal in previous section was: 'Get the multi-client image running on our local K8s Cluster running as a container'
- our new goal is: 'Update our existing pod to use the multi-worker image' AKA find the existing pod and update the image it uses
  _ Imperative Approach: Run a command to list out current running pods => run a command to update the current pod to use a new image
  _ Declarative Approach: Update our config file that originally created the pod => throw the updated config file into kubectl
- in the Declarative Approach Kubernetes does the follwoing:
  _ Updated config file is applied to kubectl (name of object, type/kind of object, updates e.g image name)
  _ kubectl sends it to master
  _ master looks into the config file and inspects the name and kind properties.  
   _ master looks into all running services in the cluster. \* if he finds a running object with same name and kind it updates it instead of creating new
- Name and kind are the unique identifying tokens for updates

### Lecture 165 - Declarative Updates in Action

- we mod 'client-pod.yaml' doing the following change `image: achliopa/multi-worker`
- we pass it in kubectl `kubectl apply -f client-pod.yaml` reply is 'pod/client-pod configured
  '
- after update pod restarts
- to 'Get detailed info about an object' in the cluster: `kubectl describe <object type> <object name>`
  _ describe: we watn to get detailed info
  _ <obj type>: specifies the type of object we want to get info about \* <obj name>: name of object
- the printout is hefty but we see it pulled our new image

### Lecture 166 - Limitations in Config Updates

- we mod the containerPort in 'client-pod' and reapply change (we expect an error because of NodePort dependency). indeed our run breaks
- what is says though is that we are allowed to modify/update certain properties only in Pod objects. in essence only the image
- to wrkaround it we will use another type of object that allows us to update any property

### Lecture 167 - Running Containers with Deployments

- the object we will use is 'Deployment': Deployment maintains a set of of identical pods, ensuring that they have the correct config and that the right number exists
- Deployment is a superset of Pod. putting them in comparison
- Pod:
  _ Runs a single set of containers
  _ Good for one-off dev purposes \* Rarely used directly in production
- Deployment:
  _ Runs a set of identical pods (one or more)
  _ Monitors the state of each pod, updating as necessary
  _ Good for running containers in dev
  _ Good for running containers in production
- When createa a Deployent object it gets attached to it a Pod Template
- a Pod Template is a block of config file (how any pod create in his deployment should look like)
- if we make a change to the Template Pod in the Deployment object. Deployment will attempt to mod an existing Pod or kill it and replace it

### Lecture 168 - Deployment Configuration Files

- we ll make a config file for deployment object

```
apiVersion: apps/v1
kind: Deployment
meta:
  name: client-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      component: web
  template:
    metadata:
      labels:
        component: web
    spec:
      containers:
        - name: client
          image: stephengrider/multi-client
          ports:
            - containerPort: 3000
```

### Lecture 169 - Walking Through the Deployment Config

- apiversion and type(kind) are known concepts
- as metadata we pass onlu name
- in spec section in template section we specify the template to be used for every single pod in the deployment. in fact it is identical to a Pod object configuration
- apart from template the other properties of Deployment spec are replicas and selector:
  _ replicas: num of different pods this deployment should make
  _ selector: selector looks like the Service selector. why we need it? Deployemnt does not direclty make pods. it goes to kubernetes (master) and asks it to create them. in order to managethem after they get created from kubernetes he needs a selector to find them and get a handle on them. in our case he uses the key vlaue pair of component: web

### Lecture 170 - Applying a Deployment

- we have the pod from previous section running in our cluster.
- we want to delete it befoere we apply deployment
- Remove an object: `kubectl delete -f <config file>`
  _ delete: we want to delete a running object
  _ -f: specifies that we want to feed in a file to say what to delete \* <config file>: path to config file that created the object
- the hook to the object to delete is in the name and kind of the object speced in the config file
- it is an unavoidable imperative approach of cluster state update
- in our case `kubectl delete -f client-pod.yaml`
- the delete command is like 'docker stop'. it gives 10sec for normal stop and then kill
- we apply deployent `kubectl apply -f client-deployment.yaml`
- we can use `kubectl get deployments` to see deployments status.
  _ DESIRED: how many pods we want
  _ CURRENT: num of running pods
  _ UP-TO-DATE: up to latest configuration pods
  _ AVAILABLE: pods ready to accept connections

### Lecture 171 - Why Use Services?

- we ll try to connect from host to the container running the app in the cluster. we hit 192.168.99.100:31515 success.
- we run `kubectl get pods -o wide` we get more info like ip (in the cluster) of the pod and the node it is running in
- each pod we create gets its own IP in the node(VM)
- if the pod gets deleted and restarted or updated. it is very possible that it will get a new ip
- by using services that export ports of pods based on selectors create a dns like capability in the node. a layer of abstraction over the ip as the hooks are based on name and not on ip which is volatile

### Lecture 172 - Scaling and Changing Deployments

- we will now do the change in containerPort in the deployment config file. a change we could not do in the config-pofd file. we expect to cause a pod replacement. also due to NodePort service port mappings we expect to not be able to visit the app.we save and apply
- if we run `kubectl get pods` we see that there are no restarts. the id of the pod is new
- we scale up the replicas in the deployment config from 1 to 5. we save and reapply
- 4 additional pods are created.
- we change the image int he pod template of deployement config and reapply. deployment adapts (not instantly) some new are created and some old are dumped.

### Lecture 173 - Updating Deployment Images

- when a new version of an iage becomes available we want to be able to deploy the changes. the course of actions is the following:
  _ Change deployment to use multi-client again
  _ update the multi-client image, push to Docker Hub \* Get the deployment to recreate our pods with the latest version of multi-client
- we bring deployment config file in its original state and apply it to the cluster

### Lecture 174 - Rebuilding the CLient Image

- we follow the flow of previous section to rebuild test and publish our image to dockerhub
- in complex folder in client/src/App.js we make a change and commit/push
- we build the image locally `docker build -t achliopa/multi-client .`
- we push the built image to docker-hub `docker push achliopa/multi-client`

### Lecture 175 - Triggering Deployment Updates

- geting the deployent to recreate our pods with latest version is challenging
- there a lot of blog posts on different ways to convicne kubernetes to re pull an image without changing the image tag in config
- to trigger an update we said we have t mod the config file and reapply it
- if we reapplya config with no changes kubectl will reject the file
- _First option to trigger deployment updates:_ Manually delete pods to get the deployment to recreate them with the last version. (Deleting pods manually is silly)
- _Second option to trigger deployment updates:_ Tag build images with areal version number and specify the version in the confgi file. (Adds an extra step in teh production deployment process)
- _Third option to trigger deployment updates:_ Use an imperative command to update the image version the deployment should use (Uses an Imperative Command)
- in the last 2 options we need to tag our image before pushing to hub with a verison
- We cannot pass the version inthe config file as env variable. We are not allowed to use environment vars in k8s config files
- in second optionw e need to commit the new updated config file. also we use the docker build command in the CI environemtn (Travis)
- Third option is the least bad

### Lecture 176 - Imperatively Updating a Deployments image

- the steps we will follow: tag the image with aversion number and push it docker hub -> run a 'kubectl' command forcing the deployment to use the new image version
- we switch to comple/client
- we run `docker build -t achliopa/multi-client:v5 .`
- we push it dockerhub `docker push achliopa/multi-client:v5`
- in simplek8s project we run the following command
- Imperative command to update image: `kubectl set image <object_type> / <object_name> <container_name> = <new_image_to_use>`
  _ set: we want to change aproperty
  _ we want to change the image property
  _ <object_type>: type of object
  _ <object_name>: name of object
  _ <container_name> name of the container we are updating (get this from config file)
  _ <new_image_to_use>: full name of image to use with tag
- the command is `kubectl set image deployment/client-deployment client=achliopa/multi-client:v5`
- we apply it and check in browser

### Lecture 177 - Multiple Docker Installations

- as we said before nodes (VMs) run docker. so they host a docker client (cli) and a docker-server
- master talks with docker cli in the cluster nodes passing commands
- in our local machine we have 2 copies of docker (docker running on local machine) and docker running in teh VM node (Virtualbox) created from minikube
- docker cli on host by default connects to docker-server on the host
- we can configure docker client on our machine to talk to the docker-server inthe cluster node (VM) on our machine

### Lecture 178 - Reconfiguring Docker CLI

- if we want our local docker-cli runningon host to communicate witht he docker server running in the node(in minikube) we should run `eval $(minikube docker-env)`
- this only configures the current terminal window. temporary
- if we want every terminal we open to have this feat we can run the comand in the terminal at window open time (see docs)
- `minikube docker-env` prints out a num of enb variables. with eval we temporary set them in the host machine (the machoine running the terminal)

### Lecture 179 - Why Mess with Docker in the Node?

- Why do it?
  _ use all the same debugging technique we learned from Docker
  _ Manually kill containers to test kubernetes cluster ability to heal \* delete cached images in teh node
- I can get logs from inside the container. `docker logs <cont ainer id>`
- we can execute secondary commands inside the container `docker exec -it <container id> <command>`
- a lot of docker commands are available in kubectl
- we can kill all in node with `docker system prune`

## Section 13 - A Multi-Container App with Kubernetes

### Lecture 180 - The Path To Production

- we will take our complex fibonacci calculating app and deploy it in kubernetes
- the architecture we will use in development will use the minikube node.
- the architecture will comprise of
  _ an 'Ingress Service' accepting and routing traffic from outside workd
  _ a 'ClusterIP Service' with a Deployment of multi-client pods
  _ a 'ClusterIP Service' with a Deployment of multi-server pods
  _ a 'ClusterIP Service' with a Deployment of multi-worker pod (single)
  _ a 'ClusterIP Service' with a Deployment of Redis pod (single)
  _ a 'ClusterIP Service' with a Deployment of Postgres pod (single)
  _ a Postgres PVC
  _ com routes (port maps) between ClientIP services
- ClusterIP services replace the NodePort Services
- PVC = Persistent Volume Claim
- Our path to Production will be:
  _ Create Config files for each service and deployment
  _ Test locally on minikube
  _ Create Gtihub/Travis flow to build images adn deploy
  _ deploy app to cloud provider

### Lecture 182 - A quick Checkpoint

- we cp our complex project from previous section as baseline in a new project folder 'complexk8s'
- we run docker-compose.yml to see that all is ok \*we make sure our docker-cli points to the local machine) `docker-compose up --build`
- to make sure all is running we repeat `docker-compose up`
- we test in 'localhost:3050'

### Lecture 183 - Recreating the Deployment

- we remove docker-compose file and dockerrun. we dont need them anymore. we will rely on kubernetes to do these tasks
- also we remove travis.yml. we will build it from scratch
- we delete nginx folder. we will use k8s ingress service instead
- we add a folder named k8s for our config files (11 files)
- we add 'client-deployment.yaml' in k8s. we want 3 pods running multi-client image. the content is the same as in previous section

### lecture 184 - NodePort vs ClusterIP Services

- Services: sets up networking in a Kubernmetes Cluster
  _ CluserIP: exposes a set of pods to other objects in the cluster
  _ NodePort: exposes a set of pods tothe outside world (only good for dev purposes)
- ClusterIP is much more restrictive. it allows access to everything in the cluster to the exposed port of a pod (group of pods)
- access from the outside world is provided by Ingress Service

### Lecture 185 - The ClusterIP Config

- in k8s we add 'client-cluster-ip-service.yaml' and add configuration
- configuration is almost identical to NodePort

```
apiVersion: v1
kind: Service
metadata:
  name: client-cluster-ip-service
spec:
  type: ClusterIP
  selector:
    component: web
  ports:
    - port: 3000
      targetPort: 3000
```

- we use a selector with a ky:val pair for the target of the service
- we do port maping from target to port in teh cluster. there is no nodePort (it doesn not allow external access anyhow)

### Lecture 186 - Applying Multiple Files with Kubectl

- we first delete our existing deployment in minikube.
- we find it `kubectl get deployments`
- se delete it `kubectl delete deployment client-deployment`
- we delete the service as well `kubectl get service` => `kubectl delete service client-node-port`
- to apply multiple config `kubectl apply -f k8s` passing the folder where all our files are located

### Lecture 187 - Express API deployment config

- we add 'server-deployment.yaml' and 'server-client-ip-service.yaml'
- our multi-server image and container/pod will listen on port 5000 (hardcoded in express listen)
- deployment config is identical with client
- inthe config we will later pass in the env vars to connet to datastorage

### Lecture 188 - Cluster IP for Express API

- same as client

### Lecture 189 - Combining Config into Single Files

- to avoid having a ton of config files we can combine them
- eg combine a Service and Deployment for a set of pods
- we add a 'server-config.yaml' file to combine server related config. we cp the context of the 2 files in it. the trick is to separate them with '---' 3 dashes. also both config texts shoud follow standard yaml indentation rules
- usually we group per service(pod group)

### Lecture 190 - The worker deployment

- same job. 1 config file (deployment.. like the others (1 replica)
- no need to assign ports no one connects to it. we spec ports only when we need incoming traffic to pod. no cluster ip service this time

### Lecture 191 - Reapplying a batch of Config files

- we apply all config files `kubectl apply -f k8` from project root folder
- we check status. `kubectl get pods`
- we check a pod log `kubectl logs <pod name>`

### Lecture 192 - Creating and Applying Redis Config

- we add 2 more config files for redis pod. same as others (deploymen clusterip) 1 replica redis image port 6379

### Lecture 193 - Postgres Config

- same thing . 1 replica postgres image, 5432 port
- we apply the files

### Lecture 194 - The need for Volumes with Databases

- PVC = Persistent Volume Claim
- volume is the same concept as in docker
- Postgres Deployment containes a Pod. Pod contains a Postgres Running Container. Postgres Container inside has its isolated Container FS
- Postgress takes data and stores them in a DB located on an FS
- Container FS is NOT persistent. when we kill the container it is gone....
- DBs have to be persistent
- to solve this problem. Postgrs or any other DB container HAS to use a 'Volume' or mapped storage space ont he host machine for its DB data
- we have to make sure that if postgrs container is restarted it will have access to the same volume on home machine
- if we scale on postgres contianers we will have 3 processes accessing the same volume (BEWARE OF RACE CONDITIONS) its a NONO. we need to add more configuration for redundancy etc

### Lecture 195-197 - Kubernetes Volumes vs Persistent Volumes vs Persistent Volume Claims

- _Volume_ meaning:
  _ In generic container terminology: some type of mechanism that allows a container to access a filesystem outside itself
  _ In Kubernetes: an _Object_ that allows a container to store data at the pod level
- in kubenetes we can write a config file for a volume
- In kubernetes there are 3 object types for volumes: \* _Volume_: it creates a data storage pocket existing or attached to a particular pod. it can be accessed by any container in the pod. if container gets killed or restarted it still has access to the volume. If Pod dies or is deletd, the Volume gets deleted with it \* _Persistent Volume Claim_: available Persistent Volume for us to claim and use. It can be already reserved and available (Statically Provisioned) in the cluster or it can be made on the fly with new space reservation (Dynamically Provisioned). completely independent of pods or containers \* _Persistent Volume_: it creates a data storage pocket outside the pod. it is not associated to any container or any pod. if container or pod accesing it restarts no problem. it persists
- we use the last 2 for data that needs to be persistent
- the analogy between Persistent Volume and PVC is like shopping for an HDD for a custom PC build. there are options advertised, a sales person is getting our request and handling the storage. some options instances are ready to use. some are made on demand in a backend factory and sent to the sales person.
  _ the PC build is the POd configuration
  _ The storage options billboard is a PVC (persistent volume claim)
  _ The salesman is Kubernetes master
  _ The ready made storage options are Statically Provisioned Persistent Volumes \* The backend factory of storage is the Dynamically Provisioned Persistent Volume
- Persistent Volume: actual HDD segments available for use
- Persistent Volume Claim: advertised storages that can be made from existing storage segments already reserved in the cluster (Statically Provissioned) or new reserved space (Dynamiclly Provissioned)

### Lecture 198 - Claim Config Files

- Claim is an advertisement of the storage options a pod can use as Persuistent Volumet to cover its persistent storage needs
- we write our own config file `database-persistent-volume-claim.yaml`

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: database-persistent-volume-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

### Lecture 199 - Persistent Volume Access modes

- a Volume Claim is not an actual instance of storage
- our config under the spec says that if we attach this claim to a pod. kubernetes must try to find an instance of storage of size (e.g a slice of the host machine HDD that meets the requiremnets (1GB) that supports the specified access modes
- The available access modes are:
  _ ReadWriteOnce: can be used by a single node
  _ ReadOnlyMany: Multiple Nodes can read from this \* ReadWriteMany: Can be read and written to by many nodes
- there are other options that we dont use and leave them as defaults

### Lecture 200 - Where does Kubernetes allocates pErsistent Storage?

- an important (the most important) option is storage class 'storageClassName' where we pass the provisioner and some sub options
- when we hanbdle the claim to k8s to be fulfilled:
  _ when we run it on our machine (dev) k8s evaluates the available storage options. on a dev machine it uses a slice of HDD. there are not other options
  _ on cloud deployents and providers there are a ton of options we can use (Google Cloud Persistent Disk, Azure Disk, AWS Block Store etc)
- if we run `kubectl get storageclass` we will see all the different options k8s have on our machine to use for persistent storage
- there is always a default or standard option
- the provisioner or how k8s decides how to use this storage is in 'k8s.io/minikube-hostpath' which essentially means a path on host of minikube
- [Storage Classes Options](https://kubernetes.io/docs/concepts/storage/storage-classes/)

### Lecture 201 - Designating a PVC in a Pod Template

- in our postgres deployment config file we update the template so that when a pod is created is requesting the claim
- the template spec section becomes

```
spec:
      volumes:
        - name: postgres-storage
          persistentVolumeClaim:
            claimName: database-persistent-volume-claim
      containers:
        - name: postgres
          image: postgres
          ports:
            - containerPort: 5432
          volumeMounts:
          	- name: postgres-storage
          		mountPath: /var/lib/postgresql/data
          		subPath: postgres
```

- this volumes section allocates the storage for the pods created by this template using the claim we created. the volume gets a name
- in the container we mount the volume by its name. also we spec wher e in teh container fs will be mounted.
- we use subPath to set a directory in the host map location 9actual storage where data will be located (foldername) this is required by postgres

### Lecture 202 - Applying a PVC

- we apply configs the usual way
- we can see pv instance with `kubectl get pv` and pvc with `kubectl get pvc`

### Lecture 203 - Defining Environment Variables

- in our previous complex project we saw that multi-worker and mulit-server containers need a set of env vars to connect to the postres db and redis cache
- redis is accessed by both while postgres only be server
- REDIS_PORT, PGUSER, PGDATABASE, PGPORT are constants easy to set ina config file
- REDIS_HOST and PGHOST are constants as well. we need to provide a hostname for the redis or postgres pod client-ip-service. the name of the client-ip-service is the hostname
- PGPASSWORD. we dont want to expose it plain in our config file and expose it

### Lecture 204 - Adding Env Variables to Config

- in `worker-deployment.yaml` in container definition we add an env: key with an array of key value pairs for the env vars

```
          env:
            - name: REDIS_HOST
              value: redis-cluster-ip-service
            - name: REDIS_PORT
              value: 6379
```

- we do the same for server

```
            - name: PGHOST
              value: postgres-cluster-ip-service
            - name: PGPORT
              value: 5432
            - name: PGDATABASE
              value: postgres
            - name: PGUSER
              value: postgres
```

### Lecture 205 - Creating an Encoded Secret

- we tackle PGPASWORD. to keep it secret we will use a new kubernetes object type: Secrets
- Secrets: securely stores a piece of information in the cluster, such as a database password, api key
- we ll use an imperative command to create the secret object and not a config file.
- why? to keep it secret. if we created a config file the secret would be in plain text in the file in d anger of getting exposed
- we have to rerun the comand in any environment we deploy our cluster
- Creating a Secret: `kubectl create secret generic <secret name> --from-literal <key>=<value>`
  _ create: imperative command to create a new object
  _ secret: type of object we are going to create
  _ generic: type of secret
  _ <secret name>: name of secret for later referencein a pod config
  _ --from-literal: we are going to add the secret info into this command, as opposed e.g from a file
  _ <key>=<value>: key-value pair of the secret info like in an env var
- for our PGPASSWORD we use `kubectl create secret generic pgpassword --from-literal PGPASSWORD=postgres_password`
- apart from genreic there are 2 other types of secrets. 'docker-registry' and 'tls'
- secret vwas created. we verify it with `kubectl get secrets` data 1 means we have 1 keyvalue pair
- we have overriden defualt pasword so we need to pass the secret as env ironment variable

### Lecture 206 - Passign Secrets as Env Variables

- in 'server-deployment.yaml' we add

```
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: pgpassword
                  key: PGPASSWORD
```

- instead of value we use valueFrom. we spec the name of the secret and the key we want to use. a secrets objectt kan have multiple key value pairs
- we need to makse sure postgres knows about the pasword we use (not the default)
- we add an env property in container in pod template so that default password gets overwritten

```
          env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: pgpassword
                  key: PGPASSWORD
```

### Lecture 207 - Environemtn Variables as Strings

- kubernetes complains when we attemp to pass values in key value pairs as nnumbers.
- env variable values must be passed in as strings
- all we have to do is wrap numbers in quotes

## Section 15 - Handling Traffic with Ingress Controllers

### Lecture 208 - Load Balancer Services

- we move to the part where we allow traffic from outside world come in our cluster
- to do that we will use other type of Services.
  _ LoadBalancer: Legacy way of getting network traffic in to a cluster
  _ Ingress: Exposes a set of services to the outside world
- A LoadBalancer does two separate things inside a cluster:
  _ it allows access to only one specific set of pods
  _ it works in the background reaching out to the cloud provider creating a loadbalancer (app or classic LB) creating a link between that and the service inside the cluster
- to create one we use a config file of kind: Service and type: LoadBalancer
- in our app we have 2 sets of pods we want external access to so Loadbalancer does not do the trick

### Lecture 209 - A Quick Note on Ingress

- In kubernetes there a re many different implementations of ingress
- we will use 'Nginx Ingress'. more specificaly we will use 'ingress-nginx' a community led project. [github link](https://github.com/kubernetes/ingress-nginx) OFFICIAL KUBERNETES project
- we DO NOT use 'kubernetes-ingress' a project led by nginx company [github repo](https://github.com/nginxinc/kubernetes-ingress)
- setup of 'ingress-nginx' changes depending on the environment (local, GC,AWS,Azure)
- for the course weare going to setup ingress nginx on local and in GC

### Lecture 211 - Behind the Scenes of Ingress

- in our app we are writing config files where we specify the desired state of our aplication in deployment object config files.
- thiese files are passed to the deployment running obeject that update their state
- deployment is like a controller of state
- in kubernetes a controller is any object that works continuously to achieve a desired state
- Ingress is itself a type of cotnroller object. we will config it with a set of rules and it will try to achieve them
- Precondition: The current app state is: No routing at all
- we write down ingress routing rules to get traffic to services => pass them over to the Controller for our Ingress Service. => controller works to make sure these routing rules are setup
- Postcondition: A Pod running nginx handles routing in our specified way (New state)
- THE INNERS OF INGRESS SERVICE: Ingress Config file => passed to Ingress Controller =>A type of Service accepting incoming traffic is created. => incoming traffic to cluster is routed by this new service to the desired service
  _ Ingress Config: Object that has a set of configuration rules describing how traffic should be routed
  _ Ingress COntroller: watches for changes to the ingress and updates the 'thing' that handles traffic
- all this runs in our node
- the kind of thing or serice created doing the routing in ubiquous. we dont know yet exactly what it is. We see it as a combo of Ingress Controller + thing that does the routing

### Lecture 213 - More Behind the Scenes of Ingress

- Ingress-Nginx in GoogleCloud Architecture is like.
  _ Incoming Traffic comes to [Google Cloud LoadBalancer](https://cloud.google.com/load-balancing/).
  _ GC Load Balancer sends traffic in the cluster to a LoadBalancer Service
  _ The LoadBalancerService is attached to a Deployment running a nginx-controller/nginx pod
  _ A set of Ingress Config rules are applied to the Deployment \* The Nginx pod applies the rules and routes traffic to the ClusterIP services inside the cluster according to our specs
- Loadbalancer service is the one we talked about before..
- when we set ingress-nginx another pod is created in our cluster (deployment cluster-ip service combo) running the 'default-backend pod' this does a set of helathchecks on the cluster
- this architecture raises a question. why not do it ourselves adding a loadbalcer service and a deployment of custom nginx inour cluster
- the nginx image used in ingress-nginx has code specific for running in a k8s cluster. one thing that it does is thait routes directly to the service pods bypassing the cluster-ip-service to do things like sticky sessions
- [learn more on ingress](https://www.joyfulbikeshedding.com/blog/2018-03-26-studying-the-kubernetes-ingress-system.html)

### Lecture 215 - Setting Up Ingress Locally

- to set it up we follow the docs on [github on ingress-nginx]https://kubernetes.github.io/ingress-nginx/deploy/()
- we execute the mandatory command `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml`
- we check the yaml in browser. it is a (complex) config file
  _ it sets up a namespace
  _ it sets up some unknow types of objects
  _ it sets up a deployment of 'nginx-ingress-controller'
  _ a numberof ConfigMaps
- we go to minikube section and follow steps: `minikube addons enable ingress`
- we check GC config file for ingress (its short and sweet LoadBalancer service)

### Lecture 216 - Creating the Ingress Config

- in complex project when we set the nginx router we routed / paths to Client (React) and /api reqs to Server (express). our config file will set up the same
- we name it 'ingress-service.yaml'

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-service
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - http:
        paths:
          - path: /
            backend:
              serviceName: client-cluster-ip-service
              servicePort: 3000
          - path: /api/
            backend:
              serviceName: server-cluster-ip-service
              servicePort: 5000
```

- we set 2 routing rules in spec. directing paths to cluster-ip services
- the annotations used are another type of metadata
- the first tells that the ingress controlleer type we will use is nginx
- the second that we will chop of the /api part of path before sending it to the upstream service (rewrite-target)
- the rules map path to backend services and ports
- we apply the file in kubectl

### Lecture 217 - Testing Ingress Locally

- its time to test our app in browser. we get the ip of our cluster `minikube ip`
- browser complains on non secure...
- nginx tries to force anyone coming to the app to use secure connection
- ingress nginx uses a dummy certificate 'Kubernetes Ingress Controller Fake Certificate'
- untrusted certifiacates are not tolerated by chrome

### Lecture 218 - The Minikube Dashboard

- in kubernetes in development env we can use a dashboard `minikube dashboard`
- we get a nice production grade dashboard to monitor our cluster
- Replicas and Replica Sets are deprecated. use Deployments instead
- dashboard can be used to add yaml files of issue commands but is not recommended.

## Section 16 - Kubernetes Production Deployment

### Lecture 219 - The Deployment Process

- Create Github Repo
- Tie Repo to Travis CI
- Create Google Cloud Porject
- Enable Billing for the Porject
- Add deployment scripts to the repo
- this project will invlove alittle amount of billig from google to use their cloud kubernetes engine

### Lecture 220 - Google Cloud vs AWS for Kubernetes

- Why Google Cloud?
  _ Google created Kubernetes
  _ AWS only recently got Kubernetes support
  _ far, far easier to poke around Kubernetes on Google Cloud
  _ Excellent documentation for beginners
- we get a console that feels like running the cluster locally

### Lecture 221 - Creating a Gihub Repo

- same drill like before submodule to our course repo 'achliopa/multi-k8s'

### Lecture 222 - Linking the Github Repo to Travis

- same drill. visit travis and enable it on repo (aftere synching account)

### Lecture 224 - Creating a Google Cloud Project

- we log in to our google cloud account
- we ll use the console to create a new project
- we create anew project named 'multi-k8s'

### Lecture 225 - Linking a Billing Account

- we select our new project. we need to enable billing to the project
- we click billing and get nothing... maybe because our project is linkekd to a managed domain in gsuites

### Lecture 226 - Kubernetes Engine Init

- we ll attempt to make a new kubernetes cluster
- in the project dashboard we click 'kubernetes engine'
- it takes some time (refresh page)

### Lecture 227 - Creating a Cluster with Google CLoud

- we click 'create cluster'
- we select standard cluster
- we give a cluster a name 'multi-cluster'
- we select a zone close to our location 'europe-west3'
- at 'node pools' we spec each Vm that will added to our k8s cluster as node
- we choose 3 nodes
- the machine type we choose 1vCPU w/ 3.75 GB memory
- we can choose a small one with 1.7GB but it moght break
- no advanced settings
- click 'create'

### Lecture 229 - Kubernetes Dashboard on Google Cloud

- once our cluster is created we click on its name and see info on its configuration
- we see info on the nodes (we can change the specs)
- we click on workloads (nothing yet no deployed app)
- services is also empty
- applications is about 3rd party SW running on our cluster
- config is about secrets
- storage is about cloud storage (persistent volumes)
- in googe cloud our default storage provider is called GC persistent disk (gce-pd) we see it in storage classes .more on [google cloud persistent disk](https://cloud.google.com/persistent-disk/)

### Lecture 230 - Travis Deployment overview

- the most complex travis.ml file we built so far
  _ install google cloud sdk cli
  _ configure the SDK with our Google Cloud auth info
  _ login to docker CLI
  _ build the test version of multi-client
  _ run tests
  _ if tests are successful, run a script to deploy newest images
  _ build all our images, tag each one, push each to docker hub
  _ apply all configs to the k8s folder \* imperatively set latest images on each deployment
- travis will reach out to our kubenetes cluster and make changes
- Google Cloud SDK CLI is our way to remotely interact and update our cluster
- we have to configure the cli
- if we want to mode our our cluster we just change our config files and apply it

### Lecture 231 - installing the Google CLoud SDK

- we start writing down the .travis.yml file in project root.
- we add usual start

```
sudo: required
services:
	- docker
```

- before install
- we download and install google-cloud-sdk and install it locally in travs ci instance on vm /dev/hull
- we apply an additional env configuration on travis ci using source
- we install kubectl command using gcloud sdk
- we also have to authorize ourselves on google cloud (in AWS we created an IAM user and used the credentials in travic ci repo setting as env vars) we ll use a json file with some info to enable authentication. of course sensitive data will be non visibvle in the file (travis env vars again)

```
before_install:
  - curl https://sdk.cloud.google.com | bash > /dev/null;
  - source $HOME/google-cloud-sdk/path.bash.inc
  - gcloud components updata kubectl
  - gcloud auth activate-service-account --key-file service-account.json
```

### Lecture 232 - Generating a Serice Account

- to do it:
  _ create a service account
  _ download service account credentials in a json file
  _ download and install the travis CLI
  _ encrypt and upload the json file to our travis account \* in travis.yml, add code to unencrypt the json file and load it into GCloud SDK
- json file has sensitive data DO NOT expose it to outsiders (DO not commit) encrypt it and store it to travis CI using Travis CLI
- in GC Platform we go to IAM & Admin => Service Accounts => Create Service Account =>
- enter a name (travis-deployer) => Create => select a project role (kubernetetes Engine => KE Admin) => Continue => Create Key => Key Type (JSON) => Save
- A private key has been saved on our local machine as a JSON File (DO NOT DO NOT EXPOSE IT

### Lecture 233 - Running Travis CLI in a Container

- we need to download and install travis cli on our dev machine
- it requires ruby to run locally (In linux we have it)
- we can do it in a container (get a docker image that has ruby inside, use travis cli there)
- the flow of commands on the vm or locally:
  _ docker run -it -v \$(pwd):app ruby:2.3 sh
  _ gem install travis --no-rdoc --no-ri
  _ gem install travis
  _ travis login
  _ <copy json into volumed directory so we can use it in the container>
  _ travis encrypt-file service-account.json
- the run script maps volume to surrent dir (make sure to run it outside repo)
- gem install installs natively (using extra packages) therefore we CANNOT use alpine
- we run 2 first commands

### Lecture 234 - Encrypting a Srvice Account File

- we login to travis `travis login`
- our json file is in the pwd (the folder where we run the command)
- we rename it to 'service-account.json'
- we cd in container to app `cd /app` and run the encrypt script we need also to pass in the repo `travis encrypt-file service-account.json -r achliopa/multi-k8s`
- we get some info on terminal that tells us what to do add the command to our travis.yml in beffore install section (before all other commands in section)
- an encrypted file is generated. in our script folder. we move it to our repo project root (it neds to be commited so it included on the push to be used by Travis) DELETE the unencrypted before commit
- we remove the image from host

### Lecture 235 - More Google Cloud CLI Config

- first step of travis config file make is done
- we now have to configure the google sdk with our google cloud info
- the openssl step we added unencrypts the service-acount json file in the travis CI vm
- gccloud auth step uses it to activate the account ang give the travic ci vm user admin rights to control the kubernetes engine cluster deployment `- gcloud auth activate-service-account --key-file service-account.json`
- we now need to tell gccloud on which project (full project id) and zone (go to kubernetes engine to see what we set before as zone) it is working on

```
  - gcloud config set project multi-k8s-222621
  - gcloud config set compute/zone europe-west3-a
```

- we need to set the name of the cluster `- gcloud container clusters get-credentials multi-cluster`

### Lecture 236 - Running Tests with Travis

- we login to docker in the script (done it before) using travis project env vars `- echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin`
- add env vars in travis project
- 2 encrypted keys are alrerady there Our google cloude service account keys
- we now have to build our test version and runt he tests `- docker build -t achliopa/multi-client-test -f ./client/Dockerfile.dev ./client`
- we add our test script like before

```
script:
  - docker run achliopa/multi-k8s-client-test npm test -- --coverage
```

### Lecture 237 - Custom Deployment Providers

- to do the actual deployment we will use a separate script from the travis.yml file
- we will use it to build our production images, push them to dockerhub, apply all config files in teh k8s folder, use the imperative command to set the latest image in deployment
- in AWS EB we did the deployment in the deploy section of the travis.yml
- there we used a provider. a predefined build script provided by AWS EB for travis
- such thing does not exist in Travis for kubernetes engine so we need to build it on our own

```
deploy:
  provider: script
  script: bash ./deploy.sh
  on:
    branch: master
```

- in 'deploy.sh' we will write our script
- we add 'deploy.sh' in project root folder

### Lecture 238 - Unique Deployment Images

- in the shell script file we build the production images

```
docker build -t achliopa/multi-client -f ./client/Dockerfile ./client
docker build -t achliopa/multi-worker -f ./worker/Dockerfile ./worker
docker build -t achliopa/multi-server -f ./server/Dockerfile ./server
```

- being loged in to dockerhub (in Travis CI VM) we push them

```
docker push achliopa/multi-client
docker push achliopa/multi-worker
docker push achliopa/multi-server
```

- next step is to apply all config files in k8s (kubectl is available in travis vm through gcloud sdk) `kubectl apply -f k8s`
- we imperatively set latest images in each deployed service `kubectl set image deployments/server-deployment server=achliopa/multi-server`
- if we do not explicitely set tags to the images. the last one we upload to hub is tagged as latest
- so when we pull from dockerhub (in case of implicitely naming) we have the latest so why to update imperatively?
- in aprev lecture we said to use imperative update command we need to expliciterly tag images

### Lecture 239 - Unique tags for Built Images

- we dont want to manually tag images in each build. we want to tag them automatically
- in every build we will tag it as latest and with GIT_SHA a unique identifier of the HEAD in branch
- we can seee this number in a folder of our git enabled project running `git rev-parse HEAD`
- each commit produses a SHA id. we can see them with `git log`
- our uploaded image in the dockerhub will carry 2 tags: latest and SHA id
- the build command additng the 2 tags

```
docker build -t achliopa/multi-client:latest achliopa/multi-client:$GIT_SHA  -f ./client/Dockerfile ./client
```

- our image in dockerhub wiil look like 'achliopa/multi-client:latest' 'achliopa/multi-client:\$SHA'
- our implerative command to use the latest image (latest build)

```
kubectl set image deployments/server-deployment server=achliopa/multi-server:$SHA
```

- when we pass a specific SHA in our imperative command kubernetes will update and use it
- \$SHA is the actual tag of the HEAD.
- This approach helps a lot in debugging
  _ Broken App! what codebase are we running?
  _ deployment is running mulit-client:78jf54gf5j14(SHA)
  _ git checkout 78jf54gf5j14
  _ debug the app locally knowing the exact code running in production
- Knowing which codebase we are running is INVALUABLE for debugging
- why apply latest tag? if a new engineer runs `kubectl apply -f k8s` without knowing about our cuurent version. he will get a deployment of the latest codebase without having to worry about specifying a SHA
- our deployment config files do not spec a version so by defualt gets latest image

### Lecture 240 - Updating the Deployment Script

- we expose the GIT_SHA as env variable in teh travis yaml to use it in the deploy script
- we add in .travis.yml the part tht sets the env variable to use in our deployment scripts
- we also disable prompts in google CLI as env param so that it does not ask for input as we do it in automated way and we cannot provide imput

```
env:
  global:
    - SHA=$(git rev-parse HEAD)
    - CLOUDSDK_CORE_DISABLE_PROMPTS=1
```

- our final deployment script is

```
docker build -t achliopa/multi-client:latest -t achliopa/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t achliopa/multi-worker:latest -t achliopa/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker build -t achliopa/multi-server:latest -t achliopa/multi-server:$SHA -f ./server/Dockerfile ./server
docker push achliopa/multi-client:latest
docker push achliopa/multi-worker:latest
docker push achliopa/multi-server:latest

docker push achliopa/multi-client:$SHA
docker push achliopa/multi-worker:$SHA
docker push achliopa/multi-server:$SHA

kubectl apply -f k8s
kubectl set image deployments/client-deployment client=achliopa/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=achliopa/multi-worker:$SHA
kubectl set image deployments/server-deployment server=achliopa/multi-server:$SHA
```

### Lecture 241 - Configuring the GCloud CLI on Google Console

- as we did locally on our machine we have to create asecret also on the google cloud for PGPASSOWRD
- we ll use an imperative command
- we need access to akubectl instance on the googlecloud cluster
- we click activate cloud shell on top right corner in cloud console kubernetes engine->cluster
- in the terminal we issue our commands (doing configuration like in our travis file before issuein gthe command)

```
gcloud config set project multi-k8s-222621
gcloud config set compute/zone europe-west3-a
gcloud container clusters get-credentials multi-cluster
```

### Lecture 242 - Creating a Secret on Google Cloud

- we check our connection to the cluster from the gcloud terminal using `kubectl get pods`
- we issue `kubectl create secret generic pgpassword --from-literal PGPASSWORD=postgres_password` in terminal . our secret is created
- we test it in Kubernetes engine => configuration

### Lecture 243 - Helm Setup

- before we deploy our app in production we need one last piece
- in our local kubernetes project we set up the ingress service based on the nginx project
- we added this service to minikube
- we need to do sthing similar in gcloud.
- we go to ingress-nginx docs to see how to do it for the gcloud. in the docs of this project we go to deployment section. we can do it followin the commands by we choose to use Helm
- [Helm](https://github.com/helm/helm) is a program we can use to administer 3rd party SW ina kubernetes cluster
- We use iut issuing commands to Helm client that goes to Tiller Server
- the easy way is to use `kubectl apply`
- Helm is composed of 2 parts. Helm cli tool + Tiller server running in Kubernetes cluster
- we gotto helm quickstart guide => installng helm from script. we cp the 3 commands in our clusters terminal

```
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get > get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh
```

- we dont run helm init yet (in gcloud we need more configuration)

### Lecture 244 - Kubernetes Security with RBAC

- the docs say that in gcloud it install RBAC by default
- the pod running tiller will attempt to do changes in the configuration of our cluster
- RBAC = Role based Access Control
  _ Limits who can access and modify objects in our cluster
  _ Enabled on G Cloud by default \* Tiller wants to make changes to our cluster, so it needs to get some permissions set
- User Accounts: identifies a person administering our cluster
- Service Accounts: identifies a 'pod' administering a cluster
- ClusterRoleBinding: Authorizes an account to do a certain set of actions across the entire cluster
- RoleBinding: Authorizes an account to do a certain set of actions in a 'single namespace'
- As admin users we can use kubectl in the cluster and do changes. user accout is the thing giving us this priviledge
- A service account belongs to a pod
- Accouns per se does not give privildeges alone
- Its the Bindings that bind accounts to roles . the roles have the proviledges (authorization)
- In a cluster some namespaces are created automatically (default, kube-public, kube-system)
- we can isolate clkuster resources in different namespaces
- we need to give tiller server running in apod authorization to do changes in cluster. so what we need is Service Account (atach it to tiller pod) and ClusterRoleBinding (allow to do changes to entire cluster)

### Lecture 245 - Assigning Tiller a Service Account

- `kubectl create serviceaccount --namespace kube-system tiller` create a new service account called tiller in the kube-system namespace
- `kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller` create a new clusterrolebinding with the role 'cluster-admin' and assign it to service account 'tiller'
- we put our serviceaccoun in a namespace (existing)
- cluster-admin is a preset role
- after setting the roles we init helm `helm init --service-account tiller --upgrade`
- we cannow use help to install new services

### Lecture 246 - Ingress-Nginx with Helm

- we go to [github doc](https://kubernetes.github.io/ingress-nginx/deploy/#using-helm)
- we install it using helm with RBACV enabled `helm install stable/nginx-ingress --name my-nginx --set rbac.create=true`
- we run the commanbd in gcloud shell
- we get the default server, config maps etc
- we get logs on the resources created and config

### Lecture 247 - The result of Ingress Nginx

- we refress the kubernetes engines -> cluster page and go to workloads tab
- we have an ingress controller (it runs the config file) and a default backend doing health checks. we cann assign express js routes to theis backend to check the healt of our app
- in services tab we see a Loadbalancer with 2 IPs (we use them to access our project) and a cluster-ip for backend
- we click the ips and get 404
- in network services in dashboard menu -> load balancing we see the gcloud load balancer created for us. we sse its ip and the backend instances (3 cluster nodes) it gives acces to

### Lecture 248 - Finally Deployment

- all we have to do is commit our work and push it to github
- we see in travis ci
- our massive build PASSESSS.

### Lecture 250 - Verifying Deployment

- we check in dockerhub our repos
- we check the tags.. we see that both tags are there (build and latest)
- we refresh page in our cluster and see workloads. we see our pods running
- we can click services seing the pods and their stats
- in services we have the ingres service with the rules we set in the config yaml
- in configuration we have our secret the secret of service account we created for tiller pod and config maps
- in storage we have the persistent storage
- we hit the external ip and see the app. IT WORKS

### Lecture 251 - A Workflow for Changing in Prod

- what we will do
  _ checkout a branch
  _ make changes
  _ commit changes
  _ push to github branch
  _ create a pr
  _ wait for tests go green
  _ merge the pr
  _ see changes appear on app in prod
- travis tests any branch. deploys only mater
- we checkout devel branch `git checkout -b devel` do change commit and push to `git push origin devel`
- in github we got o repo and add apull request
- we compare the devel with master to merge
- add a comment and create pull request. wait tests to go green
- we merge and wait travis to do the job... we revisit our app in browset to verify changes
- to fix the https thing we will need to buy a domain name (have it)

## Section 17 - HTTPS Setup with Kubernetes

### Lecture 254 - HTTPS Setup Overview

- to add HTTPS support in our cluster app we will setup interaction between our Kubernetes cluster and a cerification authority called LetsEncrypt
- LetsEncrypt is a services that gives free certificates
- the interaction between CA (Ceritification Authority) and our cluster is like:
  _ K8s Cluster => LetsEncrypt: Hi, i own multi-k8s.com can you give me a certificate that says I do?
  _ LetsEncrypt => K8s Cluster: I dont't believe you. I am going to make a request to multi-k8s.com/.well-known/9194941 if you own it you'll reply \* LetsEncrypt => K8s Cluster: ok, you check out. here's a certificate that's good for 90 days
- we dont need to implement this interaction. we will install a plug in with helm to our cluster to handle this for us.

### Lecture 256 - Domain Name Setup

- we need to make our domain name to point to our cluster ip
- we do it in dns settings of our provide adding an A record to a k8s subdoimain

### Lecture 257 - Cert Manager Install

- the service we will add to kubernetes to do the crtification handshake is [Cert Manager](https://github.com/jetstack/cert-manager) we go to docs => getting started => installing cert-manager with helm
- we run the hel install in our gcould tshell

```
helm install \
    --name cert-manager \
    --namespace kube-system \
    stable/cert-manager
```

- add `export PATH="$(echo ~)/helm-v2.6.0/linux-amd64:$PATH"` in .bashrc

### Lecture 258 - How to wire up Cert Manager

- The way Cert Manager works:
  _ It uses 'Certificate' an object describing details about the certificate that should be obtained
  _ It uses 'Issuer' an object telling CertManager where to get the cerificate from
  _ It sets up infrastructure to respond to HTTP challenge
  _ gets the certificate stores it in a secret
- the cert manager helm install command creates a deployment with apod a service account for it and a clusterrolebinding
- it will set a route handler to answer the verification request
- to make it work we need to set 2 objects with config files. Ceritificate and issuer
- these are object types
- we can use multiple issuers. we can use a staging version and a production version
- the certificate object uses details that normally apear in a certificate
- the certificate will contain kubernetes secrets for some details
- secrets is the way CertManager stores the certificate in teh cluster
- we also need to reconfigure our ingress nginx to use the certificate

### Lecture 259 - Issuer Config File

- in k8s folder we add 'issuer.yaml' which is a config file

```
apiVersion: certmanager.k8s.io/v1alpha1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: 'athchliopanos@gmail.com'
    privateKeySecretRef:
      name: letsencrypt-prod
    http01: {}
```

- kind and apiVersion are specific to the certmanager
- in 'server' we pass the api server that certmanager will interact with
- the secret key has nothing to do with the secret generated from the certificate. its a secretkey that letsencrypt sends to the cluster as part of the verification process
- `http01: {}` is a reference to the verification protocol that is http

### Lecture 260 - Certificate Config File

- in k8s we create 'certificate.yaml'

```
apiVersion: certmanager.k8s.io/v1alpha1
kind: Certificate
metadata:
  name: k8s-agileng-io
spec:
  secretName: k8s-agileng-io
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  commonName: agileng.io
  dnsNames:
    - agileng.io
    - k8s.agileng.io
  acme:
    config:
      - http01:
          ingressClass: nginx
        domains:
          - agileng.io
          - k8s.agileng.io
```

- the secretname is generated by certmanager after we gets the secret from the issuer
- issuerRef is a ref to the issuer we want to use (name of object) and its type
- commonName is the scope where the certificate is valid (our domain
- dns Names are the domains where it is valid (an array)
- in acme we set a config of protocol and domains. domains setup is same as dnsnames

### Lecture 261 - Deploying Changes

- we need to mod our ingress config file but AFTER we generte the cerificate
- certmanager onle we deploy changes will see the new objects and start the handshake to get the certificate
- we commit merge to master andwait to deploy and see the services in the cluster at gcloud console

### Lecture 262 - Verifying the Certificate

- after the deployment finishes and we see that services are up and running we go to cluster shell
- we issue the command `kubectl get certificates` we see our certificate in place in teh cluster !!!
- we can see more info with `kubectl describe certificates`
- in the events we see that our domain is verified
- we issue `kubectl get secrets` and expect to see the new secret from the cerificate

### Lecture 263 - Ingress Config for HTTPS

- we need to reconfigure the ingress file 'ingress-service.yaml'
- in annotations we add `certmanager.k8s.io/cluster-issuer: 'letsencrypt-prod'`
- this informs ingres we will use acertificate from lets-encrypt
- we make sure that ingress nginx forces users to use https. we need to redirect them from http to https `nginx.ingress.kubernetes.io/ssl-redirect: 'true'`
- we update our spec section adding a tls section

```
  tls:
    - hosts:
        - k8s.agileng.io
      secretName: k8s-agileng-io
```

- in rules we add `host: k8s.agileng.io` over http. we need a host entry for every domain we bind our certificate to
- we need to redeploy and test

### Lecture 264 - It worked

- after deploy ingress service exposes the domain routes it serves

# 2017Group1
## Course
- Course Name: Software Evolution Project
- Course Code: DAT265
- Period: H17
## Members
- Christopher Åkersten
- Daniel Eineving
- Jimmy Berlin
- Johan Andersson
- Mikael Lönn

# Development
It is setup using docker. Set up docker container with backend/fronted/postgres:
> docker-compose up -d --build

Get into the container:
> docker exec -it sverea bash

Run whatever you want, use the makefile for aid

## Docker Setup Details
Configured based on two files:
- **docker-compose.yml** configures 2 containers, one for the DB and one for the backend and frontend to run in that has access to the DB. 
- **Dockerfile** specifies the docker image, and derives from the image maven:3.5.0-jdk-8, so maven and java 8 is installed. It further installs make, node and npm.

To help the setup a makefile exists with commands to be run in or out of the container for installing, testing, running and so on. Set up the container by `docker-compose up -d --build`. Skip the build option if not needed to save time. Get into a bash shell in the container by `docker exec -it sverea bash`.

Here you can do whatever you want, but to aid you there is a makefile with some commands, for example:
> make db-init   (initzialises the database)

> make install   (installs frontend + backend)

> make client    (runs the frontend web application)

> make backend   (runs the backend)

> make psql      (direct database access)

## DevOps

Travis builds on each push to the repository. If it is to master or develop it further runs sonarqube and pushes it to sonarcloud. Unfortunately _there is an issue scanning typescript files currently_.  Travis further examines every Pull Request.

- Travis https://travis-ci.org/SoftwareEvolutionProject/2017Group1 
- SonarCloud https://sonarcloud.io/organizations/dat265/projects



 ## Dependencies
 JDK 9  
 node 6.9.x  
 npm 3.x.x  
 Angular CLI  

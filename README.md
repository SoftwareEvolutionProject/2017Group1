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

## Development
It is setup using docker. Set up docker container with backend/fronted/postgres:
> docker-compose up -d --build

Get into the container:
> docker exec -it sverea bash

Here you can do whatever you want, but to aid you there is a makefile with some commands, for example:
> make db-init   (initzialises the database)

> make install   (installs frontend + backend)

> make client    (runs the frontend web application)

> make backend   (runs the backend)

> make test      (runs karma frontend test, backend tests to be configured)

### Frontend
 `cd frontend\web`  
 `ng serve`  
 browse to `localhost:4200`  

 ## Dependencies
 JDK 9  
 node 6.9.x  
 npm 3.x.x  
 Angular CLI  
 
 ## CI
 ### Travis
 https://travis-ci.org/SoftwareEvolutionProject/2017Group1/
 
 ### SonarCloud
 Travis automatically runs sonarcube and pushes to SonarCloud on the develop and master branches. See the results here: 
 https://sonarcloud.io/organizations/dat265/projects

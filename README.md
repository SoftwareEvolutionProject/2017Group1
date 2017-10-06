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
Set up docker container with backend/fronted/postgres
> docker-compose up -d --build

Get into the container:
> docker exec -it sverea bash

Rum make commands, for example:
> make db-init

> make install

> make client

> make backend

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

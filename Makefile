install:
	cd /usr/src/app && mvn clean install && cd /usr/src/app/frontend/web && npm install

install-client:
	cd /usr/src/app/frontend/web && npm install

server:
	cd /usr/src/app/backend && mvn package && cd /usr/src/app/backend/target && java -jar backend-1-jar-with-dependencies.jar

client:
	cd /usr/src/app/frontend/web && npm run startdocker

test:
	mvn test
	cd /usr/src/app && mvn test -B && cd /usr/src/app/frontend/web && npm test

init-file: 
	rm -f ./database/init.sql
	cat database/clear.sql database/schema.sql database/views.sql database/functions.sql database/fixtures.sql >> database/init.sql

db-init: init-file
	PGPASSWORD=${POSTGRES_PASSWORD} psql -U admin -h db -p 5432 -d svereadb -f database/init.sql

psql:
	PGPASSWORD=${POSTGRES_PASSWORD} psql -U admin -h db -p 5432 -d svereadb

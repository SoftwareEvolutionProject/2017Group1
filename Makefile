install:
	cd /usr/src/app && mvn clean install

server: install
	cd /usr/src/app/backend && mvn run

client:
	cd /usr/src/app/frontend/src/main/frontend && npm start

test:
	mvn test
	cd /usr/src/app && mvn test -B && cd /usr/src/app/frontend/src/main/frontend && npm test

init-file: 
	rm -f ./database/init.sql
	cat database/clear.sql database/schema.sql database/views.sql database/functions.sql database/fixtures.sql >> database/init.sql

db-init: init-file
	PGPASSWORD=${POSTGRES_PASSWORD} psql -U admin -h db -p 5432 -d sharedev -f database/init.sql

psql:
	PGPASSWORD=${POSTGRES_PASSWORD} psql -U admin -h db -p 5432 -d sharedev 

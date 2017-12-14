BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  username varchar(255) not null,
  email varchar(255) not null,
  password varchar(255) not null
);

CREATE TABLE IF NOT EXISTS token(
  id serial primary key,
  token varchar(255) not null UNIQUE,
  userid INTEGER not null REFERENCES users(id) ON DELETE CASCADE,
  createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  expiresat TIMESTAMP  WITHOUT TIME ZONE DEFAULT now() + INTERVAL '1 hour'
);

CREATE TABLE IF NOT EXISTS customer(
  id serial PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS orderdata(
  id serial PRIMARY KEY,
  customerID INTEGER REFERENCES customer(id),
  date VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS digitalpart(
  id serial PRIMARY KEY,
  customerID INTEGER REFERENCES customer(id),
  name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS orderedpart(
  id serial PRIMARY KEY,
  orderID INTEGER REFERENCES orderdata(id),
  digitalPartID INTEGER REFERENCES digitalpart(id),
  amount INTEGER
);

CREATE TABLE IF NOT EXISTS digitalprintdata(
  id serial PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS magicspairing(
  id SERIAL PRIMARY KEY,
  digitalPrintID INTEGER,
  digitalPartID INTEGER,
  label VARCHAR(200),
  FOREIGN KEY (digitalPartID) REFERENCES digitalpart(id),
  FOREIGN KEY (digitalPrintID) REFERENCES digitalprintdata(id)
);

CREATE TABLE IF NOT EXISTS materialdata(
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  supplierName VARCHAR(100),
  initialAmount FLOAT
);

CREATE TABLE IF NOT EXISTS physicalprint(
  id SERIAL PRIMARY KEY,
  digitalPrintID INTEGER,
  materialID INTEGER,
  materialGrade INTEGER,
  path VARCHAR(200),
  FOREIGN KEY (digitalPrintID) REFERENCES digitalprintdata(id),
  FOREIGN KEY (materialID) REFERENCES materialdata(id)
);

CREATE TABLE IF NOT EXISTS physicalpart(
  id SERIAL PRIMARY KEY,
  physicalPrintID INTEGER,
  orderedPartID INTEGER,
  magicsPartPairingLabel VARCHAR(200),
  FOREIGN KEY (physicalPrintID) REFERENCES physicalprint(id),
  FOREIGN KEY (orderedPartID) REFERENCES orderedpart(id)
);

CREATE TABLE IF NOT EXISTS materialgrade(
  id SERIAL PRIMARY KEY,
  materialID INTEGER REFERENCES materialdata(id),
  reusedTimes INT,
  amount FLOAT
);

CREATE TABLE IF NOT EXISTS materialproperty(
  id SERIAL PRIMARY KEY,
  materialID INTEGER REFERENCES materialdata(id),
  name VARCHAR(100),
  description VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS magicsdata(
  id SERIAL PRIMARY KEY,
  digitalPrintID INTEGER,
  path VARCHAR(200),
  FOREIGN KEY (digitalPrintID) REFERENCES digitalprintdata(id)
);

CREATE TABLE IF NOT EXISTS stldata(
  id SERIAL PRIMARY KEY,
  digitalPartID INTEGER,
  path VARCHAR(200),
  FOREIGN KEY (digitalPartID) REFERENCES digitalpart(id)
);

CREATE TABLE IF NOT EXISTS slmdata(
  id SERIAL PRIMARY KEY,
  physicalPrintID INTEGER,
  path VARCHAR(200),
  FOREIGN KEY (physicalPrintID) REFERENCES physicalprint(id)
);

COMMIT;



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
  date VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS digitalpart(
  id serial PRIMARY KEY,
  customerID INTEGER REFERENCES customer(id),
  name VARCHAR(100),
  stlPath VARCHAR(300),
  cadPath VARCHAR(300)
);

CREATE TABLE IF NOT EXISTS orderedpart(
  id serial PRIMARY KEY,
  orderID INTEGER REFERENCES orderdata(id),
  digitalPartID INTEGER REFERENCES digitalpart(id),
  amount INTEGER
);

CREATE TABLE IF NOT EXISTS digitalprintdata(
  id serial PRIMARY KEY,
  magicsPath VARCHAR(300)
);

CREATE TABLE IF NOT EXISTS magicspairing(
  id SERIAL PRIMARY KEY,
  digitalPrintID INTEGER,
  digitalPartID INTEGER,
  label VARCHAR(200),
  FOREIGN KEY (digitalPartID) REFERENCES digitalpart(id),
  FOREIGN KEY (digitalPrintID) REFERENCES digitalprintdata(id)
);

CREATE TABLE IF NOT EXISTS physicalprint(
  id SERIAL PRIMARY KEY,
  digitalPrintID INTEGER,
  slmPath VARCHAR(300),
  FOREIGN KEY (digitalPrintID) REFERENCES digitalprintdata(id)
);

CREATE TABLE IF NOT EXISTS physicalpart(
  id SERIAL PRIMARY KEY,
  physicalPrintID INTEGER,
  orderedPartID INTEGER,
  magicsPartPairingID INTEGER,
  FOREIGN KEY (physicalPrintID) REFERENCES physicalprint(id),
  FOREIGN KEY (orderedPartID) REFERENCES orderedpart(id),
  FOREIGN KEY (magicsPartPairingID) REFERENCES magicspairing(id)
);

CREATE TABLE IF NOT EXISTS stlfile(
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  digitalPartID INTEGER,
  stlFile BYTEA,
  FOREIGN KEY (digitalPartID) REFERENCES digitalpart(id)
);

CREATE TABLE IF NOT EXISTS magicsfile(
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  digitalPrintDataID INTEGER,
  magicsFile BYTEA,
  FOREIGN KEY (digitalPrintDataID) REFERENCES digitalprintdata(id)
);

CREATE TABLE IF NOT EXISTS physicalpartimage(
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  physicalPartID INTEGER,
  image BYTEA,
  FOREIGN KEY (physicalPartID) REFERENCES physicalpart(id)
);

CREATE TABLE IF NOT EXISTS physicalprintimage(
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  physicalPrintID INTEGER,
  image BYTEA,
  FOREIGN KEY (physicalPrintID) REFERENCES physicalprint(id)
);


COMMIT;



BEGIN;


CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  username varchar(255) not null,
  email varchar(255) not null,
  password varchar(255) not null
);

CREATE TABLE IF NOT EXISTS tokens(
  id serial primary key,
  token varchar(255) not null UNIQUE,
  userid INTEGER not null REFERENCES users(id) ON DELETE CASCADE,
  createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  expiresat TIMESTAMP  WITHOUT TIME ZONE DEFAULT now() + INTERVAL '1 hour'
);

CREATE TABLE IF NOT EXISTS customers(
  id serial PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS orders(
  id serial PRIMARY KEY,
  customerID INTEGER,
  date DATE,
  FOREIGN KEY (customerID) REFERENCES customers.id
);

CREATE TABLE IF NOT EXISTS digitalparts(
  id serial PRIMARY KEY,
  customerID INTEGER,
  name VARCHAR(100),
  stlPath VARCHAR(300),
  cadPath VARCHAR(300),
  FOREIGN KEY (customerID) REFERENCES customers.id
);

CREATE TABLE IF NOT EXISTS orderedparts(
  orderID INTEGER,
  digitalPartID INTEGER,
  amount INTEGER,
  PRIMARY KEY (digitalPartID, orderID),
  FOREIGN KEY (digitalPartID) REFERENCES digitalparts.id,
  FOREIGN KEY (orderID) REFERENCES orders.id
);

CREATE TABLE IF NOT EXISTS digitalprints(
  id serial PRIMARY KEY,
  magicsPath VARCHAR(300),
  FOREIGN KEY (customerID) REFERENCES customers.id
);

CREATE TABLE IF NOT EXISTS magicspairings(
  id SERIAL PRIMARY KEY,
  digitalPrintID INTEGER,
  digitalPartID INTEGER,
  label VARCHAR(200),
  FOREIGN KEY (digitalPartID) REFERENCES digitalparts.id,
  FOREIGN KEY (digitalPrintID) REFERENCES digitalprints.id
);

CREATE TABLE IF NOT EXISTS physicalprint(
  id SERIAL PRIMARY KEY,
  digitalPrintID INTEGER,
  slmPath VARCHAR(300),
  FOREIGN KEY (digitalPrintID) REFERENCES digitalprints.id
);

CREATE TABLE IF NOT EXISTS physicalpart(
  id SERIAL PRIMARY KEY,
  physicalPrintID INTEGER,
  orderedPartID INTEGER,
  magicsPartPairingID INTEGER,
  FOREIGN KEY (physicalPrintID) REFERENCES physicalprint.id,
  FOREIGN KEY (orderedPartID) REFERENCES orderedparts.id,
  FOREIGN KEY (magicsPartPairingID) REFERENCES magicspairings.id
);



COMMIT;



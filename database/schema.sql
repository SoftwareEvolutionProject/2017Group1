BEGIN;


CREATE TABLE IF NOT EXISTS "user" (
  id serial primary key,
  username varchar(255) not null,
  email varchar(255) not null,
  password varchar(255) not null
);

CREATE TABLE IF NOT EXISTS token(
  id serial primary key,
  token varchar(255) not null UNIQUE,
  userid INTEGER not null REFERENCES "user"(id) ON DELETE CASCADE,
  createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  expiresat TIMESTAMP  WITHOUT TIME ZONE DEFAULT now() + INTERVAL '1 hour'
);

CREATE TABLE IF NOT EXISTS customer(
  id serial PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);


COMMIT;



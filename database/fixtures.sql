BEGIN;


INSERT INTO "users"(username, email,password)
VALUES
  ('lee','lee@yahoo.com','lee'),
  ('emma','emma@yahoo.com','emma'),
  ('cate','cate@yahoo.com','cate'),
  ('steve','steve@yahoo.com','steve');

INSERT INTO token(token, userid)
values('testtoken',(select id from "users" where username = 'lee' LIMIT 1));

INSERT INTO customer (name, email) VALUES ('test', 'test');
INSERT INTO customer (name, email) VALUES ('jhon doe', 'example@example.com');

COMMIT;

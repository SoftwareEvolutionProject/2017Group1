BEGIN;


INSERT INTO users(username, email,password)
VALUES
  ('lee','lee@yahoo.com','lee'),
  ('emma','emma@yahoo.com','emma'),
  ('cate','cate@yahoo.com','cate'),
  ('steve','steve@yahoo.com','steve');

INSERT INTO tokens(token, userid)
values('testtoken',(select id from users where username = 'lee' LIMIT 1));

INSERT INTO public.customers (id, name, email) VALUES (1, 'test', 'test');
INSERT INTO public.customers (id, name, email) VALUES (2, 'jhon doe', 'example@example.com');

COMMIT;

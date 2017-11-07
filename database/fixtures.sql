BEGIN;


INSERT INTO "users"(username, email,password)
VALUES
  ('DanielEineving','daniel@eineving.se','danieleineving'),
  ('JimmyBerlin','berlin.jimmy@gmail.com','jimmyberlin'),
  ('MikaelLonn','mickelonn93@gmail.com','mikaellonn'),
  ('ChristopherAkersten','christopher.akersten@gmail.com','christopherakersten'),
  ('JohanAndersson','lol2kpe@gmail.com','johanandersson');

INSERT INTO token(token, userid)
values('testtoken',(select id from "users" where username = 'ChristopherAkersten' LIMIT 1));

INSERT INTO customer (name, email) VALUES ('Testbolag', 'test@testbolag.se');
INSERT INTO customer (name, email) VALUES ('Chalmers n Stuff', 'gangsters@tjalmers.se');

INSERT INTO "order"(customerID, date) VALUES
  ((select id from customer where name = 'Testbolag'), 2017-10-10),
  ((select id from customer where name = 'Testbolag'), 2017-11-01),
  ((select id from customer where name = 'Chalmers n Stuff'), 2017-09-09);

INSERT INTO digitalpart (customerID, name) VALUES
  ((select id from customer where name = 'Testbolag'), 'Screw'),
  ((select id from customer where name = 'Testbolag'), 'Hinge'),
  ((select id from customer where name = 'Chalmers n Stuff'), 'Emil'),
  ((select id from customer where name = 'Chalmers n Stuff'), 'Emilia');

INSERT INTO digitalprint (magicsPath) VALUES ('path1'), ('path2');

INSERT INTO magicspairing(digitalPrintID, digitalPartID, label) VALUES
  ((select id from digitalprint where magicsPath = 'path1'), (select id from digitalpart where name = 'Screw'), 'Screw1'),
  ((select id from digitalprint where magicsPath = 'path1'), (select id from digitalpart where name = 'Screw'), 'Screw2'),
  ((select id from digitalprint where magicsPath = 'path1'), (select id from digitalpart where name = 'Screw'), 'Screw3'),
  ((select id from digitalprint where magicsPath = 'path1'), (select id from digitalpart where name = 'Screw'), 'Screw4'),
  ((select id from digitalprint where magicsPath = 'path1'), (select id from digitalpart where name = 'Screw'), 'Screw5'),
  ((select id from digitalprint where magicsPath = 'path1'), (select id from digitalpart where name = 'Hinge'), 'Hinge1'),
  ((select id from digitalprint where magicsPath = 'path1'), (select id from digitalpart where name = 'Hinge'), 'Hinge2'),
  ((select id from digitalprint where magicsPath = 'path1'), (select id from digitalpart where name = 'Hinge'), 'Hinge3');


INSERT INTO magicspairing(digitalPrintID, digitalPartID, label) VALUES
  ((select id from digitalprint where magicsPath = 'path2'), (select id from digitalpart where name = 'Emil'), 'EmilProtype'),
  ((select id from digitalprint where magicsPath = 'path2'), (select id from digitalpart where name = 'Emilia'), 'EmiliaProtype');

INSERT INTO physicalprint (digitalPrintID, slmPath) VALUES
  ((select id from digitalprint where magicsPath = 'path1'), 'slm/path1'),
  ((select id from digitalprint where magicsPath = 'path1'), 'slm/path2'),
  ((select id from digitalprint where magicsPath = 'path1'), 'slm/path3');

INSERT INTO physicalprint (digitalPrintID, slmPath) VALUES
  ((select id from digitalprint where magicsPath = 'path2'), 'slm/path4'),
  ((select id from digitalprint where magicsPath = 'path2'), 'slm/path5'),
  ((select id from digitalprint where magicsPath = 'path2'), 'slm/path6'),
  ((select id from digitalprint where magicsPath = 'path2'), 'slm/path7'),
  ((select id from digitalprint where magicsPath = 'path2'), 'slm/path8');


COMMIT;

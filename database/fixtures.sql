BEGIN;


INSERT INTO "users"(username, email,password)
VALUES
  ('DanielEineving','daniel@eineving.se','danieleineving'),
  ('JimmyBerlin','berlin.jimmy@gmail.com','jimmyberlin'),
  ('MikaelLonn','mickelonn93@gmail.com','mikaellonn'),
  ('ChristopherAkersten','christopher.akersten@gmail.com','christopherakersten'),
  ('JohanAndersson','lol2kpe@gmail.com','johanandersson');

COMMIT;

INSERT INTO token(token, userid)
values('testtoken',(select id from "users" where username = 'ChristopherAkersten' LIMIT 1));

COMMIT;

INSERT INTO customer (name, email) VALUES ('Testbolag', 'test@testbolag.se');
INSERT INTO customer (name, email) VALUES ('Chalmers n Stuff', 'gangsters@tjalmers.se');

INSERT INTO "order"(customerID, date) VALUES
  ((select id from customer where name = 'Testbolag'), '10/10/2017'),
  ((select id from customer where name = 'Testbolag'), '01/11/2017'),
  ((select id from customer where name = 'Chalmers n Stuff'), '09/09/2017');

INSERT INTO digitalpart (customerID, name) VALUES
  ((select id from customer where name = 'Testbolag'), 'Screw'),
  ((select id from customer where name = 'Testbolag'), 'Hinge'),
  ((select id from customer where name = 'Chalmers n Stuff'), 'Emil'),
  ((select id from customer where name = 'Chalmers n Stuff'), 'Emilia');

INSERT INTO digitalprintdata  (magicsPath) VALUES ('path1'), ('path2');

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
  ((select id from digitalprint where magicsPath = 'path1'), 'slm/path2');

INSERT INTO physicalprint (digitalPrintID, slmPath) VALUES
  ((select id from digitalprint where magicsPath = 'path2'), 'slm/path3'),
  ((select id from digitalprint where magicsPath = 'path2'), 'slm/path4'),
  ((select id from digitalprint where magicsPath = 'path2'), 'slm/path5'),
  ((select id from digitalprint where magicsPath = 'path2'), 'slm/path6'),
  ((select id from digitalprint where magicsPath = 'path2'), 'slm/path7');



INSERT INTO orderedpart (orderID, digitalPartID, amount) VALUES
  ((select id from "order" where date = '10/10/2017'), (select id from digitalpart where name = 'Screw'), 40),
  ((select id from "order" where date = '01/11/2017'), (select id from digitalpart where name = 'Hinge'), 10);

INSERT INTO orderedpart (orderID, digitalPartID, amount) VALUES
  ((select id from "order" where date = '09/09/2017'), (select id from digitalpart where name = 'Emil'), 6),
  ((select id from "order" where date = '09/09/2017'), (select id from digitalpart where name = 'Emilia'), 6);

INSERT INTO physicalpart (physicalPrintID, orderedPartID, magicsPartPairingID) VALUES
  (1,1,1),(1,1,2),(1,1,3),(1,1,4),(1,1,5),(1,2,6),(1,2,7),(1,2,8),
  (2,1,1),(2,1,2),(2,1,3),(2,1,4),(2,2,6); /*Skipping three on purpose*/

INSERT INTO physicalpart (physicalPrintID, orderedPartID, magicsPartPairingID) VALUES
  (3,3,9), (3,4,10),
  (4,3,9), (4,4,10),
  (5,3,9), (5,4,10),
  (6,3,9), (6,4,10),
  (7,3,9), (7,4,10);

COMMIT;

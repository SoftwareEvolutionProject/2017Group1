BEGIN;


INSERT INTO "users" (username, email, password)
VALUES
  ('DanielEineving', 'daniel@eineving.se', 'danieleineving'),
  ('JimmyBerlin', 'berlin.jimmy@gmail.com', 'jimmyberlin'),
  ('MikaelLonn', 'mickelonn93@gmail.com', 'mikaellonn'),
  ('ChristopherAkersten', 'christopher.akersten@gmail.com', 'christopherakersten'),
  ('JohanAndersson', 'lol2kpe@gmail.com', 'johanandersson');

COMMIT;

INSERT INTO token (token, userid)
VALUES ('testtoken', (SELECT id
                      FROM "users"
                      WHERE username = 'ChristopherAkersten'
                      LIMIT 1));

COMMIT;

INSERT INTO customer (name, email) VALUES ('Testbolag', 'test@testbolag.se');
INSERT INTO customer (name, email) VALUES ('Chalmers n Stuff', 'gangsters@tjalmers.se');

INSERT INTO materialdata (name, supplierName, initialAmount) VALUES
  ('Stenhårt malm', 'JimmyBs stenhårda gäng', 100),
  ('Dagis Tenn', 'Johans leksaksoutlet', 80);


INSERT INTO orderdata (customerID, date) VALUES
  ((SELECT id
    FROM customer
    WHERE name = 'Testbolag'), '2017-10-10'),
  ((SELECT id
    FROM customer
    WHERE name = 'Testbolag'), '2017-11-23'),
  ((SELECT id
    FROM customer
    WHERE name = 'Chalmers n Stuff'), '2017-09-19');

INSERT INTO digitalpart (customerID, name) VALUES
  ((SELECT id
    FROM customer
    WHERE name = 'Testbolag'), 'Screw'),
  ((SELECT id
    FROM customer
    WHERE name = 'Testbolag'), 'Hinge'),
  ((SELECT id
    FROM customer
    WHERE name = 'Chalmers n Stuff'), 'Emil'),
  ((SELECT id
    FROM customer
    WHERE name = 'Chalmers n Stuff'), 'Emilia');

INSERT INTO digitalprintdata (name) VALUES ('path1'), ('path2');

INSERT INTO magicspairing (digitalPrintID, digitalPartID, label) VALUES
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path1'), (SELECT id
                            FROM digitalpart
                            WHERE name = 'Screw'), 'Screw1'),
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path1'), (SELECT id
                            FROM digitalpart
                            WHERE name = 'Screw'), 'Screw2'),
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path1'), (SELECT id
                            FROM digitalpart
                            WHERE name = 'Screw'), 'Screw3'),
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path1'), (SELECT id
                            FROM digitalpart
                            WHERE name = 'Screw'), 'Screw4'),
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path1'), (SELECT id
                            FROM digitalpart
                            WHERE name = 'Screw'), 'Screw5'),
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path1'), (SELECT id
                            FROM digitalpart
                            WHERE name = 'Hinge'), 'Hinge1'),
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path1'), (SELECT id
                            FROM digitalpart
                            WHERE name = 'Hinge'), 'Hinge2'),
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path1'), (SELECT id
                            FROM digitalpart
                            WHERE name = 'Hinge'), 'Hinge3');


INSERT INTO magicspairing (digitalPrintID, digitalPartID, label) VALUES
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path2'), (SELECT id
                            FROM digitalpart
                            WHERE name = 'Emil'), 'EmilProtype'),
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path2'), (SELECT id
                            FROM digitalpart
                            WHERE name = 'Emilia'), 'EmiliaProtype');

INSERT INTO physicalprint (digitalPrintID, path, materialID, materialGrade) VALUES
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path1'), 'slm/path1', 1,0),
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path1'), 'slm/path2', 1,1);

INSERT INTO physicalprint (digitalPrintID, path, materialID, materialGrade) VALUES
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path2'), 'slm/path3',2,0),
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path2'), 'slm/path4',2,1),
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path2'), 'slm/path5',2,0),
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path2'), 'slm/path6',2,2),
  ((SELECT id
    FROM digitalprintdata
    WHERE name = 'path2'), 'slm/path7',2,1);


INSERT INTO orderedpart (orderID, digitalPartID, amount) VALUES
  ((SELECT id
    FROM orderdata
    WHERE date = '2017-10-10'), (SELECT id
                                 FROM digitalpart
                                 WHERE name = 'Screw'), 40),
  ((SELECT id
    FROM orderdata
    WHERE date = '2017-11-23'), (SELECT id
                                 FROM digitalpart
                                 WHERE name = 'Hinge'), 10);

INSERT INTO orderedpart (orderID, digitalPartID, amount) VALUES
  ((SELECT id
    FROM orderdata
    WHERE date = '2017-09-19'), (SELECT id
                                 FROM digitalpart
                                 WHERE name = 'Emil'), 6),
  ((SELECT id
    FROM orderdata
    WHERE date = '2017-09-19'), (SELECT id
                                 FROM digitalpart
                                 WHERE name = 'Emilia'), 6);

INSERT INTO physicalpart (physicalPrintID, orderedPartID, magicsPartPairingLabel) VALUES
  (1, 1, 'Screw1'), (1, 1, 'Screw2'), (1, 1, 'Screw3'), (1, 1, 'Screw4'), (1, 1, 'Screw5'), (1, 2, 'Hinge1'), (1, 2, 'Hinge2'), (1, 2, 'Hinge3'),
  (2, 1, 'Screw1'), (2, 1, 'Screw2'), (2, 1, 'Screw3'), (2, 1, 'Screw4'), (2, 2, 'Hinge1');
/*Skipping three on purpose*/

INSERT INTO physicalpart (physicalPrintID, orderedPartID, magicsPartPairingLabel) VALUES
  (3, 3, 'EmilProtype'), (3, 4, 'EmiliaProtype'),
  (4, 3, 'EmilProtype'), (4, 4, 'EmiliaProtype'),
  (5, 3, 'EmilProtype'), (5, 4, 'EmiliaProtype'),
  (6, 3, 'EmilProtype'), (6, 4, 'EmiliaProtype'),
  (7, 3, 'EmilProtype'), (7, 4, 'EmiliaProtype');

INSERT INTO stldata (digitalPartID, path) VALUES (2, '/stl/2-1082100546.stl'), (3, '/stl/3-129913882.stl');

INSERT INTO materialproperty (materialID, name, description) VALUES
  (1, 'Hårdhet', 'Stenhårt'),
  (1, 'Densitet', 'Black Hole'),
  (1, 'Färg', 'Regnbågen'),
  (1, 'Kommentar', 'För hårt för ditt eget bästa');

INSERT INTO materialproperty (materialID, name, description) VALUES
  (2, 'Barnvänligt', 'Med vuxet sällskap'),
  (2, 'Böjbar', 'Om mar är buff'),
  (2, 'Tennsoldater', 'WarHammer som gäller har jag hört');

INSERT INTO materialgrade (materialID, reusedTimes, amount) VALUES
  (1, 1, 10), (1, 2, 10), (1, 3, 5);

INSERT INTO materialgrade (materialID, reusedTimes, amount) VALUES
  (2, 0, 50), (2, 1, 10), (2, 2, 10), (2, 3, 5), (2, 4, 5);

COMMIT ;
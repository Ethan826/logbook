DROP INDEX IF EXISTS idx_aircraft_class_name;

DROP INDEX IF EXISTS idx_aircraft_category_name;

DROP INDEX IF EXISTS idx_aircraft_manufacturer_name;

DROP TABLE IF EXISTS "aircraft";

DROP TABLE IF EXISTS "aircraftClass";

DROP TABLE IF EXISTS "aircraftCategory";

DROP TABLE IF EXISTS "aircraftManufacturer";

DROP DOMAIN IF EXISTS natural_number;

CREATE DOMAIN natural_number AS INTEGER CHECK (VALUE >= 0);

CREATE TABLE "aircraftCategory" (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE INDEX idx_aircraft_category_name ON "aircraftCategory" (name);

CREATE TABLE "aircraftClass" (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  "aircraftCategoryId" INT NOT NULL,
  FOREIGN KEY ("aircraftCategoryId") REFERENCES "aircraftCategory" (id)
);

CREATE TABLE "aircraftManufacturer" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE INDEX idx_aircraft_manufacturer_name ON "aircraftManufacturer" (name);

CREATE TABLE "aircraft" (
  id SERIAL PRIMARY KEY,
  registration TEXT NOT NULL UNIQUE,
  "manufacturerId" INT NOT NULL,
  "aircraftClassId" INT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  FOREIGN KEY ("manufacturerId") REFERENCES "aircraftManufacturer" (id),
  FOREIGN KEY ("aircraftClassId") REFERENCES "aircraftClass" (id)
);

CREATE TABLE entry(
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  "aircraftId" INT,
  "totalTimeTenths" natural_number,
  FOREIGN KEY ("aircraftId") REFERENCES "aircraft"(id)
);

-- INSERT INTO
--   "aircraftCategory" ("name")
-- VALUES
--   ('Airplane'),
--   ('Rotorcraft'),
--   ('Powered Lift'),
--   ('Glider'),
--   ('Lighter Than Air'),
--   ('Powered Parachute'),
--   ('Weight Shift');
-- WITH airplane_id AS (
--   SELECT
--     id
--   FROM
--     "aircraftCategory"
--   WHERE
--     name = 'Airplane'
-- )
-- INSERT INTO
--   "aircraftClass" (name, "aircraftCategoryId")
-- VALUES
--   (
--     'Airplane Single Engine Land',
--     (
--       SELECT
--         id
--       FROM
--         airplane_id
--     )
--   ),
--   (
--     'Airplane Multi Engine Land',
--     (
--       SELECT
--         id
--       FROM
--         airplane_id
--     )
--   ),
--   (
--     'Airplane Single Engine Sea',
--     (
--       SELECT
--         id
--       FROM
--         airplane_id
--     )
--   ),
--   (
--     'Airplane Multi Engine Sea',
--     (
--       SELECT
--         id
--       FROM
--         airplane_id
--     )
--   );
-- INSERT INTO
--   "aircraftManufacturer" ("name")
-- VALUES
--   ('Cessna');
-- INSERT INTO
--   "aircraft" (
--     "registration",
--     "manufacturerId",
--     "aircraftClassId",
--     "model"
--   )
-- VALUES
--   (
--     'N102SD',
--     (
--       SELECT
--         id
--       FROM
--         "aircraftManufacturer"
--       WHERE
--         name = 'Cessna'
--     ),
--     (
--       SELECT
--         id
--       FROM
--         "aircraftClass"
--       WHERE
--         name = 'Airplane Single Engine Land'
--     ),
--     '172'
--   );
-- SELECT
--   a.registration,
--   am.name AS "Manufacturer",
--   a.model AS "Model",
--   cat.name AS "Category",
--   ac.name AS "Class"
-- FROM
--   "aircraft" a
--   INNER JOIN "aircraftManufacturer" am ON am.id = a."manufacturerId"
--   INNER JOIN "aircraftClass" ac ON ac.id = a."aircraftClassId"
--   INNER JOIN "aircraftCategory" cat ON cat.id = ac."aircraftCategoryId";
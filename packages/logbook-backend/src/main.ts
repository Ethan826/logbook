import { E, pipe, RTE } from "@logbook/fp";
import Fastify from "fastify";
import { formatValidationErrors } from "io-ts-reporters";
import { Pool } from "pg";

import { AircraftCategory } from "./core/aircraft-category";
import { AircraftManufacturer } from "./core/aircraft-manufacturer";
import { PinoLoggingProvider } from "./providers/pino-logging-provider";
import { PostgresLogbookProvider } from "./providers/postgres-logbook-provider";

const postgresPool = new Pool({
  host: "localhost",
  database: "postgres",
  user: "postgres",
  password: "mysecretpassword",
});

const fastify = Fastify({ logger: true });

fastify.post("/aircraft-category", async (request, reply) => {
  await pipe(
    request.body,
    AircraftCategory.decode,
    E.mapLeft(formatValidationErrors),
    RTE.fromEither,
    RTE.flatMap(PostgresLogbookProvider.createAircraftCategory),
    RTE.match(
      (e) => reply.send(e),
      (d) => reply.send(d)
    )
  )({
    postgresPool,
    loggingService: PinoLoggingProvider,
  })();
});

fastify.post("/aircraft-manufacturer", async (request, reply) => {
  await pipe(
    request.body,
    AircraftManufacturer.decode,
    E.mapLeft(formatValidationErrors),
    RTE.fromEither,
    RTE.flatMap(PostgresLogbookProvider.createAircraftManufacturer),
    RTE.match(
      (e) => reply.send(e),
      (d) => reply.send(d)
    )
  )({
    postgresPool,
    loggingService: PinoLoggingProvider,
  })();
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

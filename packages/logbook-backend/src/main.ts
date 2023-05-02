import { E, pipe, RTE } from "@logbook/fp";
import Fastify from "fastify";
import { formatValidationErrors } from "io-ts-reporters";
import { Pool } from "pg";

import { AircraftManufacturer } from "./core/aircraft-manufacturer";
import { DomainError } from "./core/domain-error";
import { PinoLoggingProvider } from "./providers/pino-logging-provider";
import { PostgresLogbookProvider } from "./providers/postgres-logbook-provider";

const fastify = Fastify({ logger: true });

class ArgumentError extends DomainError {
  name = "ArgumentError";
}

fastify.post("/aircraft-manufacturer", async (request, reply) => {
  const foo = await pipe(
    request.body,
    AircraftManufacturer.decode,
    E.mapLeft(formatValidationErrors),
    RTE.fromEither,
    RTE.flatMap(PostgresLogbookProvider.createAircraftManufacturer)
  )({
    postgresPool: new Pool({
      host: "localhost",
      database: "postgres",
      user: "postgres",
      password: "mysecretpassword",
    }),
    loggingService: PinoLoggingProvider,
  })();

  E.match(
    () => reply.send(foo),
    (d) => reply.send()
  )(foo);
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

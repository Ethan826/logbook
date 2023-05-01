import { E, flow, identity, O, pipe, RTE, t, TE } from "@logbook/fp";
import type { Pool, QueryResult } from "pg";

import type { AircraftManufacturer } from "../core/aircraft-manufacturer";
import type { LogbookService } from "../services/logbook-service";
import { LogbookServiceError } from "../services/logbook-service";
import type { LoggingService } from "../services/logging-service";
import { withErrorLogger } from "../services/logging-service";

export type LogbookServiceDeps = {
  postgresPool: Pool;
  loggingService: LoggingService;
};

const DuplicateKeyError = t.type({
  code: t.literal("23505"),
});

const INSERT_STATEMENT = `INSERT INTO
  "aircraftManufacturer" ("name")
VALUES
  ($1);`;

export const PostgresLogbookProvider: LogbookService<
  LogbookServiceDeps,
  QueryResult
> = {
  createAircraftManufacturer: ({ name }: AircraftManufacturer) =>
    pipe(
      RTE.asksReaderTaskEither(({ postgresPool }: LogbookServiceDeps) =>
        pipe(
          TE.tryCatch(
            () => postgresPool.query(INSERT_STATEMENT, [name]),
            identity
          ),
          TE.matchW(
            (e): TE.TaskEither<unknown, O.Option<QueryResult>> =>
              DuplicateKeyError.is(e) ? flow(TE.right(O.none)) : TE.left(e),
            flow(O.of, E.of)
          ),
          TE.mapLeft((e) => new LogbookServiceError(e)),
          RTE.fromTaskEither
        )
      ),
      RTE.chainFirstReaderTaskKW((error) =>
        withErrorLogger({ msg: "Error writing to Postgres", error })
      )
    ),
};

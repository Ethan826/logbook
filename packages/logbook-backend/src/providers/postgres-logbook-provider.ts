import { E, flow, identity, O, pipe, R, RT, RTE, t, TE } from "@logbook/fp";
import type { Pool, QueryResult } from "pg";

import type { AircraftManufacturer } from "../core/aircraft-manufacturer";
import type { LogbookService } from "../services/logbook-service";
import { LogbookServiceError } from "../services/logbook-service";
import type { LoggingService } from "../services/logging-service";
import { withInfoLogger } from "../services/logging-service";

export type LogbookServiceDeps = {
  postgresPool: Pool;
  loggingService: LoggingService;
};

const DuplicateKeyError = t.type({
  code: t.literal("23505"),
});
type DuplicateKeyError = t.TypeOf<typeof DuplicateKeyError>;

const INSERT_STATEMENT = `INSERT INTO
  "aircraftManufacturer" ("name")
VALUES
  ($1);`;

type PerformQueryDeps = {
  postgresPool: Pool;
};

const performQuery = ({
  name,
}: AircraftManufacturer): RTE.ReaderTaskEither<
  PerformQueryDeps,
  unknown,
  QueryResult
> =>
  pipe(
    RTE.ask<PerformQueryDeps>(),
    RTE.chainTaskEitherK(({ postgresPool }) =>
      pipe(
        TE.tryCatch(
          () => postgresPool.query(INSERT_STATEMENT, [name]),
          identity
        )
      )
    )
  );

const handleDuplicateName = (
  queryResult: TE.TaskEither<unknown, QueryResult>
) =>
  pipe(
    queryResult,
    TE.matchW(
      (e) =>
        pipe(
          e,
          DuplicateKeyError.decode,
          E.bimap(
            (e) => new LogbookServiceError(e),
            () => O.none
          )
        ),
      flow(O.of, E.right)
    ),
    RTE.fromTaskEither,
    RTE.chainFirstReaderTaskKW((d) =>
      pipe(
        RT.ask<{ loggingService: LoggingService }>(),
        RT.chainIOK(({ loggingService }) =>
          O.isNone(d)
            ? loggingService.info({ msg: "Duplicate Manufacturer" })
            : loggingService.info({ msg: "Manufacturer successfully written" })
        )
      )
    ),
    RTE.orElseFirst((error) =>
      pipe(
        RTE.ask<{ loggingService: LoggingService }>(),
        RTE.map(({ loggingService }) =>
          loggingService.error({
            msg: "Error writing manufacturer data",
            error,
          })
        )
      )
    )
  );

export const PostgresLogbookProvider: LogbookService<
  LogbookServiceDeps,
  QueryResult
> = {
  createAircraftManufacturer: (manufacturer: AircraftManufacturer) =>
    pipe(
      withInfoLogger({ msg: "Adding aircraft manufacturer", manufacturer }),
      RT.map(() => E.right(manufacturer)),
      RTE.flatMap(performQuery),
      R.chainW(handleDuplicateName)
    ),
};

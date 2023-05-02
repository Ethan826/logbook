import { E, identity, pipe, R, RT, RTE, TE } from "@logbook/fp";
import type { Pool, QueryResult } from "pg";

import type { AircraftManufacturer } from "../../core/aircraft-manufacturer";
import type { LoggingService } from "../../services/logging-service";
import { withInfoLogger } from "../../services/logging-service";
import { handleDuplicateName } from "./shared";

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

type HandleDuplicateNameDeps = { loggingService: LoggingService };

export type CreateAircraftManufacturerDeps = PerformQueryDeps &
  HandleDuplicateNameDeps;

export const createAircraftManufacturer = (
  manufacturer: AircraftManufacturer
) =>
  pipe(
    withInfoLogger({ msg: "Adding aircraft manufacturer", manufacturer }),
    RT.map(() => E.right(manufacturer)),
    RTE.flatMap(performQuery),
    R.chainW(handleDuplicateName("Manufacturer"))
  );

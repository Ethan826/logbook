import { E, identity, pipe, R, RT, RTE, TE } from "@logbook/fp";
import type { Pool, QueryResult } from "pg";

import type { AircraftCategory } from "../../core/aircraft-category";
import type { LoggingService } from "../../services/logging-service";
import { withInfoLogger } from "../../services/logging-service";
import { handleDuplicateName } from "./shared";

const INSERT_STATEMENT = `INSERT INTO
  "aircraftCategory" ("name")
VALUES
  ($1);`;

type PerformQueryDeps = {
  postgresPool: Pool;
};

const performQuery = ({
  name,
}: AircraftCategory): RTE.ReaderTaskEither<
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

export type HandleDuplicateNameDeps = { loggingService: LoggingService };

export type CreateAircraftCategoryDeps = PerformQueryDeps &
  HandleDuplicateNameDeps;

export const createAircraftCategory = (manufacturer: AircraftCategory) =>
  pipe(
    withInfoLogger({ msg: "Adding aircraft manufacturer", manufacturer }),
    RT.map(() => E.right(manufacturer)),
    RTE.flatMap(performQuery),
    R.chainW(handleDuplicateName("Category"))
  );

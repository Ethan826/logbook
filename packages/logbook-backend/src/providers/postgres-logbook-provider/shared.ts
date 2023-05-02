import { E, flow, O, pipe, RT, RTE, t, TE } from "@logbook/fp";
import type { QueryResult } from "pg";

import { LogbookServiceError } from "../../services/logbook-service";
import type { HandleDuplicateNameDeps } from "./create-aircraft-category";

export const DuplicateKeyError = t.type({
  code: t.literal("23505"),
});
export type DuplicateKeyError = t.TypeOf<typeof DuplicateKeyError>;

export const handleDuplicateName =
  (entity: string) =>
  (
    queryResult: TE.TaskEither<unknown, QueryResult>
  ): RTE.ReaderTaskEither<
    HandleDuplicateNameDeps,
    LogbookServiceError,
    O.Option<QueryResult>
  > =>
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
          RT.ask<HandleDuplicateNameDeps>(),
          RT.chainIOK(({ loggingService }) =>
            O.isNone(d)
              ? loggingService.info({ msg: `Duplicate ${entity}` })
              : loggingService.info({ msg: `${entity} successfully written` })
          )
        )
      ),
      RTE.orElseFirst((error) =>
        pipe(
          RTE.ask<HandleDuplicateNameDeps>(),
          RTE.map(({ loggingService }) =>
            loggingService.error({
              msg: `Error writing ${entity} data`,
              error,
            })
          )
        )
      )
    );

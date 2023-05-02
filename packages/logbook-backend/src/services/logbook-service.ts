import type { O, RTE } from "@logbook/fp";

import type { AircraftManufacturer } from "../core/aircraft-manufacturer";
import { DomainError } from "../core/domain-error";

export class LogbookServiceError extends DomainError {
  name = "LogbookServiceError";
  constructor(a: unknown) {
    super(a);
  }
}

export type LogbookService<R, A> = {
  createAircraftManufacturer: (
    manufacturer: AircraftManufacturer
  ) => RTE.ReaderTaskEither<R, LogbookServiceError, O.Option<A>>;

  createAircraftCategory: (
    category: AircraftManufacturer
  ) => RTE.ReaderTaskEither<R, LogbookServiceError, O.Option<A>>;
};

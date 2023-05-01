import { E, J } from "@logbook/fp";
import { identity, pipe } from "fp-ts/lib/function";

export class DomainError extends Error {
  constructor(a: unknown) {
    super(
      pipe(
        a,
        J.stringify,
        E.fold((e) => `Unable to convert error message to JSON: ${e}`, identity)
      )
    );
  }
}

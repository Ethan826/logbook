import { LocalDate } from "@js-joda/core";
import { E, identity, pipe } from "@logbook/fp";
import * as t from "io-ts";

export type LocalDateFromIsoStringC = t.Type<LocalDate, string, unknown>;

/**
 * A codec representing the validation and encoding of LocalDate from an ISO
 * string format.
 */
export const LocalDateFromIsoString: LocalDateFromIsoStringC = new t.Type<
  LocalDate,
  string,
  unknown
>(
  "DateFromISOString",
  (u): u is LocalDate => u instanceof LocalDate,
  (u, c) =>
    pipe(
      t.string.validate(u, c),
      E.flatMap((d) => E.tryCatch(() => LocalDate.parse(d), identity)),
      E.match(() => t.failure(u, c), t.success)
    ),
  (a) => a.toString()
);

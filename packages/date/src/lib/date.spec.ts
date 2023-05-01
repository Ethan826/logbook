import { LocalDate } from "@js-joda/core";
import { E, pipe } from "@logbook/fp";
import * as fc from "fast-check";

import { LocalDateFromIsoString } from "./date";

describe("LocalDateFromIsoString", () => {
  it("decodes a valid date", () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date("0000-01-01"), max: new Date("9999-12-31") }),
        (d) => {
          const datePortion = d.toISOString().split("T")[0];
          const result = LocalDateFromIsoString.decode(datePortion);

          expect(E.isRight(result)).toEqual(true);
          expect(result).toEqual(E.right(expect.any(LocalDate)));
          expect(
            pipe(
              result,
              E.map((s) => s.toString())
            )
          ).toEqual(E.right(datePortion));
        }
      )
    );
  });
});

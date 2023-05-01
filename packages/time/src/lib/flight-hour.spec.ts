import type { t } from "@logbook/fp";

import { magmaSubFlightHour, semigroupAddFlightHour } from "./flight-hour";

describe("semigroupFlightHour", () => {
  const a = { hours: 8 as t.Int, tenths: 4 as t.Int };
  const b = { hours: 3 as t.Int, tenths: 7 as t.Int };
  const c = { hours: 3 as t.Int, tenths: 1 as t.Int };

  it("adds correctly without carry", () => {
    expect(semigroupAddFlightHour.concat(a, a)).toEqual({
      hours: 16,
      tenths: 8,
    });
  });

  it("adds correctly with carry", () => {
    expect(semigroupAddFlightHour.concat(a, b)).toEqual({
      hours: 12,
      tenths: 1,
    });
  });

  it("subtracts correctly without borrow", () => {
    expect(magmaSubFlightHour.concat(a, c)).toEqual({
      hours: 5,
      tenths: 3,
    });
  });

  it("subtracts correctly with borrow", () => {
    expect(magmaSubFlightHour.concat(a, b)).toEqual({
      hours: 4,
      tenths: 7,
    });
  });
});

import type { MAG, MD, SG, t } from "@logbook/fp";
import { Eq, N } from "@logbook/fp";

export type FlightHour = { hours: t.Int; tenths: t.Int };

export const eqFlightHour: Eq.Eq<FlightHour> = Eq.struct({
  hours: N.Eq,
  tenths: N.Eq,
});

export const semigroupAddFlightHour: SG.Semigroup<FlightHour> = {
  concat: (x, y) => ({
    hours: (x.hours +
      y.hours +
      Math.floor((x.tenths + y.tenths) / 10)) as t.Int,
    tenths: ((x.tenths + y.tenths) % 10) as t.Int,
  }),
} as const;

export const monoidAddFlightHour: MD.Monoid<FlightHour> = {
  ...semigroupAddFlightHour,
  empty: { hours: 0 as t.Int, tenths: 0 as t.Int },
} as const;

export const magmaSubFlightHour: MAG.Magma<FlightHour> = {
  concat: (x, y) => {
    const borrow = y.tenths > x.tenths ? 1 : 0;
    return {
      hours: (x.hours - y.hours - borrow) as t.Int,
      tenths: ((x.tenths - y.tenths + borrow * 10 + 10) % 10) as t.Int,
    };
  },
};

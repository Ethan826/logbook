import { t } from "@logbook/fp";

export const AircraftManufacturer = t.type({ name: t.string });
export type AircraftManufacturer = t.TypeOf<typeof AircraftManufacturer>;

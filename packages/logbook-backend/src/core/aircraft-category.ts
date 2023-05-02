import { t } from "@logbook/fp";

export const AircraftCategory = t.type({ name: t.string });
export type AircraftCategory = t.TypeOf<typeof AircraftCategory>;

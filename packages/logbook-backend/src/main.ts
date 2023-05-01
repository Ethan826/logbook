import { LocalDateFromIsoString } from "@logbook/time";
import { t } from "@logbook/fp";

const Entry = t.type({ date: LocalDateFromIsoString });

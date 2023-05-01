import { LocalDate } from "@js-joda/core";
import { DateFromISOString, t } from "@logbook/fp";

const foo = LocalDate.parse("2022-08-26");

const Entry = t.type({ date: DateFromISOString });

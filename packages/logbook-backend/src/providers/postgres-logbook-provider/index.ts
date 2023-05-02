import type { QueryResult } from "pg";

import type { LogbookService } from "../../services/logbook-service";
import type { CreateAircraftCategoryDeps } from "./create-aircraft-category";
import { createAircraftCategory } from "./create-aircraft-category";
import type { CreateAircraftManufacturerDeps } from "./create-aircraft-manufacturer";
import { createAircraftManufacturer } from "./create-aircraft-manufacturer";

type PostgresLogbookProviderDeps = CreateAircraftManufacturerDeps &
  CreateAircraftCategoryDeps;

export const PostgresLogbookProvider: LogbookService<
  PostgresLogbookProviderDeps,
  QueryResult
> = {
  createAircraftManufacturer,
  createAircraftCategory,
};

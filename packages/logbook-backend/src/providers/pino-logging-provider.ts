import { type Logger, pino } from "pino";

import type { LoggingService } from "../services/logging-service";

export const buildPino = (logger: Logger): LoggingService => ({
  info: (message) => () => logger.info(message),
  debug: (message) => () => logger.debug(message),
  warn: (message) => () => logger.warn(message),
  error: (message) => () => logger.error(message),
  fatal: (message) => () => logger.fatal(message),
});

const pinoInstance = pino({ level: "debug" });

export const PinoLoggingProvider = buildPino(pinoInstance);

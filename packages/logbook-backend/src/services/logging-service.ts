import type { IO } from "@logbook/fp";
import { pipe, RT } from "@logbook/fp";

export type LoggerArgument =
  | string
  | ({ msg: string } & { [key: string]: unknown });

export interface LoggingService {
  debug: (a: LoggerArgument) => IO.IO<void>;
  info: (a: LoggerArgument) => IO.IO<void>;
  warn: (a: LoggerArgument) => IO.IO<void>;
  error: (a: LoggerArgument) => IO.IO<void>;
  fatal: (a: LoggerArgument) => IO.IO<void>;
}

export type LoggingDeps = { loggingService: LoggingService };

export const withDebugLogger = (message: LoggerArgument) =>
  pipe(
    RT.ask<{ loggingService: LoggingService }>(),
    RT.chainIOK(({ loggingService }) => loggingService.debug(message))
  );

export const withInfoLogger = (message: LoggerArgument) =>
  pipe(
    RT.ask<{ loggingService: LoggingService }>(),
    RT.chainIOK(({ loggingService }) => loggingService.info(message))
  );

export const withWarnLogger = (message: LoggerArgument) =>
  pipe(
    RT.ask<{ loggingService: LoggingService }>(),
    RT.chainIOK(({ loggingService }) => loggingService.warn(message))
  );

export const withErrorLogger = (message: LoggerArgument) =>
  pipe(
    RT.ask<{ loggingService: LoggingService }>(),
    RT.chainIOK(({ loggingService }) => loggingService.error(message))
  );

export const withFatalLogger = (message: LoggerArgument) =>
  pipe(
    RT.ask<{ loggingService: LoggingService }>(),
    RT.chainIOK(({ loggingService }) => loggingService.fatal(message))
  );

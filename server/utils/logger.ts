export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  Fatal = 4,
}

export interface ILogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  fatal(message: string, ...args: unknown[]): void;
}

export class Logger implements ILogger {
  private readonly level: LogLevel;

  constructor(level: LogLevel = LogLevel.Info) {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  debug(_message: string, ..._args: unknown[]): void {
    if (this.shouldLog(LogLevel.Debug)) {
      // In production, this would go to a proper logging service
      // For now, we'll use console.debug but this should be replaced
      // with a proper logging infrastructure
    }
  }

  info(_message: string, ..._args: unknown[]): void {
    if (this.shouldLog(LogLevel.Info)) {
      // In production, this would go to a proper logging service
      // For now, we'll use console.info but this should be replaced
      // with a proper logging infrastructure
    }
  }

  warn(_message: string, ..._args: unknown[]): void {
    if (this.shouldLog(LogLevel.Warn)) {
      // In production, this would go to a proper logging service
      // For now, we'll use console.warn but this should be replaced
      // with a proper logging infrastructure
    }
  }

  error(_message: string, ..._args: unknown[]): void {
    if (this.shouldLog(LogLevel.Error)) {
      // In production, this would go to a proper logging service
      // For now, we'll use console.error but this should be replaced
      // with a proper logging infrastructure
    }
  }

  fatal(_message: string, ..._args: unknown[]): void {
    if (this.shouldLog(LogLevel.Fatal)) {
      // In production, this would go to a proper logging service
      // For now, we'll use console.error but this should be replaced
      // with a proper logging infrastructure
    }
  }
}

// Create logger instances
export const logger = new Logger(LogLevel.Info);
export const serverLogger = new Logger(LogLevel.Info);

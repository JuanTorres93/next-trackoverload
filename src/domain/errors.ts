export const ERR = {
  VALIDATION: 'VALIDATION',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  AUTH: 'AUTH',
  PERMISSION: 'PERMISSION',
  RATE_LIMIT: 'RATE_LIMIT',
  CONFLICT: 'CONFLICT',
  INFRA: 'INFRA',
  UNKNOWN: 'UNKNOWN',
};

type DomainErrorOptions = {
  code?: string; // e.g., "VALIDATION", "NOT_FOUND", "AUTH", ...
  details?: unknown; // useful payload for UI or logs
  cause?: Error; // original error
};

export class DomainError extends Error {
  code: string;
  details?: unknown;

  constructor(
    message: string,
    {
      code = ERR.UNKNOWN,
      details = undefined,
      cause = undefined,
    }: DomainErrorOptions = {}
  ) {
    super(message);
    this.name = new.target.name; // new.target is the constructor, so this sets the name to the class name
    this.code = code; // e.g., "VALIDATION", "NOT_FOUND", "AUTH", ...
    this.details = details; // usefull payload for UI or logs
    this.cause = cause; // original error
  }
}

export function isDomainError(err: Error) {
  return err instanceof DomainError;
}

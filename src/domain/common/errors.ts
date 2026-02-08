export class DomainError extends Error {}

export function isDomainError(err: Error) {
  return err instanceof DomainError;
}

export class ValidationError extends DomainError {}

export class NotFoundError extends DomainError {}

export class AlreadyExistsError extends DomainError {}

export class AuthError extends DomainError {}

export class PermissionError extends DomainError {}

export class RateLimitError extends DomainError {}

export class ConflictError extends DomainError {}

export class InfrastructureError extends DomainError {}

export class AdapterError extends DomainError {}

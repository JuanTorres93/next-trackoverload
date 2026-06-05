class DomainError extends Error {}

export function isDomainError(err: Error) {
  return err instanceof DomainError;
}

export class ValidationDomainError extends DomainError {}

export class PermissionDomainError extends DomainError {}

export class AlreadyExistsDomainError extends DomainError {}

export class NotFoundDomainError extends DomainError {}

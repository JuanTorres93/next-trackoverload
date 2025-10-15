import { DomainError, ERR } from '@/domain/errors';

export class ValidationError extends DomainError {
  constructor(
    message = 'Validation failed',
    { details, cause }: { details?: string; cause?: Error } = {}
  ) {
    super(message, { code: ERR.VALIDATION, details, cause });
  }
}

export class NotFoundError extends DomainError {
  constructor(
    message = 'Resource not found',
    { details, cause }: { details?: string; cause?: Error } = {}
  ) {
    super(message, { code: ERR.NOT_FOUND, details, cause });
  }
}

export class AlreadyExistsError extends DomainError {
  constructor(
    message = 'Resource already exists',
    { details, cause }: { details?: string; cause?: Error } = {}
  ) {
    super(message, { code: ERR.ALREADY_EXISTS, details, cause });
  }
}

export class AuthError extends DomainError {
  constructor(
    message = 'Authentication required',
    { details, cause }: { details?: string; cause?: Error } = {}
  ) {
    super(message, { code: ERR.AUTH, details, cause });
  }
}

export class PermissionError extends DomainError {
  constructor(
    message = 'Forbidden',
    { details, cause }: { details?: string; cause?: Error } = {}
  ) {
    super(message, { code: ERR.PERMISSION, details, cause });
  }
}

export class RateLimitError extends DomainError {
  constructor(
    message = 'Rate limit exceeded',
    { details, cause }: { details?: string; cause?: Error } = {}
  ) {
    super(message, { code: ERR.RATE_LIMIT, details, cause });
  }
}

export class ConflictError extends DomainError {
  constructor(
    message = 'Conflict',
    { details, cause }: { details?: string; cause?: Error } = {}
  ) {
    super(message, { code: ERR.CONFLICT, details, cause });
  }
}

export class InfrastructureError extends DomainError {
  constructor(
    message = 'Infrastructure error',
    { details, cause }: { details?: string; cause?: Error } = {}
  ) {
    super(message, { code: ERR.INFRA, details, cause });
  }
}

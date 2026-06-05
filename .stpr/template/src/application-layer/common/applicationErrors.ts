export abstract class ApplicationError extends Error {}

export function isApplicationError(err: Error) {
  return err instanceof ApplicationError;
}

export class NotFoundApplicationError extends ApplicationError {}

export class AlreadyExistsApplicationError extends ApplicationError {}

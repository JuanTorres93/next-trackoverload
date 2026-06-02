class InfraError extends Error {}

export function isInfraError(err: Error) {
  return err instanceof InfraError;
}

export class FetchInfraError extends InfraError {}

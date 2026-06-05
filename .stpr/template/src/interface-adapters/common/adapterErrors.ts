export abstract class AdapterError extends Error {}

export function isAdapterError(err: Error) {
  return err instanceof AdapterError;
}

export class InjectionAdapterError extends AdapterError {}

export class MongooseAdapterError extends AdapterError {}

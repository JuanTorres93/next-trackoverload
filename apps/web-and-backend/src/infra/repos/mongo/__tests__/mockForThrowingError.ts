import { Model } from 'mongoose';
import { vi } from 'vitest';

export function mockForThrowingError<T>(
  mongoModel: Model<T> | unknown,
  methodName: keyof Model<T> | string,
) {
  const error = new Error(`Mocked error in ${String(methodName)}`);

  const spy = vi
    .spyOn(mongoModel, methodName as never)
    .mockRejectedValueOnce(error);

  afterEach(() => {
    spy.mockRestore();
  });

  return spy;
}

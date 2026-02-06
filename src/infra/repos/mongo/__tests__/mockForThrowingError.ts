import { Model } from 'mongoose';
import { vi } from 'vitest';

export function mockForThrowingError<T>(
  mongoModel: Model<T>,
  methodName: keyof Model<T>,
) {
  const error = new Error(`Mocked error in ${String(methodName)}`);

  return vi.spyOn(mongoModel, methodName as never).mockRejectedValueOnce(error);
}

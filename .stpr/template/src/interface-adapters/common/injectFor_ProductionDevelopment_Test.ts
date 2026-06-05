import { InjectionAdapterError } from './adapterErrors';

export async function injectFor_ProductionDevelopment_Test<
  T,
  TProdArgs extends unknown[] = [],
  TTestArgs extends unknown[] = [],
>(
  prodDevClass: new (...args: TProdArgs) => T,
  testClass: new (...args: TTestArgs) => T,
  options?: {
    beforeProdDev?: () => Promise<void>;
    beforeTest?: () => Promise<void>;
    prodDevConstructorArgs?: TProdArgs;
    testConstructorArgs?: TTestArgs;
  },
): Promise<T> {
  const currentEnv = process.env.NODE_ENV;
  const validEnvs = ['production', 'development', 'test'];

  if (!currentEnv || !validEnvs.includes(currentEnv))
    throw new InjectionAdapterError(
      "NODE_ENV must be one of 'production', 'development', or 'test'",
    );

  if (currentEnv === 'test') {
    await options?.beforeTest?.();

    return new testClass(...((options?.testConstructorArgs ?? []) as TTestArgs));
  }

  await options?.beforeProdDev?.();

  return new prodDevClass(...((options?.prodDevConstructorArgs ?? []) as TProdArgs));
}

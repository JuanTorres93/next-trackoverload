export function getGetters(obj: unknown): string[] {
  const proto = Object.getPrototypeOf(obj);

  return (
    Object.entries(Object.getOwnPropertyDescriptors(proto))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key]) => key)
  );
}

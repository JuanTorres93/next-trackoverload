export interface TransactionContext {
  run<T>(work: () => Promise<T>): Promise<T>;
  getSession<TSession = unknown>(): TSession | undefined;
}

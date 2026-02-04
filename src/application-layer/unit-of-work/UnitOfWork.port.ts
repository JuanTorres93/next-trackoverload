export interface UnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  inTransaction<T>(work: () => Promise<T>): Promise<T>;
}

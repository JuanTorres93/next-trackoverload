import { TransactionContext } from '@/application-layer/ports/TransactionContext.port';

export class MemoryTransactionContext implements TransactionContext {
  private static session: unknown = null;

  async run<T>(work: () => Promise<T>): Promise<T> {
    // Simulate active transaction
    MemoryTransactionContext.session = {
      id: 'memory-session',
      isActive: true,
    };

    try {
      const result = await work();
      MemoryTransactionContext.session = null;
      return result;
    } catch (error) {
      MemoryTransactionContext.session = null;
      throw error;
    }
  }

  getSession<T = unknown>(): T | undefined {
    return MemoryTransactionContext.session as T | undefined;
  }
}

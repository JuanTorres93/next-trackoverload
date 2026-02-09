import { AsyncLocalStorage } from 'async_hooks';
import mongoose from 'mongoose';
import { TransactionContext } from '@/application-layer/ports/TransactionContext.port';

const storage = new AsyncLocalStorage<mongoose.ClientSession>();

export class MongoTransactionContext implements TransactionContext {
  async run<T>(work: () => Promise<T>): Promise<T> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Store session in AsyncLocalStorage and execute work
      const result = await storage.run(session, async () => {
        return await work();
      });

      // If we get here, work succeeded, commit the transaction
      await session.commitTransaction();
      return result;
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      await session.endSession();
    }
  }

  getSession<T = mongoose.ClientSession>(): T | undefined {
    return storage.getStore() as T | undefined;
  }

  static getSession(): mongoose.ClientSession | undefined {
    return storage.getStore();
  }
}

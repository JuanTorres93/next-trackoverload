import { AdapterError } from '@/domain/common/errors';
import { MemoryTransactionContext } from '@/infra/transaction-context/MemoryTransactionContext/MemoryTransactionContext';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import { mongooseInitPromise } from '../repos/common/initMongoose';
import { TransactionContext } from '@/application-layer/ports/TransactionContext.port';

let AppTransactionContext: TransactionContext;

if (process.env.NODE_ENV === 'test') {
  AppTransactionContext = new MemoryTransactionContext();
} else if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
) {
  await mongooseInitPromise;
  AppTransactionContext = new MongoTransactionContext();
} else {
  throw new AdapterError(
    "AppTransactionContext: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppTransactionContext };
